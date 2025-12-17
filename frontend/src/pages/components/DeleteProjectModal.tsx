import React from "react";
import Modal from "../../components/Modal";
import "../../styles/components/DeleteProjectModal.css";
import { useProjects } from "../../hooks/useProjects";

interface DeleteProjectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}
const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const { deleteProject, selectedProject } = useProjects();

  const handleDelete = () => {
    if (selectedProject) {
      deleteProject(selectedProject.id);
      setIsModalOpen(false);
    }
  };
  return (
    <Modal
      isOpen={isModalOpen}
      title="Eliminar proyecto"
      onClose={() => setIsModalOpen(false)}
    >
      <div className="delete-modal-container">
        <div className="delete-modal-icon">
          <i className="material-symbols-outlined">close</i>
        </div>
        <p>
          ¿Estás seguro de que deseas eliminar el proyecto "
          {selectedProject?.name}"?
        </p>
        <button className="btn btn-danger" onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </Modal>
  );
};

export default DeleteProjectModal;
