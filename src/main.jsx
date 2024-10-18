import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { App } from './App/App.jsx'
import { Login } from './Pages/login.jsx';

const router = createBrowserRouter([
  {
    path: "/data-admin",
    element: <App />,
  },
  {
    path: "/data-admin/login",
    element: <Login />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
