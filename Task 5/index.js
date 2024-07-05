
var rowHeight = 30;
var colWidth = 100;
var count=0;
function lineDraw(ctx,x,y,xd,yd){
    ctx.moveTo(x, y);
    ctx.lineTo(xd, yd);
    ctx.fillText(`${count} is`,x+1,y+20);
    if(x==0)count++;

    ctx.stroke();
}
function drawGrid() {
  const canvas = document.getElementById("spreadsheet");
  var heightCanvas = canvas.clientHeight;
  var widthCanvas = canvas.clientWidth;
  for (let i = 0,j=0; (i < widthCanvas) ||(j<heightCanvas ); i++) {
    const ctx = canvas.getContext("2d");
    if(i<widthCanvas){
        lineDraw(ctx,i,0,i,heightCanvas);
        i=i+colWidth;
    }
    if(j<heightCanvas){
        lineDraw(ctx,0,j,widthCanvas,j);
        j=j+rowHeight;
    }
    console.log("Print");
  }
}
drawGrid();

function getPoint(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  console.log(event.clientX+" "+rect.left)
  console.log("Coordinate x: " + x,
      "Coordinate y: " + y);
  var input=document.getElementById("content");
  input.style.position="absolute";
  
  input.style.display= "inline-block";
  input.style.top=y+"px";
  input.style.left=x+"px";
  input.style.height=rowHeight-10+"px";
  input.style.width=colWidth-10+"px";
  // console.log(input.style.display==='none');
}

let canvasElem = document.querySelector("canvas");

canvasElem.addEventListener("mousedown", function (e) {
  getPoint(canvasElem, e);
}); 