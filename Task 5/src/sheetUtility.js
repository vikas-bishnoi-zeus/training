export class sheetUtility {
    constructor(dimension, objArray) {
        this.dimension = dimension;
        this.spreadsheet = document.getElementById("spreadsheet");
        this.topSheet = objArray[0];
        this.leftSheet=objArray[1];
        this.grid = objArray[2];
        // console.log(this.dimension);
        this.eventListner();
        this.inputX = -1;
        this.inputY = -1;
        this.i=-1;
        this.j=-1;
        this.currenti=-1;
        this.currentj=-1;
        this.isInput = false;
        this.isSelection=false;
        this.cellInput = document.getElementById("content");
        this.rect = spreadsheet.getBoundingClientRect();

    }
    eventListner() {
        // ?spreadsheet

        this.spreadsheet.addEventListener(
            "mousedown",
            this.onMouseDown.bind(this)
        );
        this.spreadsheet.addEventListener("mousemove",this.onMouseMove.bind(this))
        window.addEventListener("mouseup",this.onMouseUp.bind(this));
    }
    onMouseDown(evt) {
        this.inputX = evt.clientX - this.rect.left + this.dimension.scrollX;
        this.inputY = evt.clientY - this.rect.top + this.dimension.scrollY;
        this.deselect()
        if(this.isInput){
            this.renderPrv()
        }
        this.i = this.dimension.findRowIndex(this.inputY);
        this.j = this.dimension.findColumnIndex(this.inputX);
        this.currenti=this.i;
        this.currentj=this.j;
        this.renderInput(false);
        this.isInput = true;
        this.isSelection=true;
    }
    onMouseMove(evt){
        if(this.isSelection){
            let tempcurrenti = this.dimension.findRowIndex(evt.clientY - this.rect.top + this.dimension.scrollY);
            let tempcurrentj = this.dimension.findColumnIndex(evt.clientX - this.rect.left + this.dimension.scrollX);
            if(tempcurrenti==this.currenti && tempcurrentj==this.currentj){
                return ;
            }
            this.deselect()
            this.currenti=tempcurrenti
            this.currentj=tempcurrentj;
            this.select()
        }
    }
    onMouseUp(evt){
        console.log("Up")
        this.isSelection=false;
    }
    select(){
        this.count=0;
        this.sum=0;
        this.min=Number.MAX_VALUE
        this.max=Number.MIN_VALUE
        for(let j=Math.min(this.j,this.currentj);j<=Math.max(this.j,this.currentj);j++){
            this.topSheet.horizontalcell[j].isSelected=true;
        }
        for(let i=Math.min(this.i,this.currenti);i<=Math.max(this.i,this.currenti);i++){
            this.leftSheet.verticalcell[i].isSelected=true;
            for(let j=Math.min(this.j,this.currentj);j<=Math.max(this.j,this.currentj);j++){
                this.grid.cells[i][j].isSelected=true;
                let number = Number(this.grid.cells[i][j].value);
                if (!Number.isNaN(number)) {
                    this.sum=this.sum+ number;
                    this.count=this.count+1;
                    this.min=Math.min(number,this.min);
                    this.max=Math.max(number,this.max);
                }
            }
        }
        document.getElementById("sum").innerHTML = this.sum;
        if (this.count != 0) {
            let avr = (this.sum / this.count).toFixed(2);;
            document.getElementById("average").innerHTML = avr;
            document.getElementById("min").innerHTML = this.min;
            document.getElementById("max").innerHTML = this.max;
        }
        else{
            document.getElementById("average").innerHTML = 0;
        }
        this.sheetRender()
    }
    deselect(){
        document.getElementById("sum").innerHTML =0;
        document.getElementById("average").innerHTML = 0;
        if(this.j===-1 || this.i===-1){
            return ;
        }
        for(let j=Math.min(this.j,this.currentj);j<=Math.max(this.j,this.currentj);j++){
            this.topSheet.horizontalcell[j].isSelected=false;
        }
        for(let i=Math.min(this.i,this.currenti);i<=Math.max(this.i,this.currenti);i++){
            this.leftSheet.verticalcell[i].isSelected=false;
            for(let j=Math.min(this.j,this.currentj);j<=Math.max(this.j,this.currentj);j++){
                this.grid.cells[i][j].isSelected=false;
            }
        }
    }
    renderPrv(){
        console.log("Prv")
        this.grid.cells[this.i][this.j].value=this.cellInput.value
        this.cellInput.value="";
        this.sheetRender();
    }
    renderInput(notScrolling){
        if(this.inputX===-1 ||this.inputY===-1){
            return ;
        }
        if(notScrolling && this.isInput){
            this.renderPrv()
        }
        this.select()
        this.cellInput.value = this.grid.cells[this.i][this.j].value;
        // console.log(this.grid.cells[this.i][this.j].value);
        this.cellInput.style.display = "block";
        var top = this.grid.cells[this.i][this.j].y - Math.floor(this.dimension.scrollY);
        var left = this.grid.cells[this.i][this.j].x - Math.floor(this.dimension.scrollX) + this.rect.left;
        this.cellInput.style.top = top + "px";
        this.cellInput.style.left = left + "px";
        this.cellInput.style.height = 30 - 2 + "px";
        this.cellInput.style.width = 100 - 2 + "px";
    }
    sheetRender(){
        this.grid.render()
        this.topSheet.render();
        this.leftSheet.render();
    }
}
