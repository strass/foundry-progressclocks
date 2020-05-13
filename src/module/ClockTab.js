import { MODULE_NAME } from "./settings";
import Clock from "./Clock";
import { generateClockTemplatePayload } from "./util/clocks";
import rough from "roughjs";

export default class ClockSidebarTab extends SidebarTab {
  constructor(options) {
    super(options);
    // TODO: garbage collection for rough
    this.rough = [];
    this.data = { clocks: [] };
    this.editStatus = false;
    this.rough = [];
    // Save the module into the ui obj
    if (!ui[MODULE_NAME]) {
      ui[MODULE_NAME] = this;
    }
  }
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
  getData() {
    const data = super.getData();
    const clocks = Clock.getClocks();
    const payload = Object.assign(Object.assign({}, data), {
      clocks: clocks.map((c, idx) => {
        var _a, _b;
        return generateClockTemplatePayload({
          segments: c.segments,
          size: 300,
          ticks: c.ticks,
          id: Number(c._id),
          title: c.title,
          edit:
            (_b =
              (_a = this.data.clocks[idx]) === null || _a === void 0
                ? void 0
                : _a.edit) !== null && _b !== void 0
              ? _b
              : false,
        });
      }),
    });
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
  _drawClocks(el) {
    return $(el)
      .find("svg")
      .each((idx, el) => {
        const roughSvg = rough.svg(el);
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
  activateListeners(html) {
    Hooks.on("clockSettingsUpdate" /* clockSettingsUpdate */, () =>
      this.render(true, {})
    );
    if (!Clock.userHasEditPermissions) {
      return;
    }
    super.activateListeners(html);
    const clocks = $(html).find("#clock-log").find("li.clock");
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
  _activeOnClickClockSegment(clocks) {
    clocks.each((idx, el) => {
      const { segments, id, ticks: currentTicks } = el.dataset;
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
  _activateOnClickEdit(clocks) {
    clocks.each((idx, clockEl) => {
      const { segments, id } = clockEl.dataset;
      $(clockEl)
        .find("button[role=edit]")
        .click((ev) => {
          var _a, _b, _c;
          const edit =
            (_c =
              (_b =
                (_a = this.data) === null || _a === void 0
                  ? void 0
                  : _a.clocks[idx]) === null || _b === void 0
                ? void 0
                : _b.edit) !== null && _c !== void 0
              ? _c
              : false;
          if (!edit) {
            $(clockEl).find("aside").slideDown();
          } else {
            $(clockEl).find("aside").slideUp();
          }
          this.data.clocks[idx].edit = !edit;
          this.render(true, {});
        });
      $(clockEl)
        .find('input[name="title"]')
        .blur((event) => {
          Clock.setClock(Number(id), { title: event.target.value });
        });
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
