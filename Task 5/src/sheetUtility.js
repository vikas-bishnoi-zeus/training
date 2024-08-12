import { graph } from "./graph.js";
import { select } from "./select.js";
import { scrollBar } from "./scrollbar.js";

export class sheetUtility {
    constructor(dimension, objArray) {
        this.select=new select(dimension,objArray);
        this.graph=new graph(dimension,objArray,this.select);
        this.sheet=document.getElementById("excel-1");
        this.scrollBar=new scrollBar(dimension,objArray,this.sheet,this.select)
    }
}
