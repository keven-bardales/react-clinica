import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import ErrorPage from "./error-page";
import Contact from "./routes/contact";
import Doctores from "./routes/Doctores";
import Paciente from "./routes/Pacientes";
import Citas from "./routes/Citas";
import Root, { loader as rootLoader,   action as rootAction, } from "./routes/root";
import Usuarios from "./routes/Usuarios";
import Roles from "./routes/Roles";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    name:'Inicio',
    errorElement: <ErrorPage />,
    loader : rootLoader, 
    action: rootAction,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
      {
        path: "/registro",
        element: <Doctores />,
        name:'Doctores',
        errorElement: <ErrorPage />,
        loader : rootLoader, 
        action: rootAction,
      },
      {
        path: "/Paciente",
        element: <Paciente />,
        name:'Paciente',
        errorElement: <ErrorPage />,
        loader : rootLoader, 
        action: rootAction,
      },
      {
        path: "/Citas",
        element: < Citas/>,
        name:'Citas',
        errorElement: <ErrorPage />,
        loader : rootLoader, 
        action: rootAction,
      },
      {
        path: "/Usuarios",
        element: < Usuarios/>,
        errorElement: <ErrorPage />,        
        name:'Usuarios',
        loader : rootLoader, 
        action: rootAction,
      },
     {
        path: "/Usuarios",
        element: < Roles/>,        
        name:'Citas',
        errorElement: <ErrorPage />,
        loader : rootLoader, 
        action: rootAction,
      }
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    
  </React.StrictMode>
);




