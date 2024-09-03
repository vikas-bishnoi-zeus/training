import { Dimensions } from "./dimension.js";
import { TopSheet } from "./topSheet.js";
import { LeftSheet } from "./leftSheet.js";
import { Grid } from "./grid.js";
import { Select } from "./select.js";
export class Graph {
    /**
     * Initializes the Graph class, which handles the creation and rendering of various charts
     * based on the selected range within the grid. It also sets up event listeners
     * for chart interactions and dragging.
     *
     * @param {Dimensions} dimension - The dimensions of the Sheet.
     * @param {Array.<TopSheet|LeftSheet|Grid>} objArray - An array of objects including TopSheet, LeftSheet, and Grid.
     * @param {Select} selectObj - The object representing the selected range in the grid.
     */
    constructor(dimension, objArray, selectObj) {
        /**
         * @type {Dimensions} - The dimensions of  the sheet.
         */
        this.dimension = dimension;

        /**
         * @type {TopSheet} - The top sheet object that handles column headers.
         */
        this.topSheet = objArray[0];

        /**
         * @type {LeftSheet} - The left sheet object that handles row headers.
         */
        this.leftSheet = objArray[1];

        /**
         * @type {Grid} - The grid object that represents the main grid of cells.
         */
        this.grid = objArray[2];

        /**
         * @type {Select} - The object representing the selected range in the grid.
         */
        this.select = selectObj;

        /**
         * @type {boolean} - A flag indicating whether the chart is currently being dragged.
         */
        this.draging = false;
        this.updateselectRange();
        this.getGraphElement();
        /**
         * @type {Chart} - A chart is currently drawn with this reference.
         */
        this.draw = new Chart(this.graphCanvasElement, {
            type: "bar",
            data: {
                labels: [],
                datasets: [],
            },
        });
        this.init();
        this.addEventListener();
    }

    /**
     * Updates the selection range based on the current selection in the grid.
     * @returns {void}
     */
    updateselectRange() {
        this.i = Math.min(this.select.i, this.select.currenti);
        this.j = Math.min(this.select.j, this.select.currentj);
        this.currenti = Math.max(this.select.i, this.select.currenti);
        this.currentj = Math.max(this.select.j, this.select.currentj);
    }

    /**
     * Retrieves the HTML elements related to the graph, such as the canvas and control buttons.
     * @returns {void}
     */
    getGraphElement() {
        this.graph = document.querySelector(".graph");
        this.graphCanvasElement = document.getElementById("myChart");
        this.barGraphBtn = document.querySelector(".graph-bar-btn");
        this.lineGraphBtn = document.querySelector(".graph-line-btn");
        this.pieGraphBtn = document.querySelector(".graph-pie-btn");
        this.graphCloseBtn = document.querySelector(".graph-close");
    }

    /**
     * Adds event listeners for graph interactions and dragging.
     * @returns {void}
     */
    addEventListener() {
        this.graph.addEventListener("mousedown", () => {
            this.draging = true;
        });
        window.addEventListener("mouseup", () => {
            this.draging = false;
        });
        window.addEventListener("mousemove", this.dragChart.bind(this));
    }

    /**
     * Handles the dragging of the chart within the graph element.
     * @param {MouseEvent} evt - The mouse event object.
     * @returns {void}
     */
    dragChart(evt) {
        if (this.draging) {
            let graphX = this.graph.getBoundingClientRect().x;
            let graphY = this.graph.getBoundingClientRect().y;
            let newX = graphX + evt.movementX;
            if (newX > 0) {
                this.graph.style.left = newX + "px";
            }
            let newY = graphY + evt.movementY;
            if (newY > 0) {
                this.graph.style.top = newY + "px";
            }
        }
    }

    /**
     * Initializes event listeners for the graph control buttons.
     */
    init() {
        this.barGraphBtn.addEventListener("click", this.drawBarGraph.bind(this));

        this.lineGraphBtn.addEventListener("click", this.drawLineGraph.bind(this));

        this.pieGraphBtn.addEventListener("click", this.drawPieGraph.bind(this));

        //Setting diplay none of Canvas of Graph
        this.graphCloseBtn.addEventListener("click", () => {
            this.graph.style.display = "none";
        });
    }

    /**
     * Destroys the current chart if one exists, allowing for a new chart to be drawn.
     * @returns {void}
     */
    destroyGraph() {
        this.graph.style.display = "inline-block";
        this.updateselectRange();
        // console.log(this.i, this.j, this.currenti, this.currentj);
        if (this.draw) {
            this.draw.destroy();
        }
    }

    /**
     * Retrieves the values from the grid to be used for the graph's labels and datasets.
     * @returns {{labels: Array<Number>, datasets: Array<{label: string, data: Array<number>, borderWidth: number}>}} - An object containing the labels and datasets for the graph.
     */
    getGraphValue() {
        /**
         * @type {Array<Number>} - Array of Labels
         */
        let labels = [];
        /**
         * @type {Array<{label: string, data: Array<number>, borderWidth: number}>} - Array of dataset objects for the chart
         */
        let datasets = [];
        if (this.isHorizantalSizebigger()) {
            for (let k = this.i; k <= this.currenti; k++) {
                let tempDataset = {
                    label: this.leftSheet.verticalcell[k].value,
                    data: [],
                    borderWidth: 1,
                };
                for (let l = this.j; l <= this.currentj; l++) {
                    labels[l - this.j] = l - this.j + 1;
                    tempDataset.data.push(this.grid.cells[k][l].value);
                }
                datasets.push(tempDataset);
            }
        } else {
            for (let l = this.j; l <= this.currentj; l++) {
                let tempDataset = {
                    label: this.topSheet.horizontalcell[l].value,
                    data: [],
                    borderWidth: 1,
                };
                for (let k = this.i; k <= this.currenti; k++) {
                    labels[k - this.i] = k - this.i + 1;
                    tempDataset.data.push(this.grid.cells[k][l].value);
                }
                datasets.push(tempDataset);
            }
        }
        return { labels, datasets };
    }

    /**
     * Checks whether the horizontal size of the selection is larger than the vertical size.
     * @returns {boolean} - True if the horizontal size is larger, otherwise false.
     */
    isHorizantalSizebigger() {
        if (this.currentj - this.j > this.currenti - this.i) {
            return true;
        }
        return false;
    }

    /**
     * Draws a bar chart based on the selected range in the grid.
     * @returns {void}
     */ drawBarGraph() {
        this.destroyGraph();
        let { labels: labels, datasets: datasets } = this.getGraphValue();
        this.draw = new Chart(this.graphCanvasElement, {
            type: "bar",
            data: {
                labels: labels,
                datasets: datasets,
            },
        });
    }

    /**
     * Draws a line chart based on the selected range in the grid.
     * @returns {void}
     */
    drawLineGraph() {
        this.destroyGraph();
        let { labels: labels, datasets: datasets } = this.getGraphValue();
        this.draw = new Chart(this.graphCanvasElement, {
            type: "line",
            data: {
                labels: labels,
                datasets: datasets,
            },
        });
    }
    /**
     * Draws a pie chart based on the selected range in the grid.
     * @returns {void}
     */
    drawPieGraph() {
        this.destroyGraph();
        let { labels: labels, datasets: datasets } = this.getGraphValue();
        this.draw = new Chart(this.graphCanvasElement, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: datasets,
            },
        });
    }
}
