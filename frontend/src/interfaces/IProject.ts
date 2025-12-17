export interface IProject {
  id: number;
  name: string;
  description: string;
  status: "enabled" | "disabled";
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreatedProject {
  name: string;
  description: string;
  status: "enabled" | "disabled";
  email: string;
}
