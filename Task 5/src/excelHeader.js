export class ExcelHeader {
    constructor(sheet) {
        this.grid = sheet.grid;
        this.dimension = sheet.dimension;
        this.select = sheet.sheetUtlilty.select;
        this.progressDiv = document.getElementById("progress-div");
        this.progressBar = document.getElementById("progress");
        this.connection = null; // Initialize the SignalR connection here
        this.init();
    }
    init() {
        this.ClickUtility();
        this.setupConnection(); // Set up the SignalR connection
        this.uploadCsv();
        window.addEventListener("load", async () => {
            console.log("Loading");
            await this.getFile(0, this.dimension.row);
        });
    }
    // Setting up SignalR connection
    setupConnection() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7009/progressHub", {
                withCredentials: true,
            })
            .build();

        this.connection.on("ReceiveProgress", (message) => {
            // Use arrow function to preserve 'this' context
            // console.log("Progress update: ", message);
            // console.log(message>=100)
            document.getElementById("progress-div").style.display="block";
            let lastProgressValue=document.getElementById("progress").value;
            while(lastProgressValue<message){
                lastProgressValue++;
                document.getElementById("progress").value=lastProgressValue;
                // console.log(document.getElementById("progress").value)
            }
            // console.log(message)
            // Update the progress bar or console
            if (message>=100) {
                console.log("Upload complete.");
                this.stopConnection();
                console.log(this.dimension.row);
                this.getFile(0, this.dimension.row);
            } else {
                // Optionally, handle progress updates here
                // Example: Update the progress bar or show progress
                console.log("Progressing...");
            }
        });
    }

    startConnection() {
        if (this.connection) {
            this.connection.start().catch(function (err) {
                return console.error(err.toString());
            });
        }
    }

    stopConnection() {
        if (this.connection) {
            this.connection.stop().then(() => {
                console.log("Connection stopped.");
            }).catch((err) => {
                console.error("Error stopping connection:", err);
            });
        }
    }
    uploadCsv() {
        document.querySelector("form").addEventListener("submit", async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById("uploadFileInput");
            const file = fileInput.files[0];
            // console.log(file);
            if (file) {
                console.log("file found");
                const formData = new FormData();
                formData.append("file", file);

                // Start the SignalR connection before uploading the file
                this.startConnection();
                document.getElementById("progress-div").style.display="block";
                document.getElementById("progress").value=0;
                await fetch("https://localhost:7009/api/csv/UploadCsv", {
                    method: "POST",
                    body: formData,
                })
                    .then(async (response) => {
                        console.log(this.dimension.row);
                        
                        // Stop the SignalR connection after the upload is complete
                        // setTimeout(()=>{
                        //     this.getFile(0, this.dimension.row);
                        //     // this.stopConnection();
                        // },2000);

                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            } else {
                alert("Please select a file to upload.");
            }
        });
    }
    /**
     * Fetches more data from the server and updates the grid.
     *
     * @param {number} offset - The offset from which to start fetching data.
     * @param {number} limit - The number of rows to fetch.
     */
    async getFile(offset, limit) {
        let response;
        let range = {
            limit: limit,
            offset: offset,
        };
        try {
            response = await fetch("https://localhost:7009/api/csv/GetItems", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(range),
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }
            const data = await response.json();
            console.log("Geting Data", offset);

            data.forEach((row) => {
                const [rowIndex, ...cells] = row;

                cells.forEach((cellValue, colIndex) => {
                    this.grid.cells[rowIndex][colIndex].value = cellValue;
                });
            });
            this.grid.render();
            this.select.setInputBox(false);
        } catch (error) {
            console.error("could not get items", error);
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
