import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useSelector } from "react-redux";
import { LogoutSVG } from "../../assets/images/svg/LogoutSVG.jsx";
import { LoginSVG } from "../../assets/images/svg/LoginSVG.jsx";
import { useEffect } from "react";
import defaultImage from "../../assets/images/png/default_profile.png";

export const Navbar = () => {
  const {
    isAdmin,
    isLoggedIn,
    loginUserData: user,
  } = useSelector((state) => state.auth);
  const location = useLocation();
  const bodyEle = document.getElementsByTagName("body")[0];
  useEffect(() => {
    // const isHomePage = (window?.location?.pathname = "/");
    if (location?.pathname === "/" && isLoggedIn) {
      bodyEle.classList.add("banner");
    } else {
      bodyEle.classList.remove("banner");
    }
  }, [bodyEle, location]);

  return (
    <>
      <header>
        <div className="nav-container">
          <div className="logo-brand">
            <NavLink to="/">
              <h3>MERN Demo</h3>
            </NavLink>
          </div>
          <nav>
            <ul>
              <li>
                <NavLink to="/home"> Home </NavLink>
              </li>
              {isLoggedIn ? (
                <>
                  {/* <li>
                    <NavLink
                      className={
                        location.pathname.includes("book") ? "active" : ""
                      }
                      activeclassname="active"
                      to="/book"
                    >
                      {" "}
                      Book{" "}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      activeclassname="active"
                      className={
                        location.pathname.includes("author") ? "active" : ""
                      }
                      to="/author"
                    >
                      {" "}
                      Author{" "}
                    </NavLink>
                  </li> */}
                  {/* <li>
                    <NavLink
                      to="/contact"
                      activeclassname="active"
                      className={
                        location.pathname.includes("contact") ? "active" : ""
                      }
                    >
                      {" "}
                      Contact{" "}
                    </NavLink>
                  </li> */}
                  {isAdmin && Boolean(isAdmin) && (
                    <li>
                      <NavLink
                        to="/admin/users"
                        activeclassname="active"
                        className={
                          location.pathname.includes("user") ? "active" : ""
                        }
                      >
                        Users
                      </NavLink>
                    </li>
                  )}
                  {/* <li>
                    <NavLink to="/profile" activeclassname="active">
                      {" "}
                      Profile{" "}
                    </NavLink>
                  </li> */}
                  <li>
                    <NavLink to="/reset-password"> Reset Password </NavLink>
                  </li>
                  <li>
                    <NavLink to="/profile">
                      {" "}
                      <img
                        className="nav-profile-image"
                        src={`${
                          user?.image?.url &&
                          user?.image?.url?.includes("res.cloudinary.com")
                            ? user?.image?.url
                            : defaultImage
                        }`}
                        alt="profile image"
                      />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/logout" className="tooltip">
                      {" "}
                      <span className="tooltip-text ">Log Out</span>
                      <LogoutSVG height="22px" width="22px" />{" "}
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/contact"
                      activeclassname="active"
                      className={
                        location.pathname.includes("contact") ? "active" : ""
                      }
                    >
                      {" "}
                      Contact{" "}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/register"> Sign Up </NavLink>
                  </li>
                  <li>
                    <NavLink to="/forget-password"> Forget Password </NavLink>
                  </li>
                  <li>
                    <NavLink to="/" className="tooltip">
                      {" "}
                      <span className="tooltip-text ">Sign In</span>
                      <LoginSVG height="22px" width="22px" />{" "}
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};
