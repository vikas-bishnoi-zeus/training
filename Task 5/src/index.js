// Import necessary modules
// ExcelHeader help on Header Functionality
import { ExcelHeader } from "./excelHeader.js";
import { Sheet } from "./sheet.js";

// Class representing the main Excel application
class Excel {
    /**
     * Initializes the Excel application with a sheet and header.
     * @param {number} row - Number of intial rows in the sheet.
     * @param {number} col - Number of intial columns in the sheet.
     * @param {number} width - Default Width of each cell in the sheet.
     * @param {number} height - Default Height of each cell in the sheet.
     * @param {number} leftSheet_Width - Width of leftSheet(Row number) .
     */
    constructor(row, col, width, height,leftSheet_Width) {
        /**
         * @type {Sheet}
         */
        this.sheet1 = new Sheet(row, col, width, height,leftSheet_Width);

        /**
         * @type {ExcelHeader}
         */
        this.excelHead = new ExcelHeader(this.sheet1);
    }
}

// Create a new instance of the Excel class with specified parameters
/**
 * @type {Excel}
 */
const excelApp = new Excel(200, 25, 100, 30,100);
