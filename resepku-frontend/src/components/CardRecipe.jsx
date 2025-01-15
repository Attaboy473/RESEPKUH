/* eslint-disable react/prop-types */
// COMPONENT CARD BUAT RECIPE
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
const CardRecipe = ({ id, title, category, description, imgUrl, author }) => {
  const imageUrl = `http://localhost:8080/uploads/${imgUrl}`;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${id}`);
  };
  return (
    <>
      <div
        className="w-[300px] h-[400px] px-2 py-2 relative flex flex-col flex-wrap border bg-white rounded-lg cursor-pointer group "
        onClick={handleCardClick}
      >
        <div className="w-full h-[200px] mb-2 relative ">
          <img
            src={imageUrl}
            alt="testing"
            className="w-full h-full bg-cover rounded-lg group-hover:brightness-50"
          />
          <div className="hidden group-hover:block absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white">
            <h1>Lihat Detail</h1>
          </div>
        </div>
        <div className="flex flex-col w-full gap-2">
          <div className=" text-white bg-green-500 px-2 py-1 w-fit rounded-full">
            {category}
          </div>
          <h1 className="text-xl ">{title}</h1>
          <h2>By : {author}</h2>
        </div>
      </div>
    </>
  );
};
export default CardRecipe;
