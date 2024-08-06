export class dimensions{
    /**
     * 
     * @param {*} row 
     * @param {*} col 
     * @param {*} width 
     * @param {*} height 
     * @param {*} scrollX 
     * @param {*} scrollY 
     */
    constructor(row,col,width,height,scrollX,scrollY){
        this.row=row;
        this.col=col;
        this.width=width;
        this.height=height;
        this.columnSizePrefix=[0];
        this.rowSizePrefix=[0];
        this.scrollX=scrollX;
        this.scrollY=scrollY;
        this.addSize(this.columnSizePrefix,width,col)
        this.addSize(this.rowSizePrefix,height,row)
        // console.log("Rz",height)
        // console.log(this.binarySearchIndex(this.rowSizePrefix,60));
        // console.log("Ty")
    }
    addMoreRows(num){
        let len=this.rowSizePrefix.length;
        for(let i=0;i<num;i++){
            this.rowSizePrefix.push(this.rowSizePrefix[i+len-1]+this.height);
        }
    }
    addMoreCols(num){
        let len=this.columnSizePrefix.length;
        for(let j=0;j<num;j++){
            this.columnSizePrefix.push(this.columnSizePrefix[j+len-1]+this.width);
        }
    }
    addSize(arr,toAdd,len){
        for(let i=1;i<=len;i++){
            arr.push(arr[i-1]+toAdd);
        }
    }

    findRowIndex(distance){
        return this.binarySearchIndex(this.rowSizePrefix,distance);
    }
    findColumnIndex(distance){
        return this.binarySearchIndex(this.columnSizePrefix,distance);
    }
    binarySearchIndex(arr, Y) {
        if(Y==0){
            return 0;
        }
        let left = 0;
        let right = arr.length - 1;
        let result = -1;
    
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
    
            if (arr[mid] <= Y) {
                result = mid; // Update result to the current mid index
                left = mid + 1; // Move the left boundary to mid + 1
            } else {
                right = mid - 1; // Move the right boundary to mid - 1
            }
        }
    
        return result;
    }
}