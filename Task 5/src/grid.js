import { Cell } from "./cell.js";
import { Dimensions } from "./dimension.js";

export class Grid {
    /**
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
        this.rowSizePrefix = dimension.rowSizePrefix;

        /**
         * @type {number[]}
         */
        this.columnSizePrefix = dimension.columnSizePrefix;

        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = this.getCanvas();

        /**
         * @type {Cell[][]}
         */
        this.cells = [];
        this.init();
        // console.log(this.cells);
        this.render();
    }

    /**
     * Initializes the grid with cells for each row and column.
     * @returns {void}
     */
    init() {
        for (let i = 0; i < this.dimension.row; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.dimension.col; j++) {
                let val = ""; // Initialize cell with an empty string
                const curCell = new Cell(this.columnSizePrefix[j], this.rowSizePrefix[i], this.getWidth(j), this.getHeight(i), val, false, this.ctx);
                this.cells[i][j] = curCell;
            }
        }
        this.cells[1][0].isSelected = true; // Select the first cell in the second row by default
    }

    /**
     * Renders the grid by drawing the visible cells within the viewport.
     * @returns {void}
     */
    render() {
        this.ctx.reset(); // Reset the canvas context
        /**
         * @type {number}
         */
        let starti = this.dimension.findRowIndex(this.dimension.scrollY);
        /**
         * @type {number}
         */
        let lasti = this.dimension.findRowIndex(this.dimension.scrollY + screen.height);
        /**
         * @type {number}
         */
        let startj = this.dimension.findColumnIndex(this.dimension.scrollX);
        /**
         * @type {number}
         */
        let lastj = this.dimension.findColumnIndex(this.dimension.scrollX + screen.width);

        // Iterate through the visible cells and draw them
        for (let i = starti; i <= lasti; i++) {
            for (let j = startj; j <= lastj; j++) {
                this.cells[i][j].x = this.columnSizePrefix[j];
                this.cells[i][j].y = this.rowSizePrefix[i];
                this.cells[i][j].w = this.getWidth(j);
                this.cells[i][j].rectDraw(this.dimension.scrollX, this.dimension.scrollY);
            }
        }
        this.selectBoundary();
    }
    selectBoundary() {
        // console.log("A",ctx)
        // Set the green border style
        this.ctx.strokeStyle = "green";
        this.ctx.lineWidth = 3;
        // Draw the green rectangle (boundary)
        // console.log(this.dimension.selectXRange);
        // console.log(this.dimension.selectXRange)
        let startXIndex = this.dimension.selectXRange[0];
        let EndXIndex = this.dimension.selectXRange[1] + 1;
        let startYIndex = this.dimension.selectYRange[0];
        let EndYIndex = this.dimension.selectYRange[1] + 1;
        // console.log(startXIndex,startYIndex)
        let startXDis = this.dimension.columnSizePrefix[startXIndex];
        let startYDis = this.dimension.rowSizePrefix[startYIndex];
        let diffX = this.dimension.columnSizePrefix[EndXIndex] - startXDis;
        let diffY = this.dimension.rowSizePrefix[EndYIndex] - startYDis;
        this.ctx.strokeRect(startXDis - this.dimension.scrollX, startYDis - this.dimension.scrollY, diffX, diffY);
        // this.drawDottedRect()
    }

    drawDottedRect(dashOffset) {
        this.ctx.setLineDash([5, 5]);
        this.ctx.lineDashOffset =-dashOffset;
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2.5;
        let startXIndex = this.dimension.selectXRange[0];
        let EndXIndex = this.dimension.selectXRange[1] + 1;
        let startYIndex = this.dimension.selectYRange[0];
        let EndYIndex = this.dimension.selectYRange[1] + 1;
        // console.log(startXIndex,startYIndex)
        let startXDis = this.dimension.columnSizePrefix[startXIndex];
        let startYDis = this.dimension.rowSizePrefix[startYIndex];
        let diffX = this.dimension.columnSizePrefix[EndXIndex] - startXDis;
        let diffY = this.dimension.rowSizePrefix[EndYIndex] - startYDis;
        this.ctx.strokeRect(startXDis - this.dimension.scrollX, startYDis - this.dimension.scrollY, diffX, diffY);
        this.ctx.setLineDash([]);
    }

    /**
     * Retrieves the canvas context for drawing.
     * @returns {CanvasRenderingContext2D} - The 2D drawing context.
     */
    getCanvas() {
        /**
         * @type {HTMLElement}
         */
        let canvas = document.getElementById("spreadsheet");
        this.setHeightWidth(canvas, screen.height - 30, screen.width);
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

    /**
     * Calculates the height of a row.
     * @param {number} i - The index of the row.
     * @returns {number} - The height of the row.
     */
    getHeight(i) {
        return this.rowSizePrefix[i + 1] - this.rowSizePrefix[i];
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
     * Adds more rows to the grid.
     * @param {number} num - The number of rows to add.
     * @returns {void}
     */
    addMoreRows(num) {
        /**
         * @type {number}
         */
        let len = this.dimension.row;

        // Create and initialize new cells for the additional columns
        for (let i = 0; i < num; i++) {
            this.cells[i + len] = [];
            for (let j = 0; j < this.dimension.col; j++) {
                let val = ""; // Initialize cell with an empty string
                const curCell = new Cell(this.columnSizePrefix[j], this.rowSizePrefix[i + len], this.getWidth(j), this.getHeight(i + len), val, false, this.ctx);
                this.cells[i + len][j] = curCell;
            }
        }
    }

    /**
     * Adds more columns to the grid.
     * @param {number} num - The number of columns to add.
     * @returns {void}
     */
    addMoreCols(num) {
        /**
         * @type {number}
         */
        let len = this.dimension.col;

        // Create and initialize new cells for the additional columns
        for (let i = 0; i < this.dimension.row; i++) {
            for (let j = 0; j < num; j++) {
                let val = ""; // Initialize cell with an empty string
                const curCell = new Cell(this.columnSizePrefix[j + len], this.rowSizePrefix[i], this.getWidth(j + len), this.getHeight(i), val, false, this.ctx);
                this.cells[i][j + len] = curCell;
            }
        }
    }
}
