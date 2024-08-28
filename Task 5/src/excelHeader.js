export class excelHeader {
    constructor(sheet) {
        this.grid=sheet.grid;
        this.select=sheet.sheetUtlilty.select;
        this.init();
    }
    init() {
        this.ClickUtility();
        // console.log("Ram");
        // document.getElementById("uploadBtn").addEventListener("click", () => {
        //     this.uploadCsv();
        // });
        this.uploadCsv();
        window.addEventListener("load",async()=>{
            console.log("Loading")
            await this.getFile(0,100);
        })
    }
    uploadCsv() {
        console.log("Uploading");
        document.querySelector("form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById("uploadFileInput");
            const file = fileInput.files[0];
            console.log(file)
            if (file) {
                console.log("file found");
                const formData = new FormData();
                formData.append("file", file);

                await fetch(
                    "https://localhost:7009/api/csv/uploadCsv",
                    {
                        method: "POST",
                        body: formData,
                    }
                )
                    .then(async (response) => {
                        // this.grid.cells[0][0].value="1";
                        // console.log(this.grid.cells[1][1]);
                        // console.log(response);
                        await this.getFile(0,100);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            } else {
                alert("Please select a file to upload.");
            }
        });
    }
    async getFile(offset, limit){
        let response;
        let range = {
            "limit": limit,
            "offset": offset
        }; 
        // const formData = new FormData();
        // formData.append("range", JSON.stringify(range));
        try {
            response = await fetch('https://localhost:7009/api/csv/GetItems',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify(range),
                }
            ); 
            const res = await response.json();
            console.log("Geting Data")
            console.log(res);
            // // var values = res.map(item => Object.values(item))
            for(let row of res){
                console.log(row[0]);
                let j=-1;
                for(let cell of row){
                    if(j==-1){
                        j++;
                        continue;
                    }
                    this.grid.cells[row[0]][j].value=cell;
                    j++;
                }
            }
            this.grid.render();
            this.select.setInputBox(false);
            // console.log(res[0]);
              
        } catch (error) {
            console.error('could not get items');
        }
    }
    ClickUtility() {
        var fileTabBtn = document.querySelector(".file-tab-btn");
        var focusFile = document.querySelector(".focus-file");

        var operationsTabBtn = document.querySelector(".operations-tab-btn");
        var focusOperations = document.querySelector(".focus-operations");

        var graphTabBtn = document.querySelector(".graph-tab-btn");
        var focusGraph = document.querySelector(".focus-graph");

        fileTabBtn.addEventListener("click", function () {
            fileTabBtn.classList.add("active");
            operationsTabBtn.classList.remove("active");
            graphTabBtn.classList.remove("active");
            focusFile.classList.remove("d-none");
            focusOperations.classList.add("d-none");
            focusGraph.classList.add("d-none");
        });

        operationsTabBtn.addEventListener("click", function () {
            fileTabBtn.classList.remove("active");
            operationsTabBtn.classList.add("active");
            graphTabBtn.classList.remove("active");
            focusFile.classList.add("d-none");
            focusOperations.classList.remove("d-none");
            focusGraph.classList.add("d-none");
        });

        graphTabBtn.addEventListener("click", function () {
            fileTabBtn.classList.remove("active");
            operationsTabBtn.classList.remove("active");
            graphTabBtn.classList.add("active");
            focusFile.classList.add("d-none");
            focusOperations.classList.add("d-none");
            focusGraph.classList.remove("d-none");
        });
    }
}
