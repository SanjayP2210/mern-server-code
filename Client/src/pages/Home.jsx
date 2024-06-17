import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export const Home = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const bodyEle = document.getElementsByTagName("body")[0];
  useEffect(() => {
    if (isLoggedIn) {
      bodyEle.classList.add("banner");
    } else {
      bodyEle.classList.remove("banner");
    }
  }, [bodyEle, location, isLoggedIn]);

  return (
    <section>
      <main>
        <div className="container">
          {/* <h1 className="main-heading mb-3">login form</h1> */}
          <div className="section-registration">
            {/* let tackle registration form  */}
            <div className="registration-form" style={{ marginTop: "20%" }}>
              <h1>Design Your House</h1>
              <p>
                By using our website you can design your own website very
                beautiful. <br /> Lorem, ipsum dolor sit amet consectetur
                adipisicing elit.{" "}
              </p>
              <div>
                <br />
                <br />
                <button
                  type="button"
                  onClick={() => {
                    navigate("/contact");
                  }}
                >
                  connect now{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};
