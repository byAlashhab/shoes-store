import Error from "@/components/Error";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

export type usersAnalyticsType = {
  date: string;
  users: number;
};

export const usersAnalyticsContext = createContext<usersAnalyticsType[]>([]);

function UsersAnalyticsContext({ children }: { children: React.ReactNode }) {
  const query = useQuery({
    queryKey: ["usersAnalytics"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API}/user/analytics`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  if (query.isError) return <Error />;

  if (query.isLoading || query.isPending) return <Loader />;

  return (
    <usersAnalyticsContext.Provider value={query.data}>
      {children}
    </usersAnalyticsContext.Provider>
  );
}

export default UsersAnalyticsContext;
