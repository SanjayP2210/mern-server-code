import { NavLink } from "react-router-dom";
import Loader from "../components/Loader/Loader.jsx";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../service/apiService.js";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) toast.error("Please enter email");
    try {
      setLoading(true);
      const response = await apiService.postRequest("auth/forget-password", {
        email: email,
      });
      if (!response.isError) {
        toast.success(`Mail sent successfully to ${email}`);
      }
      setLoading(false);
    } catch (error) {
      toast.error("error while forget password");
      setLoading(false);
    }
  };
  return (
    <>
      <Loader visible={loading} />
      <section>
        <main>
          <div className="container">
            <div className="contact-content">
              <h1 className="main-heading">Forget Password</h1>
            </div>
            {/* <h1 className="main-heading mb-3">login form</h1> */}
            <div className="section-registration">
              <div className="main-container grid grid-two-cols">
                {/* let tackle registration form  */}
                <div className="registration-form">
                  <h2 className="information-text">
                    Enter your registered email to forget your password.
                  </h2>
                  <br />
                  <br />
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email">email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="enter your email"
                        id="email"
                        required
                        autoComplete="off"
                        style={{ width: "60%" }}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                    <br />
                    <button type="submit" className="btn btn-submit">
                      Forget Password
                    </button>
                  </form>
                  <br />
                  <div className="footer">
                    <br />
                    <h5>
                      New here?{" "}
                      <NavLink to="/register">
                        <span className="tooltip-text ">Sign Up</span>
                      </NavLink>
                    </h5>
                    <br />
                    <h5>
                      Already have an account?{" "}
                      <NavLink to="/">
                        <span className="tooltip-text ">Sign In</span>
                      </NavLink>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

export default ForgetPassword;
