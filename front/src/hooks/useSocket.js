import { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import useAuthContext from "../context/auth";

let socketConnexion = null;

function useSocket() {
  const [ioConnexion, setIoConnexion] = useState(null);
  const { isLogin } = useAuthContext();

  function connect() {
    if (socketConnexion) setIoConnexion(socketConnexion);
    else {
      try {
        socketConnexion = io(import.meta.env.VITE_API_URL, {
          auth: {
            token: localStorage.getItem("token"),
          },
        });
        setIoConnexion(socketConnexion);
      } catch (error) {
        console.log(error);
        setIoConnexion(null);
      }
    }
  }

  useEffect(() => {
    connect();
  }, [isLogin]);
  return ioConnexion;
}

export default useSocket;