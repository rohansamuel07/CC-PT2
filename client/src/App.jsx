import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Editor from "./components/CodeEditor";
import RoomJoin from "./components/RoomJoin";
import CodeEditor from "./components/CodeEditor";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<RoomJoin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editor/:roomId" element={<CodeEditor />} />
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <Editor />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
