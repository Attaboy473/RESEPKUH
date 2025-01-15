import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "../components/Navbar";
import RecipeForm from "../components/FormRecipe";

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/recipes/${id}`,
          {
            withCredentials: true,
          }
        );
        const recipe = response.data;
        setTitle(recipe.title);
        setCategory(recipe.category);
        setDescription(recipe.description);
        setIngredients(recipe.ingredients.split(","));
        setInstructions(recipe.instructions.split(","));
        setImage(recipe.image);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleUpdateRecipe = async (formData) => {
    try {
      await axios.put(`http://localhost:8080/api/recipes/${id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  return (
    <>
      <NavbarComponent />
      <div
        className="w-full min-h-screen bg-cover bg-center flex flex-col items-center py-10"
        style={{
          backgroundImage: `url('/Edit.jpg')`, // File latar belakang
          backgroundSize: "cover", // Sesuaikan ukuran
          backgroundRepeat: "no-repeat", // Hindari pengulangan
          backgroundPosition: "center", // Tempatkan di tengah
        }}
      >
        <div className="w-[95%] md:w-[70%] xl:w-[50%] bg-[#ffffffcc] backdrop-blur-md rounded-3xl shadow-2xl p-8">
          {/* Judul */}
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Edit Recipe
          </h1>
          <p className="text-lg text-gray-600 text-center mb-6">
            Perbarui resep favoritmu dengan mudah di sini!
          </p>

          {/* Formulir */}
          <RecipeForm
            onSubmit={handleUpdateRecipe}
            title={title}
            category={category}
            description={description}
            ingredients={ingredients}
            instructions={instructions}
            image={image}
            setTitle={setTitle}
            setCategory={setCategory}
            setDescription={setDescription}
            setIngredients={setIngredients}
            setInstructions={setInstructions}
            setImage={setImage}
          />
        </div>
      </div>
    </>
  );
};

export default EditRecipePage;
