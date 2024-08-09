import { graph } from "./graph.js";
import { select } from "./select.js";
export class sheetUtility {
    constructor(dimension, objArray) {
        this.select=new select(dimension,objArray);
        this.graph=new graph(dimension,objArray,this.select);
    }
}
