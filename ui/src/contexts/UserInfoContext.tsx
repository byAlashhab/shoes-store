import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import Error from "@/components/Error";

type userInfo = {
  name: string;
  role: string;
  image: string;
};

export const userInfoContext = createContext<userInfo>({ name: "", role: "",image:"" });

function UserInfoContext({ children }: { children: React.ReactNode }) {
  const query = useQuery({
    queryKey: ["userInfo"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API}/user/info`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  if (query.isError) return <Error />;

  if (query.isLoading || query.isPending) return <Loader />;

  return (
    <userInfoContext.Provider
      value={query.data}
    >
      {children}
    </userInfoContext.Provider>
  );
}

export default UserInfoContext;
