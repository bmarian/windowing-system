import Defaults from "../Defaults";
import Utils from "../Utils";

abstract class GenericWindow {
    protected _defaultClasses = Defaults.getDefaultClasses();
    protected _windowObj: any;
    protected _$window: any;
    protected _options: any;
    protected _buttons: any;
    protected _lastPositionBeforeMax: any = {};
    protected _isMaximized: boolean = false;
    protected _snapThreshold = 20;
    protected _constObjects = {
        $canvas: $(this._defaultClasses.CANVAS_QRY),
    }

    constructor(windowObj: any, $window: any, options: any) {
        this._windowObj = windowObj;
        this._$window = $window;
        this._options = options;
        this._hook();
    }

    protected _hijackedMinimize(ev): Promise<boolean> {
        // Prevent minimizing on double clicking the header
        if ((ev?.target?.className === this._defaultClasses.WINDOW_TITLE ||
            ev?.target?.className.includes(this._defaultClasses.WINDOW_HEADER)) &&
            ev.type === 'dblclick') return;

        if (!this._windowObj.popOut || [true, null].includes(this._windowObj._minimized)) return;
        this._windowObj._minimized = null;

        // Get content
        let window = this._windowObj.element,
            header = window.find('.window-header'),
            content = window.find('.window-content');

        // Remove minimum width and height styling rules
        window.css({minWidth: 100, minHeight: 30});

        // Slide-up content
        content.slideUp(100);

        // Check if the window would minimize outside
        const leftPosition = window.position().left;
        const left = leftPosition < 0 ? 0 : leftPosition;

        // Slide up window height
        return new Promise((resolve) => {
            window.animate({height: `${header[0].offsetHeight + 1}px`, left}, 100, () => {
                this._windowObj.setPosition({left});
                header.children().not(".window-title").not(".close").hide();
                window.animate({width: MIN_WINDOW_WIDTH}, 100, () => {
                    window.addClass("minimized");
                    this._windowObj._minimized = true;
                    resolve(true);
                });
            });
        });
    }

    protected _hijackedMaximize(ev): Promise<boolean> {
        if (!this._windowObj.popOut || [false, null].includes(this._windowObj._minimized)) return;
        this._windowObj._minimized = null;

        // Get content
        let window = this._windowObj.element,
            header = window.find('.window-header'),
            content = window.find('.window-content');

        const maxPosition = this._isMaximized ? {left: 0, top: 0} : {};
        this._windowObj.position = {...this._windowObj.position, ...maxPosition};

        // Expand window
        return new Promise((resolve) => {
            window.animate({
                width: this._windowObj.position.width,
                height: this._windowObj.position.height,
                ...maxPosition
            }, 100, () => {
                header.children().show();
                content.slideDown(100, () => {
                    window.removeClass("minimized");
                    this._windowObj._minimized = false;
                    window.css({minWidth: '', minHeight: '', ...maxPosition});
                    this._windowObj.setPosition(this._windowObj.position);
                    resolve(true);
                });
            });
        });
    }

