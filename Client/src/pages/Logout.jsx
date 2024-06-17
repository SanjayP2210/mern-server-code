import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { LogoutUser } from "../constants/utilities";
import { useDispatch } from "react-redux";
import { logoutUser } from "../reducers/authReducer";
import { resetUserState } from "../reducers/userReducer";

export const Logout = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    LogoutUser();
    dispatch(logoutUser());
    dispatch(resetUserState());
  }, [LogoutUser]);

  return <Navigate to="/" />;
};
