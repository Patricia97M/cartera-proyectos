import { useState } from "react";

interface Notification {
  message: string;
  type: "success" | "error";
}

type UseNotification = [
  Notification | null,
  (notification: Notification | null) => void
];

export const useNotification = (): UseNotification => {
  const [notification, setNotification] = useState<Notification | null>(null);
  return [notification, setNotification];
};
