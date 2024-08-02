horizontalCanvas.addEventListener("mousemove",(event)=>{
    let mousePos=event.offsetX+scrollX;
    let curInd=1;
    if(isResizePortion(columnSizePrefix[curInd],mousePos) || isResizePortion(columnSizePrefix[curInd+1],mousePos)){
        console.log("resizeing bro");
        horizontalCanvas.style.cursor='col-resize';
    }
    else{
        horizontalCanvas.style.cursor="default";
    }
    
})
function isResizePortion(pos,mouse){
    if(Math.abs(pos-mouse)<=5){
        return true;
    }
    return false;
}