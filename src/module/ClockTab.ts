import { MODULE_NAME, CLOCKS_HOOKS } from "./settings";
import Clock from "./Clock";
import { generateClockTemplatePayload } from "./util/clocks";

export default class ClockSidebarTab extends SidebarTab {
  // TODO: edit status boolean is insufficient because I have to manage multiple edit states
  editStatus: boolean;
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
  }

  getData() {
    const data = super.getData();
    console.log(data);

    const clocks = Clock.getClocks();
    console.log(clocks);
    return {
      ...data,
      clocks: clocks.map((c) =>
        generateClockTemplatePayload({
          segments: c.segments,
          size: 300,
          ticks: c.ticks,
          id: Number(c._id),
          title: c.title,
        })
      ),
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    const clocks = $(html).find("#clock-log").find("li.clock") as JQuery<
      HTMLLIElement
    >;
    this._activeOnClickClockSegment(clocks);
    this._activateOnClickEdit(clocks);

    Hooks.on(CLOCKS_HOOKS.clockSettingsUpdate, () => this.render(true));
  }

  /** clicking on clock segments sets the clock */
  _activeOnClickClockSegment(clocks: JQuery<HTMLLIElement>) {
    clocks.each((idx, el: HTMLLIElement) => {
      const { segments, id, ticks: currentTicks } = el.dataset as Record<
        "segments" | "ticks" | "id",
        string
      >;
      Array(Number(segments))
        .fill(undefined)
        .forEach((_, idx) => {
          $(el)
            .find(`.seg-${idx}`)
            .click(() => {
              let ticks = idx + 1;
              if (idx === 0 && Number(currentTicks) === 1) {
                ticks = 0;
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
          this.editStatus = !this.editStatus;
          if (this.editStatus) {
            console.log($(clockEl).find("#context-menu"));
            $(clockEl).find("#context-menu").slideDown();
          } else {
            $(clockEl).find("#context-menu").slideUp();
          }
        });
    });
  }
}
