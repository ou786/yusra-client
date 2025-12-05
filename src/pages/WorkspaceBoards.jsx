import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function WorkspaceBoards() {
  const { id } = useParams(); // workspaceId
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");

  const [workspaceName, setWorkspaceName] = useState("");
  const [editingName, setEditingName] = useState(false);

  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingBoardTitle, setEditingBoardTitle] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadBoards();
    loadWorkspaceInfo();
  }, [id]);

  const loadWorkspaceInfo = async () => {
    const res = await API.get(`/workspaces/${id}`);
    setWorkspaceName(res.data.name);
  };

  const saveWorkspaceName = async () => {
    setEditingName(false);
    await API.patch(`/workspaces/${id}`, { name: workspaceName });
  };

  const loadBoards = async () => {
    try {
      const res = await API.get(`/boards/workspace/${id}`);
      setBoards(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const saveBoardName = async (boardId) => {
    setEditingBoardId(null);
    if (!editingBoardTitle.trim()) return;

    try {
      await API.patch(`/boards/${boardId}`, { title: editingBoardTitle });
      loadBoards();
    } catch (err) {
      console.error("RENAME BOARD ERROR:", err);
    }
  };

  const createBoard = async () => {
    if (!newTitle.trim()) return;
    try {
      await API.post(`/boards`, { title: newTitle, workspaceId: id });
      setNewTitle("");
      loadBoards();
    } catch (err) {
      console.error(err);
    }
  };

  const onDeleteWorkspace = async () => {
    if (!confirm("Delete this workspace and ALL its boards, columns, and cards?"))
      return;

    try {
      await API.delete(`/workspaces/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("DELETE WORKSPACE ERROR:", err);
    }
  };

  if (loading) return <p className="p-6 text-xl">Loading boards...</p>;

// ===========================
// 🌟 EMPTY STATE UI
// ===========================
if (boards.length === 0) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">

      

      <h1 className="text-4xl font-bold mb-2">{workspaceName}</h1>

      <p className="text-gray-600 max-w-md mb-6">
        This workspace has no boards yet. Create your first board to begin
        organizing your tasks.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Board name"
          className="border p-2 rounded w-64"
        />
        <button
          onClick={createBoard}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Board
        </button>
      </div>

      <button
        className="mt-4 text-red-500 hover:text-red-700"
        onClick={onDeleteWorkspace}
      >
        Delete Workspace
      </button>
    </div>
  );
}

// ===========================
// 🌟 MAIN UI (Boards list)
// ===========================
return (
  <div className="p-6 max-w-3xl mx-auto">

    {/* Workspace Header */}
    <div className="flex items-center justify-between mb-6">

      
    

    {/* Workspace Name + Edit */}
    <div className="flex items-center gap-2 mb-8">
      {editingName ? (
        <input
          className="text-3xl font-bold border px-2 py-1 rounded focus:outline-blue-500"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") saveWorkspaceName();
            if (e.key === "Escape") setEditingName(false);
          }}
          onBlur={saveWorkspaceName}
        />
      ) : (
        <h1 className="text-3xl font-bold flex items-center gap-2">
          {workspaceName}
          <button
            onClick={() => setEditingName(true)}
            className="text-gray-500 hover:text-black"
          >
            ✏️
          </button>
        </h1>
      )}
    </div>
    {/* Delete workspace */}
      <button
        className="text-red-500 hover:text-red-700 border border-red-500 px-3 py-1 rounded"
        onClick={onDeleteWorkspace}
      >
        Delete Workspace
      </button>
      </div>

    {/* Create Board */}
    <div className="mb-6 flex gap-2">
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="New board name"
        className="border p-2 rounded w-full"
      />
      <button
        onClick={createBoard}
        className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
      >
        Create
      </button>
    </div>

    {/* Board Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {boards.map((b) => (
        <div
          key={b._id}
          className="
            p-5 bg-gray-100 border rounded-lg cursor-pointer
            hover:shadow-lg hover:scale-[1.03] transition-all duration-200
            flex justify-between items-center
          "
          onClick={() => {
            if (!editingBoardId) navigate(`/board/${b._id}`);
          }}
        >
          {editingBoardId === b._id ? (
            <input
              className="border px-2 py-1 rounded w-full mr-2"
              value={editingBoardTitle}
              autoFocus
              onChange={(e) => setEditingBoardTitle(e.target.value)}
              onBlur={() => saveBoardName(b._id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveBoardName(b._id);
                if (e.key === "Escape") setEditingBoardId(null);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="font-medium">{b.title}</span>
          )}

          <button
            className="text-gray-500 hover:text-black ml-2"
            onClick={(e) => {
              e.stopPropagation();
              setEditingBoardId(b._id);
              setEditingBoardTitle(b.title);
            }}
          >
            ✏️
          </button>
        </div>
      ))}
    </div>
  </div>
);
}
export default WorkspaceBoards;
