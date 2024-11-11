import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import Error from "@/components/Error";

type shoes = {
  _id: string;
  title: string;
  description: string;
  price: string;
  sizes: string;
  availability: string;
  type: "Male" | "Female";
  image: string;
};


export const shoesContext = createContext<shoes[]>([]);

function ShoesContext({ children }: { children: React.ReactNode }) {
  const query = useQuery({
    queryKey: ["shoes"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API}/shoes/all`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  if (query.isError) return <Error />;

  if (query.isLoading || query.isPending) return <Loader />;

  return (
    <shoesContext.Provider value={query.data}>{children}</shoesContext.Provider>
  );
}

export default ShoesContext;
