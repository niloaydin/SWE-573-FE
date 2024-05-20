import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const token = localStorage.getItem("token");

  if (token) {
    const decodedToken = jwtDecode(token);

    if (decodedToken.exp) {
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime > decodedToken.exp) {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
};