    // @ts-ignore
    protected _hijackedSetPosition({left, top, width, height, scale} = {}) {
        if (!this._windowObj.popOut) return; // Only configure position for popout apps
        const el = this._windowObj.element[0];
        const p = this._windowObj.position;
        const pop = this._windowObj.popOut;
        const styles = window.getComputedStyle(el);

        // If Height is "auto" unset current preference
        if ((height === "auto") || (this._windowObj.options.height === "auto")) {
            el.style.height = "";
            height = null;
        }

        // Update Width
        if (!el.style.width || width) {
            const minWidth = parseInt(styles.minWidth) || (pop ? MIN_WINDOW_WIDTH : 0);
            p.width = Math.clamped(
                minWidth,
                width || el.offsetWidth,
                el.style.maxWidth || window.innerWidth
            );
            el.style.width = p.width + "px";

            // If the new (width + left) exceeds the window width, we need to update left
            if ((p.width + p.left) > window.innerWidth) left = p.left;
        }

        // Update Height
        if (!el.style.height || height) {
            const minHeight = parseInt(styles.minHeight) || (pop ? MIN_WINDOW_HEIGHT : 0);
            p.height = Math.clamped(
                minHeight,
                height || (el.offsetHeight + 1), // the +1 helps to avoid incorrect overflow
                el.style.maxHeight || window.innerHeight
            );
            el.style.height = p.height + "px";

            // If the new (height + top) exceeds the window height, we need to update top
            if ((p.height + p.top) > window.innerHeight) top = p.top;
        }

        // Update Left
        if ((pop && !el.style.left) || Number.isFinite(left)) {
            // Add some 20px margins so you can at least find the window again
            const maxLeft = Math.max(window.innerWidth - 200, 0)
            const minLeft = Math.min(200 - el.offsetWidth, 0)

            if (!Number.isFinite(left)) left = (window.innerWidth - el.offsetWidth) / 2;
            p.left = Math.clamped(left, minLeft, maxLeft);
            el.style.left = p.left + "px";
        }

        // Update Top
        if ((pop && !el.style.top) || Number.isFinite(top)) {
            const headerHeight = Number(el.querySelector(`.${this._defaultClasses.WINDOW_HEADER}`)?.offsetHeight) || 0;
            const maxTop = Math.max(window.innerHeight - headerHeight, 0);

            if (!Number.isFinite(top)) top = (window.innerHeight - el.offsetHeight) / 2;
            p.top = Math.clamped(top, 0, maxTop);
            el.style.top = p.top + "px";
        }

        // Update Scale
        if (scale) {
            p.scale = scale;
            if (scale === 1) el.style.transform = "";
            else el.style.transform = `scale(${scale})`;
        }

        // Return the updated position object
        return p;
    }

    protected _hijackEvents(): void {
        // This might be a crude solution, but removing the dblclick event from the header
        // was not working with any option I tried
        this._windowObj.minimize = this._hijackedMinimize.bind(this);
        this._windowObj.maximize = this._hijackedMaximize.bind(this);

        // Hijacking the set position function to remove boundaries
        this._windowObj.setPosition = this._hijackedSetPosition.bind(this);

        Utils.debug('GW hijacked events');
    }

    private _generateButtonHTML(cls: string, type: string): string {
        return `<a class="${cls}"><i class="fas ${type}"></i></a>`;
    }

    protected _generateButtons(): void {
        const $closeButton = this._$window.find(this._defaultClasses.CLOSE_BUTTON_QRY);
        const $maximizeButton = $(this._generateButtonHTML('resize-max', 'fa-window-maximize'));
        const $restoreButton = $(this._generateButtonHTML('resize-restore', 'fa-window-restore'));
        const $minimizeButton = $(this._generateButtonHTML('minimize', 'fa-window-minimize'));
        this._buttons = {$closeButton, $maximizeButton, $restoreButton, $minimizeButton};

        Utils.debug('GW buttons generated', this._buttons);
    }

    protected _addButtons(): void {
        this._buttons.$closeButton.before(this._buttons.$minimizeButton);

        // Only add the maximize button if the window is resizable
        if (this._windowObj?.options?.resizable) this._buttons.$closeButton.before(this._buttons.$maximizeButton);

        // This should remove the text for the close button (to look more like a Windows window)
        this._buttons.$closeButton.contents().last().remove();

        Utils.debug('GW buttons added');
    }

    /**
     * Event listener for `mousedown` to prevent moving while holding the newly added buttons
     * @protected
     */
    protected _preventMovement(ev: any): void {
        ev.preventDefault();
        ev.stopPropagation();
    }

    protected _minimizeEvent(ev: any): void {
        this._windowObj.minimize(ev);
    }

    protected _resizeMaxEvent(ev: any, $maximizeButton: JQuery): void {
        $maximizeButton.replaceWith(this._buttons.$restoreButton);

        // Rebind the lost events
        this._buttons.$restoreButton.on('mousedown', this._preventMovement);
        this._buttons.$restoreButton.on('click', this._resizeEvent.bind(this));

        this._lastPositionBeforeMax = {...this._windowObj.position};
        const newPosition = {
            width: Number(this._constObjects.$canvas.attr('width')),
            height: Number(this._constObjects.$canvas.attr('height')),
            left: 0,
            top: 0,
        }

        this._$window.animate(newPosition, 10, () => {
            this._$window.find(this._defaultClasses.RESIZABLE_HANDLE_QRY).hide();
            this._windowObj.position = {...newPosition};
            this._windowObj.resizable = false;
            this._isMaximized = true;

            this._$window.css(newPosition);
            this._windowObj.setPosition(this._windowObj.position);

            Utils.debug('Maximized: ', {oldPosition: this._lastPositionBeforeMax}, {newPosition});
        });

    }

