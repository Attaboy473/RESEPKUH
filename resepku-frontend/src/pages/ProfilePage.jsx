import { useEffect, useState } from "react";
import axios from "axios";
import CardRecipe from "../components/CardRecipe";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState({ name: "Nama User", email: "Email User" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const [favoritesResponse, userResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/favorites", {
            withCredentials: true,
          }),
          axios.get("http://localhost:8080/api/user", {
            withCredentials: true,
          }),
        ]);

        const favoriteRecipes = favoritesResponse.data.map(
          (favorite) => favorite.recipe
        );
        setFavorites(favoriteRecipes);
        setRecipes(userResponse.data.recipes);
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching favorites:", error.message);
        navigate("/");
      }
    };

    fetchFavorites();
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="w-full min-h-screen bg-[url('Profil.jpg')] bg-cover bg-center flex flex-col items-center py-5"
      >
        {/* Kotak Nama Pengguna */}
        <div className="w-[95%] md:w-[80%] xl:w-[50%] bg-white bg-opacity-70 mx-auto my-5 px-2 py-2 flex items-center gap-5 rounded-lg shadow-md">
          <div className="w-[100px] h-[100px] bg-sky-500 rounded-full flex items-center justify-center">
            <h1 className="text-4xl">{user.name[0].toUpperCase()}</h1>
          </div>
          <div>
            <h1>{user.name}</h1>
            <h1>{user.email}</h1>
          </div>
        </div>
  
        {/* Kotak Resep Anda */}
        <div className="w-full mx-auto bg-white bg-opacity-70 py-5 mb-5">
          <h1 className="text-2xl font-bold text-center my-5">Resep Anda</h1>
          <div className="flex w-full flex-wrap gap-2 justify-center px-4 xl:justify-start">
            {recipes &&
              recipes.map((recipe) => (
                <CardRecipe
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  category={recipe.category}
                  description={recipe.description}
                  imgUrl={recipe.image}
                  author={user.name}
                />
              ))}
          </div>
        </div>
  
        {/* Kotak Resep Favorit */}
        <div className="w-full mx-auto bg-white bg-opacity-70 py-5 mb-5">
          <h1 className="text-2xl font-bold text-center my-5">Resep Favorit</h1>
          <div className="flex w-full flex-wrap gap-2 justify-center px-4 xl:justify-start">
            {favorites &&
              favorites.map((recipe) => (
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

export default ProfilePage;
