import React from "react";
import useAuthContext from "../context/auth";
import { Outlet, Navigate } from "react-router";

const PrivateRoutes = ({ forLogged, redirect }) => {
  const { isLogged } = useAuthContext();

  return isLogged === forLogged ? (
    <Outlet />
  ) : (
    <Navigate to={redirect} replace />
  );
};

export default PrivateRoutes;
