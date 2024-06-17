import { Navigate, Outlet } from "react-router-dom";
import { LogoutUser, getJWTToken } from "../constants/utilities";
import { toast } from "react-toastify";
import { Navbar } from "../components/Navbar/Navbar";
import { useDispatch } from "react-redux";
import { logoutUser } from "../reducers/authReducer";
import { resetUserState } from "../reducers/userReducer";

const privateRouter = () => {
  const token = getJWTToken();
  const dispatch = useDispatch();
  if (!token) {
    toast.error("token not available.please login again");
    LogoutUser();
    dispatch(logoutUser());
    dispatch(resetUserState());
  }
  return token ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default privateRouter;
