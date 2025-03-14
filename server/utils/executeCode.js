const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const executeCode = (code, language, input, callback) => {
  const tempDir = path.join(__dirname, "../scripts/temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const fileExtension = {
    c: "c",
    cpp: "cpp",
    python: "py",
    javascript: "js",
    java: "java",
  }[language];

  if (!fileExtension) {
    return callback("Unsupported language");
  }

  const uniqueId = crypto.randomUUID();
  const codeFilePath = path.join(tempDir, `temp_${uniqueId}.${fileExtension}`);
  const inputFilePath = path.join(tempDir, `input_${uniqueId}.txt`);

  fs.writeFileSync(codeFilePath, code);
  fs.writeFileSync(inputFilePath, input || ""); // Save input to file

  const command = `bash ${path.join(__dirname, "../scripts/execute_code.sh")} ${language} ${codeFilePath} ${inputFilePath}`;

  exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
    try {
      if (language === "java") {
        // Extract Java class name from the code
        const classNameMatch = code.match(/public\s+class\s+(\w+)/);
        const className = classNameMatch ? classNameMatch[1] : "Main";

        // Correct Java file name after renaming in execute_code.sh
        const correctedJavaFile = path.join(tempDir, `${className}.java`);

        // Delete the renamed Java file if it exists
        if (fs.existsSync(correctedJavaFile)) {
          fs.unlinkSync(correctedJavaFile);
        }
      }

      // Delete input file
      if (fs.existsSync(inputFilePath)) {
        fs.unlinkSync(inputFilePath);
      }

      // Delete other language code files
      if (language !== "java" && fs.existsSync(codeFilePath)) {
        fs.unlinkSync(codeFilePath);
      }
    } catch (unlinkError) {
      console.error("Error deleting temp files:", unlinkError);
    }

    if (error) {
      return callback(stderr || "Execution error");
    }
    callback(stdout);
  });
};

module.exports = executeCode;
