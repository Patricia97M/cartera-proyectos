import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Notification from "./components/Notification";
import { useProjects } from "./hooks/useProjects";
import { memo } from "react";
import Login from "./pages/Login";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { notification, setNotification } = useProjects();
  const { authState } = useAuth();

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Routes>
        <Route
          path="/projects"
          element={authState.email ? <Home /> : <Navigate to="/" replace />}
        />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
}

export default memo(App);
