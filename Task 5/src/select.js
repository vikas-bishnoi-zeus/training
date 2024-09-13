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
        this.setInputBox(false);
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

        // Reference to the spreadsheet DOM element
        /**
         * @type {HTMLElement}
         */
        this.columnHeader = document.getElementById("horizontal");

        /**
         * @type {HTMLInputElement}
         */
        this.cellInput = document.getElementById("content");
        /**
         * @type {DOMRect}
         */
        this.rect = this.spreadsheet.getBoundingClientRect();
        
        this.rafId=0;
        this.dashOffset=0;
    }
    /**
     * Sets up event listeners for handling mouse interactions on the spreadsheet.
     * @returns {void}
     */
    addEventListners() {
        // ?spreadsheet

        // Mouse down event listener for selecting cells and input
        this.spreadsheet.addEventListener("mousedown", this.onMouseDownSpreadSheet.bind(this));

        // Mouse move event listener for updating the selection
        this.spreadsheet.addEventListener("mousemove", this.onMouseMove.bind(this));

        // Mouse up event listener for finalizing the selection
        window.addEventListener("mouseup", this.onMouseUp.bind(this));

        window.addEventListener("keydown", this.handleKeyPress.bind(this));
    }
    /**
     * Handles mouse down events to start a cell selection.
     * @param {MouseEvent} evt - The mouse event object.
     * @returns {void}
     */
    onMouseDownSpreadSheet(evt) {
        this.dimension.colSelects=[-1,-1]

        window.cancelAnimationFrame(this.rafId);
        // Calculate the position relative to the spreadsheet
        this.inputX = evt.clientX - this.rect.left + this.dimension.scrollX;
        this.inputY = evt.clientY - this.rect.top + this.dimension.scrollY;

        // Deselect previously selected cells
        // this.deselect();

        // Render previous input and Update the value
        this.renderPrv();

        // Determine the cell indexes based on mouse position
        this.i = this.dimension.findRowIndex(this.inputY);
        this.j = this.dimension.findColumnIndex(this.inputX);

        this.currenti = this.i;
        this.currentj = this.j;

        this.isSelection = true;
        this.select();
        this.setInputBox(false);

        this.sheetRender();

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
            // this.deselect();

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
     * Handles the keypress event and triggers the copy action if 'Ctrl + C' is pressed.
     *
     * @param {KeyboardEvent} evt - The keyboard event object.
     */
    handleKeyPress(evt) {
        if (evt.ctrlKey && evt.key.toLowerCase() === "c") {
            console.log("Press C");
            console.log(evt);
            this.copyToClipboard();
            window.cancelAnimationFrame(this.rafId);
            this.march();

        } else if (evt.ctrlKey && evt.key.toLowerCase() === "v") {
            console.log("Press v");
            // console.log(evt);
            this.pasteFromClipboard();
            window.cancelAnimationFrame(this.rafId);
            this.sheetRender(false);
        }
        else if(evt.key==="Backspace"){
            console.log(evt)
            this.grid.cells[1][1].value=""
            this.sheetRender(false)
        }
    }

    /**
     * 
     */
    march() {
        this.dashOffset++;
        if (this.dashOffset > 20) {
            this.dashOffset = 0;
        }
        // console.log("Hello",this.dashOffset)
        // this.drawDottedRect();
        this.grid.drawDottedRect(this.dashOffset);

        this.rafId = window.requestAnimationFrame(() => {
            this.sheetRender(false);
            this.march();
        });
    }

    /**
     * Copies selected cells from the grid to the clipboard in a CSV-like format.
     * Cells are copied from the range defined by (i, j) to (last_i, last_j).
     */
    copyToClipboard() {
        // Initialize an array to hold the copied values
        let copiedData = [];

        // Loop through the selected range of cells
        for (let row = this.dimension.selectYRange[0]; row <= this.dimension.selectYRange[1]; row++) {
            let rowData = [];
            // console.log(row);
            for (let col = this.dimension.selectXRange[0]; col <= this.dimension.selectXRange[1]; col++) {
                // Get the value of the current cell
                let cellValue = this.grid.cells[row][col].value;
                rowData.push(cellValue);
            }
            // New   York
            // Join the row values by tabs (or commas) and push to copiedData
            copiedData.push(rowData.join("\t"));
        }

        // Convert the copied data to a single string with line breaks for each row
        let clipboardContent = copiedData.join("\n");

        // Use the Clipboard API to copy the string to the clipboard
        navigator.clipboard
            .writeText(clipboardContent)
            .then(() => {
                console.log("Copied to clipboard:", clipboardContent);
            })
            .catch((err) => {
                console.error("Failed to copy text to clipboard:", err);
            });
    }
    /**
     * Reads data from the clipboard and logs each cell value.
     * Also logs "New Line" when a new row begins.
     */
    async pasteFromClipboard() {
        navigator.clipboard
            .readText()
            .then((clipboardContent) => {
                // Split the clipboard content into rows (by newline characters)
                let rows = clipboardContent.split("\n");

                let toUpdateArray=[];
                rows.forEach((row, rowIndex) => {
                    if (rowIndex > 0) {
                        // console.log("New Line");
                    }

                    // console.log(row);
                    // Split each row into cells (by tabs or other delimiter)
                    let cells = row.split("\t");
                    // console.log(cells);

                    cells.forEach((cellValue, colIndex) => {
                        // console.log(this.i+rowIndex,this.j+colIndex)
                        this.grid.cells[this.i+rowIndex][this.j+colIndex].value=cellValue;
                        // console.log(`Cell[${rowIndex}, ${colIndex}]: ${cellValue}`);
                    });
                    let currentDataModel=this.giveDataModel(this.i+rowIndex);
                    toUpdateArray.push(currentDataModel);
                    // this.updateCell(this.i+rowIndex);
                });
                this.updateBulkCell(toUpdateArray);
                this.sheetRender(false);
            })
            .catch((err) => {
                console.error("Failed to read from clipboard:", err);
            });
    }

    async updateBulkCell(dataModelArray){
        try {
            
            let response = await fetch("https://localhost:7009/api/csv/BulkUpdate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataModelArray),
            });
            console.log(response)
        } catch (error) {
            console.error("error in updating the cell", error);
        }
    }

    giveDataModel(row_num){
        const dataModel = {
            row_num:row_num,
            email_id: this.grid.cells[row_num][0].value,
            name: this.grid.cells[row_num][1].value,
            country: this.grid.cells[row_num][2].value,
            state: this.grid.cells[row_num][3].value,
            city: this.grid.cells[row_num][4].value,
            telephone_number: this.grid.cells[row_num][5].value,
            address_line_1: this.grid.cells[row_num][6].value,
            address_line_2: this.grid.cells[row_num][7].value,
            date_of_birth: this.grid.cells[row_num][8].value,
            gross_salary_FY2019_20: this.grid.cells[row_num][9].value,
            gross_salary_FY2020_21: this.grid.cells[row_num][10].value,
            gross_salary_FY2021_22: this.grid.cells[row_num][11].value,
            gross_salary_FY2022_23: this.grid.cells[row_num][12].value,
            gross_salary_FY2023_24: this.grid.cells[row_num][13].value,
        };
        return dataModel;
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
        this.updateSlectedRange();
        // Select cells in the TopSheet
        // let startj=
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
        this.sheetRender(false);
    }
    /**
     * Update the selected range in dimension object.
     * @returns {void}
     */
    updateSlectedRange() {
        this.dimension.selectXRange = [Math.min(this.j, this.currentj), Math.max(this.j, this.currentj)];
        this.dimension.selectYRange = [Math.min(this.i, this.currenti), Math.max(this.i, this.currenti)];
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
        this.sheetRender(false);
    }
    
    /**
     * Sets the input box position and content based on the selected cell or Clicked cell.
     *
     * @param {boolean} isScrolling - Indicates if the sheet is currently scrolling and input box value should it .
     * @returns {void}
     */
    setInputBox(isScrolling) {
        if (isScrolling) {
            this.renderPrv();
        }
        let borderWidth = 2;
        this.cellInput.value = this.grid.cells[this.i][this.j].value;
        this.cellInput.style.display = "block";
        var top = this.grid.cells[this.i][this.j].y - Math.floor(this.dimension.scrollY) + borderWidth;
        var left = this.grid.cells[this.i][this.j].x - Math.floor(this.dimension.scrollX) + this.rect.left + borderWidth;
        this.cellInput.style.top = top + "px";
        this.cellInput.style.left = left + "px";
        this.cellInput.style.height = this.grid.cells[this.i][this.j].h - 2 * borderWidth + "px";
        this.cellInput.style.width = this.grid.cells[this.i][this.j].w - 2 * borderWidth + "px";
    }
    /**
     * Renders the grid, top sheet, and left sheet.
     * @returns {void}
     */
    sheetRender(isScrolling) {
        this.setInputBox(isScrolling)
        this.grid.render();
        this.topSheet.render();
        this.leftSheet.render();
    }
}
