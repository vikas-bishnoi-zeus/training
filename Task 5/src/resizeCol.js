import { Dimensions } from "./dimension.js";
import { Select } from "./select.js";
import { TopSheet } from "./topSheet.js";
import { LeftSheet } from "./leftSheet.js";
import { Grid } from "./grid.js";
export class ResizeCol {
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

        /**
         * @type {Select}
         */
        this.select = select;

        /**
         * @type {boolean} - Indicates whether the mouse is currently down.
         */
        this.isMouseDown = false;

        /**
         * @type {number} - The index of the column being resized.
         */
        this.ind = -1;
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
        this.rect = this.topCanvasElement.getBoundingClientRect();
    }

    /**
     * Adds the necessary event listeners for mouse movement and clicks.
     * @returns {void}
     */
    addEventListner() {
        window.addEventListener("mousemove", this.mouseMove.bind(this));
        this.topCanvasElement.addEventListener("mousedown", this.mouseDown.bind(this));
        window.addEventListener("mouseup", this.mouseUp.bind(this));
    }

    /**
     * Handles the mouse movement event for resizing columns.
     * @param {MouseEvent} evt - The mouse move event.
     * @returns {void}
     */
    mouseMove(evt) {
        // console.log("Mov",this.isMouseDown)
        if (this.isMouseDown && this.ind !== -1) {
            this.dimension.addColumnwidth(this.ind, evt.movementX);

            // Re-render the objects after resizing
            for (let i = 0; i < 3; i++) {
                this.objArray[i].render();
            }

            // Update the input box position
            this.select.setInputBox(true);
        } else if (!this.isMouseDown) {
            this.getMovingColNumber(evt);
            this.topCanvasElement.style.cursor = this.ind === -1 ? "default" : "col-resize";
        }
    }

    /**
     * Determines the index of the column currently being resized based on the mouse position.
     * @param {MouseEvent} evt - The mouse move event.
     * @returns {void}
     */
    getMovingColNumber(evt) {
        let distance = evt.clientX - this.rect.left + this.dimension.scrollX;
        this.ind = this.dimension.findCoumnResizeIndex(distance);
    }

    /**
     * Handles the mouse down event, indicating the start of a column resize action.
     * @param {MouseEvent} evt - The mouse down event.
     * @returns {void}
     */
    mouseDown(evt) {
        this.isMouseDown = true;
    }
    /**
     * Handles the mouse up event, indicating the end of a column resize action.
     * @param {MouseEvent} evt - The mouse up event.
     * @returns {void}
     */
    mouseUp(evt) {
        this.isMouseDown = false;
    }
}
