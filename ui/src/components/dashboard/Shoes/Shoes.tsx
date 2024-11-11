import Metadata from "@/components/metadata";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { shoesContext } from "@/contexts/ShoesContext";
import { PlusCircleIcon } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import ShoesItemAdmin from "./ShoesItemAdmin";

function Shoes() {
  const shoes = useContext(shoesContext);


  return (
    <div className="w-full h-full lg:relative px-4">
      <Metadata title="Vuitton - Dashboard - Shoes" />
      <div className="flex items-center justify-between">
        <Header>Shoes</Header>
        <Button asChild>
          <Link className="flex items-center gap-2" to={"add"}>
            <PlusCircleIcon />
            Add
          </Link>
        </Button>
      </div>
      {shoes.length === 0 ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <img className="size-14" src="../../../SVGs/empty.svg" alt="" />
          <p className="font-semibold">Empty section</p>
        </div>
      ) : (
        <div className="grid pb-4 grid-cols-1 md:grid-cols-2 gap-4 mt-4 xl:grid-cols-3">
          {shoes.map((shoe) => (
            <ShoesItemAdmin
              key={shoe._id}
              _id={shoe._id}
              title={shoe.title}
              description={shoe.description}
              image={shoe.image}
              price={shoe.price}
              type={shoe.type}
              sizes={shoe.sizes}
              availability={shoe.availability}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Shoes;
