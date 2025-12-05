import { useEffect, useState } from "react";
import { getWorkspaces, createWorkspace } from "../api/workspaces";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;

    try {
      await createWorkspace(newTitle);
      setNewTitle("");
      loadWorkspaces();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-6 text-xl">Loading...</p>;

  // ===========================
  // 🌟 EMPTY-STATE UI
  // ===========================
  if (workspaces.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Yusra 🎉</h1>
        <p className="text-gray-600 max-w-md mb-6">
          It looks like you don’t have any workspaces yet.  
          Start your journey by creating your first workspace!
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Workspace name"
            className="border p-2 rounded w-64"
          />
          <button
            onClick={handleCreate}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Create
          </button>
        </div>

        <p className="text-sm text-gray-500">
          Workspaces help you organize boards, tasks, and workflows.
        </p>
      </div>
    );
  }

  // ===========================
  // 🌟 WORKSPACES LIST UI
  // ===========================
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Workspaces</h1>

      {/* Create Workspace Section */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New workspace name"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
        >
          Create
        </button>
      </div>

      {/* Workspace Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workspaces.map((ws) => (
          <div
            key={ws._id}
            onClick={() => navigate(`/workspace/${ws._id}`)}
            className="
              p-5 bg-gray-100 border rounded-lg cursor-pointer 
              hover:shadow-lg hover:scale-[1.03] transition-all duration-200 
              flex items-center justify-center text-lg font-medium
            "
          >
            {ws.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
