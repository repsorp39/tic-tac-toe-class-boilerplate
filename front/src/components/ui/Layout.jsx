import React from "react";
import SideBar from "./SideBar";
import SocketManager from "../SocketManager";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <section>
      <SideBar />
      <div className="ml-64 p-10">
        <SocketManager />
        <Outlet />
      </div>
    </section>
  );
};

export default Layout;
