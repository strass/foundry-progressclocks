export const preloadTemplates = async function() {
	const templatePaths = [
		"modules/clocks/templates/clock.html"
	];

	return loadTemplates(templatePaths);
}
