import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import Error from "@/components/Error";

type agent = {
  _id: string;
  username: string;
  password: string;
};

export const agentsContext = createContext<agent[]>([]);

function AgentsContext({ children }: { children: React.ReactNode }) {
  const query = useQuery({
    queryKey: ["agents"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API}/agent/all`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  if (query.isError) return <Error />;

  if (query.isLoading || query.isPending) return <Loader />;

  return (
    <agentsContext.Provider value={query.data}>
      {children}
    </agentsContext.Provider>
  );
}

export default AgentsContext;
