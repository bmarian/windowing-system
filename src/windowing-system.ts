import Utils from "./module/Utils";
import WindowManager from "./module/windows/WindowManager";
import WindowType from "./module/windows/WindowType";

Hooks.once('init', async () => {
    Utils.debug('Module initialized.');
});

Hooks.once('setup', () => {
    Utils.debug('Setup completed.');
});

Hooks.once('ready', () => {
	Utils.debug('Module ready.');
});

Hooks.on('renderActorSheet', (sheetObj: any, $sheet: any, options: any): void => {
    WindowManager.addWindow(sheetObj, $sheet, options, WindowType.ACTOR_SHEET);
});

Hooks.on('closeActorSheet', (sheetObj: any, $sheet: any): void => {
    WindowManager.removeWindow(sheetObj, $sheet, WindowType.ACTOR_SHEET);
});