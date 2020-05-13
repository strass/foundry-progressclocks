import { ClockOptions } from "./Clock";
var helpers = require("handlebars-helpers")(["object"]);
import ternary from "handlebars-helper-ternary";
// import { registerClockPartial } from "./Handlebars/partials";

console.log(helpers);
export const MODULE_NAME = "progressclocks";
export const enum CLOCKS_SETTINGS_KEYS {
  clocks = `clocks_v1`,
  localSettings = "localsettings_v1",
}
export const enum CLOCKS_HOOKS {
  clockSettingsUpdate = "clockSettingsUpdate",
}

export const registerSettings = function () {
  // Register any custom module settings here
  console.log(`${MODULE_NAME} | Registering settings`);
  game.settings.register(MODULE_NAME, CLOCKS_SETTINGS_KEYS.clocks, {
    name: "Clocks",
    scope: "world",
    config: false,
    default: [],
    type: Object,
    onChange: (newClocks: ClockOptions[]) =>
      Hooks.call(CLOCKS_HOOKS.clockSettingsUpdate),
  });
  // game.settings.register(MODULE_NAME, CLOCKS_SETTINGS_KEYS.localSettings, {
  //   name: "Clocks Local Settings",
  //   scope: "user",
  //   config: false,
  //   default: {},
  //   type: Object,
  // });
  Handlebars.registerHelper("get", helpers.get);
  Handlebars.registerHelper("ternary", ternary);
  // registerClockPartial();
};
