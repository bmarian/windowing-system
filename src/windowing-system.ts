import Utils from "./module/Utils";
import WindowManager from "./module/windows/WindowManager";
import WindowType from "./module/windows/WindowType";
import {_onDragMouseDown, _onDragMouseMove, _onDragMouseUp} from "./module/windows/DraggableHijack";

Hooks.once('init', async () => {
    Utils.debug('Module initialized.');

    // @ts-ignore
    Draggable.prototype._onDragMouseDown = _onDragMouseDown;
    // @ts-ignore
    Draggable.prototype._onDragMouseMove = _onDragMouseMove;
    // @ts-ignore
    Draggable.prototype._onDragMouseUp = _onDragMouseUp;
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