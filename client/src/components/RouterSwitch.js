import { BrowserRouter, Route, Routes } from "react-router-dom"
import SessionSelect from "../pages/SessionSelect"
import { SignIn } from "./SignIn";
export const RouterSwitch = () => {
  return (
    <Routes>
      <Route path="/sessions" element={<SessionSelect />} />
      <Route path='/' element={<SignIn />} />
    </Routes>
  )
};

export const Router = () => (
  <BrowserRouter>
    <RouterSwitch />
  </BrowserRouter>
);