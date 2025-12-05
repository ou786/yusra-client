// src/components/AuthLayout.jsx
import React from "react";


export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div
        className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white p-8"
        aria-hidden="true"
      >
        <div className="max-w-lg">
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Yusra
            </h2>
            <p className="mt-3 text-lg md:text-xl opacity-90">
              “For every hardship, there is ease...”
            </p>
          </div>

          <p className="mt-6 text-sm md:text-base opacity-90">
            Build, organize and move your tasks with Yusra — a simple,
            beautiful kanban app to keep the workflow smooth. Sign in or create
            an account to get started.
          </p>

          {/* Optional small footer / credit */}
          <div className="mt-8 text-xs opacity-80">
            Crafted with ❤️ — Your personal productivity companion
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (form) */}
      <div className="flex flex-1 items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Header (title + subtitle) */}
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>

          {/* Form content passed as children */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {children}
          </div>

          {/* Mobile hint showing the quote area on small screens */}
          <div className="mt-6 text-center md:hidden text-sm text-gray-500">
            “For every hardship, there is ease...” — Yusra
          </div>
        </div>
      </div>
    </div>
  );
}
