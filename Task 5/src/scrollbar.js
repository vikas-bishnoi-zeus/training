export class scrollBar {
    constructor(dimension, objArray, sheet) {
        this.dimension = dimension;
        this.objArray = objArray;
        this.sheet = sheet;
        this.init();
        //console.log(this.objArray);
        this.flagVScroll=false;
        this.flagHScroll=false;
        ////console.log(this.getContentHeight());
        // this.handleWheelScroll = this.handleWheelScroll.bind(this)
    }
    init() {
        this.container = document.getElementById("excel-1");
        this.verticalScroll = document.getElementById("verticalScroll");
        this.horizontalScroll = document.getElementById("horizontalScroll");
        // //console.log(this.verticalScroll)
        this.updateScrollbars();
        this.eventListner();
    }
    eventListner() {
        //console.log(this.objArray);
        this.sheet.addEventListener("wheel", this.handleWheelScroll.bind(this));
        this.verticalScroll.addEventListener(
            "mousedown",
            this.startVerticalScroll.bind(this)
        );
        this.horizontalScroll.addEventListener("mousedown",this.startHorizontalScroll.bind(this));
        document.addEventListener(
          "mousemove",
          this.onMouseMove.bind(this)
        );
        document.addEventListener("mouseup", this.onMouseUp.bind(this));

    }
    handleWheelScroll(evt) {
        // //console.log("Wheel");
        evt.preventDefault();

        const deltaX = evt.deltaX;
        const deltaY = evt.deltaY / 5;
        this.dimension.scrollX = Math.max(
            0,
            Math.min(
                this.dimension.columnSizePrefix[this.dimension.col - 1] -
                    this.container.clientWidth,
                this.dimension.scrollX + deltaX
            )
        );
        // //console.log(scrollX);
        this.dimension.scrollY = Math.max(
            0,
            Math.min(
                this.dimension.rowSizePrefix[this.dimension.row - 1] -
                    this.container.clientHeight,
                this.dimension.scrollY + deltaY
            )
        );
        // //console.log(this.dimension.scrollY);
        if (this.isContentLimitReachedVertical()) {
          // addMoreContentY();
          //console.log("Reached Y end")
        }

        this.objArray.forEach((obj) => {
            // //console.log(obj);
            obj.render();
        });
        this.updateScrollbars();
    }
    startHorizontalScroll(evt){
      evt.preventDefault();
      this.flagHScroll=true;
      // //console.log("hori")
      this.startX = evt.clientX;
      this.startScrollX = this.dimension.scrollX;
    }
    startVerticalScroll(evt) {
        evt.preventDefault();
        this.flagVScroll=true;
        this.startY = evt.clientY;
        this.startScrollY = this.dimension.scrollY;
    }

    onMouseUp(evt) {
        this.flagVScroll=false;
        this.flagHScroll=false;
    }
    isContentLimitReachedVertical(){
      //console.log("ZY")
      if (this.dimension.scrollY + this.container.clientHeight >= this.dimension.rowSizePrefix[this.dimension.row-5]) {
          return true;
      }
      return false;
    }
    isContentLimitReachedHorizontal(){
      if (this.dimension.scrollX + this.container.clientWidth >= this.dimension.columnSizePrefix[this.dimension.col-3]) {
          return true;
      }
      return false;
    }
    addMoreContentY(){
      //console.log("Adding Y content")
      const add=40;
      this.dimension.addMoreRows(add)
      this.objArray.forEach((obj)=>{
        obj.addMoreRows(add)
      })
      this.dimension.row=this.dimension.row+add;
      //console.log("Added done")
      //console.log(this.dimension)
      //console.log(this.objArray[0])
      //console.log(this.objArray[1])
      //console.log(this.objArray[2])
    }
    addMoreContentX(){
      //console.log("Adding X content")
      const add=20;
      this.dimension.addMoreCols(add)
      this.objArray.forEach((obj)=>{
        obj.addMoreCols(add)
      })
      this.dimension.col=this.dimension.col+add;
      //console.log("Added done")
      //console.log(this.dimension)
      //console.log(this.objArray[0])
      //console.log(this.objArray[1])
      //console.log(this.objArray[2])
    }
    onMouseMove(evt){
      if(this.flagVScroll){
        this.onMouseMoveVertical(evt)
      }
      else if(this.flagHScroll){
        this.onMouseMoveHorizontal(evt);
      }
    }
    onMouseMoveHorizontal(evt) {
      const deltaX = evt.clientX - this.startX;
  
      this.dimension.scrollX = Math.max(
        0,
        Math.min(
          this.dimension.columnSizePrefix[this.dimension.col-1] - this.container.clientWidth,
          this.startScrollX + deltaX * (this.dimension.columnSizePrefix[this.dimension.col-1] / this.container.clientWidth)
        )
      );
      if (this.isContentLimitReachedHorizontal()) {
        //console.log("Adding more colms or X");
        this.addMoreContentX();
      }  
      this.objArray.forEach((obj) => {
        // //console.log(obj);
        obj.render();
    });
      this.updateScrollbars();
    }
    onMouseMoveVertical(evt) {
        // //console.log("Moving")
        const deltaY = evt.clientY - this.startY;
        // //console.log(this.dimension.scrollY);
        this.dimension.scrollY = Math.max(
            0,
            Math.min(
                this.dimension.rowSizePrefix[this.dimension.row - 1] -
                    this.container.clientHeight,
                this.startScrollY +
                    deltaY *
                        (this.dimension.rowSizePrefix[this.dimension.row - 1] /
                            this.container.clientHeight)
            )
        );

        if (this.isContentLimitReachedVertical) {
          this.addMoreContentY();
        }
        this.objArray.forEach((obj) => {
            obj.render();
        });
        this.updateScrollbars();
    }
    getContentHeight() {
        return this.dimension.rowSizePrefix[
            this.dimension.rowSizePrefix.length - 1
        ];
    }
    getContentWidth() {
        return this.dimension.columnSizePrefix[
            this.dimension.columnSizePrefix.length - 1
        ];
    }
    updateScrollbars() {
        const verticalRatio =
            this.container.clientHeight / this.getContentHeight();

        const horizontalRatio =
            this.container.clientWidth / this.getContentWidth();

        this.verticalScroll.style.height = `${
            Math.max(this.container.clientHeight * verticalRatio,40)
        }px`;
        this.horizontalScroll.style.width = `${
            Math.max(this.container.clientWidth * horizontalRatio,40)
        }px`;

        this.verticalScroll.style.top = `${
            Math.min((this.dimension.scrollY / this.getContentHeight()) *
            this.container.clientHeight,screen.height-150)
        }px`;
        // this.verticalScroll.style.top="0px"
        this.horizontalScroll.style.left = `${
            Math.min((this.dimension.scrollX / this.getContentWidth()) *
            this.container.clientWidth,screen.width+10)
        }px`;
    }
}
