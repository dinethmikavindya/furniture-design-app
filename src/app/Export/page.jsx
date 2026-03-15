"use client";
import React, { useState } from 'react';

const ExportPage = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar Section */}
      <aside className="w-64 bg-[#C8B6D3] p-6 rounded-r-[40px] flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Mauve Studio.</h1>
        <nav className="flex flex-col gap-4 text-gray-700 font-medium">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-white/20 p-2 rounded"><span>🏠</span> Home</div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-white/20 p-2 rounded"><span>📁</span> Projects</div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-white/20 p-2 rounded"><span>✎</span> Editor</div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-white/20 p-2 rounded"><span>📦</span> Materials</div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-white/20 p-2 rounded"><span>⚙</span> Settings</div>
          <div className="flex items-center gap-3 bg-white/40 p-2 rounded"><span>📤</span> Export</div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-white/20 p-2 rounded"><span>👤</span> Account</div>
        </nav>
      </aside>

      {/* Main Content Section */}
      <main className="flex-1 p-10 relative">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Your Projects</h2>
            <p className="text-gray-500">Create new projects and be creative!</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-[#D1C4E9] rounded-full text-sm">Join VR</button>
            <button className="px-6 py-2 bg-[#D1C4E9] rounded-full text-sm">Share</button>
            <button className="px-6 py-2 bg-[#D1C4E9] rounded-full text-sm">Save Plan</button>
            <button className="px-6 py-2 bg-red-700 text-white rounded-full text-sm">Delete</button>
          </div>
        </header>

        {/* 3D Preview Placeholder */}
        <div className="w-full h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
           <p className="text-gray-400 text-xl font-bold">[ 3D Design Preview Area ]</p>
        </div>

        {/* Export Modal Overlay */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#D9D9D9] w-[450px] rounded-2xl overflow-hidden shadow-2xl">
              
              {/* Modal Header */}
              <div className="bg-black p-3 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white text-xs font-semibold">Export to Desktop</span>
                <div className="w-8"></div>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-sm font-semibold text-gray-800">Enter Name For The Export File</p>
                  <span className="text-xl">📤</span>
                </div>
                
                <hr className="border-gray-400 mb-6" />

                <div className="flex items-center gap-4 mb-8">
                  <label className="text-sm font-bold text-gray-700">File Name:</label>
                  <input 
                    type="text" 
                    placeholder="File Name:" 
                    className="flex-1 bg-white border border-cyan-400 rounded-full px-4 py-1 text-sm outline-none shadow-[0_0_5px_rgba(34,211,238,0.5)]"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="px-6 py-1 bg-white border border-gray-300 rounded-full text-xs font-bold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button className="px-8 py-1 bg-[#87CEEB] text-white rounded-full text-xs font-bold hover:brightness-105 transition">
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar (Saved Designs) */}
      <aside className="w-80 p-6 border-l border-gray-200">
        <h3 className="text-lg font-bold mb-4">My Saved Designs</h3>
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-100 p-3 rounded-lg border border-gray-200">
               <p className="text-xs font-bold text-gray-800">Kitchen Design {item}</p>
               <div className="flex justify-between mt-2">
                 <span className="text-[10px] bg-purple-200 px-2 py-0.5 rounded text-purple-700 font-bold cursor-pointer">VIEW</span>
                 <span className="text-[10px] bg-purple-200 px-2 py-0.5 rounded text-purple-700 font-bold cursor-pointer">ARCHIVE</span>
               </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

// CRITICAL: This line makes the component available to Next.js
export default ExportPage;