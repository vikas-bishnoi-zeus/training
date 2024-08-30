// Import necessary modules
import { Grid } from "./grid.js";
import { Dimensions } from "./dimension.js";
import { TopSheet } from "./topSheet.js";
import { LeftSheet } from "./leftSheet.js";
import { SheetUtility } from "./sheetUtility.js";

// Class representing a Sheet in the Excel application
export class Sheet {
    /**
     * Initializes the Excel application with a sheet and header.
     * @param {number} row - Number of intial rows in the sheet.
     * @param {number} col - Number of intial columns in the sheet.
     * @param {number} width - Default Width of each cell in the sheet.
     * @param {number} height - Default Height of each cell in the sheet.
     */
    constructor(row, col, width, height) {
        /**
         * @type {Dimensions}
         */
        this.dimension = new Dimensions(row, col, width, height, 0, 0);
        /**
         * @type {TopSheet}
         */
        this.topSheet = new TopSheet(this.dimension);
        /**
         * @type {LeftSheet}
         */
        this.leftSheet = new LeftSheet(this.dimension);

        /**
         * @type {Grid}
         */
        this.grid = new Grid(this.dimension);

        /**
         * @type {Array.<TopSheet|LeftSheet|Grid>}
         */
        this.sheetArray = [this.topSheet, this.leftSheet, this.grid];

        /**
         * @type {SheetUtility}
         */
        this.sheetUtlilty = new SheetUtility(this.dimension, this.sheetArray);
    }
}
