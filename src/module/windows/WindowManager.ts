import WindowType from "./WindowType";
import SheetWindow from "./SheetWindow";

class WindowManager {
    private static _instance: WindowManager;
    private _windows = [];

    private constructor() {
    }

    public static getInstance(): WindowManager {
        if (!WindowManager._instance) WindowManager._instance = new WindowManager();
        return WindowManager._instance;
    }

    public addWindow(windowObj: any, $window: any, options: any, type: WindowType): void {
        let window = null;
        switch (type) {
            case WindowType.ACTOR_SHEET: {
                window = new SheetWindow(windowObj, $window, options);
                break;
            }
        }

        if (window === null) return;

        this._windows.push(window);
        window = null;
    }
}

export default WindowManager.getInstance();