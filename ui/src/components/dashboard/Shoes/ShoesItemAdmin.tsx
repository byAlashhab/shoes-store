import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

type ShoesItemAdminProps = {
  _id: string;
  title: string;
  description: string;
  price: string;
  sizes: string;
  availability: string;
  type: "Male" | "Female";
  image: string;
};

function ShoesItemAdmin({
  _id,
  image,
  title,
  description,
  type,
  price,
  sizes,
  availability,
}: ShoesItemAdminProps) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteShoes = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API}/shoes/${_id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.ok) {
          await queryClient.invalidateQueries({ queryKey: ["shoes"] });
          Swal.fire("Deleted!", "The shoes have been deleted.", "success");
        } else {
          throw new Error("Failed to delete");
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong", "error");
      } finally {
        setIsDeleting(false);
      }
    }
  };

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
          <div>
            <div className="text-3xl font-bold text-green-600">${price}</div>

            <div className="mt-2 mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold mr-2">
                Sizes
              </span>
              <span className="text-sm text-gray-600 font-thin">
                {sizes.split(" ").join(", ")}
              </span>
            </div>

            <div className="mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold mr-2">
                Availability
              </span>
              <span className="text-sm text-gray-600 font-thin">
                {availability.split(" ").join(", ")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to={`${_id}`}
              className="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
            >
              Update
            </Link>
            <button
              onClick={deleteShoes}
              disabled={isDeleting}
              className={`px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoesItemAdmin;
