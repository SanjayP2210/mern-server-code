import { useSelector } from "react-redux";
import { Login } from "./Login";
import { Register } from "./Register";
import { useEffect } from "react";
import Loader from "../components/Loader/Loader";

const LoginRegister = () => {
  const { isAdmin, isLoggedIn, loading } = useSelector((state) => state.auth);
  const bodyEle = document.getElementsByTagName("body")[0];
  useEffect(() => {
    // const isHomePage = (window?.location?.pathname = "/");
    if (isLoggedIn) {
      bodyEle.classList.add("banner");
    } else {
      bodyEle.classList.remove("banner");
    }
  }, [bodyEle, location, isLoggedIn]);

  return (
    <div className="login-form">
      <div className="login-container">
        {/* <!-- Sign Up --> */}
        <Loader visible={loading} />
        <div className="container__form container--signup signup-scrollbar">
          <Register bodyEle={bodyEle} />
        </div>

        {/* <!-- Sign In --> */}
        <div className="container__form container--signin">
          <Login bodyEle={bodyEle} />
        </div>

        {/* <!-- Overlay --> */}
        <div className="container__overlay">
          <div className="overlay">
            <div className="overlay__panel overlay--left">
              <button
                className="btn"
                id="signIn"
                onClick={() => {
                  const container = document.querySelector(".login-container");
                  container.classList.remove("right-panel-active");
                }}
              >
                Sign In
              </button>
            </div>
            <div className="overlay__panel overlay--right">
              <button
                className="btn"
                id="signUp"
                onClick={() => {
                  const container = document.querySelector(".login-container");
                  container.classList.add("right-panel-active");
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
