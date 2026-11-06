import { useEffect, useState } from "react";
import axios from "../api/axios";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalStockIn: 0,
    totalStockOut: 0,
    currentBalance: 0,
  });

  const loadData = async () => {
    try {
      const res = await axios.get("/reports/dashboard");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-blue-50">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <div className="p-8">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">
              Dashboard Overview
            </h1>
            <p className="text-blue-600">
              DAB Enterprise Inventory Management System
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* USERS */}
            <div className="bg-white border-l-4 border-blue-600 p-6 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-blue-500 font-semibold">Users</p>
              <h2 className="text-3xl font-bold text-blue-900 mt-2">
                {data.totalUsers}
              </h2>
            </div>

            {/* STOCK IN */}
            <div className="bg-white border-l-4 border-green-500 p-6 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-green-500 font-semibold">Stock In</p>
              <h2 className="text-3xl font-bold text-green-700 mt-2">
                {data.totalStockIn}
              </h2>
            </div>

            {/* STOCK OUT */}
            <div className="bg-white border-l-4 border-red-500 p-6 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-red-500 font-semibold">Stock Out</p>
              <h2 className="text-3xl font-bold text-red-600 mt-2">
                {data.totalStockOut}
              </h2>
            </div>

            {/* BALANCE */}
            <div className="bg-white border-l-4 border-purple-500 p-6 rounded-xl shadow hover:shadow-lg transition">
              <p className="text-purple-500 font-semibold">Balance</p>
              <h2 className="text-3xl font-bold text-purple-700 mt-2">
                {data.currentBalance}
              </h2>
            </div>

          </div>

          {/* INFO SECTION */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* SYSTEM INFO */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold text-blue-900 mb-3">
                System Overview
              </h2>

              <p className="text-gray-600 leading-relaxed">
                DAB Enterprise Ltd system manages stock in, stock out,
                and inventory reporting. It ensures accurate tracking of
                goods, suppliers, and warehouse balance in real time.
              </p>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold text-blue-900 mb-3">
                Quick Actions
              </h2>

              <div className="flex flex-col gap-3">

                <a
                  href="/stockin"
                  className="bg-blue-600 text-white p-3 rounded-lg text-center hover:bg-blue-700"
                >
                  + Add Stock In
                </a>

                <a
                  href="/stockout"
                  className="bg-red-500 text-white p-3 rounded-lg text-center hover:bg-red-600"
                >
                  - Add Stock Out
                </a>

                <a
                  href="/reports"
                  className="bg-purple-600 text-white p-3 rounded-lg text-center hover:bg-purple-700"
                >
                  View Reports
                </a>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;