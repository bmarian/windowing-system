import Utils from "../Utils";
import Defaults from "../Defaults";

class ActorSheetWindow {
    private static _instance: ActorSheetWindow;
    private _defaultClasses = Defaults.getDefaultClasses();

    private constructor() {
    }

    public static getInstance(): ActorSheetWindow {
        if (!ActorSheetWindow._instance) ActorSheetWindow._instance = new ActorSheetWindow();
        return ActorSheetWindow._instance;
    }

    private _generateButtonHTML(cls: string, type: string): string {
        return `<a class="${cls}"><i class="fas ${type}"></i></a>`;
    }

    private _addMinimizeButton($where: any, sheetObj: any): any {
        const $minimizeButton = $(this._generateButtonHTML('minimize', 'fa-window-minimize'));
        $where.before($minimizeButton);

        $minimizeButton.on('click', event => {
            event.preventDefault();
            sheetObj.minimize();
        });

        return $minimizeButton;
    }


    private _addResizeButton($where: any, $sheet: any, sheetObj: any): any {
        const $maximizeButton = $(this._generateButtonHTML('resize-max', 'fa-window-maximize'));
        const $restoreButton = $(this._generateButtonHTML('resize-restore', 'fa-window-restore'));
        const $canvas = $(this._defaultClasses.CANVAS_QRY);
        const oldSize = {
            width: 0,
            height: 0,
            left: 0,
            top: 0,
        }

        // Width
        const $sidebar = $(this._defaultClasses.SIDEBAR_QRY);
        const $controls = $(this._defaultClasses.CONTROLS_QRY);

        // Height
        const $navigation = $(this._defaultClasses.NAVIGATION_QRY);
        const $players = $(this._defaultClasses.PLAYERS_QRY);

        $where.before($maximizeButton, $restoreButton);

        $maximizeButton.on('click', event => {
            const width = $canvas.attr('width');
            const height = $canvas.attr('height');

            oldSize.width = $sheet.width();
            oldSize.height = $sheet.height();
            const position = $sheet.position();
            oldSize.left = position.left;
            oldSize.top = position.top;

            $sheet.animate({width: width, height: height, left: 0, top: 0});
            $maximizeButton.hide();
            $restoreButton.show();
        })

        $restoreButton.on('click', event => {
            $sheet.animate({width: oldSize.width, height: oldSize.height, left: oldSize.left, top: oldSize.top});

            $maximizeButton.show();
            $restoreButton.hide();
        }).hide();

        return {$maximizeButton, $restoreButton}
    }


    public hook(sheetObj: any, $sheet: any, options: any): void {
        const $closeButton = $sheet.find(this._defaultClasses.CLOSE_BUTTON_QRY);
        const {$maximizeButton, $restoreButton} = this._addResizeButton($closeButton, $sheet, sheetObj);
        const $minimizeButton = this._addMinimizeButton($maximizeButton, sheetObj);

        // This should remove the text for the close button (to look more like a Windows window)
        $closeButton.contents().last().remove();
    }
}

export default ActorSheetWindow.getInstance();