import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Reports() {
  const [currentStock, setCurrentStock] = useState([]);
  const [daily, setDaily] = useState({ stockIn: [], stockOut: [] });
  const [monthly, setMonthly] = useState({ stockIn: [], stockOut: [] });

  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // ================= LOAD DATA =================
  const loadReports = async () => {
    try {
      const [currentRes, dailyRes, monthlyRes] = await Promise.all([
        axios.get("/reports/current-stock"),
        axios.get("/reports/daily"),
        axios.get("/reports/monthly"),
      ]);

      setCurrentStock(currentRes.data);
      setDaily(dailyRes.data);
      setMonthly(monthlyRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // ================= FILTER =================
  const filteredCurrent = currentStock.filter((item) =>
    item.item_name.toLowerCase().includes(search.toLowerCase())
  );

  // ================= EXPORT EXCEL =================
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCurrent);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CurrentStock");

    XLSX.writeFile(workbook, "DAB_Reports.xlsx");
  };

  // ================= EXPORT PDF =================
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.text("DAB Enterprise Full Report", 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Item", "Total In", "Total Out", "Balance"]],
      body: filteredCurrent.map((item) => [
        item.item_name,
        item.total_in,
        item.total_out,
        item.balance,
      ]),
    });

    doc.save("DAB_Reports.pdf");
  };

  // ================= PRINT =================
  const printReport = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-blue-50">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <div className="p-6">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-900">
              Reports Dashboard
            </h1>
            <p className="text-blue-600">
              Stock analytics & enterprise reporting system
            </p>
          </div>

          {/* ACTION BAR */}
          <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between gap-4 mb-6">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search item..."
              className="border p-2 rounded w-full md:w-1/3"
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* BUTTONS */}
            <div className="flex gap-3">

              <button
                onClick={exportExcel}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Excel
              </button>

              <button
                onClick={exportPDF}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                PDF
              </button>

              <button
                onClick={printReport}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Print
              </button>

            </div>
          </div>

          {/* ================= CURRENT STOCK ================= */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">

            <h2 className="text-xl font-bold text-blue-900 mb-4">
              Current Stock Report
            </h2>

            <table className="w-full border">

              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">Item</th>
                  <th className="p-3">Total In</th>
                  <th className="p-3">Total Out</th>
                  <th className="p-3">Balance</th>
                </tr>
              </thead>

              <tbody>
                {filteredCurrent.map((item, i) => (
                  <tr key={i} className="text-center border-b hover:bg-blue-50">
                    <td className="p-3">{item.item_name}</td>
                    <td className="p-3 text-green-600">{item.total_in}</td>
                    <td className="p-3 text-red-600">{item.total_out}</td>
                    <td className="p-3 text-purple-700 font-bold">
                      {item.balance}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* ================= DAILY REPORT ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* DAILY IN */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-lg font-bold text-green-600 mb-3">
                Daily Stock In
              </h2>

              <table className="w-full border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {daily.stockIn.map((item) => (
                    <tr key={item.stockin_id} className="text-center border-t">
                      <td className="p-2">{item.item_name}</td>
                      <td className="p-2">{item.quantity_in}</td>
                      <td className="p-2">{item.stockin_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* DAILY OUT */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-lg font-bold text-red-600 mb-3">
                Daily Stock Out
              </h2>

              <table className="w-full border">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {daily.stockOut.map((item) => (
                    <tr key={item.stockout_id} className="text-center border-t">
                      <td className="p-2">{item.item_name}</td>
                      <td className="p-2">{item.quantity_out}</td>
                      <td className="p-2">{item.stockout_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* ================= MONTHLY REPORT ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* MONTHLY IN */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-lg font-bold text-green-700 mb-3">
                Monthly Stock In
              </h2>

              <table className="w-full border">
                <tbody>
                  {monthly.stockIn.map((item) => (
                    <tr key={item.stockin_id} className="text-center border-t">
                      <td className="p-2">{item.item_name}</td>
                      <td className="p-2">{item.quantity_in}</td>
                      <td className="p-2">{item.stockin_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MONTHLY OUT */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h2 className="text-lg font-bold text-red-700 mb-3">
                Monthly Stock Out
              </h2>

              <table className="w-full border">
                <tbody>
                  {monthly.stockOut.map((item) => (
                    <tr key={item.stockout_id} className="text-center border-t">
                      <td className="p-2">{item.item_name}</td>
                      <td className="p-2">{item.quantity_out}</td>
                      <td className="p-2">{item.stockout_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Reports;