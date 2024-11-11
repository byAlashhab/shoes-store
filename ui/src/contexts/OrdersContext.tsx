import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import Error from "@/components/Error";

export type order = {
  _id: string;
  userId: string;
  userUserName: string;
  userName: string;
  userPhoneNumber: string;
  userAddress: string;
  shoesName: string;
  orderedSize: string;
  orderedAmount: string;
  userOrderId: string;
  deliveryOrderId: string;
  createdAt: string;
  status: "pending" | "confirmed" | "delivered";
};

export const ordersContext = createContext<order[]>([]);

function OrdersContext({ children }: { children: React.ReactNode }) {
  const query = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API}/orders/all`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  if (query.isError) return <Error />;

  if (query.isLoading || query.isPending) return <Loader />;

  return (
    <ordersContext.Provider value={query.data}>
      {children}
    </ordersContext.Provider>
  );
}

export default OrdersContext;
