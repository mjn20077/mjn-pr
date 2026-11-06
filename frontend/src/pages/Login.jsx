import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    user_name: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.user_name || !form.password) {
      return setError("All fields are required");
    }

    setLoading(true);

    try {
      const res = await axios.post("/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // SOCIAL LOGIN (UI ONLY)
  const socialLogin = (provider) => {
    alert(`${provider} login will be connected later (OAuth setup required)`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">

      {/* CARD */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">
            Welcome Back
          </h1>
          <p className="text-blue-500">
            DAB Enterprise System Login
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* USERNAME */}
          <input
            name="user_name"
            placeholder="Username"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <div className="relative">

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border p-3 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-blue-600 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* DIVIDER */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-blue-200"></div>
          <span className="px-3 text-sm text-blue-500">
            or continue with
          </span>
          <div className="flex-1 h-px bg-blue-200"></div>
        </div>

        {/* SOCIAL LOGIN */}
        <div className="space-y-3">

          <button
            onClick={() => socialLogin("Google")}
            className="w-full flex items-center justify-center gap-3 border p-3 rounded-lg hover:bg-blue-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <button
            onClick={() => socialLogin("GitHub")}
            className="w-full flex items-center justify-center gap-3 border p-3 rounded-lg hover:bg-blue-50"
          >
            <img
              src="https://www.svgrepo.com/show/475654/github-color.svg"
              className="w-5 h-5"
            />
            Continue with GitHub
          </button>

          <button
            onClick={() => socialLogin("Yahoo")}
            className="w-full flex items-center justify-center gap-3 border p-3 rounded-lg hover:bg-blue-50"
          >
            <img
              src="https://www.svgrepo.com/show/349518/yahoo.svg"
              className="w-5 h-5"
            />
            Continue with Yahoo
          </button>

        </div>

        {/* REGISTER LINK */}
        <p className="text-center text-sm mt-5 text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login;