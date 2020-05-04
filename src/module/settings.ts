import Clock, { ClockOptions } from "./Clock";

declare global {
  interface Game {
    clocks?: Record<number, Clock>;
  }
}

export const MODULE_NAME = "progressclocks";
export const enum CLOCKS_SETTINGS_KEYS {
  clocks = `clocks_v4`,
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
    onChange: (newClocks: ClockOptions[]) => {
      console.debug("clocks changed", newClocks);
      newClocks.forEach(({ _id, ticks, segments }) => {
        const clock = game.clocks[_id];
        if (!clock) {
          console.error(`No clock with id "${_id}" found`);
        } else if (
          clock &&
          (clock.ticks !== ticks || clock.segments !== segments)
        ) {
          clock.ticks = ticks;
          clock.segments = segments;
          clock.render(true, {});
        } else {
          console.debug(`Clock found but update unnecessary`);
        }
      });
    },
  });
};
