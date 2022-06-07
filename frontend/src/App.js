
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import PrivateRoute from "./Components/PrivateRoute";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ShowData from "./Pages/ShowData";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/show_data/:name" element={<PrivateRoute><ShowData /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
