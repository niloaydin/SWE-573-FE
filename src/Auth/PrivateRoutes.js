import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./UseAuth";

function PrivateRoutes() {
  const token = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
