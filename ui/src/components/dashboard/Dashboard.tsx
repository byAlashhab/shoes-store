import OrdersContext from "@/contexts/OrdersContext";
import { userInfoContext } from "@/contexts/UserInfoContext";
import UsersContext from "@/contexts/UsersContext";
import clsx from "clsx";
import { useContext, useLayoutEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Metadata from "../metadata";
import UsersAnalyticsContext from "@/contexts/UsersAnalyticsContext";
import OrdersAnalyticsContext from "@/contexts/OrdersAnalyticsContext";
import AgentsContext from "@/contexts/AgentsContext";

const links = [
  { id: 1, title: "Information", icon: "../../SVGs/info.svg" },
  { id: 2, title: "Agents", icon: "../../SVGs/agents.svg" },
  { id: 3, title: "Shoes", icon: "../../SVGs/shoes.svg" },
  { id: 4, title: "Users", icon: "../../SVGs/users.svg" },
  { id: 5, title: "Orders", icon: "../../SVGs/orders.svg" },
  { id: 6, title: "Analytics", icon: "../../SVGs/analytics.svg" },
];

function Dashboard() {
  const user = useContext(userInfoContext);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (user.role !== "admin") {
      navigate("/");
    }
  }, []);

  return (
    <UsersContext>
      <AgentsContext>
        <UsersAnalyticsContext>
          <OrdersAnalyticsContext>
            <OrdersContext>
              <div className="flex p-4 lg:p-6 w-screen h-screen justify-between flex-col-reverse  lg:flex-row">
                <Metadata title="Vuitton - Dashboard" />
                <nav className="flex justify-between mt-4 lg:mt-0 shadow-slate-950 lg:flex-col gap-2 bg-slate-100 rounded-lg p-2 lg:p-4 min-w-[230px]">
                  {links.map((link) => (
                    <NavLink
                      key={link.id}
                      title={link.title}
                      icon={link.icon}
                    />
                  ))}
                  <a
                    href={`${import.meta.env.VITE_UI}`}
                    className="items-center gap-5 hover:bg-slate-200 py-1 px-2 lg:py-2 lg:px-4 rounded-lg mt-auto hidden sm:flex"
                  >
                    <img
                      className="size-8"
                      src="../../SVGs/return.svg"
                      alt=""
                    />
                    <p className="font-semibold hidden lg:block">Return</p>
                  </a>
                </nav>
                <div className="overflow-y-auto w-full">
                  <Outlet />
                </div>
              </div>
            </OrdersContext>
          </OrdersAnalyticsContext>
        </UsersAnalyticsContext>
      </AgentsContext>
    </UsersContext>
  );
}

export default Dashboard;

function NavLink({ icon, title }: { icon: string; title: string }) {
  const location = useLocation();

  return (
    <Link
      to={title === "Information" ? "" : title.toLowerCase()}
      className={clsx(
        "flex items-center gap-5 hover:bg-slate-200 py-1 px-2 lg:py-2 lg:px-4 rounded-lg",
        location.pathname.endsWith(title.toLowerCase()) && "bg-slate-200",
        location.pathname.endsWith("dashboard") &&
          title === "Information" &&
          "bg-slate-200"
      )}
    >
      <img className="size-8" src={icon} alt="" />
      <p className="font-semibold hidden lg:block">{title}</p>
    </Link>
  );
}
