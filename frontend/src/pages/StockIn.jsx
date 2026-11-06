import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function StockIn() {
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    item_name: "",
    description: "",
    quantity_in: "",
    total_quantity_in: "",
    supplier_name: "",
    stockin_date: "",
  });

  const navigate = useNavigate();

  // Load data
  const loadData = async () => {
    try {
      const res = await axios.get("/stockin");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit
  const addStockIn = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/stockin", form);
      alert("Stock In added successfully");

      setForm({
        item_name: "",
        description: "",
        quantity_in: "",
        total_quantity_in: "",
        supplier_name: "",
        stockin_date: "",
      });

      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <div className="p-6">

          {/* TITLE */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-blue-900">
              Stock In Management
            </h1>
            <p className="text-blue-600">
              Add and manage incoming stock items
            </p>
          </div>

          {/* SPLIT LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ================= LEFT FORM ================= */}
            <div className="bg-white p-5 rounded-xl shadow">

              <h2 className="text-xl font-bold text-blue-900 mb-4">
                Add Stock In
              </h2>

              <form onSubmit={addStockIn} className="space-y-3">

                <input
                  name="item_name"
                  placeholder="Item Name"
                  className="w-full border p-2 rounded"
                  value={form.item_name}
                  onChange={handleChange}
                />

                <input
                  name="description"
                  placeholder="Description"
                  className="w-full border p-2 rounded"
                  value={form.description}
                  onChange={handleChange}
                />

                <input
                  name="quantity_in"
                  type="number"
                  placeholder="Quantity In"
                  className="w-full border p-2 rounded"
                  value={form.quantity_in}
                  onChange={handleChange}
                />

                <input
                  name="total_quantity_in"
                  type="number"
                  placeholder="Total Quantity In"
                  className="w-full border p-2 rounded"
                  value={form.total_quantity_in}
                  onChange={handleChange}
                />

                <input
                  name="supplier_name"
                  placeholder="Supplier Name"
                  className="w-full border p-2 rounded"
                  value={form.supplier_name}
                  onChange={handleChange}
                />

                <input
                  name="stockin_date"
                  type="date"
                  className="w-full border p-2 rounded"
                  value={form.stockin_date}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                  + Add Stock In
                </button>

              </form>

            </div>

            {/* ================= RIGHT TABLE ================= */}
            <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow">

              <h2 className="text-xl font-bold text-blue-900 mb-4">
                Stock In Records
              </h2>

              <div className="overflow-x-auto">

                <table className="w-full border">

                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-3">Item</th>
                      <th className="p-3">Qty In</th>
                      <th className="p-3">Supplier</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.length > 0 ? (
                      items.map((item) => (
                        <tr
                          key={item.stockin_id}
                          className="text-center border-b hover:bg-blue-50"
                        >
                          <td className="p-3">{item.item_name}</td>
                          <td className="p-3 text-green-600 font-semibold">
                            {item.quantity_in}
                          </td>
                          <td className="p-3">{item.supplier_name}</td>
                          <td className="p-3">{item.stockin_date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="p-4 text-center text-gray-500"
                        >
                          No stock in records found
                        </td>
                      </tr>
                    )}
                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default StockIn;