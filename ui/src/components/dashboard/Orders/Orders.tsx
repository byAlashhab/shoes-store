import Metadata from "@/components/metadata";
import Header from "@/components/ui/header";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { order, ordersContext } from "@/contexts/OrdersContext";
import { DownloadIcon } from "lucide-react";
import { useContext } from "react";
import { jsPDF } from "jspdf";
import QRious from "qrious";
import { twMerge } from "tailwind-merge";

function Orders() {
  const orders = useContext(ordersContext);

  function downloadOrderData(order: order) {
    const doc = new jsPDF();

    const qr = new QRious({
      value: `${order.deliveryOrderId}`, // Content encoded in the QR code
      size: 100, // Size of the QR code
    });

    doc.text(`Name: ${order.userName}`, 10, 20);
    doc.text(`Phone: ${order.userPhoneNumber}`, 10, 35);
    doc.text(`Address: ${order.userAddress}`, 10, 50);
    doc.text(`Order: ${order.shoesName}`, 10, 65);
    doc.text(`Size: ${order.orderedSize}`, 10, 80);
    doc.text(`Size: ${order.orderedAmount}`, 10, 95);

    const qrDataUrl: string = qr.toDataURL();

    doc.addImage(qrDataUrl, "PNG", 150, 30, 50, 50);

    doc.save(`${order.userName.replace(/\s/g, "_")}_order_info.pdf`);
  }

  return (
    <div className="w-full h-full lg:relative px-4">
      <Metadata title="Vuitton - Dashboard - Orders" />
      <Header className="mb-5">Orders</Header>
      {orders.length === 0 ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <img className="size-14" src="../../../SVGs/empty.svg" alt="" />
          <p className="">Empty section</p>
        </div>
      ) : (
        <>
          <Table className="pb-4">
            <TableCaption>A list of all orders</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.userUserName}</TableCell>
                  <TableCell>{order.shoesName}</TableCell>
                  <TableCell>{order.orderedSize}</TableCell>
                  <TableCell>{order.orderedAmount}</TableCell>
                  <TableCell>
                    <span
                      className={twMerge(
                        "text-white py-1 px-2 rounded",
                        order.status === "pending"
                          ? "bg-slate-500"
                          : order.status === "confirmed"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      )}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button onClick={() => downloadOrderData(order)}>
                      <DownloadIcon />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell className="text-right">{orders.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </>
      )}
    </div>
  );
}

export default Orders;
