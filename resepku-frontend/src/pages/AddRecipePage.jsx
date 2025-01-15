import { useState } from "react";
import axios from "axios";
import RecipeForm from "../components/FormRecipe";
import NavbarComponent from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const CreateRecipePage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(""); // Menyimpan kategori yang dipilih
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/recipes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      alert("Berhasil menambahkan resep: " + response.data.title);
      navigate("/");
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  return (
    <>
      <NavbarComponent />
      <div
        className="w-full min-h-screen bg-cover bg-fixed flex flex-col items-center py-10"
        style={{
          backgroundImage: `url('Gelap.jpg')`,
          backgroundBlendMode: "overlay",
        }}
      >
        {/* Kotak Formulir */}
        <div className="w-[95%] md:w-[80%] xl:w-[50%] bg-[#ffffffcc] backdrop-blur-md rounded-3xl shadow-2xl p-8">
          {/* Judul */}
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Create a New Recipe
          </h1>
          <p className="text-lg text-gray-600 text-center mb-6">
            Tambahkan resep favoritmu dan bagikan dengan komunitas!
          </p>

          {/* Formulir */}
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append("title", title);
              formData.append("category", category);
              formData.append("description", description);
              formData.append("ingredients", ingredients.join(","));
              formData.append("instructions", instructions.join(","));
              formData.append("image", image);
              handleSubmit(formData);
            }}
          >
            {/* Input Judul */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Nama Masakan
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan nama masakan"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                required
              />
            </div>

            {/* Dropdown Kategori */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                required
              >
                <option value="" disabled>
                  Pilih Kategori
                </option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Dessert">Dessert</option>
                <option value="Sayur">Sayur</option>
                <option value="Olahan">Olahan</option>
              </select>
            </div>

            {/* Input Deskripsi */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Berikan deskripsi singkat tentang resep"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                rows="4"
                required
              ></textarea>
            </div>

            {/* Input Bahan-bahan */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Bahan-bahan
              </label>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center mb-3">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => {
                      const updatedIngredients = [...ingredients];
                      updatedIngredients[index] = e.target.value;
                      setIngredients(updatedIngredients);
                    }}
                    placeholder="Masukkan bahan"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() =>
                        setIngredients(ingredients.filter((_, i) => i !== index))
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                onClick={() => setIngredients([...ingredients, ""])}
              >
                Tambah Bahan
              </button>
            </div>

            {/* Input Instruksi */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Instruksi
              </label>
              {instructions.map((instruction, index) => (
                <div key={index} className="flex items-center mb-3">
                  <input
                    type="text"
                    value={instruction}
                    onChange={(e) => {
                      const updatedInstructions = [...instructions];
                      updatedInstructions[index] = e.target.value;
                      setInstructions(updatedInstructions);
                    }}
                    placeholder="Masukkan instruksi"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  />
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() =>
                        setInstructions(
                          instructions.filter((_, i) => i !== index)
                        )
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                onClick={() => setInstructions([...instructions, ""])}
              >
                Tambah Instruksi
              </button>
            </div>

            {/* Input Gambar */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Upload Gambar
              </label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                required
              />
            </div>

            {/* Tombol Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600 transition-all"
              >
                Simpan Resep
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRecipePage;
