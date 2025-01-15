/* eslint-disable react/prop-types */

const RecipeForm = ({
  title,
  setTitle,
  category,
  setCategory,
  description,
  setDescription,
  ingredients,
  setIngredients,
  instructions,
  setInstructions,
  image,
  setImage,
  onSubmit,
}) => {
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("ingredients", ingredients.join(","));
    formData.append("instructions", instructions.join(","));
    if (image && typeof image !== "string") {
      formData.append("image", image);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col">
        <label className="mb-2 text-lg font-semibold">Nama Masakan</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      <div className="flex flex-col">
        <label className="mb-2 text-lg font-semibold">Kategori</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Pilih Kategori</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Dessert">Dessert</option>
          <option value="Sayur">Sayur</option>
          <option value="Olahan">Olahan</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label className="mb-2 text-lg font-semibold">Deskripsi</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows="4"
        />
      </div>
      <div>
        <label className="block mb-2 text-lg font-semibold">Bahan-bahan</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center mb-2 gap-2">
            <input
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none flex-grow"
            />
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="text-red-600 font-semibold"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="text-white px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
        >
          Tambah bahan
        </button>
      </div>
      <div>
        <label className="block mb-2 text-lg font-semibold">Instruksi</label>
        {instructions.map((instruction, index) => (
          <div key={index} className="flex items-center mb-2 gap-2">
            <textarea
              value={instruction}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none flex-grow"
              rows="2"
            />
            <button
              type="button"
              onClick={() => removeInstruction(index)}
              className="text-red-600 font-semibold"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addInstruction}
          className="text-white px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600"
        >
          Tambah Instruksi +
        </button>
      </div>
      <div className="flex flex-col">
        <label className="mb-2 text-lg font-semibold">Image</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full text-white py-3 bg-blue-500 rounded-lg font-semibold hover:bg-blue-600"
      >
        Submit Recipe
      </button>
    </form>
  );
};

export default RecipeForm;
