'use client';

import React, { useState } from 'react';

// Mock data for design templates (Used until backend API is ready)
const mockTemplates = [
  { id: 't1', name: 'Modern Loft Living', category: 'Living Room', time: 'Edited 2 hours ago', bgColor: 'bg-purple-100' },
  { id: 't2', name: 'Sunny Bedroom', category: 'Bedroom', time: 'Edited yesterday', bgColor: 'bg-orange-100' },
  { id: 't3', name: 'Home Office Setup', category: 'Office', time: 'Edited 3 days ago', bgColor: 'bg-blue-100' },
  { id: 't4', name: 'Nordic Living', category: 'Living Room', time: 'New', bgColor: 'bg-pink-100' },
  { id: 't5', name: 'Cozy Kitchen', category: 'Kitchen', time: 'New', bgColor: 'bg-green-100' },
  { id: 't6', name: 'Zen Bath', category: 'Bathroom', time: 'New', bgColor: 'bg-indigo-100' },
];

export default function DesignTemplates() {
  // State to manage the visibility of the "New Space" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to store the currently selected template details
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Function to handle template card clicks
  const handleTemplateClick = (template: any) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  return (
    <div className="mt-10">
      
      {/* Section Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Start with a Template</h2>
      </div>

      {/* Templates Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTemplates.map((template) => (
          <div 
            key={template.id} 
            onClick={() => handleTemplateClick(template)}
            className="bg-white p-4 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-50"
          >
            {/* Template Image Placeholder */}
            <div className={`w-full h-32 ${template.bgColor} rounded-2xl mb-4 flex items-center justify-center opacity-80`}>
               <span className="text-gray-500 text-sm font-medium">{template.name} View</span>
            </div>
            {/* Template Details */}
            <h3 className="font-bold text-gray-900 text-sm">{template.name}</h3>
            <p className="text-[11px] text-gray-400 mt-1">{template.time} • {template.category}</p>
          </div>
        ))}
      </div>

      {/* New Space Modal (Glassmorphism UI) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white/60 backdrop-blur-md border border-white/40 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-3xl mx-4 relative overflow-hidden">
            
            {/* Modal Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#bda6f0]/40 to-[#eaddff]/20 z-0"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8">
              {/* Left Side: Selected Template Image Preview */}
              <div className="w-full md:w-1/2 bg-white/80 rounded-3xl h-64 md:h-80 flex items-center justify-center shadow-inner">
                {selectedTemplate ? (
                  <span className="text-[#7b5bc7] font-bold text-center px-4">{selectedTemplate.name}</span>
                ) : (
                  <span className="text-gray-400">Blank Canvas</span>
                )}
              </div>
              
              {/* Right Side: New Space Configuration Form */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                {/* Modal Header & Close Button */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-white text-xs font-bold tracking-widest uppercase mb-1 drop-shadow-md">Mauve Studio.</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">&gt; New Space</h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-200 text-xl font-bold">
                    ✕
                  </button>
                </div>

                {/* Input Fields for Space Dimensions */}
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-xs font-medium drop-shadow-sm ml-2">Space name</label>
                    <input type="text" defaultValue={selectedTemplate?.name || ''} className="w-full mt-1 px-4 py-2.5 bg-white/40 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/80 text-gray-800 placeholder-gray-500 text-sm" placeholder="e.g. My Living Room" />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="text-white text-xs font-medium drop-shadow-sm ml-2">Space width</label>
                      <input type="text" className="w-full mt-1 px-4 py-2.5 bg-white/40 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/80 text-gray-800 text-sm" placeholder="cm" />
                    </div>
                    <div className="w-1/2">
                      <label className="text-white text-xs font-medium drop-shadow-sm ml-2">Space height</label>
                      <input type="text" className="w-full mt-1 px-4 py-2.5 bg-white/40 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/80 text-gray-800 text-sm" placeholder="cm" />
                    </div>
                  </div>
                </div>

                {/* Create Button */}
                <div className="mt-8 flex justify-end">
                  <button className="px-8 py-2.5 bg-[#694eb3] text-white rounded-2xl font-bold hover:bg-[#583f99] shadow-lg transition-all text-sm">
                    + Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}