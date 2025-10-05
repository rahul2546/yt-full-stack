// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; // Important: Outlet is the placeholder for page content
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Toaster } from "@/components/ui/sonner"


const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

 // Manual dark mode logic
 const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const userPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (userPreferDark ? 'dark' : 'light');
 });

 useEffect(() => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  localStorage.setItem('theme', theme);
 }, [theme]);

 const toggleTheme = () => {
  setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
 };


  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header onMenuClick={toggleSidebar}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        <main className="flex-1 p-4">
          <Outlet /> {/* Child routes like HomePage and WatchPage will be rendered here */}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;