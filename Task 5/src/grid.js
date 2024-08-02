class grid{
    // va=[];
    constructor(row,col,width,height){
        this.row=row;
        this.col=col;
        this.width=width;
        this.height=height;
        this.columnSizePrefix=[0];
        this.rowSizePrefix=[0];
        this.cells=[];
        this.verticalcell=[];
        this.horizontalcell=[];
        this.getCanvas();
        this.getCtx("A")
        this.addSize(this.columnSizePrefix,width,col)
        this.addSize(this.rowSizePrefix,height,row)
    }
    getCanvas(){
        this.horizontalCanvas=document.getElementById("horizontal");
        this.ctxup=this.getCtx(this.horizontalCanvas);
        this.setHeightWidth(horizontalCanvas,30,screen.width);
        
        this.verticalCanvas=document.getElementById("vertrical");
        this.ctxside=this.getCtx(this.verticalCanvas);
        this.setHeightWidth(verticalCanvas,screen.height-30,100);

        this.canvas = document.getElementById("spreadsheet");
        this.ctx=this.getCtx(this.canvas);
        this.setHeightWidth(canvas,screen.height-30,screen.width)

    }
    setHeightWidth(canvas,height,width){
        canvas.height =height;
        canvas.width = width;
    }
    getCtx(canvas){
        return canvas.getContext("2d");
    }
    addSize(arr,toAdd,len){
        for(let i=1;i<=len;i++){
            arr.push(arr[i-1]+toAdd);
        }
    }
    
}
const he=new grid(10,10,109,40);
console.log(he.ram);
console.log(he.columnSizePrefix)
console.log(he.rowSizePrefix);