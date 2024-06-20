import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import "./Projects.css";
import { useNavigate } from "react-router-dom";
import apiService from "../service/apiService";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import Loader from "../components/Loader/Loader";

function Projects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const response = await apiService.getRequest("project");
        setProjects(response.projects);
        setLoading(false);
      } catch (error) {
        toast.error("error while getting projects", error);
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        setLoading(true);
        const response = await apiService.deleteRequest(`/project/${id}`);
        if (response) {
          setProjects(projects.filter((project) => project._id !== id));
          toast.success("Project deleted successfully!");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
        toast.error("Error deleting project", error);
      }
    }
  };

  const redirectAddProject = () => {
    navigate("/add-project");
  };
  return (
    <>
      <Loader visible={loading} />
      <div className="project">
        <div
          className="contact-content container"
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h1 className="main-heading">Projects</h1>
          <button className="btn" onClick={redirectAddProject}>
            <FaPlus /> Add Project
          </button>
        </div>
        <br />
        <div className="projects-grid">
          {projects.map((project) => (
            <>
              <ProjectCard
                key={project._id}
                project={project}
                handleDelete={handleDelete}
              />
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default Projects;
