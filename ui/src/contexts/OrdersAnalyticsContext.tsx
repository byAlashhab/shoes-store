import Error from "@/components/Error";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

export type ordersAnalyticsType = {
  date: Date;
  orders: number;
};

export const ordersAnalyticsContext = createContext<ordersAnalyticsType[]>([]);

function OrdersAnalyticsContext({ children }: { children: React.ReactNode }) {
  const query = useQuery({
    queryKey: ["ordersAnalytics"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API}/orders/analytics`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  if (query.isError) return <Error />;

  if (query.isLoading || query.isPending) return <Loader />;

  return (
    <ordersAnalyticsContext.Provider value={query.data}>
      {children}
    </ordersAnalyticsContext.Provider>
  );
}

export default OrdersAnalyticsContext;
