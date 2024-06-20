import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import UploadImage from "../components/UploadImage/UploadImage";
import apiService from "../service/apiService";
import { toast } from "react-toastify";
import Loader from "../components/Loader/Loader";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await apiService.getRequest(`project/${id}`);
        setProject(response.projectData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const formKeys = Object.keys(project);
      formKeys.forEach((key) => {
        if (key === "image") {
          if (!image.startsWith("https://res.cloudinary.com")) {
            formData.append("newImage", image);
          }
          formData.append("image", JSON.stringify(project[key]));
        } else {
          formData.append(key, project[key]);
        }
      });
      setLoading(true);
      const response = await apiService.putRequest(`project/${id}`, formData);
      if (response) {
        toast.success("Project updated successfully!");
        setProject({
          title: "",
          description: "",
          image: null,
        });
        setImage(null);
        navigate(-1);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Error updating project");
    }
  };

  return (
    <section>
      <Loader visible={loading} />
      <main>
        <div className="container">
          <div className="contact-content">
            <h1 className="main-heading">Edit Project</h1>
          </div>
          <div className="section-registration">
            <div className="main-container grid grid-two-cols">
              <div className="registration-form">
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={project.title}
                      onChange={handleChange}
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label htmlFor="title">Description</label>
                    <textarea
                      name="description"
                      value={project.description}
                      onChange={handleChange}
                      required
                      cols={40}
                      rows={5}
                      style={{
                        background: "black",
                        padding: "1rem 2.6rem",
                        borderRadius: "8px",
                      }}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <UploadImage
                      multiple={false}
                      setImage={setImage}
                      data={project}
                    />
                  </div>

                  <br />
                  <button
                    type="button"
                    className="btn"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-submit">
                    Update Project
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}

export default EditProject;
