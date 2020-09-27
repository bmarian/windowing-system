class Defaults {
    private static _instance: Defaults;
    private _defaultClasses = {
        CLOSE_BUTTON_QRY: '.close',
        WINDOW_HEADER: 'window-header',
        WINDOW_TITLE: 'window-title',
        CANVAS_QRY: '#board',
        SIDEBAR_QRY: '#sidebar',
        NAVIGATION_QRY: '#navigation',
        CONTROLS_QRY: '#controls',
        PLAYERS_QRY: '#players',
        RESIZABLE_HANDLE_QRY: '.window-resizable-handle',
    };

    private constructor() {
    }

    public static getInstance(): Defaults {
        if (!Defaults._instance) Defaults._instance = new Defaults();
        return Defaults._instance;
    }

    /**
     * Returns a list of default css classes, used to identify elements in the interface
     */
    public getDefaultClasses(): any {
        return this._defaultClasses;
    }

}

export default Defaults.getInstance();