export class select{
    constructor(dimension,objArray){
        this.dimension=dimension;
        this.objArray=objArray;
        this.topSheet = objArray[0];
        this.leftSheet=objArray[1];
        this.grid = objArray[2];
        this.init()
        this.eventListner();
        this.setInputBox();
    }
    init(){
        this.inputX = -1;
        this.inputY = -1;
        this.i=0;
        this.j=0;
        this.currenti=0;
        this.currentj=0;
        this.isInput = false;
        this.isSelection=false;
        
        this.spreadsheet = document.getElementById("spreadsheet");
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

        // this.updateGarph()
        this.renderInput();
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
            // this.updateGarph();
            this.select()
        }
    }
    onMouseUp(evt){
        this.isSelection=false;
    }
    select(){
        this.count=0;
        this.sum=0;
        this.min=Number.MAX_VALUE
        this.max=-Number.MAX_VALUE
        for(let j=Math.min(this.j,this.currentj);j<=Math.max(this.j,this.currentj);j++){
            this.topSheet.horizontalcell[j].isSelected=true;
        }
        for(let i=Math.min(this.i,this.currenti);i<=Math.max(this.i,this.currenti);i++){
            this.leftSheet.verticalcell[i].isSelected=true;
            for(let j=Math.min(this.j,this.currentj);j<=Math.max(this.j,this.currentj);j++){
                this.grid.cells[i][j].isSelected=true;
                if(this.grid.cells[i][j].value===""){
                    continue;
                }
                let number = Number(this.grid.cells[i][j].value);
                if (!Number.isNaN(number)) {
                    this.sum=this.sum+ number;
                    this.count=this.count+1;
                    this.min=Math.min(number,this.min);
                    this.max=Math.max(number,this.max);
                }
            }
        }
        if (this.count> 1) {
            document.getElementById("sum").innerHTML ="Sum: "+ this.sum;
            let avr = (this.sum / this.count).toFixed(2);;
            document.getElementById("average").innerHTML ="Average: "+avr;
            document.getElementById("min").innerHTML = "Min: "+this.min;
            document.getElementById("max").innerHTML = "Max: "+this.max;
        }
        else{
            this.removeInfoMath()
        }
        this.sheetRender()
    }
    removeInfoMath(){
        document.getElementById("sum").innerHTML ="";
        document.getElementById("average").innerHTML = "";
        document.getElementById("min").innerHTML ="";
        document.getElementById("max").innerHTML = "";
    }
    deselect(){
        this.removeInfoMath()
        // console.log(this.currenti)
        if(this.currentj===-1 || this.currenti===-1){
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
        this.grid.cells[this.i][this.j].value=this.cellInput.value
        console.log("hello",this.cellInput.value)
        this.cellInput.value="";
        this.sheetRender();
    }
    renderInput(){
        if(this.inputX===-1 ||this.inputY===-1){
            return ;
        }
        this.select()
        this.setInputBox(false)
    }
    setInputBox(iScrolling){
        if(iScrolling){
            this.renderPrv();
        }
        this.cellInput.value = this.grid.cells[this.i][this.j].value;
        this.cellInput.style.display = "block";
        var top = this.grid.cells[this.i][this.j].y - Math.floor(this.dimension.scrollY);
        var left = this.grid.cells[this.i][this.j].x - Math.floor(this.dimension.scrollX) + this.rect.left;
        this.cellInput.style.top = top + "px";
        this.cellInput.style.left = left + "px";
        this.cellInput.style.height = this.grid.cells[this.i][this.j].h + "px";
        this.cellInput.style.width = 100+ "px";
    }
    sheetRender(){
        this.grid.render()
        this.topSheet.render();
        this.leftSheet.render();
    }

}