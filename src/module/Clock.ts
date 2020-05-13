import { MODULE_NAME, CLOCKS_SETTINGS_KEYS } from "./settings";
import update from "lodash.update";

export type ClockOptions = ApplicationOptions & {
  segments: number;
  ticks: number;
};

const clockTemplate = `modules/${MODULE_NAME}/templates/clock.html`;

// AT THIS POINT I BELIEVE THAT ONLY THE STATIC METHODS HERE ARE BEING USED
// TODO: CLEANUP
export default class Clock extends Application {
  options: ClockOptions;
  _id: number;

  constructor(options: ClockOptions) {
    super({ ...options, template: clockTemplate });
    options.template = clockTemplate;
    if (options.segments <= 1) {
      throw new Error("Clocks need at least 2 segments");
    }
    this.options.segments = options.segments;
    this.options.ticks = options.ticks;
    this._id = options._id || new Date().valueOf();
    if (Clock.userHasEditPermissions) {
      // sync globally
      this._setClock(this.options);
    }
  }

  getTicks = () => this.options.ticks;
  getId = () => this._id;

  static get defaultOptions() {
    const obj = mergeObject(super.defaultOptions, {
      segments: 4,
      ticks: 0,
      popOut: false,
      resizable: false,
      width: 64,
      template: clockTemplate,
      classes: ["progress-clocks", "clock"],
    });
    return obj;
  }
  static resetClocks = () => {
    return game.settings.set(MODULE_NAME, CLOCKS_SETTINGS_KEYS.clocks, []);
  };
  static getClocks = (): ClockOptions[] => {
    return game.settings.get(MODULE_NAME, CLOCKS_SETTINGS_KEYS.clocks);
  };
  static createClock = (
    newClock: Partial<ClockOptions> = {
      ticks: 1,
      segments: 4,
      _id: new Date().valueOf(),
      title: "New Clock",
    }
  ) => {
    const clocks = Clock.getClocks();
    game.settings.set(MODULE_NAME, CLOCKS_SETTINGS_KEYS.clocks, [
      ...clocks,
      newClock,
    ] as ClockOptions[]);
  };
  static setClock = (id: number, options: Partial<ClockOptions>) => {
    if (!Clock.userHasEditPermissions) {
      console.warn("User lacks edit permissions");
      return;
    }
    const clocks = Clock.getClocks();
    const idx = clocks.findIndex(({ _id }) => id === _id);
    if (idx < 0) {
      console.error(`No clock found with id ${id}`);
      return;
    }
    const newClocks = update(
      clocks,
      `[${idx}]`,
      (clock) =>
        ({
          ...clock,
          ...options,
          segments: Math.max(2, options.segments || clock.segments),
        } as ClockOptions)
    );
    game.settings.set(MODULE_NAME, CLOCKS_SETTINGS_KEYS.clocks, newClocks);
  };
  _setClock = (options: Partial<ClockOptions>) => {
    this.options = { ...this.options, ...options };
    if (this.options.segments < 2) this.options.segments = 2;
    if (this.options.segments < this.options.ticks)
      this.options.ticks = this.options.segments;
    Clock.setClock(this._id, this.options);
    this.render(true, this.options);
  };

  static get userHasEditPermissions() {
    return game.user.hasRole(
      (game as any)?.permissions?.SETTINGS_MODIFY[0] ??
        CONST.USER_ROLES.ASSISTANT
    );
  }

  // /** @override */
  // getData() {
  //   const data = super.getData();
  //   return {
  //     ...data,
  //     ...generateClockTemplatePayload({
  //       segments: this.options.segments,
  //       ticks: this.options.ticks,
  //       size: this.position.width,
  //       title: this.options.title,
  //       id: this._id,
  //       edit: false,
  //     }),
  //   };
  // }

  // /** @override */
  // activateListeners(html: JQuery<HTMLElement>) {
  //   const nav = html[2] as HTMLElement;
  //   const hasPermissions = Clock.userHasEditPermissions;
  //   if (!hasPermissions) {
  //     console.warn("User lacks edit permissions for WorldSettings");
  //     return;
  //   }

  //   // HANDLERS
  //   // plus/minus
  //   $(nav)
  //     .find(".plus")
  //     .click(() => {
  //       this._setClock({ segments: ++this.options.segments });
  //     });
  //   $(nav)
  //     .find(".minus")
  //     .click(() => {
  //       this._setClock({ segments: --this.options.segments });
  //     });
  //   // clock segments
  //   Array(this.options.segments)
  //     .fill(undefined)
  //     .forEach((_, idx) => {
  //       (html as JQuery<HTMLElement>)
  //         .find(`.seg-${idx}`)
  //         .click(() => this._handleClickSegment(idx));
  //     });
  // }

  // _handleClickSegment = (idx: number) => {
  //   if (idx === 0 && this.options.ticks === 1) {
  //     this.options.ticks = 0;
  //   } else {
  //     this.options.ticks = idx + 1;
  //   }

  //   this._setClock({ ticks: this.options.ticks });
  // };

  // /** @override */
  // _updateObject(event, formData) {
  //   console.debug("_updateObject in", formData);
  // }
}
