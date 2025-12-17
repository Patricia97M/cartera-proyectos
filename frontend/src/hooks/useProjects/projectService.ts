import axios, { AxiosError } from "axios";
import { Status, ERROR_RESPONSES } from "../../constants/status";
import type { ICreatedProject, IProject } from "../../interfaces/IProject";

const URL = "http://localhost:4000/proyectos";

export const fetchProjects = async (email: string) => {
  const query = new URLSearchParams({ email });
  try {
    const response = await axios.get(`${URL}?${query.toString()}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: string }>;
    const status = axiosError.response?.data?.status || Status.ERROR;
    const errorMessage =
      ERROR_RESPONSES[status]?.message || "Error desconocido";
    throw new Error(errorMessage);
  }
};

export const createProject = async (project: ICreatedProject) => {
  try {
    const response = await axios.post(URL, project, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.project;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: string }>;
    const status = axiosError.response?.data?.status || Status.ERROR;
    const errorMessage =
      ERROR_RESPONSES[status]?.message || "Error desconocido";
    throw new Error(errorMessage);
  }
};

export const updateStatusProject = async (
  id: number,
  status: "enabled" | "disabled"
) => {
  const updatedProject: Partial<IProject> = { status };
  try {
    const response = await axios.patch(`${URL}/${id}`, updatedProject, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: string }>;
    const status = axiosError.response?.data?.status || Status.ERROR;
    const errorMessage =
      ERROR_RESPONSES[status]?.message || "Error desconocido";
    throw new Error(errorMessage);
  }
};

export const deleteProject = async (id: number) => {
  try {
    const response = await axios.delete(`${URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ status: string }>;
    const status = axiosError.response?.data?.status || Status.ERROR;
    const errorMessage =
      ERROR_RESPONSES[status]?.message || "Error desconocido";
    throw new Error(errorMessage);
  }
};
