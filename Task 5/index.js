class cell{
  constructor(x,y,value,isSelected){
    this.x=x;
    this.y=y;
    this.value=value;
    this.isSelected=isSelected;
  }
}

var colWidths = [];
var rowHeights=[];
var cells=[];
function fill(array,length,totalLength){
  var count=0;
  let i = 0
  for (;i<totalLength; i=i+length) {
    array[count]=i;
    count++;
  }
  array[count]=i;
}
function cellHeightWidth(){
  const canvas = document.getElementById("spreadsheet");
  var heightCanvas = canvas.clientHeight;
  var widthCanvas = canvas.clientWidth;
  fill(rowHeights,30,heightCanvas);
  fill(colWidths,100,widthCanvas);
}
cellHeightWidth();
function rectDraw(ctx,curCell,w,h){
  // console.log(curCell.x,curCell.y);
  ctx.rect(curCell.x,curCell.y,w,h);
  ctx. fillText(curCell.value, curCell.x+(w/2),curCell.y+(h/2))
  ctx.stroke();
}
function drawGrid() {
  const canvas = document.getElementById("spreadsheet");

  const ctx = canvas.getContext("2d");
  ctx.textAlign="center"; 
  ctx.textBaseline = "middle";
  ctx.font="20px";

  for (let i = 0;i <rowHeights.length-1; i++) {
    cells[i]=[];
    // console.log("I "+ i);
    for(let j=0;j<colWidths.length-1;j++){
      let val=Math.floor(Math.random() * 1000);
      
      // console.log("j "+ j);
      const curCell=new cell(colWidths[j],rowHeights[i],val,false);
      cells[i][j]=curCell;
      rectDraw(ctx,cells[i][j],colWidths[j+1]-colWidths[j],rowHeights[i+1]-rowHeights[i]);
    }
  }
}
drawGrid();

let canvasElem = document.querySelector("canvas");

canvasElem.addEventListener("click",(event)=>getInput(event)); 
function setInput(top,left){
  var cellInput=document.getElementById("content");
  var cnleft=left-15;
  var cntop=top-15;
  var i=Math.floor(cntop/30);
  var j=Math.floor(cnleft/100);
  cellInput.value =cells[i][j].value;
  console.log(cells[i][j].value)
  cellInput.style.display = "block";
  cellInput.style.top =top  + 'px';
  cellInput.style.left = left+ 'px';
  cellInput.style.height = (30-2.5) + 'px';
  cellInput.style.width =(100-2.5) + 'px';
  const canvas = document.getElementById("spreadsheet");
  const ctx = canvas.getContext("2d");
  console.log(left,top);
  
  ctx.clearRect(left-14,top-14, 98, 18);

  cellInput.focus();
  cellInput.onblur=()=>{
    console.log(cellInput.value);
    
    cells[i][j].value=cellInput.value;
    ctx.clip();
    ctx.fillText(cells[i][j].value, cnleft+(100/2) ,cntop+(30/2));
    cellInput.value=""; 
  }
}
function getInput(e) {
  // getPoint(canvasElem, e);
  // console.log("Hello")
  let rect = canvasElem.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  let top=((Math.floor(y/30))*30)+15;
  let left=((Math.floor(x/100))*100)+15;
  // console.log(top+" "+(x/colWidth));
  setInput(top,left); 
  // console.log();
}



// function getPoint(canvas, event) {
//   let rect = canvas.getBoundingClientRect();
//   let x = event.clientX - rect.left;
//   let y = event.clientY - rect.top;
//   console.log(event.clientX+" "+rect.left)
//   console.log("Coordinate x: " + x,
//       "Coordinate y: " + y);
//   var input=document.getElementById("content");
//   input.style.position="absolute";
  
//   input.style.display= "inline-block";
//   input.style.top=y+"px";
//   input.style.left=x+"px";
//   input.style.height=rowHeight-10+"px";
//   input.style.width=colWidth-10+"px";
//   // console.log(input.style.display==='none');
// }


