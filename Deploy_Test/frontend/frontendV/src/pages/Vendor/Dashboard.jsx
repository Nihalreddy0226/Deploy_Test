import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      {/* <Sidebar /> */}
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <Outlet /> {/* Renders the nested route content */}
      </div>
    </div>
  );
};

export default DashboardLayout;
