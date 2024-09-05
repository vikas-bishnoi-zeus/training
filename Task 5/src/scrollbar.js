import { Dimensions } from "./dimension.js";
import { Select } from "./select.js";
import { TopSheet } from "./topSheet.js";
import { LeftSheet } from "./leftSheet.js";
import { Grid } from "./grid.js";
export class ScrollBar {
    /**
     * Initializes the ScrollBar class.
     *
     * @param {Dimensions} dimension - The dimensions of the sheet.
     * @param {Array.<TopSheet|LeftSheet|Grid>} objArray - An array of objects including TopSheet, LeftSheet, and Grid.
     * @param {HTMLElement} sheet - The HTML element representing the sheet.
     * @param {Select} select - The Select object for handling cell selection.
     */
    constructor(dimension, objArray, sheet, select) {
        /**
         * @type {Select}
         */
        this.select = select;

        /**
         * @type {Dimensions}
         */
        this.dimension = dimension;

        /**
         * @type {Array.<TopSheet|LeftSheet|Grid>}
         */
        this.objArray = objArray;

        /**
         * @type {Grid}
         */
        this.grid = this.objArray[2];
        /**
         * @type {HTMLElement}
         */
        this.sheet = sheet;
        this.init();

        /**
         * Flag indicating if vertical scrolling is active.
         * @type {boolean}
         */
        this.flagVScroll = false;

        /**
         * Flag indicating if horizontal scrolling is active.
         * @type {boolean}
         */
        this.flagHScroll = false;
    }
    init() {
        /**
         * @type {HTMLElement}
         */
        this.container = document.getElementById("excel-1");

        /**
         * @type {HTMLElement}
         */
        this.verticalScroll = document.getElementById("verticalScroll");

        /**
         * @type {HTMLElement}
         */
        this.horizontalScroll = document.getElementById("horizontalScroll");

        //Seting Intial postions of Custom ScrollBar
        this.updateScrollbars();

        // Adding Event Listner of ScrollBar
        this.eventListner();
    }
    /**
     * Attaches event listeners for scrolling and mouse interactions.
     * @returns {void}
     */
    eventListner() {
        this.sheet.addEventListener("wheel", this.handleWheelScroll.bind(this), { passive: false });
        this.verticalScroll.addEventListener("mousedown", this.startVerticalScroll.bind(this));
        this.horizontalScroll.addEventListener("mousedown", this.startHorizontalScroll.bind(this));
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    /**
     * Handles wheel scroll events to scroll the sheet.
     *
     * @param {WheelEvent} evt - The wheel event.
     * @returns {void}
     */
    handleWheelScroll(evt) {
        evt.preventDefault();
        const factorOfScrollWheel = 5;
        const scrollAmount = evt.deltaY / factorOfScrollWheel;
        const deltaX = evt.shiftKey ? scrollAmount : 0;
        const deltaY = evt.shiftKey ? 0 : scrollAmount;
        this.updateScrollPosition(deltaX,deltaY)
        if (this.isContentLimitReachedVertical(20)) {
            this.addMoreContentY(200);
        }
        if (this.isContentLimitReachedHorizontal()) {
            this.addMoreContentX();
        }
        //Updateing The scrollBar postion According the wheel change
        this.updateScrollbars();
    }

    /**
     * Updates the scroll positions for both horizontal and vertical scrolling
     * based on the wheel event delta values.
     *
     * @param {number} deltaX - The horizontal scroll delta.
     * @param {number} deltaY - The vertical scroll delta.
     */
    updateScrollPosition(deltaX, deltaY) {
        const { columnSizePrefix, rowSizePrefix,scrollX, scrollY } = this.dimension;
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;

        this.dimension.scrollX = this.calculateNewScrollPosition(scrollX, deltaX, columnSizePrefix.at(-1) - containerWidth);

        this.dimension.scrollY = this.calculateNewScrollPosition(scrollY, deltaY, rowSizePrefix.at(-1) - containerHeight);
    }

    /**
     * Calculates the new scroll position within the allowed range.
     *
     * @param {number} currentPosition - The current scroll position.
     * @param {number} delta - The amount to scroll.
     * @param {number} maxScroll - The maximum allowable scroll position.
     * @returns {number} The updated scroll position.
     */
    calculateNewScrollPosition(currentPosition, delta, maxScroll) {
        const updatedPosition = currentPosition + delta;
        const minimumScroll=0;
        return Math.max(0, Math.min(maxScroll, updatedPosition));
    }

    /**
     * Starts horizontal scrolling when the mouse is pressed down on Horizontal scrollBar.
     * @param {MouseEvent} evt - The mouse event.
     * @returns {void}
     */
    startHorizontalScroll(evt) {
        evt.preventDefault();
        this.flagHScroll = true;
        this.startX = evt.clientX;
        this.startScrollX = this.dimension.scrollX;
    }

    /**
     * Starts vertical scrolling when the mouse is pressed down on Vertical ScrollBar.
     * @param {MouseEvent} evt - The mouse event.
     * @returns {void}
     */
    startVerticalScroll(evt) {
        evt.preventDefault();
        this.flagVScroll = true;
        this.startY = evt.clientY;
        this.startScrollY = this.dimension.scrollY;
    }

    /**
     * Stops scrolling when the mouse button is released.
     * @param {MouseEvent} evt - The mouse event.
     * @return {void}
     */
    onMouseUp(evt) {
        this.flagVScroll = false;
        this.flagHScroll = false;
    }

    /**
     * Checks if more vertical content needs to be loaded based on the scrollY position.
     * @param {number} check - The offset to check.
     * @returns {boolean} True if more content needs to be loaded, false otherwise.
     */
    isContentLimitReachedVertical(check) {
        if (this.dimension.scrollY + this.container.clientHeight >= this.dimension.rowSizePrefix[this.dimension.row - check]) {
            return true;
        }
        return false;
    }

    /**
     * Checks if more horizontal content needs to be loaded based on the scrollX position.
     *
     * @returns {boolean} True if more content needs to be loaded, false otherwise.
     */
    isContentLimitReachedHorizontal() {
        if (this.dimension.scrollX + this.container.clientWidth >= this.dimension.columnSizePrefix[this.dimension.col - 3]) {
            return true;
        }
        return false;
    }

    /**
     * Adds more rows to the sheet and updates the grid.
     */
    addMoreContentY(add) {
        this.dimension.addMoreRows(add);
        if (this.dimension.row < 110000) {
            console.log(this.dimension.row);
            this.getFile(this.dimension.row, add);
        }
        this.objArray.forEach((obj) => {
            obj.addMoreRows(add);
        });
        this.dimension.row = this.dimension.row + add;
    }

    /**
     * Fetches more data from the server and updates the grid.
     *
     * @param {number} offset - The offset from which to start fetching data.
     * @param {number} limit - The number of rows to fetch.
     */
    async getFile(offset, limit) {
        let response;
        let range = {
            limit: limit,
            offset: offset,
        };
        try {
            response = await fetch("https://localhost:7009/api/csv/GetItems", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(range),
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("Geting Data", offset);

            data.forEach((row) => {
                const [rowIndex, ...cells] = row;

                cells.forEach((cellValue, colIndex) => {
                    this.grid.cells[rowIndex][colIndex].value = cellValue;
                });
            });
            this.grid.render();
        } catch (error) {
            console.error("could not get items", error);
        }
    }

    /**
     * Adds more columns to the sheet and updates the grid.
     * @returns {void}
     */
    addMoreContentX() {
        const add = 20;
        this.dimension.addMoreCols(add);
        this.objArray.forEach((obj) => {
            obj.addMoreCols(add);
        });
        this.dimension.col = this.dimension.col + add;
    }

    /**
     * Handles mouse move events to update the scroll position.
     * @param {MouseEvent} evt - The mouse event.
     * @returns {void}
     */
    onMouseMove(evt) {
        if (this.flagVScroll) {
            this.onMouseMoveVertical(evt);
        } else if (this.flagHScroll) {
            this.onMouseMoveHorizontal(evt);
        }
    }

    /**
     * Updates the scroll position based on horizontal ScrollBar of mouse.
     * @param {MouseEvent} evt - The mouse event.
     * @returns {void}
     */
    onMouseMoveHorizontal(evt) {
        const deltaX = evt.clientX - this.startX;

        this.dimension.scrollX = Math.max(
            0,
            Math.min(
                this.dimension.columnSizePrefix[this.dimension.col - 1] - this.container.clientWidth,
                this.startScrollX + deltaX * (this.dimension.columnSizePrefix[this.dimension.col - 1] / this.container.clientWidth)
            )
        );
        if (this.isContentLimitReachedHorizontal()) {
            this.addMoreContentX();
        }
        this.objArray.forEach((obj) => {
            obj.render();
        });
        this.updateScrollbars();
    }

    /**
     * Updates the scroll position based on vertical ScrollBar of mouse.
     * @param {MouseEvent} evt - The mouse event.
     * @returns {void}
     */
    onMouseMoveVertical(evt) {
        const deltaY = evt.clientY - this.startY;
        this.dimension.scrollY = Math.max(
            0,
            Math.min(
                this.dimension.rowSizePrefix[this.dimension.row - 1] - this.container.clientHeight,
                this.startScrollY + deltaY * (this.dimension.rowSizePrefix[this.dimension.row - 1] / this.container.clientHeight)
            )
        );
        let checkReached = Math.max(100, Math.floor(0.3 * this.dimension.row));
        if (this.isContentLimitReachedVertical(checkReached)) {
            this.addMoreContentY(4000);
        }
        this.updateScrollbars();
    }

    /**
     * Gets the total content height based on the dimensions.
     * @returns {number} The height of the content.
     */
    getContentHeight() {
        return this.dimension.rowSizePrefix[this.dimension.rowSizePrefix.length - 1];
    }

    /**
     * Gets the total content width based on the dimensions.
     * @returns {number} The width of the content.
     */
    getContentWidth() {
        return this.dimension.columnSizePrefix[this.dimension.columnSizePrefix.length - 1];
    }

    /**
     * Updates the size and position of the scrollbars based on the current scroll position and container size.
     */
    updateScrollbars() {
        // Re-render all objects in objArray
        this.objArray.forEach((obj) => {
            obj.render();
        });

        // Calculate ratios for scrollbars
        const verticalRatio = this.container.clientHeight / this.getContentHeight();
        const horizontalRatio = this.container.clientWidth / this.getContentWidth();

        // Update scrollbar sizes
        let minimumScrollSize = 40;
        this.verticalScroll.style.height = `${Math.max(this.container.clientHeight * verticalRatio, minimumScrollSize)}px`;
        this.horizontalScroll.style.width = `${Math.max(this.container.clientWidth * horizontalRatio, minimumScrollSize)}px`;

        // Update scrollbar positions
        let maxScrollPercentage = 0.7;
        this.verticalScroll.style.top = `${Math.min((this.dimension.scrollY / this.getContentHeight()) * this.container.clientHeight, screen.height * maxScrollPercentage)}px`;
        // console.log(Math.min((this.dimension.scrollY / this.getContentHeight()) * this.container.clientHeight, screen.height*maxScrollPercentage),screen.height*maxScrollPercentage)
        this.horizontalScroll.style.left = `${Math.min((this.dimension.scrollX / this.getContentWidth()) * this.container.clientWidth, screen.width - 30)}px`;

        // Ensure the input box is positioned correctly
        this.select.setInputBox(true);
    }
}
