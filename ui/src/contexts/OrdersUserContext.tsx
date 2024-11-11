import Error from "@/components/Error";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

export type ordersUserContextType = {
  _id: string;
  userId: string;
  userUserName: string;
  userName: string;
  userPhoneNumber: string;
  userAddress: string;
  shoesName: string;
  shoesImage: string;
  orderedSize: string;
  orderedAmount: string;
  userOrderId: string;
  createdAt: string;
  status: "pending" | "confirmed" | "delivered";
};

export const ordersUserContext = createContext<ordersUserContextType[]>([]);

function OrdersUserContext({ children }: { children: React.ReactNode }) {
  const query = useQuery({
    queryKey: ["ordersUser"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API}/orders/my-orders`, {
        method: "GET",
        credentials: "include",
      }).then((data) => data.json()),
  });

  if (query.isError) return <Error />;

  if (query.isLoading || query.isPending) return <Loader />;

  return (
    <ordersUserContext.Provider value={query.data}>
      {children}
    </ordersUserContext.Provider>
  );
}

export default OrdersUserContext;
