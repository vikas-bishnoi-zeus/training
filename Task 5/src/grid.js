import { cell } from "./cell.js";
export class grid {
    /**
     * 
     * @param {*} dimension 
     */
    constructor(dimension) {
        this.dimension=dimension;
        this.rowSizePrefix = dimension.rowSizePrefix;
        this.columnSizePrefix = dimension.columnSizePrefix;
        this.ctx = this.getCanvas();
        // console.log(this.dimension.scrollY)
        this.cells = [];
        this.init();
        // console.log(this.cells);
        this.render()
    }
    render() {
        this.ctx.reset();
        let starti=this.dimension.findRowIndex(this.dimension.scrollY);
        let lasti=this.dimension.findRowIndex(this.dimension.scrollY+screen.height);
        // console.log(starti,this.cells[starti][0])
        // console.log(starti,this.cells[starti+1][0])
        // console.log(this.dimension.scrollY)
        let startj=this.dimension.findColumnIndex(this.dimension.scrollX);
        // console.log(this.dimension.scrollX+screen.width)
        let lastj=this.dimension.findColumnIndex(this.dimension.scrollX+screen.width);
        // console.log(lastj)
        for (let i = starti; i <lasti; i++) {
            for (let j = startj; j <lastj; j++) {
                this.cells[i][j].rectDraw(this.dimension.scrollX,this.dimension.scrollY);
            }
        }
    }
    init() {
        for (let i = 0; i < this.dimension.row; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.dimension.col; j++) {
                let val = Math.floor(Math.random() * 1000) + "";
                // let val=""
                const curCell = new cell(
                    this.columnSizePrefix[j],
                    this.rowSizePrefix[i],
                    this.getWidth(j),
                    this.getHeight(i),
                    val,
                    false,
                    this.ctx
                );
                this.cells[i][j] = curCell;
            }
        }
        this.cells[0][0].isSelected=true;
    }
    getHeight(i) {
        return this.rowSizePrefix[i + 1] - this.rowSizePrefix[i];
    }
    getWidth(j) {
        return this.columnSizePrefix[j + 1] - this.columnSizePrefix[j];
    }
    getCanvas() {
        let canvas = document.getElementById("spreadsheet");
        this.setHeightWidth(canvas, screen.height - 30, screen.width);
        return canvas.getContext("2d");
    }
    addMoreRows(num){
        let len=this.dimension.row
        for (let i = 0; i < num; i++) {
            this.cells[i+len] = [];
            for (let j = 0; j < this.dimension.col; j++) {
                // let val = Math.floor(Math.random() * 1000) + "";
                let val=""
                const curCell = new cell(
                    this.columnSizePrefix[j],
                    this.rowSizePrefix[i+len],
                    this.getWidth(j),
                    this.getHeight(i+len),
                    val,
                    false,
                    this.ctx
                );
                this.cells[i+len][j] = curCell;
            }
        }
    }
    addMoreCols(num){
        let len=this.dimension.col;
        for (let i = 0; i < this.dimension.row; i++) {
            for (let j = 0; j < num; j++) {
                // let val = Math.floor(Math.random() * 1000) + "";
                let val=""
                const curCell = new cell(
                    this.columnSizePrefix[j+len],
                    this.rowSizePrefix[i],
                    this.getWidth(j+len),
                    this.getHeight(i),
                    val,
                    false,
                    this.ctx
                );
                this.cells[i][j+len] = curCell;
            }
        }
    }
    /**
     *
     * @param {*} canvas
     * @param {*} height
     * @param {*} width
     */
    setHeightWidth(canvas, height, width) {
        canvas.height = height;
        canvas.width = width;
    }
}
