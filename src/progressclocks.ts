import { registerSettings, MODULE_NAME } from "./module/settings.js";
import { preloadTemplates } from "./module/preloadTemplates.js";
import Clock from "./module/Clock";
import ClockSidebarTab from "./module/ClockTab.js";

const debug = false;

Hooks.once("init", async function () {
  console.log(`${MODULE_NAME} | Initializing Progress Clocks module`);

  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  ui[MODULE_NAME] = new ClockSidebarTab({});

  const _origSidebarRender =
    //@ts-ignore
    Sidebar.prototype._render;

  // @ts-ignore
  Sidebar.prototype._render = async function (...args) {
    await _origSidebarRender.call(this, ...args);
    await ui[MODULE_NAME]._render(true, {});
  };

  const _origDefaultOptions = Sidebar.defaultOptions;

  // @ts-ignore
  Sidebar.__defineGetter__("defaultOptions", function () {
    return mergeObject(_origDefaultOptions, {
      template: `modules/${MODULE_NAME}/templates/sidebar-with-clocks.html`,
      width: Number(_origDefaultOptions.width) + 30,
    });
  });
});

// Hooks.once("setup", function () {
// });

// Hooks.once("ready", function () {
// });

if (debug) {
  // @ts-ignore
  window.createClock = Clock.createClock;

  // @ts-ignore
  window.resetClocks = Clock.resetClocks;
  // @ts-ignore
  window.getClocks = Clock.getClocks;
}
