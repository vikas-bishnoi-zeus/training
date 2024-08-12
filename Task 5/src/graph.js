export class graph {
    constructor(dimension, objArray, selectObj) {
        this.dimension = dimension;
        this.topSheet = objArray[0];
        this.leftSheet=objArray[1];
        this.grid=objArray[2];
        this.select = selectObj;
        this.draw = false;
        this.draging=false;
        this.updateselectRange();
        this.getGraphElement();
        this.init();
        this.addEventListener();
    }
    updateselectRange() {
        this.i = Math.min(this.select.i,this.select.currenti);
        this.j = Math.min(this.select.j,this.select.currentj);
        this.currenti = Math.max(this.select.i,this.select.currenti);
        this.currentj = Math.max(this.select.j,this.select.currentj);
    }
    getGraphElement() {
        this.graph = document.querySelector(".graph");
        this.graphCanvasElement = document.getElementById("myChart");
        this.barGraphBtn = document.querySelector(".graph-bar-btn");
        this.lineGraphBtn = document.querySelector(".graph-line-btn");
        this.pieGraphBtn = document.querySelector(".graph-pie-btn");
        this.graphCloseBtn = document.querySelector(".graph-close");
    }
    addEventListener(){
        this.graph.addEventListener("mousedown",()=>{this.draging=true});
        window.addEventListener("mouseup",()=>{this.draging=false});
        window.addEventListener("mousemove",this.dragChart.bind(this))
    }
    dragChart(evt){
        if(this.draging){
            // console.log("draging ",this.graph.getBoundingClientRect())
            let graphX=this.graph.getBoundingClientRect().x
            let graphY=this.graph.getBoundingClientRect().y;
            let newX=graphX+evt.movementX;
            if(newX>0){
                this.graph.style.left=newX+"px";
            }
            let newY=graphY+evt.movementY;
            if(newY>0){
                this.graph.style.top=newY+"px";
            }
            console.log(evt.movementX,newX,newY)
        }
    }
    init() {
        this.barGraphBtn.addEventListener(
            "click",
            this.drawBarGraph.bind(this)
        );

        this.lineGraphBtn.addEventListener(
            "click",
            this.drawLineGraph.bind(this)
        );

        this.pieGraphBtn.addEventListener(
            "click",
            this.drawPieGraph.bind(this)
        );

        this.graphCloseBtn.addEventListener("click", () => {
            this.graph.style.display = "none";
        });
    }

    // destroy graph
    destroyGraph() {
        this.graph.style.display = "inline-block";
        this.updateselectRange();
        // console.log(this.i, this.j, this.currenti, this.currentj);
        if (this.draw) {
            this.draw.destroy();
        }
    }

    getGraphValue(){
        let labels=[];
        let datasets=[];
        if(this.isHorizantalSizebigger()){
            for(let k=this.i;k<=this.currenti;k++){
                let tempDataset={
                    label:this.leftSheet.verticalcell[k].value,
                    data:[],
                    borderWidth: 1,
                }
                for(let l=this.j;l<=this.currentj;l++){
                    labels[l-this.j]=l-this.j+1;
                    tempDataset.data.push(this.grid.cells[k][l].value)
                }
                datasets.push(tempDataset)
            }
        }
        else{
            for(let l=this.j;l<=this.currentj;l++){
                let tempDataset={
                    label:this.topSheet.horizontalcell[l].value,
                    data:[],
                    borderWidth: 1,
                }
                for(let k=this.i;k<=this.currenti;k++){
                    labels[k-this.i]=k-this.i+1;
                    tempDataset.data.push(this.grid.cells[k][l].value)
                }
                datasets.push(tempDataset)
            }
        }
        console.log(datasets)
        return {labels,datasets};
    }
    isHorizantalSizebigger(){
        if((this.currentj-this.j)>(this.currenti-this.i)){
            // console.log((this.currentj-this.j))
            return true;
        }
        return false;
    }
    //  * Drawing Bar Graph
    drawBarGraph() {
        this.destroyGraph();
        let {labels:labels,datasets:datasets}=this.getGraphValue();
        // console.log(labels)
        this.draw = new Chart(this.graphCanvasElement, {
            type: "bar",
            data: {
                labels: labels,
                datasets:datasets,
            },
            // options: {
            //     scales: {
            //         y: {
            //             // beginAtZero: true,
            //         },
            //     },
            // },
            // grouped:true,
        });
    }

    //  * Drawing Line Graph
    drawLineGraph() {
        this.destroyGraph();
        let {labels:labels,datasets:datasets}=this.getGraphValue();
        // console.log(labels)
        this.draw = new Chart(this.graphCanvasElement, {
            type: "line",
            data: {
                labels: labels,
                datasets:datasets,
            },
            // options: {
            //     title: {
            //         // display: true,
            //     },
            // },
        });
    }

    //  * Drawing Pie Chart
    drawPieGraph() {
        this.destroyGraph();
        let {labels:labels,datasets:datasets}=this.getGraphValue();
        this.draw = new Chart(this.graphCanvasElement, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: datasets,
            },
            // options: {
            //     title: {
            //         display: true,
            //     },
            // },
        });
    }
}
