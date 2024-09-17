import { Dimensions } from "./dimension.js";
import { Select } from "./select.js";
import { TopSheet } from "./topSheet.js";
import { LeftSheet } from "./leftSheet.js";
import { Grid } from "./grid.js";
export class Resize {
    /**
     * Initializes the ResizeCol class.
     * This class handles the resizing of columns within the sheet.
     *
     * @param {Dimensions} dimension - The dimensions of the sheet.
     * @param {Array.<TopSheet|LeftSheet|Grid>} objArray - An array of objects including TopSheet, LeftSheet, and Grid.
     * @param {Select} select - The Select object for handling cell selection.
     */
    constructor(dimension, objArray, select) {
        /**
         * @type {Dimensions}
         */
        this.dimension = dimension;

        /**
         * @type {Array.<TopSheet|LeftSheet|Grid>}
         */
        this.objArray = objArray;

        this.grid = objArray[2];

        /**
         * @type {Select}
         */
        this.select = select;

        /**
         * @type {boolean} - Indicates whether the mouse is currently down for resize.
         */
        this.isMouseDownOnColResize = false;

        /**
         * @type {boolean} - Indicates whether the mouse is currently down for Selecting a column.
         */
        this.isSelectingColumn = false;

        this.isSelectingRow = false;

        /**
         * @type {boolean} - Indicates whether the mouse is currently down.
         */
        this.isMouseDownOnRowResize = false;

        /**
         * @type {number} - The index of the column being resized.
         */
        this.colIndex = -1;

        /**
         * @type {number} - The index of the column being resized.
         */
        this.rowIndex = -1;

        this.minimumColWidth = 50;
        this.minimumRowHeight = 30;
        this.init();
        this.addEventListner();
    }

    /**
     * Initializes the necessary DOM elements and sets up the canvas element.
     * @returns {void}
     */
    init() {
        /**
         * @type {HTMLElement}
         */
        this.topCanvasElement = document.getElementById("horizontal");
        /**
         * @type {DOMRect}
         */
        this.rectTop = this.topCanvasElement.getBoundingClientRect();

        /**
         * @type {HTMLElement}
         */
        this.leftCanvasElement = document.getElementById("vertrical");
        /**
         * @type {DOMRect}
         */
        this.rectLeft = this.leftCanvasElement.getBoundingClientRect();
    }

    /**
     * Adds the necessary event listeners for mouse movement and clicks.
     * @returns {void}
     */
    addEventListner() {
        this.topCanvasElement.addEventListener("mousedown", this.onMouseDownOnTop.bind(this));
        this.leftCanvasElement.addEventListener("mousedown",this.onMouseDownOnLeft.bind(this));
        window.addEventListener("mousemove", this.mouseMove.bind(this));
        window.addEventListener("mouseup", this.mouseUp.bind(this));
    }

    /**
     * Handles the mouse down event, indicating the start of a column resize action.
     * @param {MouseEvent} evt - The mouse down event.
     * @returns {void}
     */
    onMouseDownOnTop(evt) {
        console.log(this.colIndex===-1)
        this.colIndex === -1 ? (this.isSelectingColumn = true) : (this.isMouseDownOnColResize = true);
        if (this.isSelectingColumn) {
            window.cancelAnimationFrame(this.select.rafId);
            this.dimension.isSelectedRow = false;
            this.dimension.isSelectedColumn = true;
            this.onMouseDownCoulumnHeader(evt);
        }
    }

    onMouseDownCoulumnHeader(evt) {
        
        // console.log("Hello")
        let distance = evt.clientX - this.rectTop.left + this.dimension.scrollX;
        let selectColumnStartIndex = this.dimension.findColumnIndex(distance);
        // this.select.deselect();
        this.select.i = 0;
        this.select.j = selectColumnStartIndex;
        this.select.currenti = this.dimension.row - 1;
        this.select.currentj = selectColumnStartIndex;
        this.select.updateSlectedRange();
        this.select.sheetRender(true);

        // console.log(this.dimension.findColumnIndex(temp));
    }

