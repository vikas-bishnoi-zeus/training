// import {cell} from "./cell.js"

// const canvas = document.getElementById("spreadsheet");
const div = document.getElementById("main-area");

// const ctx = canvas.getContext("2d");
// console.log(div.clientHeight);
// console.log(div.clientWidth);
canvas.width = div.clientWidth - 10;
canvas.height = div.clientHeight - 10;

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
function addRows(rowAdd){
  let len=cells.length;
  for(let i=0;i<rowAdd;i++){
    cells[len+i]=[];
    for(let j=0;j<colms;j++){
      let val = Math.floor(Math.random() * 1000);
      const curCell = new cell(j*100, (len+i)*30, val, false);
      cells[len+i][j] = curCell;
    }
  }
}
function addCols(colsAdd){
  let len=cells.length;
  let wid=cells[0].length
  for(let i=0;i<len;i++){
    for(let j=wid;j<wid+colsAdd;j++){
      let val = Math.floor(Math.random() * 1000);
      const curCell = new cell(j*100, (len+i)*30, val, false);
      cells[i][j] = curCell;
    }
  }
}
addRows(rows);
updateScrollbars();

// Event listeners for scrolling

verticalScroll.addEventListener("mousedown", startVerticalScroll);

horizontalScroll.addEventListener('mousedown', startHorizontalScroll);

canvas.addEventListener("wheel", handleWheelScroll);
function drawContent() {
  ctx.reset();
  for (let i = 0; i < rows; i++) {
    if (30 * i - scrollY < -40) {
      continue;
    }
    for(let j=0;j<colms;j++){
      if(j*100-scrollX<-110){
        continue;
      }
      ctx.rect(j*100-scrollX, 30 * i - scrollY, 100, 30);
      // ctx.fillText(`${i + 1} ${j+1} ${cells[i][j].value}`, (j*100)+10 - scrollX, 30 * (i + 1) - scrollY - 10);
      ctx.fillText(`${cells[i][j].value}`, (j*100)+10 - scrollX, 30 * (i + 1) - scrollY - 10);
      ctx.stroke();
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
  colms += 20;
  addCols(20);
  contentWidth += 2000;
  drawContent();
  updateScrollbars();
}


drawContent();
