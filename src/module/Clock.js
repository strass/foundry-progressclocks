import { MODULE_NAME } from "./settings";
import { generateClockTemplatePayload } from "./util/clocks";
const update = require("lodash/update");
const clockTemplate = `modules/${MODULE_NAME}/templates/clock.html`;
// AT THIS POINT I BELIEVE THAT ONLY THE STATIC METHODS HERE ARE BEING USED
// TODO: CLEANUP
export default class Clock extends Application {
    constructor(options) {
        super(Object.assign(Object.assign({}, options), { template: clockTemplate }));
        this.getTicks = () => this.options.ticks;
        this.getId = () => this._id;
        this._setClock = (options) => {
            this.options = Object.assign(Object.assign({}, this.options), options);
            if (this.options.segments < 2)
                this.options.segments = 2;
            if (this.options.segments < this.options.ticks)
                this.options.ticks = this.options.segments;
            Clock.setClock(this._id, this.options);
            this.render(true, this.options);
        };
        this._handleClickSegment = (idx) => {
            if (idx === 0 && this.options.ticks === 1) {
                this.options.ticks = 0;
            }
            else {
                this.options.ticks = idx + 1;
            }
            this._setClock({ ticks: this.options.ticks });
        };
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
    static get userHasEditPermissions() {
        var _a, _b, _c;
        return game.user.hasRole((_c = (_b = (_a = game) === null || _a === void 0 ? void 0 : _a.permissions) === null || _b === void 0 ? void 0 : _b.SETTINGS_MODIFY[0]) !== null && _c !== void 0 ? _c : CONST.USER_ROLES.ASSISTANT);
    }
    /** @override */
    getData() {
        const data = super.getData();
        return Object.assign(Object.assign({}, data), generateClockTemplatePayload({
            segments: this.options.segments,
            ticks: this.options.ticks,
            size: this.position.width,
            title: this.options.title,
            id: this._id,
            edit: false,
        }));
    }
    /** @override */
    activateListeners(html) {
        const nav = html[2];
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
            html
                .find(`.seg-${idx}`)
                .click(() => this._handleClickSegment(idx));
        });
    }
    /** @override */
    _updateObject(event, formData) {
        console.debug("_updateObject in", formData);
    }
}
Clock.resetClocks = () => {
    return game.settings.set(MODULE_NAME, "clocks_v1" /* clocks */, []);
};
Clock.getClocks = () => {
    return game.settings.get(MODULE_NAME, "clocks_v1" /* clocks */);
};
Clock.createClock = (newClock = {
    ticks: 1,
    segments: 4,
    _id: new Date().valueOf(),
    title: "New Clock",
}) => {
    const clocks = Clock.getClocks();
    game.settings.set(MODULE_NAME, "clocks_v1" /* clocks */, [
        ...clocks,
        newClock,
    ]);
};
Clock.setClock = (id, options) => {
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
    const newClocks = update(clocks, `[${idx}]`, (clock) => (Object.assign(Object.assign(Object.assign({}, clock), options), { segments: Math.max(2, options.segments || clock.segments) })));
    game.settings.set(MODULE_NAME, "clocks_v1" /* clocks */, newClocks);
};
