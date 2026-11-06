import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">
        DAB Enterprise System
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;