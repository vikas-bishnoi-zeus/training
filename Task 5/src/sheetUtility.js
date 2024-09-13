import { Dimensions } from "./dimension.js";
import { Graph } from "./graph.js";
import { Select } from "./select.js";
import { ScrollBar } from "./scrollbar.js";
import { Resize } from "./resize.js";
import { TopSheet } from "./topSheet.js";
import { LeftSheet } from "./leftSheet.js";
import { Grid } from "./grid.js";
export class SheetUtility {
    /**
     * Initializes the SheetUtility class with the given dimensions and an array of objects
     * consisting of TopSheet, LeftSheet, and Grid objects in that order.
     * This class manages selection, graphing, scrolling, and column resizing functionalities.
     *
     * @param {Dimensions} dimension - The dimensions of the sheet.
     * @param {Array.<TopSheet|LeftSheet|Grid>} objArray - An array of objects including TopSheet, LeftSheet, and Grid.
     */
    constructor(dimension, objArray) {
        /**
         * Handles cell selection within the sheet.
         * @type {Select}
         */
        this.select = new Select(dimension, objArray);

        /**
         * Manages graph-related operations within the sheet.
         * @type {Graph}
         */
        this.graph = new Graph(dimension, objArray, this.select);

        /**
         * The HTML element representing the sheet.
         * @type {HTMLElement}
         */
        this.sheet = document.getElementById("excel-1");

        /**
         * Handles the scroll bar functionality for navigating the sheet.
         * @type {ScrollBar}
         */
        this.scrollBar = new ScrollBar(dimension, objArray, this.sheet, this.select);

        /**
         * Manages the resizing of columns within the sheet.
         * @type {ResizeCol}
         */
        this.resize = new Resize(dimension, objArray, this.select);
    }
}
