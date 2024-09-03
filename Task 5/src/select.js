import { Dimensions } from "./dimension.js";
import { TopSheet } from "./topSheet.js";
import { LeftSheet } from "./leftSheet.js";
import { Grid } from "./grid.js";

export class Select {
    /**
     * Initializes the Select class, which handles the selection of cells
     * across the TopSheet, LeftSheet, and Grid objects. Also sets up event listeners
     * for mouse interactions.
     *
     * @param {Dimensions} dimension - The dimensions of the sheet.
     * @param {Array.<TopSheet|LeftSheet|Grid>} objArray - An array of objects including TopSheet, LeftSheet, and Grid.
     */
    constructor(dimension, objArray) {
        /**
         * @type {Dimensions}
         */
        this.dimension = dimension;

        /**
         * @type {Array.<TopSheet|LeftSheet|Grid>}
         */
        this.objArray = objArray;

        /**
         * @type {TopSheet}
         */
        this.topSheet = objArray[0];

        /**
         * @type {LeftSheet}
         */
        this.leftSheet = objArray[1];

        /**
         * @type {Grid}
         */
        this.grid = objArray[2];

        this.init();
        this.addEventListners();
        this.setInputBox();
        // console.log(this.i,this.grid.cells[0][0]);
    }
    /**
     * Initializes the selection properties and references to DOM elements.
     * Also sets the initial selection state.
     * @returns {void}
     */
    init() {
        /**
         * @type {number}
         */
        this.inputX = -1;

        /**
         * @type {number}
         */
        this.inputY = -1;

        /**
         * @type {number}
         */
        this.i = 1;

        /**
         * @type {number}
         */
        this.j = 0;

        /**
         * @type {number}
         */
        this.currenti = 1;

        /**
         * @type {number}
         */
        this.currentj = 0;

        /**
         * @type {boolean}
         */
        this.isSelection = false;

        // Reference to the spreadsheet DOM element
        /**
         * @type {HTMLElement}
         */
        this.spreadsheet = document.getElementById("spreadsheet");

        /**
         * @type {HTMLInputElement}
         */
        this.cellInput = document.getElementById("content");
        /**
         * @type {DOMRect}
         */
        this.rect = this.spreadsheet.getBoundingClientRect();
    }
    /**
     * Sets up event listeners for handling mouse interactions on the spreadsheet.
     * @returns {void}
     */
    addEventListners() {
        // ?spreadsheet

        // Mouse down event listener for selecting cells and input
        this.spreadsheet.addEventListener("mousedown", this.onMouseDown.bind(this));

        // Mouse move event listener for updating the selection
        this.spreadsheet.addEventListener("mousemove", this.onMouseMove.bind(this));

        // Mouse up event listener for finalizing the selection
        window.addEventListener("mouseup", this.onMouseUp.bind(this));
    }
    /**
     * Handles mouse down events to start a cell selection.
     * @param {MouseEvent} evt - The mouse event object.
     * @returns {void}
     */
    onMouseDown(evt) {
        // Calculate the position relative to the spreadsheet
        this.inputX = evt.clientX - this.rect.left + this.dimension.scrollX;
        this.inputY = evt.clientY - this.rect.top + this.dimension.scrollY;

        // Deselect previously selected cells
        this.deselect();

        // Render previous input and Update the value
        this.renderPrv();

        // Determine the cell indexes based on mouse position
        this.i = this.dimension.findRowIndex(this.inputY);
        this.j = this.dimension.findColumnIndex(this.inputX);

        this.currenti = this.i;
        this.currentj = this.j;

        // Start input mode and cell selection
        this.renderInput();
        this.isSelection = true;
    }
    /**
     * Handles mouse move events to update the cell selection range.
     * @param {MouseEvent} evt - The mouse event object.
     * @returns {void}
     */
    onMouseMove(evt) {
        if (this.isSelection) {
            let tempcurrenti = this.dimension.findRowIndex(evt.clientY - this.rect.top + this.dimension.scrollY);
            let tempcurrentj = this.dimension.findColumnIndex(evt.clientX - this.rect.left + this.dimension.scrollX);
            // Check if the current cell has changed
            if (tempcurrenti == this.currenti && tempcurrentj == this.currentj) {
                return;
            }

            // Deselect the previous selection
            this.deselect();

            // Update current cell indexes
            this.currenti = tempcurrenti;
            this.currentj = tempcurrentj;

            // Select the new cells
            this.select();
        }
    }
    /**
     * Handles mouse up events to finalize the cell selection.
     * @param {MouseEvent} evt - The mouse event object.
     * @returns {void}
     */
    onMouseUp(evt) {
        this.isSelection = false;
    }
    /**
     * Selects the cells within the current selection range and updates related information.
     * @returns {void}
     */
    select() {
        this.count = 0;
        this.sum = 0;
        this.min = Number.MAX_VALUE;
        this.max = -Number.MAX_VALUE;

        // Select cells in the TopSheet
        for (let j = Math.min(this.j, this.currentj); j <= Math.max(this.j, this.currentj); j++) {
            this.topSheet.horizontalcell[j].isSelected = true;
        }

        // Select cells in the LeftSheet and Grid
        for (let i = Math.min(this.i, this.currenti); i <= Math.max(this.i, this.currenti); i++) {
            this.leftSheet.verticalcell[i].isSelected = true;
            for (let j = Math.min(this.j, this.currentj); j <= Math.max(this.j, this.currentj); j++) {
                this.grid.cells[i][j].isSelected = true;

                // Continue withouth selection summary if the cell don't have a value
                if (this.grid.cells[i][j].value === "") {
                    continue;
                }
                let number = Number(this.grid.cells[i][j].value);

                // do selection summary if the cell have a numerical value
                if (!Number.isNaN(number)) {
                    this.sum = this.sum + number;
                    this.count = this.count + 1;
                    this.min = Math.min(number, this.min);
                    this.max = Math.max(number, this.max);
                }
            }
        }

        // Update the summary display if more than one cell is selected
        if (this.count > 1) {
            document.getElementById("sum").innerHTML = "Sum: " + this.sum;
            let avr = (this.sum / this.count).toFixed(2);
            document.getElementById("average").innerHTML = "Average: " + avr;
            document.getElementById("min").innerHTML = "Min: " + this.min;
            document.getElementById("max").innerHTML = "Max: " + this.max;
        } else {
            this.removeInfoMath();
        }
        this.sheetRender();
    }

