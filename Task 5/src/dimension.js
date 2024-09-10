export class Dimensions {
    /**
     * Initializes the Dimensions class with rows, columns, and other properties.
     * @param {number} row - Number of current rows.
     * @param {number} col - Number of current columns.
     * @param {number} width - Deafault Width of each column.
     * @param {number} height - Deafault Height of each row.
     * @param {number} scrollX - Horizontal scroll position.
     * @param {number} scrollY - Vertical scroll position.
     * @param {number} leftSheet_Width - Width of leftSheet(Row number) .
     */
    constructor(row, col, width, height, scrollX, scrollY,leftSheet_Width) {
        /**
         * @type {number}
         */
        this.row = row;

        /**
         * @type {number}
         */
        this.col = col;

        /**
         * @type {number}
         */
        this.width = width;

        /**
         * @type {number}
         */
        this.height = height;

        /**
         * @type {number[]}
         */
        this.columnSizePrefix = [0];

        /**
         * @type {number[]}
         */
        this.rowSizePrefix = [0];

        /**
         * @type {number}
         */
        this.scrollX = scrollX;

        /**
         * @type {number}
         */
        this.scrollY = scrollY;

        this.selectXRange=[0,0];
        this.selectYRange=[1,1];

        /**
         * @type {number}
         */
        this.leftSheet_Width=leftSheet_Width;
        // Add intial number of columns of default width
        this.addSize(this.columnSizePrefix, width, col);

        // Add intial number of rows of default height
        this.addSize(this.rowSizePrefix, height, row);
    }

    /**
     * Adds more rows to the sheet.
     * @param {number} num - Number of rows to add of default Height.
     * @returns {void}
     */
    addMoreRows(num) {
        let len = this.rowSizePrefix.length;
        for (let i = 0; i < num; i++) {
            this.rowSizePrefix.push(this.rowSizePrefix[i + len - 1] + this.height);
        }
    }

    /**
     * Adds more columns to the sheet.
     * @param {number} num - Number of columns to add of default Width.
     * @returns {void}
     */
    addMoreCols(num) {
        let len = this.columnSizePrefix.length;
        for (let j = 0; j < num; j++) {
            this.columnSizePrefix.push(this.columnSizePrefix[j + len - 1] + this.width);
        }
    }

    /**
     * Adds sizes to the array based on the given length.
     * @param {number[]} arr - The array to modify.
     * @param {number} toAddValue - The value to add.
     * @param {number} len - The number of elements to add.
     * @returns {void}
     */
    addSize(arr, toAddValue, len) {
        for (let i = 1; i <= len; i++) {
            arr.push(arr[i - 1] + toAddValue);
        }
    }

    /**
     * Finds the row index based on the given distance.
     * @param {number} distance - The distance to search for.
     * @returns {number} - The row index.
     */
    findRowIndex(distance) {
        return this.binarySearchIndex(this.rowSizePrefix, distance);
    }

    /**
     * Finds the column index based on the given distance.
     * @param {number} distance - The distance to search for.
     * @returns {number} - The column index.
     */
    findColumnIndex(distance) {
        return this.binarySearchIndex(this.columnSizePrefix, distance);
    }

    /**
     * Performs a binary search to find the index based on the distance
     * return the index which have value just lesser than or equal to distance.
     * @param {number[]} arr - The array to search.
     * @param {number} Y - The distance to search for.
     * @returns {number} - The found index.
     */
    binarySearchIndex(arr, Y) {
        if (Y == 0) {
            return 0;
        }
        let left = 0;
        let right = arr.length - 1;
        let result = -1;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);

            if (arr[mid] <= Y) {
                result = mid; // Update result to the current mid index
                left = mid + 1; // Move the left boundary to mid + 1
            } else {
                right = mid - 1; // Move the right boundary to mid - 1
            }
        }
        return result;
    }

    /**
     * find whether if mouse is on resize column range or not if in range then return index.
     * @param {number} distance - The distance to search for.
     * @returns {number} - The column resize index.
     */
    findCoumnResizeIndex(distance) {
        return this.binarySearchResizeIndex(this.columnSizePrefix, distance);
    }

    /**
     * Performs a binary search find whether if mouse is on resize column range or not.
     * @param {number[]} arr - The array to search.
     * @param {number} Y - The distance to search for.
     * @returns {number} - The found index of column to resize or -1 if not found.
     */
    binarySearchResizeIndex(arr, Y) {
        if (Y <= 5) {
            return -1;
        }
        let left = 0;
        let right = arr.length - 1;
        let result = -1;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);

            if (Y >= arr[mid] - 5 && Y <= arr[mid] + 5) {
                // console.log(Y,mid);
                return mid;
            } else if (arr[mid] < Y) {
                left = mid + 1; // Move the left boundary to mid + 1
            } else {
                right = mid - 1; // Move the right boundary to mid - 1
            }
        }
        return result;
    }

    /**
     * Adds extra width to the particular column having index ind.
     * @param {number} ind - The index of the column.
     * @param {number} extra - The extra width to add.
     * @returns {void}
     */
    addColumnwidth(ind, extra) {
        this.sizeAdd(this.columnSizePrefix, ind, extra);
    }

    /**
     * Adds extra size to the array starting at the specified index till end.
     * @param {number[]} arr - The array to modify.
     * @param {number} ind - The index to start adding size.
     * @param {number} extra - The extra size to add.
     * @returns {void}
     */
    sizeAdd(arr, ind, extra) {
        for (let i = ind; i < arr.length; i++) {
            arr[i] += extra;
        }
    }
}
