// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Important: Outlet is the placeholder for page content
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen">
      <Header onMenuClick={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 p-4">
          <Outlet /> {/* Child routes like HomePage and WatchPage will be rendered here */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;