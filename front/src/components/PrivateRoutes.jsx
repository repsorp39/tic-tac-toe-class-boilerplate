import React from "react";
import { useState } from "react";
import useAuthContext from "../context";
import { Outlet } from "react-router";
import { Navigate } from "react-router";

const PrivateRoutes = ({ forLogged, redirect }) => {
  const { isLogged } = useAuthContext();

  return isLogged === forLogged ? (
    <Outlet />
  ) : (
    <Navigate to={redirect} replace />
  );
};

export default PrivateRoutes;
