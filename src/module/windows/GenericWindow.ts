import Defaults from "../Defaults";
import Utils from "../Utils";

abstract class GenericWindow {
    protected _defaultClasses = Defaults.getDefaultClasses();
    protected _windowObj: any;
    protected _$window: any;
    protected _options: any;
    protected _buttons = {};

    constructor(windowObj: any, $window: any, options: any) {
        this._windowObj = windowObj;
        this._$window = $window;
        this._options = options;

        this._generateButtons();
        this._hook();
    }

    protected _generateButtons(): void {
        const $closeButton = this._$window.find(this._defaultClasses.CLOSE_BUTTON_QRY);
        const $maximizeButton = null;
        const $restoreButton = null;
        const $minimizeButton = null;
        this._buttons = {$closeButton, $maximizeButton, $restoreButton, $minimizeButton};

        Utils.debug('GW button generation', this._buttons);
    }

    protected _hook(): void {
    }
}

export default GenericWindow;