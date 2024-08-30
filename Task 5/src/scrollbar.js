export class ScrollBar {
    constructor(dimension, objArray, sheet, select) {
        this.select = select;
        this.dimension = dimension;
        this.objArray = objArray;
        this.grid = this.objArray[2];
        this.sheet = sheet;
        this.init();
        this.flagVScroll = false;
        this.flagHScroll = false;
    }
    init() {
        this.container = document.getElementById("excel-1");
        this.verticalScroll = document.getElementById("verticalScroll");
        this.horizontalScroll = document.getElementById("horizontalScroll");
        this.updateScrollbars();
        this.eventListner();
    }
    eventListner() {
        this.sheet.addEventListener(
            "wheel",
            this.handleWheelScroll.bind(this),
            { passive: false }
        );
        this.verticalScroll.addEventListener(
            "mousedown",
            this.startVerticalScroll.bind(this)
        );
        this.horizontalScroll.addEventListener(
            "mousedown",
            this.startHorizontalScroll.bind(this)
        );
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));
    }
    handleWheelScroll(evt) {
        evt.preventDefault();
        let deltaX = 0;
        let deltaY = 0;
        if (evt.shiftKey) {
            deltaX = evt.deltaY / 5;
        } else {
            deltaY = evt.deltaY / 5;
        }
        this.dimension.scrollX = Math.max(
            0,
            Math.min(
                this.dimension.columnSizePrefix[this.dimension.col - 1] -
                    this.container.clientWidth,
                this.dimension.scrollX + deltaX
            )
        );
        this.dimension.scrollY = Math.max(
            0,
            Math.min(
                this.dimension.rowSizePrefix[this.dimension.row - 1] -
                    this.container.clientHeight,
                this.dimension.scrollY + deltaY
            )
        );
        while (this.isContentLimitReachedVertical(20)) {
            this.addMoreContentY();
        }
        if (this.isContentLimitReachedHorizontal()) {
            this.addMoreContentX();
        }
        this.updateScrollbars();
    }
    startHorizontalScroll(evt) {
        evt.preventDefault();
        this.flagHScroll = true;
        this.startX = evt.clientX;
        this.startScrollX = this.dimension.scrollX;
    }
    startVerticalScroll(evt) {
        evt.preventDefault();
        this.flagVScroll = true;
        this.startY = evt.clientY;
        this.startScrollY = this.dimension.scrollY;
    }

    onMouseUp(evt) {
        this.flagVScroll = false;
        this.flagHScroll = false;
    }
    isContentLimitReachedVertical(check) {
        if (
            this.dimension.scrollY + this.container.clientHeight >=
            this.dimension.rowSizePrefix[this.dimension.row - check]
        ) {
            return true;
        }
        return false;
    }
    isContentLimitReachedHorizontal() {
        if (
            this.dimension.scrollX + this.container.clientWidth >=
            this.dimension.columnSizePrefix[this.dimension.col - 3]
        ) {
            return true;
        }
        return false;
    }
    addMoreContentY() {
        const add = 200;
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
    async getFile(offset, limit) {
        let response;
        let range = {
            limit: limit,
            offset: offset,
        };
        // const formData = new FormData();
        // formData.append("range", JSON.stringify(range));
        try {
            response = await fetch("https://localhost:7009/api/csv/GetItems", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(range),
            });
            const res = await response.json();
            console.log("Geting Data", offset);
            // console.log(res);
            // // var values = res.map(item => Object.values(item))
            for (let row of res) {
                // console.log(row[0]);
                let j = -1;
                for (let cell of row) {
                    if (j == -1) {
                        j++;
                        continue;
                    }
                    this.grid.cells[row[0]][j].value = cell;
                    j++;
                }
            }
            this.grid.render();
            // this.select.setInputBox(false);
            // console.log(res[0]);
        } catch (error) {
            console.error("could not get items", error);
        }
    }
    addMoreContentX() {
        const add = 20;
        this.dimension.addMoreCols(add);
        this.objArray.forEach((obj) => {
            obj.addMoreCols(add);
        });
        this.dimension.col = this.dimension.col + add;
    }
    onMouseMove(evt) {
        if (this.flagVScroll) {
            this.onMouseMoveVertical(evt);
        } else if (this.flagHScroll) {
            this.onMouseMoveHorizontal(evt);
        }
    }
    onMouseMoveHorizontal(evt) {
        const deltaX = evt.clientX - this.startX;

        this.dimension.scrollX = Math.max(
            0,
            Math.min(
                this.dimension.columnSizePrefix[this.dimension.col - 1] -
                    this.container.clientWidth,
                this.startScrollX +
                    deltaX *
                        (this.dimension.columnSizePrefix[
                            this.dimension.col - 1
                        ] /
                            this.container.clientWidth)
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
    onMouseMoveVertical(evt) {
        const deltaY = evt.clientY - this.startY;
        this.dimension.scrollY = Math.max(
            0,
            Math.min(
                this.dimension.rowSizePrefix[this.dimension.row - 1] -
                    this.container.clientHeight,
                this.startScrollY +
                    deltaY *
                        (this.dimension.rowSizePrefix[this.dimension.row - 1] /
                            this.container.clientHeight)
            )
        );
        let checkReached = Math.max(100, Math.floor(0.3 * this.dimension.row));
        while (this.isContentLimitReachedVertical(checkReached)) {
            this.addMoreContentY();
        }
        this.updateScrollbars();
    }
    getContentHeight() {
        return this.dimension.rowSizePrefix[
            this.dimension.rowSizePrefix.length - 1
        ];
    }
    getContentWidth() {
        return this.dimension.columnSizePrefix[
            this.dimension.columnSizePrefix.length - 1
        ];
    }
    updateScrollbars() {
        this.objArray.forEach((obj) => {
            obj.render();
        });
        const verticalRatio =
            this.container.clientHeight / this.getContentHeight();

        const horizontalRatio =
            this.container.clientWidth / this.getContentWidth();

        this.verticalScroll.style.height = `${Math.max(
            this.container.clientHeight * verticalRatio,
            40
        )}px`;
        this.horizontalScroll.style.width = `${Math.max(
            this.container.clientWidth * horizontalRatio,
            40
        )}px`;

        this.verticalScroll.style.top = `${Math.min(
            (this.dimension.scrollY / this.getContentHeight()) *
                this.container.clientHeight,
            screen.height - 350
        )}px`;
        this.horizontalScroll.style.left = `${Math.min(
            (this.dimension.scrollX / this.getContentWidth()) *
                this.container.clientWidth,
            screen.width - 30
        )}px`;
        this.select.setInputBox(true);
    }
}
