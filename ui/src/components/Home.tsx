import { useContext } from "react";
import Navbar from "./Navbar";
import { shoesContext } from "@/contexts/ShoesContext";
import { MoreHorizontalIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { authContext } from "@/contexts/AuthContext";

function Home() {
  const shoes = useContext(shoesContext)[0];
  const auth = useContext(authContext);

  return (
    <>
      <Navbar />

      {!auth ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 uppercase text-xs font-mono">log in or sign up</div>
      ) : (
        <>
          <div className="w-full max-w-[550px] p-5 lg:p-0 lg:max-w-none lg:w-4/6 flex flex-col lg:flex-row gap-4 relative mx-auto mt-[20px] lg:mt-[100px]">
            <span
              className={`absolute top-9 left-9 lg:top-4 lg:left-4 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${
                shoes.type === "Male"
                  ? "bg-blue-500 text-white"
                  : "bg-pink-500 text-white"
              }`}
            >
              {shoes.type}
            </span>

            <img className="w-full mb-4 lg:w-1/2 lg:m-0 rounded-lg" src={shoes.image} alt="" />

            <div className="flex justify-center items-center">
              <div className="flex flex-col gap-5">
                <h1 className="font-semibold text-2xl lg:text-3xl">{shoes.title}</h1>
                <p>{shoes.description}</p>
                <p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold mr-2">
                    Sizes
                  </span>
                  <span className="text-sm text-gray-600 font-thin">
                    {shoes.sizes.split(" ").join(", ")}
                  </span>
                </p>
                <div className="flex justify-between mt-5">
                  <p className="text-3xl font-bold text-green-600">
                    ${shoes.price}
                  </p>
                  <Button asChild>
                    <Link to={`/purchase/${shoes._id}`}>
                      <ShoppingCartIcon />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Button asChild className="relative left-1/2 -translate-x-1/2 my-10">
            <Link className="flex gap-1 items-center" to={"/shoes"}>
              See more <MoreHorizontalIcon className="mt-1" />
            </Link>
          </Button>
        </>
      )}
    </>
  );
}

export default Home;