    protected _resizeRestoreEvent(ev: any, $restoreButton: JQuery): void {
        $restoreButton.replaceWith(this._buttons.$maximizeButton);

        // Rebind the lost events
        this._buttons.$maximizeButton.on('mousedown', this._preventMovement);
        this._buttons.$maximizeButton.on('click', this._resizeEvent.bind(this));

        this._$window.animate(this._lastPositionBeforeMax, 10, () => {
            this._$window.find(this._defaultClasses.RESIZABLE_HANDLE_QRY).show();
            this._windowObj.position = {...this._lastPositionBeforeMax};
            this._windowObj.resizable = true;
            this._isMaximized = false;

            this._$window.css(this._lastPositionBeforeMax);
            this._windowObj.setPosition(this._windowObj.position);

            Utils.debug('Restored: ', {oldPosition: this._lastPositionBeforeMax});
        });
    }

    protected _resizeEvent(ev: any): void {
        // No need to add resize events if the window is not resizable
        if (!this._windowObj?.options?.resizable) return;
        const $target = $(ev.target);
        const $closestMax = $target.closest('.resize-max');
        const $parent = $closestMax.length ? $closestMax : $target.closest('.resize-restore');
        if (!$parent.length) return;

        return $parent.hasClass('resize-max') ? this._resizeMaxEvent(ev, $parent) : this._resizeRestoreEvent(ev, $parent);
    }

    // Not implemented, might be needed in the future
    protected _closeEvent(ev: Event, context: any): void {
    }

    protected _addButtonEvents(): void {
        this._buttons.$minimizeButton.on('mousedown', this._preventMovement);
        this._buttons.$maximizeButton.on('mousedown', this._preventMovement);

        this._buttons.$minimizeButton.on('click', this._minimizeEvent.bind(this));
        this._buttons.$maximizeButton.on('click', this._resizeEvent.bind(this));

        this._buttons.$closeButton.on('click', this._closeEvent.bind(this));

        Utils.debug('Added events on buttons')
    }

    protected _addEdgeSnapEvents(): void {
        if (this._windowObj.resizable === false) return;

        const $windowHeader = $(`.${this._defaultClasses.WINDOW_HEADER}`);
        let lastPositionBeforeMove: any = {};
        let relativeMousePositionBeforeMove: any = {};
        let triggerMouseUp = true;
        let oldY = 0;

        const mouseMoveEvent = (event: any): void => {
            event.preventDefault();

            const newY = event.clientY;
            if (this._isMaximized && this._windowObj.position.top === 0 && newY > oldY) {

                // Simulate the windows behaviour, where the window resizes around the pointer
                this._lastPositionBeforeMax.left = relativeMousePositionBeforeMove.left - $windowHeader.width() / 2;
                this._lastPositionBeforeMax.top = relativeMousePositionBeforeMove.top;
                this._windowObj.position.left = this._lastPositionBeforeMax.left;
                this._windowObj.position.top = this._lastPositionBeforeMax.top;
                this._buttons.$restoreButton.trigger('click');

                triggerMouseUp = false;
            }
            oldY = newY;

        };
        const mouseUpEvent = (event: any): void => {
            $windowHeader.off('mousemove');
            if (!triggerMouseUp) return;
        };
        const mouseDownEvent = (event: any): void => {
            if (this._windowObj._minimized) return;

            oldY = event.clientY;
            lastPositionBeforeMove = {...this._windowObj.position};
            relativeMousePositionBeforeMove = {
                left: event.clientX - $windowHeader.offset().left,
                top: event.clientY - $windowHeader.offset().top,
            };

            $windowHeader.on('mousemove', mouseMoveEvent.bind(this));
            $windowHeader.one('mouseup', mouseUpEvent.bind(this));
        };
        $windowHeader.on('mousedown', mouseDownEvent.bind(this));

        Utils.debug('Added edge snap events')
    }

    protected _hook(): void {
        this._hijackEvents();
        this._generateButtons();
        this._addButtons();
        this._addButtonEvents();
        this._addEdgeSnapEvents();
    }
}

export default GenericWindow;