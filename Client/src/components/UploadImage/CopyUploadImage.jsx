// src/App.js
import { useState, useEffect, useMemo, useRef } from "react";
// import apiService, { BASE_URL, apiRequest } from "../../service/apiService";
// import { useSelector } from "react-redux";
// import { FaTrash } from "react-icons/fa";
// import { toast } from "react-toastify";
import "./UploadImage.css";
import { toast } from "react-toastify";

const UploadImage = () => {
  // const { isAdmin, isLoggedIn } = useSelector((state) => state.auth);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  // const [users, setUsers] = useState([]);
  const [fileUploading, setFileUploading] = useState(false);
  const imageRef = useRef(null);
  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const uploadFile = (e) => {
    const selectedFile = e.target.files[0];
    const value = e.target.value;
    var ext = value.split(".").pop().toLowerCase();
    if (!["gif", "png", "jpg", "jpeg"].includes(ext)) {
      toast.error("Only gif, png, jpg,jpeg files are supported");
    } else {
      // btnOuter.addClass("file_uploading");
      setFileUploading(true);
      var uploadedFile = URL.createObjectURL(e.target.files[0]);
      setTimeout(function () {
        setPreviewImage(uploadedFile);
        setImage(selectedFile);
        imageRef.current.value = null;
      }, 3500);
    }
  };
  const removeFile = (e) => {
    e.preventDefault();
    setImage(null);
    setPreviewImage(null);
    setFileUploading(false);
  };

  // const fetchUsers = async () => {
  //   const response = await apiService.getRequest("user/upload-image");
  //   setUsers(response);
  // };

  // const deleteImage = async (id) => {
  //   try {
  //     const response = await apiService.deleteRequest(
  //       `user/upload-image/${id}`
  //     );
  //     if (response) {
  //       toast.success(response.message);
  //       fetchUsers();
  //     } else {
  //       toast.error(response.message);
  //     }
  //   } catch (error) {
  //     toast.error(error);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append("name", name);
  //   formData.append("image", image);

  //   try {
  //     const response = await fetch(
  //       "http://localhost:3001/api/user/upload-image",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );
  //     const data = await response.json();
  //     console.log("response", response);
  //     fetchUsers(); // Refresh the user list
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <>
      <div className="image-container">
        <div className="panel">
          <div
            className={`button_outer ${
              image
                ? "file_uploaded file_uploading"
                : fileUploading
                ? "file_uploading"
                : ""
            }`}
          >
            <div className="btn_upload">
              <input
                type="file"
                id="upload_file"
                name="userImage"
                ref={imageRef}
                onChange={(e) => uploadFile(e)}
              />
              Upload Image
            </div>
            <div className="processing_bar"></div>
            <div className="success_box"></div>
          </div>
        </div>
        <div className="error_msg"></div>
        {image && (
          <div
            id="uploaded_view"
            className={`uploaded_file_view ${image ? "show" : ""}`}
          >
            <span className="file_remove" onClick={removeFile}>
              X
            </span>
            <img src={previewImage} />
          </div>
        )}
      </div>
      {/* <div>
        <h1>Upload User Image</h1>
        <div className="section-registration">
          <div className="main-container grid grid-two-cols">
            <div className="registration-form">
              <form onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <br />
                <div className="image-container">
                  <div className="panel">
                    <div
                      className={`button_outer ${
                        image
                          ? "file_uploaded file_uploading"
                          : fileUploading
                          ? "file_uploading"
                          : ""
                      }`}
                    >
                      <div className="btn_upload">
                        <input
                          type="file"
                          id="upload_file"
                          name=""
                          onChange={(e) => uploadFile(e)}
                        />
                        Upload Image
                      </div>
                      <div className="processing_bar"></div>
                      <div className="success_box"></div>
                    </div>
                  </div>
                  <div className="error_msg"></div>
                  {image && (
                    <div
                      id="uploaded_view"
                      className={`uploaded_file_view ${image ? "show" : ""}`}
                    >
                      <span className="file_remove" onClick={removeFile}>
                        X
                      </span>
                      <img src={previewImage} />
                    </div>
                  )}
                </div>
                <br />
                <div>
                  <button type="submit">Upload</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}
      {/* <section className="admin-contacts-section">
        <div className="contact-content container">
          <h1 className="main-heading">Image List</h1>
        </div>
        <div className="admin-users admin-contact-form">
          {users.map((user, index) => {
            return (
              <div key={user._id} className="contact-card">
                <span>
                  <img
                    src={`http://localhost:3001/${user.image}`}
                    alt={user.name}
                    style={{ width: "150px", height: "100px" }}
                  />
                </span>
                <br />
                <p>{user.name}</p>
                <br />
                <br />
                {isAdmin && (
                  <button className="btn" onClick={() => deleteImage(user._id)}>
                    <FaTrash />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section> */}
    </>
  );
};

export default UploadImage;
