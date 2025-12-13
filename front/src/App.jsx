import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import GameArea from "./pages/GameArea";
import PrivateRoutes from "./components/PrivateRoutes";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import OnlinePlayer from "./pages/OnlinePlayer";
import useAuthContext from "./context";
import Layout from "./components/ui/Layout";

const App = () => {
  const ProtectedRule1 = <PrivateRoutes forLogged={true} redirect="/login" />;
  const ProtectedRule2 = (
    <PrivateRoutes forLogged={false} redirect="/" />
  );
  const { isLoading } = useAuthContext();
  return isLoading ? (
    <div>Chargement...</div>
  ) : (
    <Router>
      <Routes>
        <Route element={ProtectedRule1}>
          <Route element={<Layout />}>
            <Route path="/game" Component={GameArea} />
            <Route path="/" Component={Dashboard} />
            <Route path="/profile" Component={Profile} />
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
  );
};

export default App;
