canvas.addEventListener("click", (event) => getInput(event));
function setInput(x, y) {
  var cellInput = document.getElementById("content");
  var i = Math.floor(y / 30);
  var j = Math.floor(x / 100);

  cellInput.value = cells[i][j].value;
  cellInput.style.display = "inline";
  var top = cells[i][j].y - scrollY;
  var left = cells[i][j].x - scrollX;
  cellInput.style.top = top - 1 + "px";
  cellInput.style.left = left - 1 + "px";
  cellInput.style.height = 30 - 2 + "px";
  cellInput.style.width = 100 - 2 + "px";
  // cellInput.style.border = "2px solid blue";

  cellInput.focus();
  cellInput.onblur = () => {
    cells[i][j].setValue(cellInput.value);
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
