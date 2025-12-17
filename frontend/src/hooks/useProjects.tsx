/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./useAuth";
import {
  fetchProjects as fetchProjectsService,
  createProject as createProjectService,
  updateStatusProject as updateStatusProjectService,
  deleteProject as deleteProjectService,
} from "./useProjects/projectService";
import type { ICreatedProject, IProject } from "../interfaces/IProject";
import { Status, ERROR_RESPONSES } from "../constants/status";

interface ProjectsContextProps {
  projects: IProject[];
  selectedProject: IProject | null;
  fetchProjects: () => void;
  selectProject: (id: number) => void;
  createProject: (project: ICreatedProject) => void;
  updateStatusProject: (id: number, status: "enabled" | "disabled") => void;
  deleteProject: (id: number) => void;
  error: any;
  isLoading: boolean;
  notification: {
    message: string;
    type: "success" | "error";
  } | null;
  setNotification: React.Dispatch<
    React.SetStateAction<{
      message: string;
      type: "success" | "error";
    } | null>
  >;
}

const ProjectsContext = createContext<ProjectsContextProps | undefined>(
  undefined
);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { authState } = useAuth();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProjectsService(authState.email || "");
      setProjects(data);
    } catch (err) {
      if (err instanceof Error) {
        const status = (err as any).response?.data?.status || Status.ERROR;
        const errorMessage =
          ERROR_RESPONSES[status]?.message || "Error desconocido";
        setNotification({ message: errorMessage, type: "error" });
      }
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectProject = (id: number) => {
    const project = projects.find((p) => p.id === id) || null;
    setSelectedProject(project);
  };

  const createProject = async (project: ICreatedProject) => {
    setIsLoading(true);
    try {
      const newProject = await createProjectService(project);
      setProjects((prev) => [...prev, newProject]);
      setNotification({
        message: "Proyecto creado con éxito",
        type: "success",
      });
    } catch (err) {
      if (err instanceof Error) {
        const status = (err as any).response?.data?.status || Status.ERROR;
        const errorMessage =
          ERROR_RESPONSES[status]?.message || "Error desconocido";
        setNotification({ message: errorMessage, type: "error" });
      }
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatusProject = async (
    id: number,
    status: "enabled" | "disabled"
  ) => {
    setIsLoading(true);
    try {
      await updateStatusProjectService(id, status);
      setProjects((prev) =>
        prev.map((project) =>
          project.id === id ? { ...project, status } : project
        )
      );
      setNotification({
        message: "Estado actualizado con éxito",
        type: "success",
      });
    } catch (err) {
      if (err instanceof Error) {
        const status = (err as any).response?.data?.status || Status.ERROR;
        const errorMessage =
          ERROR_RESPONSES[status]?.message || "Error desconocido";
        setNotification({ message: errorMessage, type: "error" });
      }
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    setIsLoading(true);
    try {
      await deleteProjectService(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      setNotification({
        message: "Proyecto eliminado con éxito",
        type: "success",
      });
    } catch (err) {
      if (err instanceof Error) {
        const status = (err as any).response?.data?.status || Status.ERROR;
        const errorMessage =
          ERROR_RESPONSES[status]?.message || "Error desconocido";
        setNotification({ message: errorMessage, type: "error" });
      }
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        selectedProject,
        fetchProjects,
        selectProject,
        createProject,
        updateStatusProject,
        deleteProject,
        error,
        isLoading,
        notification,
        setNotification,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
