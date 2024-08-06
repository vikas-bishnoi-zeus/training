export class sheetUtility {
    constructor(dimension, objArray) {
        this.dimension = dimension;
        this.spreadsheet = document.getElementById("spreadsheet");
        this.objArray = objArray;
        this.grid = objArray[2];
        console.log(this.dimension);
        this.eventListner();
        this.inputX = -1;
        this.inputY = -1;
        this.i=-1;
        this.j=-1;
        this.isInput = false;

        this.cellInput = document.getElementById("content");

    }
    eventListner() {
        // ?spreadsheet

        this.spreadsheet.addEventListener(
            "mousedown",
            this.getInput.bind(this)
        );
    }
    getInput(evt) {
        let rect = spreadsheet.getBoundingClientRect();
        this.inputX = evt.clientX - rect.left + this.dimension.scrollX;
        this.inputY = evt.clientY - rect.top + this.dimension.scrollY;
        this.renderInput();
        this.isInput = true;
        console.log(this.inputX, this.inputY);
        console.log("Get input");
    }
    renderPrv(){
        console.log("Prv")
        this.grid.cells[this.i][this.j].value=this.cellInput.value
        this.cellInput.value="";
        this.grid.render();
    }
    renderInput() {
        if(this.isInput){
            this.renderPrv()
        }
        let rect = spreadsheet.getBoundingClientRect();
        this.i = this.dimension.findRowIndex(this.inputY);
        this.j = this.dimension.findColumnIndex(this.inputX);
        console.log(this.grid.cells[this.i][this.j].y);

        this.cellInput.value = this.grid.cells[this.i][this.j].value;

        this.cellInput.style.display = "block";
        var top = this.grid.cells[this.i][this.j].y - Math.floor(scrollY);
        var left = this.grid.cells[this.i][this.j].x - Math.floor(scrollX) + rect.left;
        this.cellInput.style.top = top + "px";
        this.cellInput.style.left = left + "px";
        this.cellInput.style.height = 30 - 2 + "px";
        this.cellInput.style.width = 100 - 2 + "px";
    }
}
