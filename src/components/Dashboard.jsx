import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/students" className="p-4 bg-blue-500 text-white rounded text-center">Manage Students</Link>
        <Link to="/videos" className="p-4 bg-green-500 text-white rounded text-center">Manage Videos</Link>
        <Link to="/pdfs" className="p-4 bg-yellow-500 text-white rounded text-center">Manage PDFs</Link>
        <Link to="/tests" className="p-4 bg-purple-500 text-white rounded text-center">Manage Tests</Link>
      </div>
    </div>
  );
};

export default Dashboard;
