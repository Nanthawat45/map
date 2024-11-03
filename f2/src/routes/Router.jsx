import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

// import Add from "../pages/Add.jsx";
const Add = lazy(() => import("../pages/Add.jsx"));

const APP = lazy(() => import("../App.jsx"));

import Edit from "../pages/Edit.jsx";
// const Edit = lazy(() => import("../pages/Edit.jsx"));

// import Login from "../pages/Login.jsx";
const Login = lazy(() => import("../pages/Login.jsx"));
// import Register from "../pages/Register.jsx";
const Register = lazy(() => import("../pages/Register.jsx"));
// import UserProfile from "../pages/UserProfile.jsx";
const UserProfile = lazy(() => import("../pages/UserProfile.jsx"));
import Layout from "../components/Layout.jsx";
import ModOrAdminPage from "../pages/ModOrAdminPage.jsx";
import NotAllowed from "../pages/NotAllowed.jsx";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <APP />, // เปลี่ยนจาก <Home /> เป็น <APP />
      },
      {
        path: "add",
        element:
          <ModOrAdminPage>
         <Add />,
         </ModOrAdminPage>
      },
      {
        path: "edit/:id",
        element: (
          <ModOrAdminPage>
            <Edit />
          </ModOrAdminPage>
        ),
      },
      { path: "login", element: <Login /> },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "notAllowed",
        element: <NotAllowed />,
      },
      {
        path: "userProfile",
        element: <UserProfile />,
      },
    ],
  },
]);

export default Router;
