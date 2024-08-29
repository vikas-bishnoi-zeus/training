import { excelHeader } from "./excelHeader.js";
import {sheet} from "./sheet.js";
class excel{
    constructor(row,col,width,height){
        this.sheet1=new sheet(row,col,width,height);
        this.excelHead=new excelHeader(this.sheet1);
    }
}
const index1=new excel(200,50,100,30);
