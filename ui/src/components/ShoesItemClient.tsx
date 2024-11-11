import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from "./ui/button";
import { ShoppingCartIcon } from "lucide-react";

type ShoesItemClientProps = {
  _id: string;
  title: string;
  description: string;
  price: string;
  type: "Male" | "Female";
  image: string;
};

function ShoesItemClient({
  _id,
  image,
  title,
  description,
  type,
  price,
}: ShoesItemClientProps) {

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        <img className="w-full h-64 object-cover" src={image} alt={title} />
        <span
          className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${
            type === "Male"
              ? "bg-blue-500 text-white"
              : "bg-pink-500 text-white"
          }`}
        >
          {type}
        </span>
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-green-600">${price}</div>

          <Button asChild>
            <Link to={`/purchase/${_id}`}>
              <ShoppingCartIcon />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoesItemClient;
