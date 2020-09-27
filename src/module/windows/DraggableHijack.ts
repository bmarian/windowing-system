// @ts-nocheck

/**
 * Handle the initial mouse click which activates dragging behavior for the application
 * @private
 */
function _onDragMouseDown(event) {
    event.preventDefault();

    // Record initial position
    this.position = duplicate(this.app.position);
    this._initial = {x: event.clientX, y: event.clientY};

    // Add temporary handlers
    window.addEventListener(...this.handlers.dragMove);
    window.addEventListener(...this.handlers.dragUp);
}


/**
 * Move the window with the mouse, bounding the movement to ensure the window stays within bounds of the viewport
 * @private
 */
function _onDragMouseMove(event) {
    event.preventDefault();

    this.app.setPosition({
        left: this.position.left + (event.clientX - this._initial.x),
        top: this.position.top + (event.clientY - this._initial.y)
    });
}

/**
 * Conclude the dragging behavior when the mouse is release, setting the final position and removing listeners
 * @private
 */
function _onDragMouseUp(event) {
    event.preventDefault();
    window.removeEventListener(...this.handlers.dragMove);
    window.removeEventListener(...this.handlers.dragUp);
}

export {
    _onDragMouseDown,
    _onDragMouseMove,
    _onDragMouseUp
}