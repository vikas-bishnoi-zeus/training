export class FindAndReplace {
    constructor(dimension) {
        this.dimension = dimension;
        this.findAndReplaceBtn = document.getElementById("find-replace");
        this.addEventListners();
    }
    addEventListners() {
        this.findAndReplaceBtn.addEventListener("click", this.findAndReplace.bind(this));
    }
    async findAndReplace() {
        const findText = prompt("Enter the value you want to change");
        const replaceText = findText && prompt("Enter the updated value");

        console.log(findText, replaceText);
        // If both values are valid
        if (findText && replaceText) {
            const params = {
                FindText: findText,
                ReplaceText: replaceText,
            };
    
            try {
                const response = await fetch("https://localhost:7009/api/csv/FindAndReplace", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(params),
                });

                location.reload();
                // Optionally handle the response here if necessary (e.g., check response status)
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
            } catch (error) {
                console.error("Could not get items:", error);
            }
        }
    }
}
