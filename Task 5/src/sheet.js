// import { cell } from "./cells";
// import { cell } from "./cells.js";
import { grid } from "./grid.js";
import { dimensions } from "./dimension.js";
import { topSheet } from "./topSheet.js";
import { leftSheet } from "./leftSheet.js";
import { scrollBar } from "./scrollbar.js";
class sheet{
    /**
     * 
     * @param {*} row 
     * @param {*} col 
     * @param {*} width 
     * @param {*} height 
     */
    constructor(row,col,width,height){
        this.dimension=new dimensions(row,col,width,height,0,0);
        this.sheet=document.getElementById("excel-1");

        this.topSheet=new topSheet(this.dimension)
        this.leftSheet=new leftSheet(this.dimension);
        this.grid=new grid(this.dimension)
        console.log(this.topSheet)
        console.log(this.leftSheet)
        console.log(this.grid )
        // this.sheetArray={topSheet:this.topSheet,leftSheet:this.topSheet,grid:this.grid};
        this.sheetArray=[this.topSheet,this.leftSheet,this.grid];
        this.scrollBar=new scrollBar(this.dimension,this.sheetArray,this.sheet)
        // console.log(this.grid);
        // console.log(this.dimensions.rowSizePrefix);
        // console.log(this.grid.rowSizePrefix);
        // this.tempcell=new cell(0,0,224,false,"na","as");
        // console.log(this.tempcell.value);
    }
    
}
const he=new sheet(60,30,100,30);
// console.log(he.columnSizePrefix)
// console.log(he.rowSizePrefix);