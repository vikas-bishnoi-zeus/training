export class select{
    constructor(dimension,objArray){
        this.dimension=dimension;
        this.objArray=objArray;
        this.topSheet = objArray[0];
        this.leftSheet=objArray[1];
        this.grid = objArray[2];
        this.init()
        // console.log(this.i,this.grid.cells[0][0]);
        this.eventListner();
        this.setInputBox();
        // console.log(this.i,this.grid.cells[0][0]);
    }
    init(){
        this.inputX = -1;
        this.inputY = -1;
        this.i=1;
        this.j=0;
        this.currenti=1;
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
    async renderPrv(){
        if(this.i===0 || this.grid.cells[this.i][this.j].value===this.cellInput.value){
            return;
        }
        this.grid.cells[this.i][this.j].value=this.cellInput.value
        try {
            // console.log(this.i);
            // const formData = new FormData();
            const dataModel = {
                row_num: this.i,
                email_id: this.grid.cells[this.i][0].value,
                name: this.grid.cells[this.i][1].value,
                country: this.grid.cells[this.i][2].value,
                state: this.grid.cells[this.i][3].value,
                city: this.grid.cells[this.i][4].value,
                telephone_number: this.grid.cells[this.i][5].value,
                address_line_1: this.grid.cells[this.i][6].value,
                address_line_2: this.grid.cells[this.i][7].value,
                date_of_birth: this.grid.cells[this.i][8].value,
                gross_salary_FY2019_20: this.grid.cells[this.i][9].value,
                gross_salary_FY2020_21: this.grid.cells[this.i][10].value,
                gross_salary_FY2021_22: this.grid.cells[this.i][11].value,
                gross_salary_FY2022_23: this.grid.cells[this.i][12].value,
                gross_salary_FY2023_24: this.grid.cells[this.i][13].value
            };
            let response = await fetch('https://localhost:7009/api/csv/updateRecord',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify(dataModel),
                }
            ); 
              
        } catch (error) {
            console.error('error now update the cell',error);
        }
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
        this.cellInput.style.width = this.grid.cells[this.i][this.j].w+ "px";
    }
    sheetRender(){
        this.grid.render()
        this.topSheet.render();
        this.leftSheet.render();
    }

}