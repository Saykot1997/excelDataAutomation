import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Home from "./Pages/Home";
import ShowData from "./Pages/ShowData";


function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show_data/:name" element={<ShowData />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
