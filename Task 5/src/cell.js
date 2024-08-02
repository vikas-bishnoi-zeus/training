class cell {
  constructor(x, y, value, isSelected,ctx) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.isSelected = isSelected;
    this.currentctx=ctx
  }
    setValue(value){
      this.value=value;
    }
    clearRect(w,h,scrollX,scrollY){
      // console.log("start-Clearing")
      // console.log(this.x-scrollX,this.y-scrollY,w,h)
      this.currentctx.clearRect(this.x-scrollX, this.y-scrollY,w,h);
      // console.log("Clearing")
    }
    rectDraw(w, h,scrollX,scrollY) {
      this.currentctx.lineWidth=0.5;
      this.currentctx.clearRect(this.x-scrollX, this.y-scrollY,w,h);
      this.currentctx.strokeStyle="#E0E0E0";
      this.currentctx.strokeRect(this.x-Math.floor(scrollX)+0.5, this.y-Math.floor(scrollY)+0.5,w, h);
      this.currentctx.fillStyle = '#000';
      this.currentctx.font=`${18}px areal light`
      this.currentctx.fillText(`${this.value}`, this.x + 10-scrollX, this.y + 18-scrollY);
      // this.currentctx.stroke();
      if(this.isSelected){
        this.selectCell(scrollX,scrollY);
      }
    }
    selectCell(scx=scrollX,scy=scrollY){
      // console.log(scx,scy);
      if (this.isSelected) {
        this.currentctx.fillStyle = 'rgba(19, 126, 67, 0.3)';
        this.currentctx.fillRect(this.x-scx, this.y-scy, 100, 30);
      } else {
        // console.log(`This log that selectCell is working for ${Math.floor(this.x/100)} and ${Math.floor(this.y/30)}  ${this.isSelected}`);
        // console.log("Calling rect from select")
        // currentctx.clearRect(this.x, this.y,100,30);
        // this.rectDraw(100,30)
        this.rectDraw(100,30,scx,scy)
      }
    }
    
  }