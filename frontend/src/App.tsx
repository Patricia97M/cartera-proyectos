import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Notification from "./components/Notification";
import { useProjects } from "./hooks/useProjects";
import Login from "./pages/Login";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

function App() {
  const { notification, setNotification } = useProjects();
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.error) {
      navigate("/projects");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);

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
        <Route path="/" element={<Login />} />
        <Route
          path="/projects"
          element={authState.email ? <Home /> : <Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

export default App;
