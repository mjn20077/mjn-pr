import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">

      <h2 className="text-2xl font-bold mb-8">
        MENU
      </h2>

      <div className="flex flex-col gap-4">

        <Link
          to="/dashboard"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Dashboard
        </Link>

        <Link
          to="/stockin"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Stock In
        </Link>

        <Link
          to="/stockout"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Stock Out
        </Link>

        <Link
          to="/reports"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Reports
        </Link>

      </div>
    </div>
  );
}

export default Sidebar;