// Importing cell to create columname cell
import { Cell } from "./cell.js";
import { Dimensions } from "./dimension.js";
export class TopSheet {
    /**
     * Initializes the TopSheet class with the given dimensions and prepares the canvas.
     * @param {Dimensions} dimension - The dimensions of the sheet.
     */
    constructor(dimension) {
        /**
         * @type {Dimensions}
         */
        this.dimension = dimension;

        /**
         * @type {number[]}
         */
        this.columnSizePrefix = dimension.columnSizePrefix;

        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = this.getCanvasContext();

        /**
         * @type {Cell[]}
         */
        this.horizontalcell = [];

        this.init();
        this.render();
    }
    /**
     * Initializes the top sheet with cells.
     * @returns {void}
     */
    init() {
        // Create and initialize cells for each column
        for (let i = 0; i < this.dimension.col; i++) {
            const headerCell = new Cell(this.columnSizePrefix[i], 0, this.getWidth(i), 30, this.getCoulomName(i + 1), false, this.ctx);
            this.horizontalcell[i] = headerCell;
        }
        this.horizontalcell[0].isSelected = true; // Select the first cell by default
    }
    /**
     * Renders the top sheet by drawing the cells within the visible area.
     * @returns {void}
     */
    render() {
        this.ctx.reset(); // Reset the canvas context

        /**
         * @type {number}
         */
        let starti = this.dimension.findColumnIndex(this.dimension.scrollX);

        /**
         * @type {number}
         */
        let lasti = this.dimension.findColumnIndex(this.dimension.scrollX + screen.width);

        // Iterate through the visible cells and draw them
        for (let i = starti; i <= lasti; i++) {
            this.horizontalcell[i].x = this.columnSizePrefix[i];
            this.horizontalcell[i].w = this.getWidth(i);
            this.horizontalcell[i].rectDraw(this.dimension.scrollX, 0);
        }
        this.selectBoundar();
    }

    selectBoundar(){
        // console.log("A",ctx)
        // Set the green border style
        this.ctx.strokeStyle = 'green';
        this.ctx.lineWidth = 4;
        let startXIndex=this.dimension.selectXRange[0];
        let EndXIndex=this.dimension.selectXRange[1]+1;

        let startXDis=this.dimension.columnSizePrefix[startXIndex];
        let diffX=this.dimension.columnSizePrefix[EndXIndex]-startXDis;
        this.ctx.strokeRect(startXDis-this.dimension.scrollX,this.dimension.height, diffX, 0);
    }

    /**
     * Adds more rows to the top sheet. (Currently not implemented)
     * @param {number} num - The number of rows to add.
     * @returns {void}
     */
    addMoreRows(num) {
        // Placeholder for adding more rows functionality
    }

    /**
     * Adds more columns to the top sheet.
     * @param {number} num - The number of columns to add.
     * @returns {void}
     */
    addMoreCols(num) {
        /**
         * @type {number}
         */
        let len = this.dimension.col;

        // Create and initialize new cells for the additional columns
        for (let i = 0; i < num; i++) {
            const headerCellToBeAdded = new Cell(this.columnSizePrefix[i + len], 0, this.getWidth(i + len), 30, this.getCoulomName(i + len + 1), false, this.ctx);
            this.horizontalcell[i + len] = headerCellToBeAdded;
        }
    }

    /**
     * Calculates the width of a column.
     * @param {number} j - The index of the column.
     * @returns {number} - The width of the column.
     */
    getWidth(j) {
        return this.columnSizePrefix[j + 1] - this.columnSizePrefix[j];
    }

    /**
     * Generates the column name based on its index.
     * @param {number} num - The index of the column.
     * @returns {string} - The name of the column.
     */
    getCoulomName(num) {
        var s = "";

        // Generate column name based on its index
        while (num > 0) {
            var t = (num - 1) % 26;
            s = String.fromCharCode(65 + t) + s;
            num = ((num - t) / 26) | 0;
        }
        return s || undefined;
    }

    /**
     * Retrieves the canvas context for drawing.
     * @returns {CanvasRenderingContext2D} - The 2D drawing context.
     */
    getCanvasContext() {
        let canvas = document.getElementById("horizontal");
        this.setHeightWidth(canvas, 30, screen.width);
        return canvas.getContext("2d");
    }

    /**
     * Sets the height and width of the canvas.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {number} height - The height to set.
     * @param {number} width - The width to set.
     * @returns {void}
     */
    setHeightWidth(canvas, height, width) {
        canvas.height = height;
        canvas.width = width;
    }
}
