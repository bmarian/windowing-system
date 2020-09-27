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

    const left = this.position.left + (event.clientX - this._initial.x);
    const top = this.position.top + (event.clientY - this._initial.y);

    console.log({left, top});
    this.app.setPosition({left, top});
}

export {
    _onDragMouseDown,
    _onDragMouseMove
}