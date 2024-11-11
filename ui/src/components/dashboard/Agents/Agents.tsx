import Metadata from "@/components/metadata";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { agentsContext } from "@/contexts/AgentsContext";
import { PlusCircleIcon } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";

function Agents() {
  const agents = useContext(agentsContext);

  return (
    <div className="w-full lg:relative h-full px-4">
      <Metadata title="Vuitton - Dashboard - Agents" />
      <div className="flex items-center justify-between">
        <Header>Agents</Header>
        <Button asChild>
          <Link className="flex items-center gap-2" to={"add"}>
            <PlusCircleIcon />
            Add
          </Link>
        </Button>
      </div>

      {agents.length == 0 ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <img className="size-14" src="../../../SVGs/empty.svg" alt="" />
          <p className="">Empty section</p>
        </div>
      ) : (
        <Table className="pb-4 mt-8">
            <TableCaption>A list of all orders</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.username}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell className="text-right">{agents.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
      )}
    </div>
  );
}

export default Agents;
