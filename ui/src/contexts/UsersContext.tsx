import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import Error from "@/components/Error";

type user = {
  name: string;
  email: string;
  role: string;
  image: string;
  createdAt: number;
};

export const usersContext = createContext<user[]>([]);

function UsersContext({ children }: { children: React.ReactNode }) {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API}/user/all`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  if (query.isError) return <Error />;

  if (query.isLoading || query.isPending) return <Loader />;

  return (
    <usersContext.Provider value={query.data}>{children}</usersContext.Provider>
  );
}

export default UsersContext;
