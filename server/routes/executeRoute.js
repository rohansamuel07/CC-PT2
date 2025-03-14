// executeRoute.js
const express = require("express");
const executeCode = require("../utils/executeCode");

const router = express.Router();

router.post("/run", async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ output: "Missing code or language" });
  }

  try {
    executeCode(code, language, input, (output) => res.json({ output }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ output: "Server error while executing code" });
  }
});

module.exports = router;