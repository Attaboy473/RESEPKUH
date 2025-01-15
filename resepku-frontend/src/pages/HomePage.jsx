import { useEffect, useState } from "react";
import axios from "axios";
import CardRecipe from "../components/CardRecipe";
import Navbar from "../components/Navbar";
import hero from "../assets/Recipe.jpg";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/recipes", {
          withCredentials: true,
        });
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error.message);
      }
    };

    const fetchUser = async () => {
      try {
        await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        setIsAuth(true);
      } catch (e) {
        console.error(e);
        setIsAuth(false);
      }
    };

    fetchRecipes();
    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full mx-auto">
        {/* Hero Section */}
        <div className="w-full h-[500px] md:h-[600px] relative mx-auto mb-5">
          <div className="w-full h-full">
            <img
              src={hero}
              alt="Hero"
              className="w-full h-full object-cover brightness-75"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-4">
            <h1 className="text-center text-3xl text-white">Welcome To Resepku</h1>
            {isAuth ? (
              <Link
                to={"/create-recipe"}
                className="px-4 py-2 w-fit bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all"
              >
                Share Resep Masakanmu
              </Link>
            ) : (
              <Link
                to={"/login"}
                className="px-4 py-2 w-fit bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>

        {/* Recipes Section */}
        <h1 className="text-center text-3xl font-semibold mb-6 text-gray-800">
          Recipes
        </h1>
        <div
          className="w-full py-8 bg-gradient-to-b from-white via-gray-50 to-gray-100 px-4"
          style={{
            backgroundImage: `url('/assets/images/Resep.jpg')`, // Jika ingin menambahkan pola
            backgroundSize: "contain",
            backgroundBlendMode: "lighten",
          }}
        >
          <div className="flex w-full flex-wrap gap-6 justify-center xl:justify-around px-4 pb-4">
            {recipes &&
              recipes.map((recipe) => (
                <CardRecipe
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  category={recipe.category}
                  description={recipe.description}
                  imgUrl={recipe.image}
                  author={recipe.user.name}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
