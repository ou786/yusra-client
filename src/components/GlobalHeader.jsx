// src/components/GlobalHeader.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function GlobalHeader() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide header on login/register
  if (location.pathname === "/" || location.pathname === "/register") return null;


  // 🌟 Quotes to rotate
  const quotes = [
    "For every hardship, there is ease… — Yusra",
    "Small steps every day lead to big results.",
    "Productivity begins with clarity.",
    "Stay consistent, not perfect.",
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // 🌟 Fade animation logic (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade-out

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % quotes.length);
        setFade(true); // fade-in new quote
      }, 500); // fade-out duration
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-3 px-4">

        {/* LEFT — Animated Quote */}
        <div
          className={`
            text-gray-600 text-sm italic transition-opacity duration-500
            ${fade ? "opacity-100" : "opacity-0"}
          `}
        >
          {quotes[index]}
        </div>

        {/* RIGHT — Useful Links */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/dashboard" className="hover:text-blue-600 transition">
            Dashboard
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            className="hover:text-blue-600 transition"
          >
            GitHub
          </a>

          <a
            href="https://www.google.com"
            target="_blank"
            className="hover:text-blue-600 transition"
          >
            Help
          </a>
        </div>

      </div>
    </div>
  );
}
