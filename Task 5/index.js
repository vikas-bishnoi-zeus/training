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
  rectDraw(w, h) {
    ctx.rect(this.x, this.y, w, h);
    ctx.fillStyle = "black";
    ctx.fillText(this.value, this.x + 5, this.y + 18);
    ctx.stroke();
    if(this.isSelected){
      this.selectCell();
    }
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

var colWidths = [];
var rowHeights = [];
var cells = [];
function fill(array, length, totalLength) {
  var count = 0;
  let i = 0;
  for (; i < totalLength; i = i + length) {
    array[count] = i;
    count++;
  }
  array[count] = i;
}
function cellHeightWidth() {
  var heightCanvas = canvas.clientHeight;
  var widthCanvas = canvas.clientWidth;
  fill(rowHeights, 30, heightCanvas);
  fill(colWidths, 100, widthCanvas);
}
cellHeightWidth();

function drawGrid() {
  // ctx.textAlign="center";
  ctx.textBaseline = "middle";
  ctx.font = "20px";

  var bl = false;
  for (let i = 0; i < rowHeights.length - 1; i++) {
    cells[i] = [];
    for (let j = 0; j < colWidths.length - 1; j++) {
      let val = Math.floor(Math.random() * 1000);

      const curCell = new cell(colWidths[j], rowHeights[i], val, bl);
      cells[i][j] = curCell;
      cells[i][j].rectDraw(
        colWidths[j + 1] - colWidths[j],
        rowHeights[i + 1] - rowHeights[i]
      );
    }
  }
}
drawGrid();

let canvasElement = document.querySelector("canvas");

canvasElement.addEventListener("click", (event) => getInput(event));
function setInput(top, left) {
  var cellInput = document.getElementById("content");
  var cnleft = left - 15;
  var cntop = top - 15;
  var i = Math.floor(cntop / 30);
  var j = Math.floor(cnleft / 100);
  cellInput.value = cells[i][j].value;
  cellInput.style.display = "block";
  cellInput.style.top = top + "px";
  cellInput.style.left = left + "px";
  cellInput.style.height = 30 - 2.5 + "px";
  cellInput.style.width = 100 - 2.5 + "px";

  cellInput.focus();
  cellInput.onblur = () => {
    cells[i][j].setValue(cellInput.value);
    for (let k = 0; k < cells[i].length; k++) {
      ctx.clearRect(colWidths[k], rowHeights[i], 100, 30);
      cells[i][k].rectDraw(100, 30);
    }

  };
}
function getInput(e) {
  let rect = canvasElement.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  let top = Math.floor(y / 30) * 30 + 15;
  let left = Math.floor(x / 100) * 100 + 15;
  setInput(top, left);
}

let selected = [];
canvasElement.addEventListener("mousedown", (event) => {
  select(event);
});
function select(event) {
  let rect = canvasElement.getBoundingClientRect();
  let xind = getXYind(event.clientX-rect.left, 100);
  let yind = getXYind(event.clientY-rect.top, 30);
  console.log("Move");
  mouseMove(xind, yind);
}
function getXYind(clientXY, div) {
  let len = clientXY;
  return Math.floor(len / div);
}
const mouseMove = (xInd, yInd) => {
  let newXind = -1;
  let newYind = -1;
  canvasElement.addEventListener("mousemove", move);
  function move(event) {
    let rect = canvasElement.getBoundingClientRect();

    let newXind1 = getXYind(event.clientX-rect.left, 100);
    let newYind1 = getXYind(event.clientY-rect.top, 30);
    if(newXind==newXind1 && newYind==newYind1){
      return;
    }
    else{
      newXind=newXind1;
      newYind=newYind1;
    }
    for(let i=0;i<selected.length;i++){
      selected[i].isSelected=false;
      selected[i].selectCell();
      console.log(i,selected[i]);
    }
    selected=[];
    let sum=0;
    let count=0;
    for(let i=Math.min(xInd,newXind);i<=Math.max(xInd,newXind);i++){
      for(let j=Math.min(yInd,newYind);j<=Math.max(yInd,newYind);j++){
        cells[j][i].isSelected=true;
        selected.push(cells[j][i]);
        cells[j][i].selectCell();
        let number=Number(cells[j][i].value);
        if(!Number.isNaN(number)){
          sum+=number;
          count++;
        }
        // console.log(i+" J "+j);
      }
    }
    document.getElementById("sum").innerHTML=sum;
    let avr=sum/count;
    document.getElementById("average").innerHTML=avr;
  }
  canvasElement.addEventListener("mouseup", (event) => {
    console.log("hello");
    canvasElement.removeEventListener("mousemove", move);
  });
};

// canvasElement.addEventListener("mouseup",(event)=>{slectup(event)})
// function slectup(event){
//   console.log("up")
// }

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
