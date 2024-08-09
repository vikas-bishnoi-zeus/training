import { cell } from "./cell.js";
export class leftSheet{
    constructor(dimension){
        this.dimension=dimension;
        this.rowSizePrefix = dimension.rowSizePrefix;
        this.ctx = this.getCanvas();
        this.verticalcell=[];
        // this.dimension.scrollY=55;
        // console.log(this.dimension.scrollY);
        this.init();
        this.render();
    }
    render(){
        this.ctx.reset();
        let starti=this.dimension.findRowIndex(this.dimension.scrollY);
        let lasti=this.dimension.findRowIndex(this.dimension.scrollY+screen.height);
        for (let i = starti; i <lasti; i++) {
            this.verticalcell[i].rectDraw(0,this.dimension.scrollY);
        }
    }
    init(){
        for (let i = 0; i < this.dimension.row; i++) {
            const verCell = new cell(0, this.rowSizePrefix[i],100,this.getHeight(i),i+1, false,this.ctx);
            this.verticalcell[i]=verCell;
            // this.verticalcell[i].rectDraw(this.dimension.scrollX,this.dimension.scrollY);
        }
        this.verticalcell[0].isSelected=true;
    }
    addMoreRows(num){
        let len=this.dimension.row
        for (let i = 0; i < num; i++) {
            const verCell = new cell(0, this.rowSizePrefix[i+len],100,this.getHeight(i+len),i+len+1, false,this.ctx);
            this.verticalcell[i+len]=verCell;
        }
    }
    addMoreCols(num){
        
    }
    getHeight(i) {
        return this.rowSizePrefix[i + 1] - this.rowSizePrefix[i];
    }
    getCanvas() {
        let canvas = document.getElementById("vertrical");
        this.setHeightWidth(canvas,screen.height-30,100);
        return canvas.getContext("2d");
    }
    setHeightWidth(canvas,height,width){
        canvas.height =height;
        canvas.width = width;
    }
}