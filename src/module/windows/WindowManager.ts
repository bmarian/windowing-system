import WindowType from "./WindowType";
import SheetWindow from "./SheetWindow";
import Utils from "../Utils";
import GenericWindow from "./GenericWindow";

class WindowManager {
    private static _instance: WindowManager;
    private _windows = [];

    private constructor() {
    }

    public static getInstance(): WindowManager {
        if (!WindowManager._instance) WindowManager._instance = new WindowManager();
        return WindowManager._instance;
    }

    private _saveSheetWindow(windowObj: any): boolean {
        const saveData = {
            id: windowObj?.object?._id,
            hasToken: windowObj?.token !== null,
        }

        const exists = this._windows.some(el => el?.id === saveData.id && el?.hasToken === saveData.hasToken);
        if (!exists) this._windows.push(saveData);

        return exists;
    }

    private _deleteSheetWindow(windowObj: any): void {
        const searchData = {
            id: windowObj?.object?._id,
            hasToken: windowObj?.token !== null,
        }
        this._windows = this._windows.filter(el => !(el?.id === searchData.id && el?.hasToken === searchData.hasToken));
    }

    public addWindow(windowObj: any, $window: any, options: any, type: WindowType): void {
        let window: GenericWindow;
        switch (type) {
            case WindowType.ACTOR_SHEET: {
                const windowExists = this._saveSheetWindow(windowObj);
                if (!windowExists) window = new SheetWindow(windowObj, $window, options);
                break;
            }
        }
        window = null;

        Utils.debug('WM window add', this._windows);
    }

    public removeWindow(windowObj: any, $window: any, type: WindowType) {
        switch (type) {
            case WindowType.ACTOR_SHEET: {
                this._deleteSheetWindow(windowObj);
                break;
            }
        }

        Utils.debug('WM window remove', this._windows);
    }
}

export default WindowManager.getInstance();