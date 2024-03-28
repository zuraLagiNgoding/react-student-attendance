import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./Layout";
import AdminOverview from "./pages/admin/Overview";
import GeneralOverview from "./pages/general/Overview"
import DataKelas from "./pages/admin/data_kelas/DataKelas";
import DataSiswa from "./pages/admin/data_siswa/DataSiswa";
import DataJurusan from "./pages/admin/data_jurusan/DataJurusan";
import SaveJurusan from "./pages/admin/data_jurusan/Save";
import SaveKelas from "./pages/admin/data_kelas/Save";
import SaveSiswa from "./pages/admin/data_siswa/Save";
import DataGuru from "./pages/admin/data_guru/DataGuru";
import SaveGuru from "./pages/admin/data_guru/Save";
import NotFound from "./pages/NotFound";
import { useContext } from "react";
import { AuthContext } from "./context/authContext";

const Routing = () => {
  const { currentUser, logout } = useContext(AuthContext);

  if (!currentUser) {
    return (
      <>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </>
    );
  } else {
    if (currentUser.role === "ADMIN") {
      return (
        <>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Navigate to="/overview" />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/overview" element={<AdminOverview />} />
                <Route path="/majors" element={<DataJurusan />} />
                <Route path="/majors/:id" element={<DataJurusan detail />} />
                <Route path="/majors/save" element={<SaveJurusan />} />
                <Route path="/classes" element={<DataKelas />} />
                <Route path="/classes/:id" element={<DataKelas detail />} />
                <Route path="/classes/save" element={<SaveKelas />} />
                <Route path="/students" element={<DataSiswa />} />
                <Route path="/students/save" element={<SaveSiswa />} />
                <Route path="/teachers" element={<DataGuru />} />
                <Route path="/teachers/save" element={<SaveGuru />} />
              </Route>
            </Routes>
          </Router>
        </>
      );
    } else if (currentUser.role === "STUDENT") {
      return (
        <>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/overview" element={<GeneralOverview />} />
            </Routes>
          </Router>
        </>
      );
    } else {
      logout();
    }
  } 
};

function App() {
  return (
    <>
      <Routing/>
    </>
  );
}

export default App;
