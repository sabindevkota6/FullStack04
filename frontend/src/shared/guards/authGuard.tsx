import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: JSX.Element;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");

    // redirect to login if no token
    if (!token || !currentUser) {
        return <Navigate to="/login" replace />;
    } 

    // allow access to protected route if token and user exist
    return children;
};

export default AuthGuard;