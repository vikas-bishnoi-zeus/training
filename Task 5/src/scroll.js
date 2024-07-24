// import {cell} from "./cell.js"

// const div = document.getElementById("main-area");

// console.log(div.clientHeight);
// console.log(div.clientWidth);
canvas.width = div.clientWidth - 108;
canvas.height = div.clientHeight - 8;

const container = document.getElementById("main-area");

const verticalScroll = document.getElementById("verticalScroll");

const horizontalScroll = document.getElementById("horizontalScroll");

let contentWidth = 2000; // Initial content width

let contentHeight = 1050; // Initial content height

let scrollX = 0;

let scrollY = 0;

let rows = 35; // Initial number of rows
let colms=20;
// Initial scrollbar sizes

var cells=[];
var verticalcell=[];
function addRows(rowAdd){
  let len=cells.length;
  for(let i=0;i<rowAdd;i++){
    cells[len+i]=[];
    const verCell = new cell(0, (len+i)*30, len+i+1, false,ctxside);
    verticalcell[len+i]=verCell;
    for(let j=0;j<colms;j++){
      let val = Math.floor(Math.random() * 1000);
      const curCell = new cell(j*100, (len+i)*30, val, false,ctx);
      cells[len+i][j] = curCell;
    }
  }
}
function addCols(colsAdd){
  console.log("Hello columns adding started")
  let len=cells.length;
  let wid=cells[0].length
  for(let i=0;i<len;i++){
    for(let j=wid;j<wid+colsAdd;j++){
      let val = Math.floor(Math.random() * 1000);
      const curCell = new cell(j*100, (i)*30, val, false,ctx);
      cells[i].push(curCell);
    }
  }
  console.log("Sucessfully add colms")
}
addRows(rows);
updateScrollbars();

// Event listeners for scrolling

verticalScroll.addEventListener("mousedown", startVerticalScroll);

horizontalScroll.addEventListener('mousedown', startHorizontalScroll);

canvas.addEventListener("wheel", handleWheelScroll);
function drawContent() {
  ctx.reset();
  ctxside.reset();
  for (let i = 0; i < rows; i++) {
    if (30 * i - scrollY < -40) {
      continue;
    }
    // console.log("Ver",verticalcell[i].y);
    verticalcell[i].isSelected=true;
    // if((i%2)==0){
      verticalcell[i].rectDraw(100,30,0,screenY)
    // }
    // else{
      // continue;
    // }
    
    // console.log(verticalcell[i])
    for(let j=0;j<colms;j++){
      if(j*100-scrollX<-110){
        continue;
      }
      if(i==j){
        // console.log("Cells",cells[i][j].y);
        // cells[i][j].isSelected=true;
      }
      // if(i==0 && j>19 && j<21){
      //   console.log(i,j);
      //   console.log(cells[i][j].x);
      //   console.log(j*100-scrollX);
      // }
      cells[i][j].rectDraw(100,30,scrollX,scrollY);
    }
    
    }
}

function updateScrollbars() {
  const verticalRatio = container.clientHeight / contentHeight;

  const horizontalRatio = container.clientWidth / contentWidth;

  verticalScroll.style.height = `${container.clientHeight * verticalRatio}px`;

  horizontalScroll.style.width = `${container.clientWidth * horizontalRatio}px`;

  verticalScroll.style.top = `${
    (scrollY / contentHeight) * container.clientHeight
  }px`;

  horizontalScroll.style.left = `${
    (scrollX / contentWidth) * container.clientWidth
  }px`;
}

function startVerticalScroll(e) {
  e.preventDefault();

  const startY = e.clientY;

  const startScrollY = scrollY;

  function onMouseMove(e) {
    const deltaY = e.clientY - startY;

    scrollY = Math.max(
      0,
      Math.min(
        contentHeight - container.clientHeight,
        startScrollY + deltaY * (contentHeight / container.clientHeight)
      )
    );

    if (scrollY + container.clientHeight >= contentHeight-30) {
      addMoreContentY();
    }

    drawContent();

    updateScrollbars();
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);

    document.removeEventListener("mouseup", onMouseUp);
  }

  document.addEventListener("mousemove", onMouseMove);

  document.addEventListener("mouseup", onMouseUp);
}

function startHorizontalScroll(e) {
  e.preventDefault();

  const startX = e.clientX;

  const startScrollX = scrollX;

  function onMouseMove(e) {
    const deltaX = e.clientX - startX;

    scrollX = Math.max(
      0,
      Math.min(
        contentWidth - container.clientWidth,
        startScrollX + deltaX * (contentWidth / container.clientWidth)
      )
    );
    if (scrollX + container.clientWidth >= contentWidth - 50) {
      // console.log("Adding more colms or X");
      addMoreContentX();

    }

    drawContent();

    updateScrollbars();
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);

    document.removeEventListener("mouseup", onMouseUp);
  }

  document.addEventListener("mousemove", onMouseMove);

  document.addEventListener("mouseup", onMouseUp);
}

function handleWheelScroll(e) {
  e.preventDefault();

  const deltaX = e.deltaX;

  const deltaY = e.deltaY;

  scrollX = Math.max(
    0,
    Math.min(contentWidth - container.clientWidth, scrollX + deltaX)
  );

  scrollY = Math.max(
    0,
    Math.min(contentHeight - container.clientHeight, scrollY + deltaY)
  );

  if (scrollY + container.clientHeight >= contentHeight - 100) {
    addMoreContentY();
  }

  drawContent();

  updateScrollbars();
}

function addMoreContentY() {
  // Increase the content height and add more rows
  rows += 20;
  addRows(20);
  contentHeight += 600;
  drawContent();
  updateScrollbars();
}
function addMoreContentX() {
  // Increase the content height and add more rows
  contentWidth += 2000;
  colms += 20;
  addCols(20);
  // console.log("Again drawing");
  drawContent();
  updateScrollbars();
}

drawContent();
