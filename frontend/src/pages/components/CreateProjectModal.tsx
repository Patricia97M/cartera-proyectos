import React, { memo, useMemo } from "react";
import Modal from "../../components/Modal";
import Switch from "../../components/Switch";
import "../../styles/components/CreateProjectModal.css";
import type { ICreatedProject } from "../../interfaces/IProject";
import { useProjects } from "../../hooks/useProjects";
import { useAuth } from "../../hooks/useAuth";

interface CreateProjectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const closeModal = () => setIsModalOpen(false);
  const { authState } = useAuth();
  const [form, setForm] = React.useState<ICreatedProject>({
    name: "",
    description: "",
    status: "enabled",
    email: authState.email || "",
  });
  const [errors, setErrors] = React.useState({
    name: "",
    description: "",
  });

  const { createProject } = useProjects();

  const validateField = (field: string, value: string) => {
    let error = "";
    if (field === "name" && value.trim().length < 3) {
      error = "El nombre debe tener al menos 3 caracteres.";
    }
    if (field === "description" && value.trim().length < 5) {
      error = "La descripción debe tener al menos 5 caracteres.";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const validateForm = () => {
    const isNameValid = validateField("name", form.name);
    const isDescriptionValid = validateField("description", form.description);
    return isNameValid && isDescriptionValid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      await createProject({ ...form });
      closeModal();
    }
  };
  const disabled = useMemo(() => {
    if (form.description.trim().length < 5 || form.name.trim().length < 3) {
      return true;
    } else if (errors.name || errors.description) {
      return true;
    }
    return false;
  }, [errors.name, errors.description, form]);

  return (
    <Modal isOpen={isModalOpen} title="Nuevo proyecto" onClose={closeModal}>
      <h4>Formulario de creación de proyecto</h4>

      <div className="form-group">
        <label htmlFor="name">Nombre del proyecto:</label>
        <input
          type="text"
          id="name"
          placeholder="Nombre del proyecto"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          onBlur={(event) => validateField("name", event.target.value)}
          style={{ borderColor: errors.name ? "red" : undefined }}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción del proyecto:</label>
        <textarea
          id="description"
          placeholder="Descripción del proyecto"
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          onBlur={(event) => validateField("description", event.target.value)}
          rows={4}
          style={{ borderColor: errors.description ? "red" : undefined }}
        ></textarea>
        {errors.description && (
          <p className="error-message">{errors.description}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="stack">Estado:</label>
        <Switch
          id={`switch-form`}
          isOn={form.status === "enabled"}
          handleToggle={() =>
            setForm({
              ...form,
              status: form.status === "enabled" ? "disabled" : "enabled",
            })
          }
        />
      </div>

      <div className="form-group-btn">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={closeModal}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={disabled}
          onClick={onSubmit}
        >
          Crear Proyecto
        </button>
      </div>
    </Modal>
  );
};

export default memo(CreateProjectModal);
