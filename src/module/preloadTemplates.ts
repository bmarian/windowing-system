export const preloadTemplates = async function() {
	const templatePaths = [
		// Add paths to "modules/windowing-system/templates"
	];

	return loadTemplates(templatePaths);
}
