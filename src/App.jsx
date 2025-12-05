import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WorkspaceBoards from "./pages/WorkspaceBoards";
import BoardPage from "./pages/BoardPage";
import Navbar from "./components/Navbar";
import GlobalHeader from "./components/GlobalHeader";




function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <GlobalHeader />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workspace/:id" element={<WorkspaceBoards />} />
        <Route path="/board/:id" element={<BoardPage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
