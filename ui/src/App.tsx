import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import AuthContext from "./contexts/AuthContext";
import UserInfoContext from "./contexts/UserInfoContext";
import Dashboard from "./components/dashboard/Dashboard";
import ShoesAdmin from "./components/dashboard/Shoes/Shoes";
import Users from "./components/dashboard/Users/Users";
import Orders from "./components/dashboard/Orders/Orders";
import Analytics from "./components/dashboard/Analytics";
import Info from "./components/dashboard/Info";
import AddShoes from "./components/dashboard/Shoes/Add";
import AddAgents from "./components/dashboard/Agents/Add";
import ShoesContext from "./contexts/ShoesContext";
import Update from "./components/dashboard/Shoes/Update";
import ShoesUser from "./components/Shoes";
import Purchase from "./components/Purchase";
import { Toaster } from "./components/ui/toaster";
import Cart from "./components/Cart";
import OrdersUserContext from "./contexts/OrdersUserContext";
import Agents from "./components/dashboard/Agents/Agents";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext>
        <UserInfoContext>
          <ShoesContext>
            <OrdersUserContext>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/shoes" element={<ShoesUser />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/purchase/:id" element={<Purchase />} />
                <Route path="/dashboard" element={<Dashboard />}>
                  <Route path="" element={<Info />} />
                  <Route path="agents" element={<Agents />} />
                  <Route path="agents/add" element={<AddAgents />} />
                  <Route path="shoes" element={<ShoesAdmin />} />
                  <Route path="shoes/:id" element={<Update />} />
                  <Route path="shoes/add" element={<AddShoes />} />
                  <Route path="users" element={<Users />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
              </Routes>
            </OrdersUserContext>
            <Toaster />
          </ShoesContext>
        </UserInfoContext>
      </AuthContext>
    </QueryClientProvider>
  );
}

export default App;
