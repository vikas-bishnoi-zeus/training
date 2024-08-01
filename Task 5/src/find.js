var btnFind = document.getElementById("btn-find");
btnFind.addEventListener("click", find);
let findArray=[];
class pair{
    constructor(i,array){
        this.i=i;
        this.array=array;
    }
}
let fl=false;
function find(event){
    console.log(event)
    var findText = document.getElementById("find");
    console.log(findText.value);
    for(let i=0;i<cells.length;i++){
        const temp=new pair(i,[]);
        var bl=false;
        for(let j=0;j<cells[i].length;j++){
            if(cells[i][j].value===findText.value){
                bl=true;
                temp.array.push(j);
                // console.log(j);
                
            }
        }
        if(bl){
            findArray.push(temp);
        }
    }
    ctx.reset();
    ctxside.reset();

    if(fl){
        return;
    }
    // fl=true;
    for(let k=0;k<findArray.length;k++){

        const curRow=findArray[k];
        const tempRow=[];
        let jIndex=0;
        const srNo=new cell(0,k*30,curRow.i+1,false,ctxside)
        srNo.rectDraw(100,30,0,0);
        for(let j=0;j<colms;j++){
            const tempcell=new cell(j*100,k*30,cells[curRow.i][j].value,false,ctx)
            if(j==curRow.array[jIndex]){
                tempcell.isSelected=true;
                if(jIndex<curRow.length-1){
                    jIndex++;
                }
            }
            tempRow.push(tempcell);
            tempcell.rectDraw(100,30,0,0);
        }
    }
    findArray=[]

}
