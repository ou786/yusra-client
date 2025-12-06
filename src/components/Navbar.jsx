import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on auth pages
  if (location.pathname === "/" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  // Determine when to show the Back button
  const showBack =
    location.pathname.startsWith("/workspace") ||
    location.pathname.startsWith("/board");

  return (
    <div className="w-full flex items-center justify-between p-4 border-b bg-white shadow-sm">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        {/* App name */}
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          Yusra
        </h1>

        {/* Back button (ONLY inside workspace or board) */}
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            ← Back
          </button>
        )}
      </div>

      {/* RIGHT SECTION */}
      <button
        onClick={handleLogout}
        className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
