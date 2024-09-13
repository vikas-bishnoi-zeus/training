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


        this.grid=objArray[2];

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
        this.isMouseDownOnColSelect = false;

        /**
         * @type {boolean} - Indicates whether the mouse is currently down.
         */
        this.isMouseDownOnRow = false;

        /**
         * @type {number} - The index of the column being resized.
         */
        this.colIndex = -1;

        /**
         * @type {number} - The index of the column being resized.
         */
        this.rowIndex = -1;
        
        this.minimumColWidth=50;
        this.minimumRowHeight=30;
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
     * Handles the mouse movement event for resizing columns.
     * @param {MouseEvent} evt - The mouse move event.
     * @returns {void}
     */
    mouseMove(evt) {
        // console.log("Mov",this.isMouseDownOnColResize)
        this.handleTopMouseMove(evt);
        this.handleLeftMouseMove(evt);
        
    }
    handleTopMouseMove(evt){
        if (this.isMouseDownOnColResize && this.colIndex !== -1) {
            this.dimension.addColumnwidth(this.colIndex, evt.movementX,this.minimumColWidth);

            // // Re-render the objects after resizing
            for (let i = 0; i < 3; i++) {
                this.objArray[i].render();
            }
            // Update the input box position
            this.select.setInputBox(true);
            this.objArray[0].render();
        }

        if (!(this.isMouseDownOnColResize||this.isMouseDownOnColSelect)) {
            this.getMovingColNumber(evt);
            this.topCanvasElement.style.cursor = this.colIndex === -1 ? "pointer" : "col-resize";
        }

        if(this.isMouseDownOnColSelect){
            // console.log(this.isMouseDownOnColResize,this.isMouseDownOnColSelect)
            let distance=evt.clientX  - this.rectTop.left + this.dimension.scrollX;
            // this.dimension.selectXRange[1]=Math.max(this.dimension.findColumnIndex(distance),0)
            this.select.currentj=Math.max(this.dimension.findColumnIndex(distance),0)
            this.select.updateSlectedRange();
            // console.log(this.dimension.selectXRange);
            // this.grid.cells[0][0].value="A";
            this.select.sheetRender(false)         
        }
    }

    handleLeftMouseMove(evt){
        if (this.isMouseDownOnRow && this.rowIndex !== -1) {
            this.dimension.addRowHeight(this.rowIndex, evt.movementY,this.minimumRowHeight);

            // Re-render the objects after resizing
            for (let i = 0; i < 3; i++) {
                this.objArray[i].render();
            }

            // Update the input box position
            this.select.setInputBox(true);
        } else if (!this.isMouseDownOnRow) {
            this.getMovingRowNumber(evt);
            // console.log("OnRow",this.rowIndex)
            this.leftCanvasElement.style.cursor = this.rowIndex === -1 ? "default" : "row-resize";
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
     * Handles the mouse down event, indicating the start of a column resize action.
     * @param {MouseEvent} evt - The mouse down event.
     * @returns {void}
     */
    onMouseDownOnTop(evt) {
        // console.log("R")
        // this.getMovingColNumber(evt);
        // this.isMouseDownOnColResize = true;
        this.colIndex===-1? this.isMouseDownOnColSelect = true: this.isMouseDownOnColResize=true;
        this.topCanvasElement.style.cursor =  this.isMouseDownOnColSelect == true? "pointer" : "col-resize";
        if(this.isMouseDownOnColSelect){
            this.onMouseDownCoulumnHeader(evt)
        }

    }

    onMouseDownCoulumnHeader(evt){
        // console.log("Hello")
        let distance=evt.clientX  - this.rectTop.left + this.dimension.scrollX;
        let selectColumnStartIndex=this.dimension.findColumnIndex(distance);
        this.select.deselect();
        this.select.i=0;
        this.select.j=selectColumnStartIndex;
        this.select.currenti=this.dimension.row-1;
        this.select.currentj=selectColumnStartIndex;
        this.select.updateSlectedRange();
        // this.dimension.selectXRange[0]=selectColumnStartIndex;
        // this.dimension.selectXRange[1]=selectColumnStartIndex;
        // this.dimension.selectYRange[0]=0;
        // this.dimension.selectYRange[1]=this.dimension.row-1;
        // this.select.rend
        this.select.sheetRender(false)
        // console.log(this.dimension.findColumnIndex(temp));
    }

    /**
     * Handles the mouse down event, indicating the start of a Row resize action.
     * @param {MouseEvent} evt - The mouse down event.
     * @returns {void}
     */
    onMouseDownOnLeft(evt) {
        this.isMouseDownOnRow = true;
    }
    /**
     * Handles the mouse up event, indicating the end of a column resize action.
     * @param {MouseEvent} evt - The mouse up event.
     * @returns {void}
     */
    mouseUp(evt) {
        this.isMouseDownOnColResize = false;
        this.isMouseDownOnColSelect=false;
        this.isMouseDownOnRow = false;

        // // Re-render the objects after resizing
        // for (let i = 0; i < 3; i++) {
        //     this.objArray[i].render();
        // }
        // this.select.sheetRender(true);

    }
}
