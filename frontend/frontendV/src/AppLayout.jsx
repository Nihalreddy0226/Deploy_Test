import React from "react";
import Sidebar from "./components/Sidebar";

const AppLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className="flex-1 p-1"
        style={{
          marginLeft: "16rem", // Matches the expanded sidebar width (w-64)
          transition: "margin-left 0.3s", // Smooth transition when collapsing
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
