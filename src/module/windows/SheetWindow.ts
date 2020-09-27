import GenericWindow from "./GenericWindow";

class SheetWindow extends GenericWindow {
    getSaveObject(): any {
        const id = this._windowObj?.object?._id;
        const hasToken = this._windowObj?.token !== null;
        return {id, hasToken, window: this}
    }
}

export default SheetWindow;