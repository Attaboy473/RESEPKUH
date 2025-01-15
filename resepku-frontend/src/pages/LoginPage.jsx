import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookies] = useCookies(["jwt", "userId"]);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/login",
        { email, password },
        { withCredentials: true }
      );
      const { jwt, userId } = response.data; 

      if (jwt && userId) {
        // Set cookies
        setCookies("jwt", jwt, { path: "/", sameSite: "Lax" });
        setCookies("userId", userId, { path: "/", sameSite: "Lax" });
      }
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* container */}
      <div
  className="w-full h-screen flex items-center justify-center bg-cover bg-center bg-[url('/login.jpg')]"
>
  <form
    onSubmit={handleLogin}
    className="w-[95%] md:w-[50%] px-5 py-5 md:py-10 md:px-14 flex flex-col border bg-white bg-opacity-90 rounded-lg shadow-lg"
  >
    <h2 className="mb-6 text-xl md:text-2xl text-center">
      Welcome Back to ResepKu
    </h2>
    {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
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
    <div className="mb-10 flex flex-col gap-2">
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
    <div className="mb-2 text-center">
      Dont have an account?{" "}
      <Link to="/register" className="text-green-500">
        Register
      </Link>
    </div>
    <button
      type="submit"
      className="bg-green-500 text-white w-[80%] mx-auto py-2"
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Login"}
    </button>
  </form>
</div>

      {/* container */}
    </>
  );
};

export default LoginPage;
