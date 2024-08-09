import { cell } from "./cell.js";

export class topSheet{
    constructor(dimension){
        this.dimension=dimension;
        this.columnSizePrefix=dimension.columnSizePrefix;
        this.ctx = this.getCanvas();
        this.horizontalcell=[];
        this.init();
        this.render();
        // console.log(this.horizontalcell)
    }
    render(){
        this.ctx.reset();
        let starti=this.dimension.findColumnIndex(this.dimension.scrollX);
        let lasti=this.dimension.findColumnIndex(this.dimension.scrollX+screen.width);
        // console.log(lasti)
        for (let i = starti; i <lasti; i++) {
            this.horizontalcell[i].rectDraw(this.dimension.scrollX,0);
        }
    }
    init(){
        for (let i = 0; i < this.dimension.col; i++) {
            const temp=new cell(this.columnSizePrefix[i],0,this.getWidth(i),30,this.getCoulomName(i+1),false,this.ctx);
            this.horizontalcell[i]=temp;
        }
        this.horizontalcell[0].isSelected=true;
    }
    addMoreRows(num){
        
    }
    addMoreCols(num){
        let len=this.dimension.col;
        for (let i = 0; i < num; i++) {
            const temp=new cell(this.columnSizePrefix[i+len],0,this.getWidth(i+len),30,this.getCoulomName(i+len+1),false,this.ctx);
            this.horizontalcell[i+len]=temp;
        }
    }
    getWidth(j) {
        return this.columnSizePrefix[j + 1] - this.columnSizePrefix[j];
    }
    getCoulomName(num){
        var s = '', t;
      
        while (num > 0) {
          t = (num - 1) % 26;
          s = String.fromCharCode(65 + t) + s;
          num = (num - t)/26 | 0;
        }
        return s || undefined;
      }
    getCanvas() {
        let canvas = document.getElementById("horizontal");
        this.setHeightWidth(canvas, 30,screen.width);
        return canvas.getContext("2d");
    }
    setHeightWidth(canvas,height,width){
        canvas.height =height;
        canvas.width = width;
    }
}