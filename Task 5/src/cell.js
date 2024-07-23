const canvas = document.getElementById("spreadsheet");
const ctx = canvas.getContext("2d");

class cell {
    constructor(x, y, value, isSelected) {
      this.x = x;
      this.y = y;
      this.value = value;
      this.isSelected = isSelected;
    }
    setValue(value){
      this.value=value;
    }
    rectDraw(w, h,scrollX,scrollY) {
      ctx.clearRect(this.x-scrollX, this.y-scrollY,100,30);
      ctx.rect(this.x-scrollX, this.y-scrollY, w, h);
      ctx.fillStyle = "black";
      ctx.fillText(`${this.value}`, this.x + 10-scrollX, this.y + 18-scrollY);
      ctx.stroke();
    }
    selectCell(){
      if (this.isSelected) {
        ctx.fillStyle = 'rgba(0, 100, 255, 0.3)';
        ctx.fillRect(this.x, this.y, 100, 30);
      } else {
        console.log(`This log that selectCell is working for ${Math.floor(this.x/100)} and ${Math.floor(this.y/30)}  ${this.isSelected}`);
        console.log("Calling rect from select")
        ctx.clearRect(this.x, this.y,100,30);
        this.rectDraw(100,30)
      }
    }
  }