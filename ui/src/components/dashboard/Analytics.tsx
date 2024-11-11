import React, { useContext } from "react";
import Header from "../ui/header";
import Metadata from "../metadata";
import { AxisOptions, Chart } from "react-charts";
import {
  usersAnalyticsType,
  usersAnalyticsContext,
} from "@/contexts/UsersAnalyticsContext";
import {
  ordersAnalyticsContext,
  ordersAnalyticsType,
} from "@/contexts/OrdersAnalyticsContext";
import Loader from "../Loader";

function Analytics() {
  return (
    <div className="relative px-4 w-full pb-4">
      <Metadata title="Vuitton - Dashboard - Analytics" />
      <Header>Analytics</Header>

      <div className="flex flex-col xl:flex-row mt-4 justify-between gap-10">
        <div>
          <h2 className="text-center font-thin">Users</h2>
          <UsersChart />
        </div>

        <div>
          <h2 className="text-center font-thin">Orders</h2>
          <OrdersChart />
        </div>
      </div>
      <h2 className="text-center my-5 italic text-lg">Data from last week</h2>
    </div>
  );
}

function UsersChart() {
  const usersAnalytics = useContext(usersAnalyticsContext);

  const primaryAxis = React.useMemo(
    (): AxisOptions<usersAnalyticsType> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    (): AxisOptions<usersAnalyticsType>[] => [
      {
        getValue: (datum) => datum.users,
        min: 0,
        stacked: true,
      },
    ],
    []
  );

  const isDataEmpty = !usersAnalytics || usersAnalytics.length === 0;

  return (
    <>
      {usersAnalytics ? (
        <div className="w-full h-[475px] xl:w-[475px] xl:h-[475px]">
          <Chart
            options={{
             
              data: isDataEmpty
                ? [{ label: "Users", data: [{ date: "", users: 0 }] }]
                : [{ label: "Users", data: usersAnalytics }],
              primaryAxis,
              secondaryAxes,
              defaultColors: ["#f59e0b"],
            }}
          />
          {isDataEmpty && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">No Users available</p>
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

function OrdersChart() {
  const ordersAnalytics = useContext<ordersAnalyticsType[]>(
    ordersAnalyticsContext
  );

  console.log(ordersAnalytics);
  

  const primaryAxis = React.useMemo(
    (): AxisOptions<ordersAnalyticsType> => ({
      getValue: (datum) => datum.date,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    (): AxisOptions<ordersAnalyticsType>[] => [
      {
        getValue: (datum) => datum.orders,
        min: 0,
        stacked: true,
      },
    ],
    []
  );

  const isDataEmpty = !ordersAnalytics || ordersAnalytics.length === 0;

  return (
    <>
      {ordersAnalytics ? (
        <div className="w-full h-[475px] xl:w-[475px] xl:h-[475px]">
          <Chart
            options={{
              //@ts-ignore
              data: isDataEmpty
                ? [{ label: "Orders", data: [{ date: "", orders: 0 }] }]
                : [{ label: "Orders", data: ordersAnalytics }],
              primaryAxis,
              secondaryAxes,
              defaultColors: ["#f59e0b"],
            }}
          />
          {isDataEmpty && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">No Orders available</p>
            </div>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Analytics;
