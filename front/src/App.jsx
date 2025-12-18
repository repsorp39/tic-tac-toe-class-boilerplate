import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import {
  Login,
  Register,
  NotFound,
  GameArea,
  Dashboard,
  Profil,
  OnlinePlayer,
} from "./pages";
import PrivateRoutes from "./components/PrivateRoutes";
import useAuthContext from "./context/auth";
import Layout from "./components/ui/Layout";
import SocketManager from "./components/SocketManager";

const App = () => {
  const ProtectedRule1 = <PrivateRoutes forLogged={true} redirect="/login" />;
  const ProtectedRule2 = <PrivateRoutes forLogged={false} redirect="/" />;
  const { isLoading, user } = useAuthContext();

  return isLoading ? (
    <div>Chargement...</div>
  ) : (
    <>
      <Router>
        <Routes>
          <Route element={ProtectedRule1}>
            <Route element={<Layout />}>
              <Route path="/game" Component={GameArea} />
              <Route path="/" Component={Dashboard} />
              <Route path="/profile" Component={Profil} />
              <Route path="/online-players" Component={OnlinePlayer} />
            </Route>
          </Route>

          <Route element={ProtectedRule2}>
            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />
          </Route>

          <Route path="*" Component={NotFound} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
