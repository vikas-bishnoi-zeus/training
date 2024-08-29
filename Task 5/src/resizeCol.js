export class resizeCol{
    constructor(dimension,objArray,select){
        this.dimension=dimension;
        this.objArray=objArray;
        this.select=select;
        this.isMouseDown=false;
        this.ind=-1;
        this.init()
        this.addEventListner();
    }
    init(){
        this.topCanvas = document.getElementById("horizontal");
        this.rect = this.topCanvas.getBoundingClientRect();
    }
    addEventListner(){
        window.addEventListener('mousemove',this.mouseMove.bind(this))
        this.topCanvas.addEventListener('mousedown',this.mouseDown.bind(this))
        window.addEventListener('mouseup',this.mouseUp.bind(this))

    }
    mouseMove(evt){
        // console.log("Mov",this.isMouseDown)
        if(this.isMouseDown){
            if(this.ind!=-1){
                // let extra=evt
                this.topCanvas.style.cursor="col-resize";
                this.dimension.addColumnwidth(this.ind,evt.movementX);
                // this.dimension.scrollX=100;
                // this.objArray[0].render();
                // console.log(evt)
                for(let i=0;i<3;i++){
                    this.objArray[i].render();
                }
                this.select.setInputBox(true);

            }
        }
        else{
            this.getMovingColNumber(evt);
            if(this.ind==-1){
                this.topCanvas.style.cursor="default";
            }
            else{
                this.topCanvas.style.cursor="col-resize";
            }
        }
    }
    getMovingColNumber(evt){
        let distance=evt.clientX-this.rect.left+this.dimension.scrollX;
        this.ind=this.dimension.findCoumnResizeIndex(distance);
        // console.log("Moving on top Column canvas",evt.clientX-this.rect.left+this.dimension.scrollX,this.ind);
        // if(this.ind!=-1){
        //     console.log("do it",this.ind,distance);
        // }
    }
    mouseDown(evt){
        this.isMouseDown=true;
    }
    mouseUp(evt){
        this.isMouseDown=false;
    }
}