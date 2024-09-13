import { Cell } from "./cell.js";
import { Dimensions } from "./dimension.js";
export class LeftSheet {
    /**
     * Initializes the LeftSheet class with the given dimensions and prepares the canvas.
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
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = this.getCanvas();

        /**
         * @type {Cell[]}
         */
        this.verticalcell = [];

        this.init();
        this.render();
    }
    /**
     * Initializes the left sheet with cells.
     * @returns {void}
     */
    init() {
        // Create and initialize cells for each row
        for (let i = 0; i < this.dimension.row; i++) {
            const verCell = new Cell(0, this.rowSizePrefix[i], 100, this.getHeight(i), i + 1, false, this.ctx);
            this.verticalcell[i] = verCell;
        }
        this.verticalcell[1].isSelected = true; // Select the second cell by default
    }
    /**
     * Renders the left sheet by drawing the cells within the visible area.
     * @returns {void}
     */
    render() {
        this.ctx.reset(); // Reset the left canvas context

        /**
         * @type {number}
         */
        let starti = this.dimension.findRowIndex(this.dimension.scrollY);

        /**
         * @type {number}
         */
        let lasti = this.dimension.findRowIndex(this.dimension.scrollY + screen.height);

        // Iterate through the visible cells and draw them
        for (let i = starti; i <= lasti; i++) {
            this.verticalcell[i].y=this.rowSizePrefix[i];
            this.verticalcell[i].h=this.getHeight(i);
            this.verticalcell[i].rectDraw(0, this.dimension.scrollY);
        }
        this.selectBoundary();
    }

    selectBoundary(){
        // console.log("A",ctx)
        // Set the green border style
        this.ctx.strokeStyle = 'green';
        this.ctx.lineWidth = 4;
        let startYIndex=this.dimension.selectYRange[0];
        let EndYIndex=this.dimension.selectYRange[1]+1;
        let startYDis=this.dimension.rowSizePrefix[startYIndex];
        let diffY=this.dimension.rowSizePrefix[EndYIndex]-startYDis;
        this.ctx.strokeRect(this.dimension.leftSheet_Width, startYDis-this.dimension.scrollY, 0, diffY);
        this.ctx.fillStyle = "rgba(19, 126, 67, 0.1)";
        this.ctx.fillRect(0, startYDis-this.dimension.scrollY, this.dimension.width, diffY);
    }

    /**
     * Adds more rows to the left sheet.
     * @param {number} num - The number of rows to add.
     * @returns {void}
     */
    addMoreRows(num) {
        /**
         * @type {number}
         */
        let len = this.dimension.row;

        // Create and initialize new cells for the additional rows
        for (let i = 0; i < num; i++) {
            const verCell = new Cell(0, this.rowSizePrefix[i + len], 100, this.getHeight(i + len), i + len + 1, false, this.ctx);
            this.verticalcell[i + len] = verCell;
        }
    }

    /**
     * Adds more columns to the left sheet. (Currently not implemented)
     * @param {number} num - The number of columns to add.
     * @returns {void}
     */
    addMoreCols(num) {
        // No code need just dumy function
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
     * Retrieves the canvas context for drawing.
     * @returns {CanvasRenderingContext2D} - The 2D drawing context.
     */
    getCanvas() {
        let canvas = document.getElementById("vertrical");
        this.setHeightWidth(canvas, screen.height - 30, 100);
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
