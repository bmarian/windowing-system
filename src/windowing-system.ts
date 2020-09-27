import Utils from "./module/Utils";
import WindowManager from "./module/windows/WindowManager";
import WindowType from "./module/windows/WindowType";

Hooks.once('init', async function() {
	// TODO remove from final release, just here to trigger debugging
	Utils.debug('Module initialized.', false);
});

//
//
// Hooks.once('setup', function() {
// 	Utils.debug('Setup complete.', false);
// });
//
//
// Hooks.once('ready', function() {
// 	Utils.debug('Ready.', false);
// });

Hooks.on('renderActorSheet', (sheetObj: any, $sheet: any, options: any): void => {
	WindowManager.addWindow(sheetObj, $sheet, options, WindowType.ACTOR_SHEET);
});

Hooks.on('closeActorSheet', (sheetObj: any, $sheet: any): void => {
	WindowManager.removeWindow(sheetObj, $sheet, WindowType.ACTOR_SHEET);
});