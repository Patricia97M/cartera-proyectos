import { memo, useEffect, useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../hooks/useAuth";
import "../styles/page/Home.css";
import Switch from "../components/Switch";
import CreateProjectModal from "./components/CreateProjectModal";
import DeleteProjectModal from "./components/DeleteProjectModal";

const Home = () => {
  const {
    projects,
    selectedProject,
    selectProject,
    fetchProjects,
    updateStatusProject,
  } = useProjects();

  const { logout, authState } = useAuth(); // Hook para manejar el deslogueo y obtener el usuario

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleToggle = async (id: number, status: "enabled" | "disabled") => {
    if (id) {
      await updateStatusProject(
        id,
        status === "enabled" ? "disabled" : "enabled"
      );
    }
  };
  const handleDelete = (id: number) => {
    // Lógica para eliminar el proyecto
    setIsDeleteModalOpen(true);
    selectProject(id);
  };

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      selectProject(projects[0].id || 0);
    }
  });

  useEffect(() => {
    if (!projects.length) {
      fetchProjects();
    }
  }, [projects, fetchProjects]);

  return (
    <>
      <header className="header">
        <div className="user-info">
          <span className="user-email">{authState.user?.email}</span>
        </div>
        <button className="btn btn-logout" onClick={logout}>
          Cerrar Sesión
        </button>
      </header>
      <div className="container">
        <h1>Gestión de Proyectos</h1>
        <div>
          {isCreateModalOpen && (
            <CreateProjectModal
              isModalOpen={isCreateModalOpen}
              setIsModalOpen={setIsCreateModalOpen}
            />
          )}
          {isDeleteModalOpen && (
            <DeleteProjectModal
              isModalOpen={isDeleteModalOpen}
              setIsModalOpen={setIsDeleteModalOpen}
            />
          )}
        </div>
        <div className="projects-btn-container">
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Crear Proyecto
          </button>
        </div>
        <table className="projects-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th className="column-action">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>
                  <Switch
                    key={`switch-${project.id}`}
                    id={`switch-${project.id}`}
                    isOn={project.status === "enabled"}
                    handleToggle={() =>
                      handleToggle(project.id, project.status)
                    }
                  />
                </td>
                <td className="column-action">
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(project.id)}
                  >
                    <i className="material-icons">delete</i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default memo(Home);
