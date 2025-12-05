// src/pages/BoardPage.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

/**
 * Polished BoardPage (Trello-like)
 * - smooth drag visuals (ghosts + transitions)
 * - column + card UI polish
 * - inline add column / add card
 * - keep your existing API calls (no backend changes)
 */

function BoardPage() {
  const { id } = useParams(); // boardId
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  // inline add states
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [addingCardFor, setAddingCardFor] = useState(null);
  const [newCardTitle, setNewCardTitle] = useState("");

  // editing states
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const [editingCardId, setEditingCardId] = useState(null);
  const [editingCardTitle, setEditingCardTitle] = useState("");

  const navigate = useNavigate();
  const addColInputRef = useRef(null);
  const addCardInputRef = useRef(null);

  useEffect(() => {
    loadBoard();
    // eslint-disable-next-line
  }, [id]);

  const loadBoard = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/boards/${id}`);
      setBoard(res.data.board);
      // expect res.data.columns to be array of columns with cards nested
      setColumns(res.data.columns || []);
    } catch (err) {
      console.error("BOARD FETCH ERROR:", err);
    }
    setLoading(false);
  };

  /* ---------------------------
     Create / Add helpers
     --------------------------- */

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim()) {
      setAddingColumn(false);
      setNewColumnTitle("");
      return;
    }
    try {
      await API.post("/columns", { title: newColumnTitle, boardId: id });
      setNewColumnTitle("");
      setAddingColumn(false);
      loadBoard();
    } catch (err) {
      console.error("COLUMN CREATE ERROR:", err);
    }
  };

  const handleAddCard = async (columnId) => {
    if (!newCardTitle.trim()) {
      setAddingCardFor(null);
      setNewCardTitle("");
      return;
    }
    try {
      await API.post("/cards", {
        title: newCardTitle,
        columnId,
        boardId: id,
      });
      setNewCardTitle("");
      setAddingCardFor(null);
      loadBoard();
    } catch (err) {
      console.error("CARD CREATE ERROR:", err);
    }
  };

  /* ---------------------------
     Rename helpers (columns/cards)
     --------------------------- */

  const saveColumnName = async (columnId) => {
    setEditingColumnId(null);
    if (!editingColumnTitle.trim()) return;
    try {
      await API.patch(`/columns/${columnId}`, { title: editingColumnTitle });
      setColumns((prev) =>
        prev.map((c) => (c._id === columnId ? { ...c, title: editingColumnTitle } : c))
      );
    } catch (err) {
      console.error("RENAME COLUMN ERROR:", err);
    }
  };

  const saveCardTitle = async (cardId, columnId) => {
    setEditingCardId(null);
    if (!editingCardTitle.trim()) return;
    try {
      await API.patch(`/cards/${cardId}`, { title: editingCardTitle });
      setColumns((prev) =>
        prev.map((col) =>
          col._id === columnId
            ? {
                ...col,
                cards: col.cards.map((c) => (c._id === cardId ? { ...c, title: editingCardTitle } : c)),
              }
            : col
        )
      );
    } catch (err) {
      console.error("RENAME CARD ERROR:", err);
    }
  };

  /* ---------------------------
     Delete helpers
     --------------------------- */

  const onDeleteCard = async (cardId, columnId) => {
    if (!confirm("Delete this card?")) return;
    try {
      await API.delete(`/cards/${cardId}`);
      setColumns((prev) =>
        prev.map((col) => (col._id === columnId ? { ...col, cards: col.cards.filter((c) => c._id !== cardId) } : col))
      );
    } catch (err) {
      console.error("DELETE CARD ERROR:", err);
    }
  };

  const onDeleteColumn = async (columnId) => {
    if (!confirm("Delete this column and all its cards?")) return;
    try {
      await API.delete(`/columns/${columnId}`);
      setColumns((prev) => prev.filter((c) => c._id !== columnId));
    } catch (err) {
      console.error("DELETE COLUMN ERROR:", err);
    }
  };

  const onDeleteBoard = async (boardId) => {
    if (!confirm("Delete this board and ALL its columns and cards?")) return;
    try {
      await API.delete(`/boards/${boardId}`);
      navigate(`/workspace/${board.workspace}`);
    } catch (err) {
      console.error("DELETE BOARD ERROR:", err);
    }
  };

  /* ---------------------------
     Drag & drop handlers
     --------------------------- */

  const moveCardLocal = (sourceColId, destColId, sourceIndex, destIndex) => {
    const updatedColumns = columns.map((c) => ({ ...c, cards: [...c.cards] }));
    const sourceCol = updatedColumns.find((c) => c._id === sourceColId);
    const destCol = updatedColumns.find((c) => c._id === destColId);
    const [movedCard] = sourceCol.cards.splice(sourceIndex, 1);
    destCol.cards.splice(destIndex, 0, movedCard);
    setColumns(updatedColumns);
  };

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    // Reorder columns
    if (type === "column") {
      if (source.index === destination.index) return;
      const newColumns = Array.from(columns);
      const [moved] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, moved);
      setColumns(newColumns);
      try {
        await API.post("/columns/reorder", {
          boardId: id,
          orderedColumnIds: newColumns.map((col) => col._id),
        });
      } catch (err) {
        console.error("COLUMN REORDER ERROR:", err);
        loadBoard();
      }
      return;
    }

    // Move cards
    if (type === "card") {
      const sourceColumnId = source.droppableId;
      const destColumnId = destination.droppableId;
      // instant UI
      moveCardLocal(sourceColumnId, destColumnId, source.index, destination.index);

      // backend
      try {
        await API.post("/cards/move", {
          cardId: draggableId,
          toColumnId: destColumnId,
          toPosition: destination.index,
        });
      } catch (err) {
        console.error("Card move sync error:", err);
        loadBoard();
      }
    }
  };

  /* ---------------------------
     Render helpers / empty-state
     --------------------------- */

  if (loading) return <p className="p-6 text-xl">Loading board...</p>;
  if (!board) return <p className="p-6 text-xl">Board not found</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold">{board.title}</h1>

        <div className="flex items-center gap-3">
          

          <button
            onClick={() => onDeleteBoard(board._id)}
            className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100"
          >
            Delete Board
          </button>
        </div>
      </div>

      {/* If no columns show friendly empty state */}
      {columns.length === 0 ? (
        <div className="p-12 border-2 border-dashed rounded text-center text-gray-600">
          <p className="text-xl font-semibold mb-4">This board is empty</p>
          <p className="mb-6">Create your first column to get started.</p>
          <div className="flex justify-center gap-2">
            <input
              ref={addColInputRef}
              className="border p-2 rounded w-72"
              placeholder="Column name"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddColumn();
              }}
            />
            <button onClick={handleAddColumn} className="px-4 py-2 bg-blue-600 text-white rounded">
              Add Column
            </button>
          </div>
        </div>
      ) : null}

      {/* Drag & drop board area */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            <div
              className="flex gap-6 overflow-x-auto py-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columns.map((col, colIndex) => (
                <Draggable key={col._id} draggableId={col._id} index={colIndex}>
                  {(draggableProvided, snapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      style={{
                        ...draggableProvided.draggableProps.style,
                        minWidth: 300,
                        maxWidth: 320,
                        transition: "transform 150ms ease",
                      }}
                      className={`bg-gray-50 rounded-lg p-3 shadow-sm transform ${
                        snapshot.isDragging ? "scale-105 z-20" : "hover:scale-[1.02]"
                      }`}
                    >
                      {/* Column header (with grab handle) */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            {...draggableProvided.dragHandleProps}
                            className="p-1 rounded-full bg-white border text-sm cursor-grab hover:bg-gray-100"
                            title="Drag column"
                          >
                            ☰
                          </div>

                          {editingColumnId === col._id ? (
                            <input
                              className="font-bold text-lg px-2 py-1 rounded w-44"
                              value={editingColumnTitle}
                              autoFocus
                              onChange={(e) => setEditingColumnTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveColumnName(col._id);
                                if (e.key === "Escape") setEditingColumnId(null);
                              }}
                              onBlur={() => saveColumnName(col._id)}
                            />
                          ) : (
                            <h2 className="font-bold text-lg">{col.title}</h2>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingColumnId(col._id);
                              setEditingColumnTitle(col.title);
                            }}
                            className="text-gray-500 hover:text-black"
                            title="Rename column"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => onDeleteColumn(col._id)}
                            className="text-red-400 hover:text-red-600"
                            title="Delete column"
                          >
                            🗑
                          </button>
                        </div>
                      </div>

                      {/* Cards droppable */}
                      <Droppable droppableId={col._id} type="card">
                        {(dropProvided, dropSnapshot) => (
                          <div
                            ref={dropProvided.innerRef}
                            {...dropProvided.droppableProps}
                            className={`min-h-[60px] max-h-[60vh] overflow-y-auto space-y-3 p-1 rounded transition-colors ${
                              dropSnapshot.isDraggingOver ? "bg-blue-50" : "bg-transparent"
                            }`}
                          >
                            {col.cards.map((card, idx) => (
                              <Draggable key={card._id} draggableId={card._id} index={idx}>
                                {(cardProvided, cardSnapshot) => (
                                  <div
                                    ref={cardProvided.innerRef}
                                    {...cardProvided.draggableProps}
                                    {...cardProvided.dragHandleProps}
                                    className={`p-3 bg-white rounded shadow-sm relative transition-transform ${
                                      cardSnapshot.isDragging ? "scale-105 z-30" : "hover:translate-y-[-2px]"
                                    }`}
                                  >
                                    {editingCardId === card._id ? (
                                      <input
                                        className="w-full border px-2 py-1 rounded"
                                        value={editingCardTitle}
                                        autoFocus
                                        onChange={(e) => setEditingCardTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") saveCardTitle(card._id, col._id);
                                          if (e.key === "Escape") setEditingCardId(null);
                                        }}
                                        onBlur={() => saveCardTitle(card._id, col._id)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    ) : (
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="text-sm">{card.title}</div>
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingCardId(card._id);
                                              setEditingCardTitle(card.title);
                                            }}
                                            className="text-gray-400 hover:text-black"
                                            title="Rename card"
                                          >
                                            ✏️
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onDeleteCard(card._id, col._id);
                                            }}
                                            className="text-red-400 hover:text-red-600"
                                            title="Delete card"
                                          >
                                            🗑
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}

                            {/* Ghost placeholder from DnD */}
                            {dropProvided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* Add card UI */}
                      <div className="mt-3">
                        {addingCardFor === col._id ? (
                          <div className="flex gap-2">
                            <input
                              ref={addCardInputRef}
                              value={newCardTitle}
                              onChange={(e) => setNewCardTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddCard(col._id);
                                if (e.key === "Escape") {
                                  setAddingCardFor(null);
                                  setNewCardTitle("");
                                }
                              }}
                              className="flex-1 border px-2 py-1 rounded"
                              placeholder="Card title"
                              autoFocus
                            />
                            <button
                              onClick={() => handleAddCard(col._id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setAddingCardFor(col._id);
                              setTimeout(() => addCardInputRef.current?.focus(), 50);
                            }}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            + Add Card
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {/* Add column panel */}
              <div className="min-w-[300px] max-w-[320px]">
                {addingColumn ? (
                  <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                    <input
                      ref={addColInputRef}
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddColumn();
                        if (e.key === "Escape") {
                          setAddingColumn(false);
                          setNewColumnTitle("");
                        }
                      }}
                      className="w-full border px-2 py-2 rounded mb-2"
                      placeholder="Column name"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button onClick={handleAddColumn} className="px-3 py-1 bg-blue-600 text-white rounded">
                        Add column
                      </button>
                      <button
                        onClick={() => {
                          setAddingColumn(false);
                          setNewColumnTitle("");
                        }}
                        className="px-3 py-1 border rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setAddingColumn(true);
                      setTimeout(() => addColInputRef.current?.focus(), 50);
                    }}
                    className="h-full flex items-center justify-center p-4 rounded border-dashed border-2 border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    + Add another column
                  </div>
                )}
              </div>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default BoardPage;
