import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Layout from "./Layout";
import Overview from "./pages/admin/Overview";
import DataKelas from "./pages/admin/data_kelas/DataKelas";
import DataSiswa from "./pages/admin/data_siswa/DataSiswa";
import DataJurusan from "./pages/admin/data_jurusan/DataJurusan";
import SaveJurusan from "./pages/admin/data_jurusan/Save";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Layout/>}>
            <Route path="/" element={<Overview/>}/>
            <Route path="/overview" element={<Overview/>}/>
            <Route path="/majors" element={<DataJurusan/>}/>
            <Route path="/majors/:id" element={<DataJurusan detail/>}/>
            <Route path="/majors/save" element={<SaveJurusan/>}/>
            <Route path="/classes" element={<DataKelas/>}/>
            <Route path="/classes/:id" element={<DataKelas detail/>}/>
            <Route path="/students" element={<DataSiswa/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
