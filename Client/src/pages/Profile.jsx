import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiService from "../service/apiService";
import Loader from "../components/Loader/Loader";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchUsersById } from "../reducers/userReducer";
import defaultImage from "../assets/images/png/default_profile.png";
const Profile = () => {
  const dispatch = useDispatch();
  const { loginUserData } = useSelector((state) => state.auth);
  const [technology, setTechnology] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
    mobileNumber: "",
    technology: [],
    isAdmin: false,
  });
  const { userData, isUserUpdated, loading } = useSelector(
    (state) => state.user
  );
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    const fetchTechnology = async () => {
      const response = await apiService.getRequest("technology");
      const techs =
        response?.Technology.filter((x) =>
          user?.technology?.includes(x?._id)
        ) || [];
      setTechnology(techs);
      setIsLoading(false);
    };
    fetchTechnology();
  }, []);

  useEffect(() => {
    dispatch(fetchUsersById(loginUserData?._id));
  }, [loginUserData?._id]);

  useEffect(() => {
    if (userData) {
      const ids = userData?.technology?.map((x) => x._id);
      setUser({
        ...userData,
        technology: ids,
      });
    }
  }, [userData]);

  return (
    <>
      <Loader visible={isLoading} />
      <div className="login-form">
        <div className="profile-container">
          {/* <!-- Sign Up --> */}

          {/* <!-- Sign In --> */}

          {/* <!-- Overlay --> */}
          <div className="container__overlay">
            <div className="overlay">
              <div className="overlay__panel overlay--right">
                <div className="profile-image">
                  <img
                    src={`${
                      user?.image?.url &&
                      user?.image?.url?.includes("res.cloudinary.com")
                        ? user?.image?.url
                        : defaultImage
                    }`}
                    alt="profile image"
                  />
                </div>
                <div className="profile-details">
                  {/* <h1 className="main-heading mb-3">User Details</h1> */}
                  <p className="user-name">{user?.userName}</p>
                  <br />
                  <p>{user?.email}</p>
                  <br />
                  <p>{user?.mobileNumber}</p>
                  <br />
                  <div className="technology-div">
                    {technology.map((item, index) => {
                      return <p key={index}>{item.name}</p>;
                    })}
                  </div>
                  <br />
                  <div>
                    <button
                      type="button"
                      className="btn"
                      style={{ marginRight: "10px" }}
                      onClick={() => {
                        navigate(`/user/${user._id}/edit`);
                      }}
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <main>
        <section>
          <div className="login-form">
            <div className="profile-container">
              <div className="profile-card">
                <div className="">
                  <div className="profile-image">
                    <img
                      src={`${
                        user?.image
                          ? `http://localhost:3001/${user.image}`
                          : null
                      }`}
                      alt="profile image"
                    />
                  </div>
                  <div className="profile-details">
                    <p className="user-name">{user?.userName}</p>
                    <br />
                    <p>{user?.email}</p>
                    <br />
                    <p>{user?.mobileNumber}</p>
                    <br />
                    <div className="technology-div">
                      {technology.map((item, index) => {
                        return <p key={index}>{item.name}</p>;
                      })}
                    </div>
                    <br />
                    <div>
                      <button
                        type="button"
                        className="btn"
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                          navigate(`/admin/user/${user._id}/edit`);
                        }}
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main> */}
    </>
  );
};

export default Profile;
