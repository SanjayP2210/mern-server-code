// src/App.js
import React, { useState, useRef, useEffect } from "react";
import "./UploadImage.css";
import { toast } from "react-toastify";

const UploadImage = ({ multiple = false, setImage, data, disabled }) => {
  const [previewImage, setPreviewImage] = useState([]);
  const [fileUploading, setFileUploading] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (data?.image) {
      if (data?.image[0]?.url?.length > 0) {
        const imageList = data?.image?.map((x) => x?.url);
        setPreviewImage(imageList);
      } else {
        setPreviewImage(
          data?.image?.url && data?.image?.url?.includes("res.cloudinary.com")
            ? [data?.image?.url]
            : []
        );
      }
    }
  }, [data]);

  const uploadFile = (e) => {
    // const selectedFile = file;
    // const value = file.value;
    setFileUploading(true);
    let finalImages = previewImage || [];
    const selectedFiles = Array.from(e.target.files);
    selectedFiles.forEach(async (file) => {
      var ext = file.type.split("/").pop().toLowerCase();
      if (!["gif", "png", "jpg", "jpeg"].includes(ext)) {
        toast.error("Only gif, png, jpg,jpeg files are supported");
        imageRef.current.value = null;
      } else {
        // btnOuter.addClass("file_uploading");
        //convert with media type
        // var uploadedFile = URL.createObjectURL(e.target.files[0]);
        // var uploadedFile = null;

        //convert with base64 type
        const reader = new FileReader();

        reader.onload = () => {
          if (reader.readyState === 2) {
            finalImages = [...finalImages, reader.result];
          }
          if (finalImages?.length === selectedFiles?.length) {
            setTimeout(function () {
              setImage(finalImages);
              setPreviewImage(finalImages);
              imageRef.current.value = null;
            }, 1500);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };
  const removeImage = (e, index) => {
    e.preventDefault();
    const updatedImage = previewImage.filter((x, i) => i != index);
    setImage(updatedImage);
    setPreviewImage(updatedImage);
    setFileUploading(false);
  };

  const renderPreviewImages = () => {
    return previewImage.map((img, index) => {
      return (
        <div
          key={index}
          id="uploaded_view"
          className={`uploaded_file_view ${img ? "show" : ""}`}
        >
          {!disabled && (
            <span
              className="file_remove"
              onClick={(e) => {
                removeImage(e, index);
              }}
            >
              X
            </span>
          )}
          <img src={img} alt={"user image"} />
        </div>
      );
    });
  };

  return (
    <>
      <div className="image-container">
        <div className="panel">
          {previewImage?.length > 0 ? (
            renderPreviewImages()
          ) : (
            <div
              className={`button_outer ${
                previewImage?.length > 0
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
                  multiple={multiple}
                  ref={imageRef}
                  onChange={(e) => uploadFile(e)}
                  disabled={disabled}
                />
                Upload Image
              </div>
              <div className="processing_bar"></div>
              {/* <div className="success_box"></div> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadImage;
