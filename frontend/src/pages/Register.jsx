import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    user_name: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // PASSWORD STRENGTH
  const getStrength = (password) => {
    let strength = 0;

    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  };

  const strength = getStrength(form.password);

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["gray", "red", "orange", "blue", "green"];

  // REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.user_name || !form.password || !form.confirm_password) {
      return setError("All fields are required");
    }

    if (form.password !== form.confirm_password) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      await axios.post("/users", {
        user_name: form.user_name,
        password: form.password,
      });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // SOCIAL LOGIN (UI ONLY)
  const socialLogin = (provider) => {
    alert(`${provider} login will be connected later`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">

      {/* CARD */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">
            Create Account
          </h1>
          <p className="text-blue-500">
            DAB Enterprise System
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

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

          {/* PASSWORD STRENGTH */}
          {form.password && (
            <div className="text-sm">
              <span className={`font-semibold text-${strengthColor[strength]}-600`}>
                Strength: {strengthLabel[strength]}
              </span>

              <div className="w-full bg-gray-200 h-2 rounded mt-1">
                <div
                  className="h-2 rounded"
                  style={{
                    width: `${strength * 25}%`,
                    backgroundColor: strengthColor[strength],
                  }}
                />
              </div>
            </div>
          )}

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full border p-3 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-blue-600 text-sm"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* PASSWORD MATCH */}
          {form.confirm_password && (
            <p
              className={`text-sm ${
                form.password === form.confirm_password
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {form.password === form.confirm_password
                ? "Passwords match"
                : "Passwords do not match"}
            </p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-blue-200"></div>
          <span className="px-3 text-sm text-blue-500">or continue with</span>
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
            Google
          </button>

          <button
            onClick={() => socialLogin("GitHub")}
            className="w-full flex items-center justify-center gap-3 border p-3 rounded-lg hover:bg-blue-50"
          >
            <img
              src="https://www.svgrepo.com/show/475654/github-color.svg"
              className="w-5 h-5"
            />
            GitHub
          </button>

          <button
            onClick={() => socialLogin("Yahoo")}
            className="w-full flex items-center justify-center gap-3 border p-3 rounded-lg hover:bg-blue-50"
          >
            <img
              src="https://www.svgrepo.com/show/349518/yahoo.svg"
              className="w-5 h-5"
            />
            Yahoo
          </button>

        </div>

        {/* LOGIN LINK */}
        <p className="text-center text-sm mt-5 text-gray-600">
          Already have account?{" "}
          <a href="/" className="text-blue-600 font-semibold">
            Sign in
          </a>
        </p>

      </div>
    </div>
  );
}

export default Register;