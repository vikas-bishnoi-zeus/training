let selected = [];
canvas.addEventListener("mousedown", select);
let canvasElement = document.querySelector("canvas");
let rect = canvasElement.getBoundingClientRect();
function select(event) {
  console.log("Mouse Down");
  let xind = getXind(event.clientX);
  let yind = getYind(event.clientY);
  console.log("x,y ",xind,yind);
  mouseMove(xind, yind);
}
function getXind(clientX) {
  let len = clientX- rect.left+scrollX;
  return Math.floor(len / 100);
}
function getYind(clientY) {
  let len = clientY-rect.top+scrollY;
  return Math.floor(len / 30);
}
const mouseMove = (xInd, yInd) => {
  let newXind = -1;
  let newYind = -1;
  let body = document.querySelector("body");
  body.addEventListener("mousemove", move);

  function move(event) {
    let newXind1 = getXind(event.clientX );
    let newYind1 = getYind(event.clientY);
    console.log(newXind1,newYind1);
    if(newXind1===-1 || newYind1===-1){
      console.log("R")
      body.removeEventListener("mousemove", move);
      console.log("F");

      return;
    }
    if (newXind == newXind1 && newYind == newYind1) {
      return;
    } else {
      newXind = newXind1;
      newYind = newYind1;
    }
    for (let i = 0; i < selected.length; i++) {
      selected[i].isSelected = false;
      selected[i].selectCell();
      // console.log(i, selected[i]);
    }
    selected = [];
    let sum = 0;
    let count = 0;
    for (let i = Math.min(xInd, newXind); i <= Math.max(xInd, newXind); i++) {
      for (let j = Math.min(yInd, newYind); j <= Math.max(yInd, newYind); j++) {
        cells[j][i].isSelected = true;
        selected.push(cells[j][i]);
        cells[j][i].selectCell();
        let number = Number(cells[j][i].value);
        if (!Number.isNaN(number)) {
          sum += number;
          count++;
        }
        // console.log(i+" J "+j);
      }
    }
    document.getElementById("sum").innerHTML = sum;
    if (count != 0) {
      let avr = sum / count;
      document.getElementById("average").innerHTML = avr;
    }
  }
  // let l=0;
  canvasElement.addEventListener("mouseup", (event) => {
    // console.log("hello");
    body.removeEventListener("mousemove", move);
    // var cellInput = document.getElementById("content");
    // if(newXind===-1 || newYind===-1){
    // }
    // else{
    //   cellInput.style.display = "none";

    // }
    // console.log(cellInput.style.display,l);
    // l++;
    // isInput=false;
  });
};
