import React from "react";
import Breadcrumb from "../../components/Breadcrumb";
import TopStat from "./TopStat";
import { Archive, Wallet, Invoice, ArrowRight } from "../../svg";
import Highlight from "../Dashboard/Main/Highlight";
import RecentSalesTable from "./RecentSales";

const Shopping = () => {
  return (
    <div className="flex flex-col w-full items-start">
      <Breadcrumb
        parentText="Shopping"
        parentLink="/shopping"
        // childLink="/shopping"
        // childText="Shopping"
      />
      <div className="flex w-full justify-between md:justify-around md:flex-wrap">
        <TopStat
          title="Inventory"
          value={5009}
          caption="Total items in inventory"
          svg={<Archive color="#8661ff" scale={1.5} />}
          color="purple"
          link="/shopping/inventory"
          linkText="Manage"
        />
        <TopStat
          title="Orders"
          value={273}
          caption="Total items sold in orders"
          svg={<Invoice color="#8661ff" scale={1.7} />}
          color="purple"
          link="/shopping/orders"
          linkText="View"
        />
        <TopStat
          title="Sales"
          value={"₦230,690"}
          caption="Total sales made in last 24 hours"
          svg={<Wallet color="#8661ff" scale={1} />}
          color="purple"
        />
      </div>

      <div className="flex pt-12 w-full md:flex-col md:items-center">
        <div className="tracking-wide md:w-6/12 sm:w-10/12">
          <Highlight />
        </div>
        <div className="mx-4 md:-mx-6 md:mt-6 md:bg-white md:py-8 md:px-4" style={{ width: 'calc(100% + 3rem)'}}>
          <h3 className="text-2xl md:pb-6 md:bg-white tracking-wider">
            Recent Sales
          </h3>
          <div className="mt-5 py-8 px-10 md:py-0 md:px-0 md:mt-0 rounded-3xl md:rounded-none bg-white">
            <RecentSalesTable />
            <div className="flex justify-between mt-8 pb-8 w-full">
              <span className="text-gray-500">Showing 8 of 100</span>
              <div className="flex items-center text-purple-500">
                See all &nbsp; <ArrowRight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shopping;
