export class cell {
    constructor(x, y,w,h, value, isSelected, ctx) {
        this.x = x;
        this.y = y;
        this.w=w;
        this.h=h;
        this.value = value;
        this.isSelected = isSelected;
        this.currentctx = ctx;
    }
    setValue(value) {
        this.value = value;
    }
    clearRect(scrollX, scrollY) {
        
        
        this.currentctx.clearRect(this.x - scrollX, this.y - scrollY, this.w, this.h);
        // console.log("Clearing")
    }
    rectDraw(scrollX, scrollY) {
        this.currentctx.lineWidth = 0.5;
        this.currentctx.clearRect(this.x - scrollX, this.y - scrollY, this.w, this.h);
        if(!(this.value==="")){
        }
        this.currentctx.strokeStyle = "#E0E0E0";
        this.currentctx.strokeRect(
            this.x - Math.floor(scrollX) + 0.5,
            this.y - Math.floor(scrollY) + 0.5,
            this.w,
            this.h
        );
        this.currentctx.fillStyle = "#000";
        this.currentctx.font = `${18}px areal light`;
        this.currentctx.fillText(
            `${this.value}`,
            this.x + 10 - scrollX,
            this.y + 18 - scrollY
        );
        // this.currentctx.stroke();
        if (this.isSelected) {
            this.selectCell(scrollX, scrollY);
        }
    }
    selectCell(scx = 0, scy = 0) {
        // console.log(scx,scy);
        if (this.isSelected) {
            this.currentctx.fillStyle = "rgba(19, 126, 67, 0.3)";
            this.currentctx.fillRect(this.x - scx, this.y - scy, this.w, this.h);
        } 
        // else {
            // this.rectDraw(scx, scy);
        // }
    }
}
