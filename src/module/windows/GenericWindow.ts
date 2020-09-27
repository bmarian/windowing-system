import Defaults from "../Defaults";
import Utils from "../Utils";

class GenericWindow {
    private _defaultClasses = Defaults.getDefaultClasses();
    private _windowObj: any;
    private _$window: any;
    private _options: any;

    constructor(windowObj: any, $window: any, options: any) {
        this._windowObj = windowObj;
        this._$window = $window;
        this._options = options;

        this._hook();
    }

    private _generateButtons($closeButton: JQuery): string {
        return '';
    }

    private _hook(): void {
        Utils.debug('Some hook')
    }
}

export default GenericWindow;