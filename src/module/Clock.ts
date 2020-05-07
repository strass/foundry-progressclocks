import { MODULE_NAME, CLOCKS_SETTINGS_KEYS } from "./settings";
import type * as Lodash from "lodash";
import { getSegmentPaths, generateClockTemplatePayload } from "./util/clocks";
const _: Lodash.LoDashStatic = require("lodash");

const popper = require("@popperjs/core");

export type ClockOptions = ApplicationOptions & {
  segments: number;
  ticks: number;
};

const clockTemplate = `modules/${MODULE_NAME}/templates/clock.html`;

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
    const newClocks = _.update(
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

  /** @override */
  getData() {
    const data = super.getData();
    return {
      ...data,
      ...generateClockTemplatePayload({
        segments: this.options.segments,
        ticks: this.options.ticks,
        size: this.position.width,
        title: this.options.title,
        id: this._id,
        edit: false,
      }),
    };
  }

  /** @override */
  activateListeners(html: JQuery<HTMLElement>) {
    const nav = html[2] as HTMLElement;
    this._contextMenu(html);
    const hasPermissions = Clock.userHasEditPermissions;
    if (!hasPermissions) {
      console.warn("User lacks edit permissions for WorldSettings");
      return;
    }

    // HANDLERS
    // plus/minus
    $(nav)
      .find(".plus")
      .click(() => {
        this._setClock({ segments: ++this.options.segments });
      });
    $(nav)
      .find(".minus")
      .click(() => {
        this._setClock({ segments: --this.options.segments });
      });
    // clock segments
    Array(this.options.segments)
      .fill(undefined)
      .forEach((_, idx) => {
        (html as JQuery<HTMLElement>)
          .find(`.seg-${idx}`)
          .click(() => this._handleClickSegment(idx));
      });
  }

  _handleClickSegment = (idx: number) => {
    if (idx === 0 && this.options.ticks === 1) {
      this.options.ticks = 0;
    } else {
      this.options.ticks = idx + 1;
    }

    this._setClock({ ticks: this.options.ticks });
  };

  /**
   * Create a Context Menu attached to each Macro button
   * @param html
   * @private
   */
  _contextMenu(html: JQuery<HTMLElement>) {
    const svg = html[0];
    const nav = html[2];
    // $(nav).css({ visibility: "hidden" });
    const navBB = nav.getBoundingClientRect();

    const virtualElement = {
      getBoundingClientRect: () => {
        const bb = svg.getBoundingClientRect();
        const newObj = {
          height: 0,
          width: 0,
          right: bb.right + (1 / 2) * navBB.width,
          left: bb.right + (1 / 2) * navBB.width,
          top: bb.top + (1 / 2) * bb.height - (1 / 2) * navBB.height,
          bottom: bb.top + (1 / 2) * bb.height - (1 / 2) * navBB.height,
        };
        return newObj;
      },
    };
    popper.createPopper(virtualElement, nav, {});
  }

  /** @override */
  _updateObject(event, formData) {
    console.debug("_updateObject in", formData);
    // return this.object.update(formData);
  }
}
