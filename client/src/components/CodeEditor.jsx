import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000", { autoConnect: false });

export default function CodeEditor() {
  const { roomId } = useParams();
  const [code, setCode] = useState("// Write your code here...");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const outputRef = useRef(null);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", roomId);

    const handleCodeUpdate = (newCode) => setCode(newCode);
    socket.on("codeUpdate", handleCodeUpdate);

    return () => {
      socket.off("codeUpdate", handleCodeUpdate);
      socket.disconnect();
    };
  }, [roomId]);

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    socket.emit("codeChange", { roomId, code: newValue });
  };

  const runCode = async () => {
    setOutput("Running...");
    try {
      const response = await fetch("http://localhost:5000/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput("Error executing code");
    }
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <nav className="flex items-center justify-between px-6 py-3 bg-gray-800 shadow-lg">
        <h1 className="text-xl font-bold text-blue-400">Online Compiler</h1>
        <div className="flex items-center space-x-4">
          <label className="font-medium">Language:</label>
          <select
            className="px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </nav>

      <div className="flex flex-1 p-4 space-x-4">
        <div className="w-2/3 bg-gray-800 rounded-lg shadow-lg p-4">
          <Editor
            height="70vh"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={handleCodeChange}
            options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true }}
          />
          <button
            onClick={runCode}
            className="w-full mt-3 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Run Code ▶
          </button>
        </div>

        <div className="w-1/3 bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-blue-400">Output:</h2>
          <div
            ref={outputRef}
            className="flex-1 bg-black text-green-400 p-3 mt-2 rounded-md overflow-auto font-mono"
          >
            {output || "Output will be shown here..."}
          </div>
        </div>
      </div>
    </div>
  );
}
