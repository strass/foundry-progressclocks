import { MODULE_NAME, CLOCKS_HOOKS } from "./settings";
import Clock from "./Clock";
import { generateClockTemplatePayload } from "./util/clocks";
import roughjs from "roughjs/bundled/rough.esm.js";

export default class ClockSidebarTab extends SidebarTab {
  // TODO: edit status boolean is insufficient because I have to manage multiple edit states
  editStatus: boolean;
  _popout: any;
  _original: any;
  // TODO: garbage collection for rough
  rough: ReturnType<typeof roughjs.svg>[] = [];
  data: {
    clocks: {
      segments: number;
      ticks: number;
      percent: number;
      pathTransforms: number[][];
      size: number;
      id: number;
      title: string;
      edit: boolean;
    }[];
  } = { clocks: [] };

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: MODULE_NAME,
      template: `modules/${MODULE_NAME}/templates/sidebar-tab.html`,
      title: "Clocks",
      scrollContainer: null,
      stream: false,
      classes: [MODULE_NAME],
    });
  }

  constructor(options) {
    super(options);
    this.editStatus = false;
    this.rough = [];

    // Save the module into the ui obj
    if (!ui[MODULE_NAME]) {
      ui[MODULE_NAME] = this;
    }
  }

  getData() {
    const data: {} = super.getData();
    const clocks = Clock.getClocks();
    const payload = {
      ...data,
      clocks: clocks.map((c, idx) =>
        generateClockTemplatePayload({
          segments: c.segments,
          size: 300,
          ticks: c.ticks,
          id: Number(c._id),
          title: c.title,
          edit: this.data.clocks[idx]?.edit ?? false,
        })
      ),
    };
    this.data = payload;
    return payload;
  }

  render(force, options) {
    return super.render(force, options);
  }

  async _renderInner(data, options) {
    const el = await super._renderInner(data, options);
    this._drawClocks(el);
    return el;
  }

  _drawClocks(el: HTMLElement | JQuery<HTMLElement>) {
    return $(el)
      .find("svg")
      .each((idx, el) => {
        const roughSvg = roughjs.svg(el);
        this.rough[idx] = roughSvg;

        const clock = this.data.clocks[idx];
        const degreesPerSegment = 360 / clock.segments;
        const center = this.position.width / 2;
        const size = this.position.width - this.position.width / 20;
        el.append(
          roughSvg.circle(center, center, size, {
            seed: clock.id,
            fill: "white",
            fillStyle: "solid",
          }),
          ...Array(clock.segments)
            .fill(undefined)
            .map((_, idx) => {
              return roughSvg.arc(
                center,
                center,
                size,
                size,
                toRadians(idx * degreesPerSegment),
                toRadians((idx + 1) * degreesPerSegment - 1),
                true,
                {
                  roughness: 2,

                  seed: clock.id,
                  fill: clock.ticks > idx ? "tomato" : "transparent",
                  fillStyle: "zigzag",
                  fillWeight: 2.5,
                  zigzagOffset: 8,
                  hachureGap: 8,
                }
              );
            })
        );
      });
  }

  activateListeners(html: JQuery<HTMLElement> | HTMLElement) {
    Hooks.on(CLOCKS_HOOKS.clockSettingsUpdate, () => this.render(true, {}));

    if (!Clock.userHasEditPermissions) {
      return;
    }
    super.activateListeners(html);

    const clocks = $(html).find("#clock-log").find("li.clock") as JQuery<
      HTMLLIElement
    >;
    $(this.element)
      .find("button[role=create]")
      .click(() => {
        Clock.createClock();
      });
    $(this.element)
      .find("button[role=reset]")
      .click(() => {
        Clock.resetClocks();
      });
    this._activeOnClickClockSegment(clocks);
    this._activateOnClickEdit(clocks);
  }

  /** clicking on clock segments sets the clock */
  _activeOnClickClockSegment(clocks: JQuery<HTMLLIElement>) {
    clocks.each((idx, el: HTMLLIElement) => {
      const { segments, id, ticks: currentTicks } = el.dataset as Record<
        "segments" | "ticks" | "id",
        string
      >;
      $(el)
        .find("svg > g:not(:first-child)")
        .each((idx, el) => {
          $(el).click(() => {
            let ticks = idx + 1;
            if (idx + 1 === Number(currentTicks)) {
              ticks = idx;
            }
            Clock.setClock(Number(id), { ticks });
          });
        });
    });
  }

  /** clicking the edit button toggles edit mode */
  _activateOnClickEdit(clocks: JQuery<HTMLLIElement>) {
    clocks.each((idx, clockEl: HTMLLIElement) => {
      const { segments, id } = clockEl.dataset as Record<
        "segments" | "ticks" | "id",
        string
      >;
      $(clockEl)
        .find("button[role=edit]")
        .click((ev) => {
          const edit = this.data?.clocks[idx]?.edit ?? false;
          if (!edit) {
            $(clockEl).find("aside").slideDown();
          } else {
            $(clockEl).find("aside").slideUp();
          }
          this.data.clocks[idx].edit = !edit;
          this.render(true, {});
        });
      ($(clockEl).find('input[name="title"]') as JQuery<HTMLInputElement>).blur(
        (event) => {
          Clock.setClock(Number(id), { title: event.target.value });
        }
      );
      $(clockEl)
        .find("button[role=plus]")
        .click((ev) => {
          Clock.setClock(Number(id), {
            segments: Number(segments) + 1,
          });
        });
      $(clockEl)
        .find("button[role=minus]")
        .click((ev) => {
          Clock.setClock(Number(id), {
            segments: Number(segments) - 1,
          });
        });
    });
  }
}
