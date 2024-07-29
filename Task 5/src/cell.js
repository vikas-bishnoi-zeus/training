class cell {
  // const canvas = document.getElementById("spreadsheet");
  // const currentctx = can vas.getContext("2d");
  constructor(x, y, value, isSelected,head,ctx) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.isSelected = isSelected;
    this.head=head;
    this.currentctx=ctx
  }
    setValue(value){
      this.value=value;
    }
    rectDraw(w, h,scrollX,scrollY) {
      this.currentctx.lineWidth=0.5;
      if(this.isSelected){
        // console.log(this.y-scrollY+0.5+h);
        // console.log(this.y,h)
        // this.selectCell();
      }

      this.currentctx.clearRect(this.x-scrollX, this.y-scrollY,w,h);
      this.currentctx.rect(this.x-Math.floor(scrollX)+0.5, this.y-Math.floor(scrollY)+0.5,w, h-1);
      if(this.isSelected){
      }
      this.currentctx.fillStyle = '#000';
      this.currentctx.font=`${18}px areal light`
      this.currentctx.fillText(`${this.value}`, this.x + 10-scrollX, this.y + 18-scrollY);
      this.currentctx.stroke();
      if(this.isSelected){
        this.selectCell();
      }
    }
    selectCell(){
      if (this.isSelected) {
        this.currentctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
        this.currentctx.fillRect(this.x-scrollX, this.y-scrollY, 100, 30);
      } else {
        // console.log(`This log that selectCell is working for ${Math.floor(this.x/100)} and ${Math.floor(this.y/30)}  ${this.isSelected}`);
        // console.log("Calling rect from select")
        // currentctx.clearRect(this.x, this.y,100,30);
        // this.rectDraw(100,30)
        this.rectDraw(100,30,scrollX,scrollY)
      }
    }
    
  }