const { spawn } = require("child_process");

function img_to_text(file_name, lang_code) {
    return new Promise((resolve, reject) => {
        const pythonScript = `./generators/imgToText.py`;
        const pythonArgs = [`./public/images/${file_name}`, lang_code];
        const pythonProcess = spawn("python", [
            "-W ignore",
            pythonScript,
            ...pythonArgs,
        ]);
        let pythonOutput = "";
        // Handle Python script output
        pythonProcess.stdout.on("data", (data) => {
            pythonOutput = data.toString();
            console.log(`Python Output: ${pythonOutput}`);
        });
        // Handle errors or script completion
        pythonProcess.on("close", (code) => {
            if (code === 0) {
                console.log("Python script execution complete.");
                resolve(pythonOutput);
            } else {
                const errorMessage = `Python script execution failed with code ${code}`;
                reject(new Error(errorMessage));
            }
        });
    });
}

module.exports = img_to_text;
