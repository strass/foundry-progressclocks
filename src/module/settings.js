// import { registerClockPartial } from "./Handlebars/partials";
export const MODULE_NAME = "progressclocks";
export const registerSettings = function () {
    // Register any custom module settings here
    console.log(`${MODULE_NAME} | Registering settings`);
    game.settings.register(MODULE_NAME, "clocks_v1" /* clocks */, {
        name: "Clocks",
        scope: "world",
        config: false,
        default: [],
        type: Object,
        onChange: (newClocks) => Hooks.call("clockSettingsUpdate" /* clockSettingsUpdate */),
    });
    // game.settings.register(MODULE_NAME, CLOCKS_SETTINGS_KEYS.localSettings, {
    //   name: "Clocks Local Settings",
    //   scope: "user",
    //   config: false,
    //   default: {},
    //   type: Object,
    // });
    // Handlebars.registerHelper("ternary", require("handlebars-helper-ternary"));
    // registerClockPartial();
};
