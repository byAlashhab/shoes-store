import { shoesContext } from "@/contexts/ShoesContext";
import { useContext } from "react";
import ShoesItemClient from "./ShoesItemClient";
import { Link } from "react-router-dom";

function Shoes() {
  const shoes = useContext(shoesContext);

  return (
    <div>
      <h1 className="font-caveat text-6xl py-4 bg-gradient-to-r from-purple-600 to-red-500 inline-block text-transparent bg-clip-text relative left-1/2 -translate-x-1/2 my-4">
        Shoes
      </h1>
      <Link to={"/"} className="absolute top-8 right-8">
        <img className="size-8" src="../SVGs/return.svg" alt="" />
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
        {shoes.map((shoe) => (
          <ShoesItemClient
            key={shoe._id}
            _id={shoe._id}
            title={shoe.title}
            description={shoe.description}
            image={shoe.image}
            price={shoe.price}
            type={shoe.type}
          />
        ))}
      </div>
    </div>
  );
}

export default Shoes;
