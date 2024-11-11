import Error from "@/components/Error";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

export const authContext = createContext(false);

function AuthContext({ children }: { children: React.ReactNode }) {
  const query = useQuery({
    queryKey: ["auth"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API}/auth/status`, {
        credentials: "include",
      }),
  });

  if (query.isError) return <Error />;

  if (query.isLoading || query.isPending) return <Loader />;

  return (
    <authContext.Provider value={query.data?.ok ?? false}>
      {children}
    </authContext.Provider>
  );
}

export default AuthContext;
