import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import SignIn from "./pages/SignIn";
import Projects from "./pages/Projects";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Header from "./components/Header";
import FooterComponent from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}
