import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import RegisterationForm from "./components/RegisterationForm";
import LoginForm from "./components/LoginPage";
import { LandingPage } from "./components/LandingPage";
function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
      <Route path="/home/*" element={<LandingPage/>}/>
      <Route path="/register" element={<RegisterationForm />} />
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  </BrowserRouter>
    </>
  );
}

export default App;
