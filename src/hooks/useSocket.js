import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socketClient } from "../utils/socketClient";

export const useSocket = () => {
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (user?.token) {
      socketClient.connect(user.token);
    }

    return () => {
      socketClient.disconnect();
    };
  }, [user?.token]);

  return socketClient;
};