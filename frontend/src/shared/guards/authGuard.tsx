import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: JSX.Element;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("currentUser");

    // If user is NOT logged in (no token and no user), redirect to login
    if (!token || !currentUser) {
        return <Navigate to="/login" replace />;
    } 
    
    // If user is logged in, allow access to protected route
    return children;
};

export default AuthGuard;