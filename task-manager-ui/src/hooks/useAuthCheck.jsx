import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export function useAuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000;
      const now = Date.now();

      if (now > exp) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        // Set a timeout to auto-logout when token expires
        const timeout = exp - now;
        const timer = setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/");
        }, timeout);

        // Cleanup the timeout on unmount
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);
}