    /**
     * Clears the summary information displayed for the selected cells.
     * @returns {void}
     */
    removeInfoMath() {
        document.getElementById("sum").innerHTML = "";
        document.getElementById("average").innerHTML = "";
        document.getElementById("min").innerHTML = "";
        document.getElementById("max").innerHTML = "";
    }

    /**
     * Deselects all currently selected cells.
     * @returns {void}
     */
    deselect() {
        // Deselect cells in the TopSheet
        for (let j = Math.min(this.j, this.currentj); j <= Math.max(this.j, this.currentj); j++) {
            this.topSheet.horizontalcell[j].isSelected = false;
        }

        // Deselect cells in the LeftSheet and Grid
        for (let i = Math.min(this.i, this.currenti); i <= Math.max(this.i, this.currenti); i++) {
            this.leftSheet.verticalcell[i].isSelected = false;
            for (let j = Math.min(this.j, this.currentj); j <= Math.max(this.j, this.currentj); j++) {
                this.grid.cells[i][j].isSelected = false;
            }
        }
    }

    /**
     * Renders the previous input value if in editing mode and updates the cell content.
     * @returns {Promise<void>}
     */
    async renderPrv() {
        // Return if no changes are made
        if (this.i === 0 || this.grid.cells[this.i][this.j].value === this.cellInput.value) {
            return;
        }
        this.grid.cells[this.i][this.j].value = this.cellInput.value;
        try {
            const dataModel = {
                row_num: this.i,
                email_id: this.grid.cells[this.i][0].value,
                name: this.grid.cells[this.i][1].value,
                country: this.grid.cells[this.i][2].value,
                state: this.grid.cells[this.i][3].value,
                city: this.grid.cells[this.i][4].value,
                telephone_number: this.grid.cells[this.i][5].value,
                address_line_1: this.grid.cells[this.i][6].value,
                address_line_2: this.grid.cells[this.i][7].value,
                date_of_birth: this.grid.cells[this.i][8].value,
                gross_salary_FY2019_20: this.grid.cells[this.i][9].value,
                gross_salary_FY2020_21: this.grid.cells[this.i][10].value,
                gross_salary_FY2021_22: this.grid.cells[this.i][11].value,
                gross_salary_FY2022_23: this.grid.cells[this.i][12].value,
                gross_salary_FY2023_24: this.grid.cells[this.i][13].value,
            };
            let response = await fetch("https://localhost:7009/api/csv/UpdateRecord", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataModel),
            });
        } catch (error) {
            console.error("error in updating the cell", error);
        }
        this.sheetRender();
    }
    /**
     * Renders the input box for cell editing.
     * @returns {void}
     */
    renderInput() {
        // if(this.inputX===-1 ||this.inputY===-1){
        //     return ;
        // }
        this.select();
        this.setInputBox(false);
    }
    /**
     * Sets the input box position and content based on the selected cell or Clicked cell.
     *
     * @param {boolean} iScrolling - Indicates if the sheet is currently scrolling and input box value should it .
     * @returns {void}
     */
    setInputBox(iScrolling) {
        if (iScrolling) {
            this.renderPrv();
        }
        this.cellInput.value = this.grid.cells[this.i][this.j].value;
        this.cellInput.style.display = "block";
        var top = this.grid.cells[this.i][this.j].y - Math.floor(this.dimension.scrollY);
        var left = this.grid.cells[this.i][this.j].x - Math.floor(this.dimension.scrollX) + this.rect.left;
        this.cellInput.style.top = top + "px";
        this.cellInput.style.left = left + "px";
        this.cellInput.style.height = this.grid.cells[this.i][this.j].h + "px";
        this.cellInput.style.width = this.grid.cells[this.i][this.j].w + "px";
    }
    /**
     * Renders the grid, top sheet, and left sheet.
     * @returns {void}
     */
    sheetRender() {
        this.grid.render();
        this.topSheet.render();
        this.leftSheet.render();
    }
}
