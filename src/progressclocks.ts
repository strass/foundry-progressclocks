/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */

// Import TypeScript modules
import {
  registerSettings,
  MODULE_NAME,
  CLOCKS_SETTINGS_KEYS,
} from "./module/settings.js";
import { preloadTemplates } from "./module/preloadTemplates.js";
import Clock, { ClockOptions } from "./module/Clock";
import ClockSidebarTab from "./module/ClockTab.js";

// declare global {
//   interface Window {
//     ClocksApp?: Clocks;
//   }
// }

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once("init", async function () {
  console.log(`${MODULE_NAME} | Initializing clocks`);

  // Assign custom classes and constants here
  console.log(`${MODULE_NAME} | Registering Handlebars helper: ternary`);
  Handlebars.registerHelper("ternary", require("handlebars-helper-ternary"));
  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets (if any)

  // TODO: is this the right place to put these?
  ui.clocksSidebarTab = new ClockSidebarTab({});

  const _origSidebarRender =
    //@ts-ignore
    Sidebar.prototype._render;

  // @ts-ignore
  Sidebar.prototype._render = async function (...args) {
    await _origSidebarRender.call(this, ...args);
    await ui.clocksSidebarTab._render(true, {});
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
/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once("setup", function () {
  // Do anything after initialization but before ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once("ready", function () {
  renderClocks();
});

/**
 * Add Status right click option for combat tracker combatants
 */
Hooks.on(
  "getSceneControlButtons",
  (
    controls: (SceneControls["controls"][0] & {
      name: string;
      tools: {
        button?: boolean;
        icon: string;
        name: string;
        title: string;
        onClick: Function;
      }[];
      title: string;
      layer: string;
      visible: boolean;
      icon: string;
      activeTool: string;
      // onClick: Function;
    })[]
  ) => {
    let group = controls.find((b) => b.name == "notes");
    group.tools.push({
      button: true,
      icon: "fas fa-circle",
      name: "test",
      title: "CONTROLS.createClock",
      onClick: () => {
        Clock.createClock();
      },
    });
  }
);

// @ts-ignore
window.createClock = Clock.createClock;

// @ts-ignore
window.resetClocks = Clock.resetClocks;

// @ts-ignore
window.getClocks = Clock.getClocks;

function renderClocks() {
  const clocks: ClockOptions[] = game.settings.get(
    MODULE_NAME,
    CLOCKS_SETTINGS_KEYS.clocks
  );

  clocks.forEach((clock, idx) => {
    const c = new Clock({
      title: "New Clock",
      height: 256,
      width: 256,
      top: 500,
      left: 500,
      popOut: true,
      segments: (idx + 1) * 2,
      ticks: 0,
      resizable: true,
      ...clock,
    });
    c.render(true, {});
  });
}

// @ts-ignore
window.renderClocks = renderClocks;
