import { jwtDecode } from "jwt-decode";

export default function isLoggedIn() {
  //get token from local storage
  const token = localStorage.getItem('token');

  if(token) {
    try {
      //decode token to obtain payload information; not the same as verifying it
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decoded.exp > currentTime; // Check if token is expired
    } catch (error) {
      console.error("Error decoding JWT:", error.message);
      return false;
    }
  }else {
    return false;
  }
};
