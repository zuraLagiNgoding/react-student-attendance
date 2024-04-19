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
import DataMapel from "./pages/admin/data_mapel/DataMapel";
import SaveMapel from "./pages/admin/data_mapel/Save";
import DataJadwal from "./pages/admin/data_jadwal/DataJadwal";
import SaveJadwal from "./pages/admin/data_jadwal/Save";
import LandingPage from "./pages/general/LandingPage";
import JadwalMengajar from "./pages/general/teacher/jadwal_mengajar/JadwalMengajar";
import DaftarPresensi from "./pages/general/teacher/presensi/DaftarPresensi";
import Presensi from "./pages/general/teacher/presensi/Presensi";
import DaftarRecap from "./pages/general/teacher/recap/DaftarRecap";
import Recap from "./pages/general/teacher/recap/Recap";

const Routing = () => {
  const { currentUser, logout } = useContext(AuthContext);

  if (!currentUser) {
    return (
      <>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
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
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Navigate to="/overview" />} />
                <Route path="/overview" element={<AdminOverview />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/majors" element={<DataJurusan />} />
                <Route path="/majors/:id" element={<DataJurusan detail />} />
                <Route path="/majors/save" element={<SaveJurusan />} />
                <Route path="/subjects" element={<DataMapel />} />
                <Route path="/subjects/:id" element={<DataMapel detail />} />
                <Route path="/subjects/save" element={<SaveMapel />} />
                <Route path="/schedules" element={<DataJadwal />} />
                <Route path="/schedules/:id" element={<DataJadwal detail />} />
                <Route path="/schedules/save" element={<SaveJadwal />} />
                <Route path="/classes" element={<DataKelas />} />
                <Route path="/classes/:id" element={<DataKelas detail />} />
                <Route path="/classes/save" element={<SaveKelas />} />
                <Route path="/students" element={<DataSiswa />} />
                <Route path="/students/:id" element={<DataSiswa detail/>} />
                <Route path="/students/save" element={<SaveSiswa />} />
                <Route path="/teachers" element={<DataGuru />} />
                <Route path="/teachers/:id" element={<DataGuru detail/>} />
                <Route path="/teachers/save" element={<SaveGuru />} />
              </Route>
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
        </>
      );
    } else if (currentUser.role === "STUDENT") {
      return (
        <>
          <>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route path="/" element={<Navigate to="/overview" />} />
                  <Route path="/overview" element={<GeneralOverview />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/login" element={<Login />} />
              </Routes>
            </Router>
          </>
        </>
      );
    } else if (currentUser.role === "TEACHER") {
      return (
        <>
          <>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route path="/" element={<Navigate to="/overview" />} />
                  <Route path="/overview" element={<GeneralOverview />} />
                  <Route path="/schedule" element={<JadwalMengajar />} />
                  <Route path="/attendance" element={<DaftarPresensi />} />
                  <Route path="/attendance/records" element={<DaftarRecap />} />
                  <Route path="/attendance/records/:id" element={<Recap />} />
                  <Route path="/attendance/:id" element={<Presensi />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
                <Route path="/login" element={<Login />} />
              </Routes>
            </Router>
          </>
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
