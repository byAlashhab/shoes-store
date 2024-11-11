import { ordersUserContext } from "@/contexts/OrdersUserContext";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, DownloadIcon, Loader2, XCircle } from "lucide-react";
import { useContext, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { jsPDF } from "jspdf";
import QRious from "qrious";
import { Link } from "react-router-dom";

function Cart() {
  const [status, setStatus] = useState("pending");

  const orders = useContext(ordersUserContext).filter(
    (order) => order.status === status
  );

  console.log(orders);

  return (
    <div>
      <h1 className="font-caveat text-6xl py-4 bg-gradient-to-r from-purple-600 to-red-500 inline-block text-transparent bg-clip-text relative left-1/2 -translate-x-1/2 my-4">
        Cart
      </h1>
      <Link to={"/"} className="absolute top-8 right-8">
        <img className="size-8" src="../SVGs/return.svg" alt="" />
      </Link>
      <div className="flex justify-center items-center gap-2">
        <Button
          variant={status == "pending" ? "default" : "outline"}
          onClick={() => setStatus("pending")}
        >
          Pending
        </Button>
        <Button
          variant={status == "confirmed" ? "default" : "outline"}
          onClick={() => setStatus("confirmed")}
        >
          Confirmed
        </Button>
        <Button
          variant={status == "delivered" ? "default" : "outline"}
          onClick={() => setStatus("delivered")}
        >
          Delivered
        </Button>
      </div>
      <div className="">
        {orders.length === 0 ? (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <img className="size-14" src="../../../SVGs/empty.svg" alt="" />
            <p className="">{"Nothing here"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-5 gap-5">
            {orders.map((order) => {
              var item;

              switch (status) {
                case "pending":
                  item = (
                    <OrderPending
                      key={order._id}
                      id={order._id}
                      image={order.shoesImage}
                      title={order.shoesName}
                      size={order.orderedSize}
                      amount={order.orderedAmount}
                    />
                  );
                  break;
                case "confirmed":
                  item = (
                    <OrderConfirmed
                      key={order._id}
                      userOrderId={order.userOrderId}
                      image={order.shoesImage}
                      title={order.shoesName}
                      size={order.orderedSize}
                      amount={order.orderedAmount}
                    />
                  );
                  break;
                case "delivered":
                  item = <OrderDelivered key={order._id} />;
              }

              return item;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderPending({
  id,
  image,
  title,
  size,
  amount,
}: {
  id: string;
  image: string;
  title: string;
  size: string;
  amount: string;
}) {
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);

  const queryClient = useQueryClient();

  async function confirmOrder(id: string) {
    setIsLoadingConfirm(true);

    await fetch(`${import.meta.env.VITE_API}/orders/confirm-order/${id}`, {
      method: "GET",
      credentials: "include",
    });

    await queryClient.invalidateQueries({ queryKey: ["ordersUser"] });

    setIsLoadingConfirm(false);
  }

  async function cancelOrder(id: string) {
    setIsLoadingCancel(true);

    await fetch(`${import.meta.env.VITE_API}/orders/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    await queryClient.invalidateQueries({ queryKey: ["ordersUser"] });

    setIsLoadingCancel(false);
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <img className="w-full h-48 object-cover" src={image} alt={title} />
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Size: {size}</Badge>
          <Badge variant="secondary">Amount: {amount}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-muted/50">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isLoadingCancel || isLoadingConfirm}
            >
              {isLoadingCancel ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Cancel
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">No, keep order</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => cancelOrder(id)}
                disabled={isLoadingCancel}
              >
                {isLoadingCancel ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Yes, cancel order"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={isLoadingCancel || isLoadingConfirm}>
              {isLoadingConfirm ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Confirm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to confirm this order? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">No, I want to check first</Button>
              </DialogClose>
              <Button
                onClick={() => confirmOrder(id)}
                disabled={isLoadingConfirm}
              >
                {isLoadingConfirm ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Yes, Confirm order"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

function OrderConfirmed({
  userOrderId,
  image,
  title,
  size,
  amount,
}: {
  userOrderId: string;
  image: string;
  title: string;
  size: string;
  amount: string;
}) {
  function downloadCode() {
    const doc = new jsPDF();

    const qr = new QRious({
      value: `${userOrderId}`, // Content encoded in the QR code
      size: 100, // Size of the QR code
    });

    const qrDataUrl: string = qr.toDataURL();

    doc.addImage(qrDataUrl, "PNG", 10, 10, 100, 100);

    doc.save(`${title}_order_${size}_${amount}.pdf`);
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <img className="w-full h-48 object-cover" src={image} alt={title} />
      </CardHeader>
      <CardContent className="p-4 flex justify-between items-center">
        <div className="space-y-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Size: {size}</Badge>
            <Badge variant="secondary">Amount: {amount}</Badge>
          </div>
        </div>
        <button onClick={downloadCode}>
          <DownloadIcon />
        </button>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-muted/50">
        <Button className="w-full flex items-center justify-center gap-2 hover:bg-primary">
          <CheckCircle className="h-5 w-5" />
          Order Confirmed
        </Button>
      </CardFooter>
    </Card>
  );
}

function OrderDelivered() {
  return <div>delivered</div>;
}

export default Cart;