    /**
     * Handles the mouse down event, indicating the start of a Row resize action.
     * @param {MouseEvent} evt - The mouse down event.
     * @returns {void}
     */
    onMouseDownOnLeft(evt) {
        
        this.rowIndex === -1 ? (this.isSelectingRow = true) : (this.isMouseDownOnRowResize = true);
        if (this.isSelectingRow) {
            window.cancelAnimationFrame(this.select.rafId);
            this.dimension.isSelectedColumn = false;
            this.dimension.isSelectedRow = true;
            // console.log("selected Row   ");
            this.onMouseDownRow(evt);
        }
    }
    /**
     *
     * @param {*} evt
     */
    onMouseDownRow(evt) {
        let distance = evt.clientY - this.rectLeft.top + this.dimension.scrollY;
        let selectRowStartIndex = this.dimension.findRowIndex(distance);
        // this.select.deselect();
        this.select.i = selectRowStartIndex;
        this.select.j = 0;
        this.select.currenti = selectRowStartIndex;
        this.select.currentj = this.dimension.col-1;
        this.select.updateSlectedRange();
        this.select.sheetRender(false);
        // console.log(this.dimension.findColumnIndex(temp));
    }

    /**
     * Handles the mouse movement event for resizing columns.
     * @param {MouseEvent} evt - The mouse move event.
     * @returns {void}
     */
    mouseMove(evt) {
        // console.log("Mov",this.isMouseDownOnColResize)
        this.handleTopMouseMove(evt);
        this.handleLeftMouseMove(evt);
    }
    handleTopMouseMove(evt) {
        if (this.isMouseDownOnColResize && this.colIndex !== -1) {
            this.dimension.addColumnwidth(this.colIndex, evt.movementX, this.minimumColWidth);
            this.select.sheetRender(true);
        }

        if (!(this.isMouseDownOnColResize || this.isSelectingColumn)) {
            this.getMovingColNumber(evt);
            this.topCanvasElement.style.cursor = this.colIndex === -1 ? "grab" : "col-resize";
        }

        if (this.isSelectingColumn) {
            let distance = evt.clientX - this.rectTop.left + this.dimension.scrollX;
            this.select.currentj = Math.max(this.dimension.findColumnIndex(distance), 0);
            this.select.updateSlectedRange();
            this.select.sheetRender(false);
        }
    }

    handleLeftMouseMove(evt) {
        if (this.isMouseDownOnRowResize && this.rowIndex !== -1) {
            this.dimension.addRowHeight(this.rowIndex, evt.movementY, this.minimumRowHeight);
            this.select.sheetRender(true);
        }
        if (!(this.isMouseDownOnRowResize || this.isSelectingRow)) {
            this.getMovingRowNumber(evt);
            // console.log(this.isMouseDownOnRowResize,this.isSelectingRow)
            this.leftCanvasElement.style.cursor = this.rowIndex === -1 ? "grab" : "row-resize";
        }

        if (this.isSelectingRow) {
            let distance = evt.clientY - this.rectLeft.top + this.dimension.scrollY;
            this.select.currenti = Math.max(this.dimension.findRowIndex(distance), 0);
            this.select.updateSlectedRange();
            this.select.sheetRender(false);
        }
    }

    /**
     * Determines the index of the column currently being resized based on the mouse position.
     * @param {MouseEvent} evt - The mouse move event.
     * @returns {void}
     */
    getMovingColNumber(evt) {
        let distance = evt.clientX - this.rectTop.left + this.dimension.scrollX;
        this.colIndex = this.dimension.findColumnResizeIndex(distance);
    }

    getMovingRowNumber(evt) {
        let distance = evt.clientY - this.rectLeft.top + this.dimension.scrollY;
        this.rowIndex = this.dimension.findRowResizeIndex(distance);
    }

    /**
     * Handles the mouse up event, indicating the end of a column resize action.
     * @param {MouseEvent} evt - The mouse up event.
     * @returns {void}
     */
    mouseUp(evt) {
        this.isMouseDownOnColResize = false;
        this.isMouseDownOnRowResize = false;
        this.isSelectingColumn = false;
        this.isSelectingRow = false;
    }
}
