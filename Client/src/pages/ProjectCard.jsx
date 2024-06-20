import { useNavigate } from "react-router-dom";
import "./ProjectCard.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function ProjectCard({ project, handleDelete }) {
  const navigate = useNavigate();
  const handleEditProject = () => {
    navigate(`/edit-project/${project._id}`);
  };
  return (
    <div className="project-card">
      <img
        src={project?.image?.url}
        alt={project.title}
        className="project-image"
      />
      <div className="project-details">
        <h2 className="project-title">{project.title}</h2>
        <p className="project-description">{project.description}</p>
        <p className="project-date">
          {new Date(project.createdAt).toLocaleDateString()}
        </p>
        <br />
        <br />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button onClick={handleEditProject} className="button primary">
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(project._id)}
            className="button danger "
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
