import React from 'react';

const ProjectsPage = () => {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Design Projects</h1>
      <p className="text-gray-600">Here you can view and manage all your furniture design projects.</p>
      
      <div className="mt-6 p-6 border border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-500 italic">No projects found at the moment.</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Create New Project
        </button>
      </div>
    </div>
  );
};

export default ProjectsPage;