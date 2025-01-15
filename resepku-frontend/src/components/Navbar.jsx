import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NavbarComponent = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  //   const [cookie, setCookie] = useCookies(["jwt", "userId"]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BACKEND}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND}/user`,
          { withCredentials: true }
        );

        const userData = response.data;
        setUsername(userData.name);
        setIsAuth(true);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setIsAuth(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  //   console.log(username);

  return (
    <>
      <nav
        className={`p-4 bg-green-500 flex items-center justify-between md:justify-around sticky top-0 z-[9999]`}
      >
        <div className="flex items-center z-[99]">
          <Link to={"/"} className="text-white text-xl font-bold">
            ResepKu
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isAuth ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="focus:outline-none bg-white text-blue-gray-900 font-bold w-8 h-8 rounded-full flex  justify-center items-center"
              >
                {username[0].toUpperCase()}
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link
                    to={"/profile"}
                    className="block px-4 py-2 text-gray-800"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              className="bg-[#DA7086] px-2 py-1 text-white rounded-md"
              to={"/login"}
            >
              Login / signup
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavbarComponent;
