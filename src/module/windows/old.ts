import Defaults from "../Defaults";
import Utils from "../Utils";

/**
 * THIS SHOULD BE REMOVED SOON
 */
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
        const $resizeHandle = $sheet.find(this._defaultClasses.RESIZABLE_HANDLE_QRY);
        let oldPosition = sheetObj.position;

        // Width
        const $sidebar = $(this._defaultClasses.SIDEBAR_QRY);
        const $controls = $(this._defaultClasses.CONTROLS_QRY);

        // Height
        const $navigation = $(this._defaultClasses.NAVIGATION_QRY);
        const $players = $(this._defaultClasses.PLAYERS_QRY);

        $where.before($maximizeButton, $restoreButton);

        $maximizeButton.on('click', event => {
            const canvasWidth = Number($canvas.attr('width'));
            const canvasHeight = Number($canvas.attr('height'));

            oldPosition = sheetObj.position;
            const newPosition = {width: canvasWidth, height: canvasHeight, left: 0, top: 0}

            sheetObj.position = newPosition
            $sheet.css(newPosition);

            $resizeHandle.hide(); // hide the resize button
            $maximizeButton.hide();
            $restoreButton.show();
        })

        $restoreButton.on('click', event => {
            sheetObj.position = oldPosition;
            $sheet.css(oldPosition);

            $resizeHandle.show(); // show the resize button
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

        const $windowTitle = $sheet.find(this._defaultClasses.WINDOW_TITLE_QRY);
        const $canvas = $(this._defaultClasses.CANVAS_QRY);
        $windowTitle.on('mousedown', () => {
            let oldY = 0;
            let mouseUpTrigger = true;
            $windowTitle.on('mousemove', (event) => {
                const position = $sheet.position();
                const pageY = event.pageY;

                if (position.top === 0 && pageY > oldY) {
                    $restoreButton.trigger('click');
                    mouseUpTrigger = false;
                }
                oldY = pageY;

                Utils.debug(position, false);
            }).one('mouseup', () => {
                $windowTitle.unbind('mousemove');

                const position = $sheet.position();
                const canvasWidth = Number($canvas.attr('width'));
                const canvasHeight = Number($canvas.attr('height'));
                const sheetWidth = $sheet.width();

                if (!mouseUpTrigger) return;

                if (position.top <= 5) {
                    // Fullscreen if the header touches the top
                    if (position.left > 5 && position.left + sheetWidth < canvasWidth - 5) {
                        Utils.debug('fullscreen');
                        $maximizeButton.trigger('click');
                    }
                } else {
                    const newPosition = {width: canvasWidth / 2 - 2, height: canvasHeight, left: 0, top: 0}

                    // Left half
                    if (position.left <= 5) {
                        Utils.debug('left half');
                        $maximizeButton.trigger('click');

                        sheetObj.position = newPosition
                        $sheet.css(newPosition);

                    } else if (position.left + sheetWidth >= canvasWidth - 5) {
                        Utils.debug('right half');
                        $maximizeButton.trigger('click');

                        newPosition.left = newPosition.width + 2;
                        sheetObj.position = newPosition
                        $sheet.css(newPosition);
                    }
                }
            });
        });
    }
}

export default ActorSheetWindow.getInstance();