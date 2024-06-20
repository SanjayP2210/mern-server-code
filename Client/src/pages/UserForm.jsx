import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchUsersById,
  resetUserState,
  updateUser,
} from "../reducers/userReducer";
import {
  addUser,
  resetState,
  updateLoginUserData,
} from "../reducers/authReducer.js";
import apiService from "../service/apiService.js";
import UploadImage from "../components/UploadImage/UploadImage";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Loader from "../components/Loader/Loader.jsx";
import { checkPassword } from "../constants/utilities.js";
import Password from "../components/Password/password.jsx";
import { SelectComponent } from "../components/Select/Select.jsx";

const animatedComponents = makeAnimated();

export const UserForm = ({ isEdit = false, bodyEle }) => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const [data, setData] = useState({
    userName: "",
    email: "",
    password: "",
    mobileNumber: "",
    technology: [],
    isAdmin: false,
  });
  const [technology, setTechnology] = useState([]);
  const [image, setImage] = useState(null);
  const { userData, isUserUpdated, loading, user } = useSelector(
    (state) => state.user
  );
  const { isAdmin, isLoggedIn } = useSelector((state) => state.auth);
  const [isLoginUser, setIsLoginUser] = useState(true);
  const { loginUserData, isUserAdded } = useSelector((state) => state.auth);
  const roleOptions = [
    { label: "Admin", value: true },
    { label: "User", value: false },
  ];
  const userID = params?.id;
  let bars = document.querySelector("#bars");
  let strengthDiv = document.querySelector("#strength");
  useEffect(() => {
    if (!isEdit) return;
    dispatch(fetchUsersById(userID, loginUserData?._id === userData?._id));
    setImage(null);
  }, [userID]);

  useEffect(() => {
    if (!isEdit) return;
    if (userData?._id) {
      setImage(userData?.image?.url);
      const ids = userData?.technology?.map((x) => x._id);
      setData({
        ...userData,
        technology: ids,
      });
      setIsLoginUser(loginUserData?._id === userData._id);
    }
  }, [userData]);

  useEffect(() => {
    if (!isEdit) return;
    if (technology?.length > 0) {
      const filterdList =
        userData?.technology?.map((x) => {
          return { label: x.name, value: x.name, _id: x._id };
        }) || [];
      console.log("filterdList", filterdList);
      setSelectedTechnology(filterdList);
    }
  }, [technology]);

  useEffect(() => {
    bars = document.querySelector("#bars");
    strengthDiv = document.querySelector("#strength");
    const fetchTechnology = async () => {
      const response = await apiService.getRequest("technology");
      setTechnology(
        response?.Technology.map((x) => {
          return { label: x.name, value: x.name, _id: x._id };
        }) || []
      );
    };
    fetchTechnology();
    return () => {
      setData({
        userName: "",
        email: "",
        password: "",
        mobileNumber: "",
      });
      setImage(null);
      setSelectedTechnology([]);
    };
  }, []);

  const handleInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "password") {
      const strengthText = checkPassword(value);

      bars.classList = "";

      if (strengthText) {
        strengthDiv.innerText = `${strengthText} Password`;
        strengthDiv.classList.add(strengthText);
        bars.classList.add(strengthText);
      } else {
        strengthDiv.innerText = "";
      }
    }
    setData({
      ...data,
      [name]: value,
    });
  };

  useEffect(() => {
    if (isUserUpdated && user) {
      toast.success("User Updated Successfully");
      let admin = isAdmin;
      if (loginUserData?._id === data._id) {
        dispatch(updateLoginUserData(user));
        admin = user?.isAdmin === "true";
      }
      dispatch(resetUserState());
      navigate(-1);
      // if (admin) {
      //   navigate("/admin/users");
      // } else {
      //   navigate("/profile");
      // }
    }
  }, [isUserUpdated]);

  useEffect(() => {
    if (isUserAdded) {
      setData({
        userName: "",
        email: "",
        password: "",
        mobileNumber: "",
      });
      dispatch(resetState());
      setSelectedTechnology([]);
      setImage(null);
      if (location?.pathname === "/") {
        const container = document.querySelector(".login-container");
        container.classList.remove("right-panel-active");
      } else {
        navigate("/");
      }
    }
    return () => {
      setData({
        userName: "",
        email: "",
        password: "",
        mobileNumber: "",
      });
      setImage(null);
      setSelectedTechnology([]);
    };
  }, [isUserAdded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data", data);

    try {
      if (selectedTechnology?.length === 0) {
        toast.error("select any technology");
        return;
      }
      if (!image) {
        toast.error("User Image is required");
        return;
      }
      const formData = new FormData();
      const formKeys = Object.keys(data);
      formKeys.forEach((key) => {
        if (key === "image") {
          // let imageList = [];
          // if (image?.length > 0) {
          //   imageList = image?.map((img) => {
          //     // formData.append("image", img);
          //     const imageData = img.startsWith("https://res.cloudinary.com")
          //       ? userData.image.filter((x) => {
          //           return x.url === img ? x : null;
          //         })
          //       : null;
          //     return imageData === null
          //       ? { public_id: null, image: img }
          //       : imageData[0];
          //   });
          // } else {
          //   imageList = [{ public_id: null, image: img }];
          // }
          // formData.append("image", JSON.stringify(imageList));
          if (!image.startsWith("https://res.cloudinary.com")) {
            formData.append("newImage", image);
          }
          formData.append("image", JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      if (isEdit) {
        dispatch(updateUser({ formData: formData, userID: userData?._id }));
      } else {
        formData.append("image", image);
        dispatch(addUser(formData));
      }
    } catch (error) {
      console.log("getting error while submitting");
      toast.error(error.message);
    }
  };

  const [selectedTechnology, setSelectedTechnology] = useState([]);
  const onSelectRole = (newValue, actionMeta) => {
    console.log("newValue", newValue);
    setData({
      ...data,
      isAdmin: Boolean(newValue.value),
    });
  };

  const onSelectTechnologies = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        newValue = technology.filter((v) => v.isFixed);
        break;
    }
    console.log("newValue", newValue);
    setSelectedTechnology(newValue);
    setData({
      ...data,
      technology: newValue.map((x) => x._id),
    });
  };

  const renderButton = () => {
    let content = <></>;
    if (isEdit) {
      content = (
        <>
          <button
            type="button"
            className="btn"
            style={{ marginRight: "10px" }}
            onClick={() => {
              // navigate("/admin/users");
              navigate(-1);
              // if (loginUserData?._id === data._id && data?.isAdmin) {
              //   navigate("/admin/users");
              // } else {
              //   navigate("/profile");
              // }
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-submit">
            Update
          </button>
        </>
      );
    } else {
      content = (
        <button type="submit" className="btn btn-submit">
          Register Now
        </button>
      );
    }
    return content;
  };

  return (
    <>
      <Loader visible={loading} />
      {location?.pathname === "/" ? (
        <div>
          <form onSubmit={handleSubmit} className="form" id="form1">
            <h2 className="form__title">Sign Up</h2>
            <div className="form-div">
              <input
                type="text"
                name="userName"
                placeholder="userName"
                id="userName"
                required
                autoComplete="off"
                value={data.userName}
                onChange={handleInput}
                disabled={!isLoginUser}
              />
            </div>

            <div className="form-div">
              <input
                type="email"
                name="email"
                placeholder="enter your email"
                id="email"
                required
                autoComplete="off"
                value={data.email}
                onChange={handleInput}
                disabled={!isLoginUser}
              />
            </div>
            <div className="form-div">
              <input
                type="number"
                name="mobileNumber"
                placeholder="mobileNumber"
                id="mobileNumber"
                required
                autoComplete="off"
                value={data.mobileNumber}
                maxLength={10}
                onChange={handleInput}
                disabled={!isLoginUser}
              />
            </div>
            <div className="form-div">
              <Password
                data={data}
                lableShow={false}
                handleInput={handleInput}
                isLoginUser={isLoginUser}
                eyeStyle={{ top: "55%" }}
              />
            </div>
            <div className="form-div" style={{ color: "black" }}>
              <SelectComponent
                onChange={onSelectTechnologies}
                value={selectedTechnology}
                options={technology}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    fontSize: "14px",
                  }),
                }}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 8,
                  colors: {
                    ...theme.colors,
                    primary25: "#b5b5b55e",
                    primary: "black",
                  },
                })}
                name="technology"
                id="technology"
              />
              <br />
            </div>
            <div className="singup-button-color">
              <UploadImage multiple={false} setImage={setImage} data={data} />
            </div>
            {/* <UploadImage setImage={setImage} image={null} data={null} /> */}
            {renderButton()}
            <br />
            <br />
          </form>
        </div>
      ) : (
        <section>
          <main>
            <div className="container">
              <div className="contact-content">
                <h1 className="main-heading">
                  {isEdit ? "User Form" : "Registration form"}
                </h1>
              </div>
              <div className="section-registration">
                <div className="main-container grid grid-two-cols">
                  {/* let tackle registration form  */}
                  <div className="registration-form">
                    <form onSubmit={handleSubmit}>
                      <div>
                        <label htmlFor="userName">User Name</label>
                        <input
                          type="text"
                          name="userName"
                          placeholder="userName"
                          id="userName"
                          required
                          autoComplete="off"
                          value={data.userName}
                          onChange={handleInput}
                          disabled={!isLoginUser}
                        />
                      </div>

                      <div>
                        <label htmlFor="email">email</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="enter your email"
                          id="email"
                          required
                          autoComplete="off"
                          value={data.email}
                          onChange={handleInput}
                          disabled={!isLoginUser}
                        />
                      </div>
                      <div>
                        <label htmlFor="mobileNumber">mobile Number</label>
                        <input
                          type="number"
                          name="mobileNumber"
                          placeholder="mobileNumber"
                          id="mobileNumber"
                          required
                          autoComplete="off"
                          value={data.mobileNumber}
                          maxLength={10}
                          onChange={handleInput}
                          disabled={!isLoginUser}
                        />
                      </div>
                      {!isLoggedIn && (
                        <>
                          <Password
                            data={data}
                            lableShow={true}
                            handleInput={handleInput}
                            isLoginUser={isLoginUser}
                            eyeStyle={{ top: "55%" }}
                          />
                        </>
                      )}
                      {isAdmin && (
                        <div>
                          <label htmlFor="authorId">Role</label>
                          <Select
                            id="isAdmin"
                            name="isAdmin"
                            value={
                              data?.isAdmin ? roleOptions[0] : roleOptions[1]
                            }
                            options={roleOptions}
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: "black",
                                borderColor: state.isFocused ? "grey" : "white",
                                fontSize: "14px",
                                container: "black",
                              }),
                            }}
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 8,
                              colors: {
                                ...theme.colors,
                                primary25: "#b5b5b55e",
                                primary: "#b5b5b55e",
                              },
                            })}
                            onChange={onSelectRole}
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>
                      )}
                      <div>
                        <label htmlFor="authorId">Technology</label>
                        <SelectComponent
                          onChange={onSelectTechnologies}
                          value={selectedTechnology}
                          options={technology}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              backgroundColor: "black",
                              borderColor: state.isFocused ? "grey" : "white",
                              fontSize: "14px",
                              container: "black",
                              fontColor: "blue",
                              color: "blue",
                            }),
                          }}
                          name="technology"
                          id="technology"
                          theme={(theme) => ({
                            ...theme,
                            borderRadius: 8,
                            colors: {
                              ...theme.colors,
                              primary25: "#b5b5b55e",
                              primary: "white",
                            },
                          })}
                          closeMenuOnSelect={true}
                          components={animatedComponents}
                          isMulti
                          disabled={!isLoginUser}
                          isDisabled={!isLoginUser}
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      </div>
                      <div>
                        <br />
                        <UploadImage
                          setImage={setImage}
                          multiple={false}
                          data={data}
                          disabled={!isLoginUser}
                        />
                        {/* <UploadImage setImage={setImage} image={null} data={null} /> */}
                      </div>
                      <br />
                      {renderButton()}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </section>
      )}
    </>
  );
};
