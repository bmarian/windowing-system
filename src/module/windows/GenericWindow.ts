import Defaults from "../Defaults";
import Utils from "../Utils";

abstract class GenericWindow {
    protected _defaultClasses = Defaults.getDefaultClasses();
    protected _windowObj: any;
    protected _$window: any;
    protected _options: any;

    constructor(windowObj: any, $window: any, options: any) {
        this._windowObj = windowObj;
        this._$window = $window;
        this._options = options;

        this._hook();
    }

    public abstract getSaveObject(): Object;

    protected _generateButtons($closeButton: JQuery): string {
        return '';
    }

    protected _hook(): void {
    }
}

export default GenericWindow;