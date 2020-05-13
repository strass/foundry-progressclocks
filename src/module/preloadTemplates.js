export const preloadTemplates = async function () {
    const templatePaths = [
    // Huh, these prevent it from rendering?
    // `modules/${MODULE_NAME}/templates/sidebar-tab.html`,
    // `modules/${MODULE_NAME}/templates/sidebar-with-clocks.html`,
    ];
    return loadTemplates(templatePaths);
};
