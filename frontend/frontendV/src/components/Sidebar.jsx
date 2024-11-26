import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaBox,
  FaPlusSquare,
  FaClipboardList,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";
import api from "../services/api"; // Adjust the path based on your project structure

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [storeName, setStoreName] = useState(""); // Store name state

  useEffect(() => {
    // Fetch the store name from the API
    const fetchStoreName = async () => {
      try {
        const { data } = await api.get("/api/vendor/profile/"); // Adjust endpoint if necessary
        setStoreName(data.store_name || "Store"); // Fallback to "Store" if no name is available
      } catch (error) {
        console.error("Failed to fetch store name:", error);
      }
    };

    fetchStoreName();
  }, []);

  const getAbbreviation = (name) => {
    // Return the first two uppercase letters of the store name
    const words = name.split(" ");
    if (words.length > 1) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={`h-screen ${
        isCollapsed ? "w-20" : "w-64"
      } bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col justify-between transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex items-center gap-3">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
        >
          <div className="flex items-center">
            <div className="bg-purple-500 p-2 rounded-md">
              <span className="text-white font-bold text-lg">
                {getAbbreviation(storeName)} {/* Dynamic abbreviation */}
              </span>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <h2 className="text-lg font-bold">{storeName}</h2>{" "}
                {/* Dynamic store name */}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto text-gray-800 dark:text-gray-200 focus:outline-none"
        >
          {isCollapsed ? "❯" : "❮"}
        </button>
      </div>

      {/* Sidebar Links */}
      <ul className="flex-1 space-y-2 px-2">
        <li>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? "justify-center" : "justify-start"
              } px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              } rounded-lg transition-colors duration-200`
            }
          >
            <FaUser className="text-lg" />
            {!isCollapsed && <span className="ml-4">Profile</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/products"
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? "justify-center" : "justify-start"
              } px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              } rounded-lg transition-colors duration-200`
            }
          >
            <FaBox className="text-lg" />
            {!isCollapsed && <span className="ml-4">Products</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/add-product"
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? "justify-center" : "justify-start"
              } px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              } rounded-lg transition-colors duration-200`
            }
          >
            <FaPlusSquare className="text-lg" />
            {!isCollapsed && <span className="ml-4">Add Product</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/orders"
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? "justify-center" : "justify-start"
              } px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              } rounded-lg transition-colors duration-200`
            }
          >
            <FaClipboardList className="text-lg" />
            {!isCollapsed && <span className="ml-4">Orders</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center ${
                isCollapsed ? "justify-center" : "justify-start"
              } px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              } rounded-lg transition-colors duration-200`
            }
          >
            <FaCogs className="text-lg" />
            {!isCollapsed && <span className="ml-4">Settings</span>}
          </NavLink>
        </li>
      </ul>

      {/* Sidebar Footer */}
      <div className="p-4 space-y-4">
        <button
          onClick={() => alert("Logged out")}
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-start"
          } w-full px-4 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200`}
        >
          <FaSignOutAlt className="text-lg" />
          {!isCollapsed && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
