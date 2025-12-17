import React, { memo, useEffect } from "react";
import "../styles/components/Notification.css";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      {type === "success" ? (
        <i className="material-symbols-outlined">check_circle</i>
      ) : (
        <i className="material-symbols-outlined">error</i>
      )}
      <p>{message}</p>
    </div>
  );
};

export default memo(Notification);
