import { MODULE_NAME } from "./settings";

export const preloadTemplates = async function () {
  const templatePaths = [`modules/${MODULE_NAME}/templates/clock.html`];

  return loadTemplates(templatePaths);
};
