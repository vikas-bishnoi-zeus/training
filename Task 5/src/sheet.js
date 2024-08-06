// import { cell } from "./cells";
// import { cell } from "./cells.js";
import { grid } from "./grid.js";
import { dimensions } from "./dimension.js";
import { topSheet } from "./topSheet.js";
import { leftSheet } from "./leftSheet.js";
import { scrollBar } from "./scrollbar.js";
import { sheetUtility } from "./sheetUtility.js";
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
        this.sheetArray=[this.topSheet,this.leftSheet,this.grid];
        this.scrollBar=new scrollBar(this.dimension,this.sheetArray,this.sheet)
        this.sheetUtlilty=new sheetUtility(this.dimension,this.sheetArray);
    }
    
}
const sheet1=new sheet(60,30,100,30);
