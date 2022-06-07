import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ShowData from "./Pages/ShowData";



function App() {

  const User = useSelector(state => state.User.User);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show_data/:name" element={<ShowData />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
