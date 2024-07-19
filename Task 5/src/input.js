// console.log("Input")
var isInput=true;

canvas.addEventListener("click", (event) => getInput(event));
function setInput(x, y) {
  var cellInput = document.getElementById("content");
  console.log(x,y);
//   var cnleft = left ;
//   var cntop = top;
  var i = Math.floor(y/30);
  var j = Math.floor(x/100);

  cellInput.value = cells[i][j].value;
//   console.log("Clicking",isInput);
//   console.log(i,j);
  if(isInput){
    cellInput.style.display = "inline";
  }
  isInput=true;
  var top=cells[i][j].y-scrollY;
  console.log("top",top,scrollY)
  var left=cells[i][j].x-scrollX;
  cellInput.style.top = top-1 + "px";
  cellInput.style.left = left-1 + "px";
  cellInput.style.height = 30 - 2 + "px";
  cellInput.style.width = 100 - 2 + "px";
  cellInput.style.border = "2px solid blue"
//   ctx.clearRect(left, top,100,30);

  cellInput.focus();
  //
  cellInput.onblur = () => {
    // console.log()
    cells[i][j].setValue(cellInput.value);
    console.log("scroll",scrollX,scrollY);
    console.log("scroll",scrollX,scrollY);

    // cells[i][j].rectDraw(100,30,scrollX,scrollY);
    console.log("blur ",i,j,scrollX,scrollY);
    for (let k = 0; k < cells[i].length; k++) {
    //   ctx.clearRect(, rowHeights[i], 100, 30);
      cells[i][k].rectDraw(100, 30,scrollX,scrollY);
      
    }

  };
}
function getInput(e) {
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left+scrollX;
  let y = e.clientY - rect.top+scrollY;
//   console.log("Input")
//   console.log(x,y)
//   console.log("End");

//   let top = Math.floor(y / 30) * 30 ;
//   let left = Math.floor(x / 100) * 100;
  setInput(x, y);
}