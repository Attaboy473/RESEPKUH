import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "../components/Navbar";
import { FiEdit } from "react-icons/fi";
import { MdFavorite } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

const RecipePage = () => {
  const { id } = useParams(); // Recipe ID
  const [recipe, setRecipe] = useState(null);
  const [author, setAuthor] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/recipes/${id}`,
          {
            withCredentials: true,
          }
        );
        setRecipe(response.data);
        setAuthor(response.data.user);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRecipe();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, favoritesResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/user", {
            withCredentials: true,
          }),
          axios.get("http://localhost:8080/api/favorites", {
            withCredentials: true,
          }),
        ]);

        setCurrentUser(userResponse.data);
        const favorites = favoritesResponse.data;
        const favorite = favorites.find(
          (favorite) => favorite.recipe_id === parseInt(id)
        );
        if (favorite) {
          setFavoriteId(favorite.id);
          setIsFavorited(true);
        }

        setIsAuth(true);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsAuth(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFavorite = async () => {
    try {
      const recipeId = parseInt(id);

      if (isFavorited && favoriteId) {
        await axios.delete(
          `http://localhost:8080/api/favorites/${favoriteId}`,
          {
            withCredentials: true,
          }
        );
        setIsFavorited(false);
        setFavoriteId(null);
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/favorites",
          { recipe_id: recipeId },
          { withCredentials: true }
        );
        setFavoriteId(response.data.id);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error(
        "Error handling favorite:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/recipes/${id}`, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error(
        "Error deleting recipe:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const isOwner = currentUser && author && currentUser.id === author.id;

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavbarComponent />
      <div
        className="w-full min-h-screen bg-cover bg-center flex flex-col items-center py-10"
        style={{
          backgroundImage: `url('/resep.jpg')`, 
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="md:w-[60%] xl:w-[50%] mx-auto py-8 px-6 bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-2xl">
          {/* Gambar Resep */}
          <div className="w-full h-[400px] rounded-lg overflow-hidden mb-6">
            <img
              src={`http://localhost:8080/uploads/${recipe.image}`}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Detail Resep */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold uppercase">
                {recipe.category}
              </h2>
              <div className="flex gap-2">
                {isOwner && (
                  <>
                    <Link
                      to={`/edit-recipe/${recipe.id}`}
                      className="px-3 py-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-all"
                    >
                      <FiEdit />
                    </Link>
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-3 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
                {isAuth && !isOwner && (
                  <button
                    onClick={handleFavorite}
                    className={`px-3 py-3 rounded-full transition-all ${
                      isFavorited
                        ? "bg-red-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    <MdFavorite />
                  </button>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
            {author && (
              <h2 className="text-lg italic text-gray-600 mt-1">
                by: {author.name}
              </h2>
            )}
            <p className="mt-4 text-lg text-gray-700">{recipe.description}</p>

            <div className="mt-8">
              <h1 className="text-2xl font-semibold text-green-600 mb-4">
                Bahan-bahan
              </h1>
              <ul className="pl-5 space-y-2">
                {recipe.ingredients.split(",").map((ingredient, index) => (
                  <li
                    key={index}
                    className="text-lg text-gray-700 list-disc list-inside"
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h1 className="text-2xl font-semibold text-green-600 mb-4">
                Instruksi
              </h1>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                {recipe.instructions.split(",").map((instruction, index) => (
                  <li key={index} className="text-lg">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipePage;
