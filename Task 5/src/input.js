// canvas.addEventListener("dblclick", (event) => getInput(event));
let lasti=-1;
let lastj=-1;
let lastScrollx=-1
let lastScrolly=-1

function setInput(x, y) {
  var cellInput = document.getElementById("content");
  var i = Math.floor(y / 30);
  var j = Math.floor(x / 100);
  removeSelects(selected,scrollX,scrollY);
  removeSelects(horisel,scrollX,0);
  removeSelects(versel,0,scrollY);
  // console.log(i,j);
  // console.log(cells[i][j].value)
  cells[i][j].clearRect(100,30,scrollX,scrollY);

  // console.log(horizontalcell[j],j);
  horisel.push(horizontalcell[j]);
  horizontalcell[j].isSelected=true;
  horizontalcell[j].selectCell(scrollX,0);

  versel.push(verticalcell[i])
  verticalcell[i].isSelected=true;
  verticalcell[i].selectCell(0,scrollY)

  cellInput.style.display = "block";
  var top = cells[i][j].y - scrollY;
  var left = cells[i][j].x - scrollX+rect.left;
  // console.log("top",top,left)
  cellInput.style.top = top +30+ "px";
  cellInput.style.left = left + "px";
  cellInput.style.height = 30 - 2 + "px";
  cellInput.style.width = 100 - 2 + "px";
  cellInput.style.border = "2px solid blue";
  
  cellInput.focus();
  cellInput.onblur = () =>{
    console.log(lasti)
    console.log(lasti!=-1);//true
    console.log(lastj!=-1);//true
    console.log(lasti!=-1 && lastj!=-1)
    if(lasti!=-1 && lastj!=-1){
      cells[lasti][lastj].setValue(cellInput.value);
      cells[lasti][lastj].rectDraw(100,30,scrollX,scrollY);
      console.log("R")
      console.log(cellInput.value);
    }
    lasti=i;
    lastj=j;
    // lastScrollx=scrollX;
    // lastScrolly=scrolly;
    cellInput.value = cells[i][j].value;
    for (let k = 0; k < cells[i].length; k++) {
      cells[i][k].rectDraw(100, 30, scrollX, scrollY);
    }
  };
}
function getInput(e) {
  let rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left + scrollX;
  let y = e.clientY - rect.top + scrollY;
  setInput(x, y);
}

var cellInput = document.getElementById("content");
cellInput.addEventListener("keypress",updateValue);
function updateValue(event){
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    // event.preventDefault();
    // console.log(cellInput.value);
    cellInput.style.display='none';
    // Trigger the button element with a click
  }
}

