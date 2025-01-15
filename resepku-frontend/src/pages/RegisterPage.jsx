import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegist = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/register",
        { name, email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      setError("Register failed. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* container */}
      <div
  className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-[url('login.jpg')]"
>
        {/* form */}
        <form
          onSubmit={handleRegist}
          className="w-[95%] md:w-[50%] px-5 py-5 md:py-10 md:px-14 flex flex-col border bg-white bg-opacity-90 rounded-lg shadow-lg"
  >
          <h2 className="mb-4 text-xl md:text-2xl text-center">
            Welcome to ResepKu
          </h2>
          {error && (
            <div className="mb-4 text-red-500 text-center">{error}</div>
          )}
          <div className="mb-4 flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan Nama.."
              className="px-4 py-2 border-2 rounded-lg border-green-200 focus:border-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4 flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan Email.."
              className="px-4 py-2 border-2 rounded-lg border-green-200 focus:border-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-4 flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password.."
              className="px-4 py-2 border-2 rounded-lg border-green-200 focus:border-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="mb-10 flex flex-col gap-2">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              type="password"
              id="confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi Password.."
              className="px-4 py-2 border-2 rounded-lg border-green-200 focus:border-green-500 focus:outline-none"
              required
            />
          </div>
          <div className="text-center mb-2">
            Already have an account?{" "}
            <Link to="/login" className="text-green-500">
              Login
            </Link>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white w-[80%] mx-auto py-2"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
        {/* end of form */}
      </div>
      {/* container */}
    </>
  );
};

export default RegisterPage;
