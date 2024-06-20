import { useSelector } from "react-redux";
import { UserForm } from "./UserForm";
import Loader from "../components/Loader/Loader";

export const Register = () => {
  return <UserForm isEdit={false} />;
};
