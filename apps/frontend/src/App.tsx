

import { Link, Route, Router, Routes } from "react-router-dom";
import GetSpaces from "./components/GetSpaces";
import Home from "./screens/Home";
import Arena from "./screens/VirtualSpace";
import Params from "./screens/Params";
import Spaces from "./screens/Spaces";




function App() {


  return (
    <>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/space" element={<Spaces />} />
        <Route path="/space/:spaceid" element={<Arena />} />
      </Routes>
    </>
  );
}

export default App;
