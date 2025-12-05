import API from "./axios";

export const getWorkspaces = async () => {
  const res = await API.get("/workspaces");
  return res.data;
};

export const createWorkspace = async (name) => {
  const res = await API.post("/workspaces", { name });
  return res.data;
};

