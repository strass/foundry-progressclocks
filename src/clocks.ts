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

// declare global {
//   interface Window {
//     ClocksApp?: Clocks;
//   }
// }

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once("init", async function () {
  console.log("clocks | Initializing clocks");

  // Assign custom classes and constants here
  console.log("clocks | Registering Handlebars helper: ternary");
  Handlebars.registerHelper("ternary", require("handlebars-helper-ternary"));
  // Register custom module settings
  registerSettings();

  // Preload Handlebars templates
  await preloadTemplates();

  // Register custom sheets (if any)
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

// @ts-ignore
window.createClock = Clock.createClock;

// @ts-ignore
window.resetClocks = Clock.resetClocks;

// @ts-ignore
window.getClocks = Clock.getClocks;

function renderClocks() {
  if (!game.clocks) game.clocks = {};
  const clocks: ClockOptions[] = game.settings.get(
    MODULE_NAME,
    CLOCKS_SETTINGS_KEYS.clocks
  );
  console.log("clocks:", clocks);
  clocks.forEach((clock, idx) => {
    console.log(`Clock ${idx}`);
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
    game.clocks[c.getId()] = c;
    c.render(true, {});
  });
}

// @ts-ignore
window.renderClocks = renderClocks;
