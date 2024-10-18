import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {MainLayout} from "author-design-system-react"
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

const mainLayoutProps = {
  text: "Dataset Catalogue",
  me:{
    displayName: 'Gareth Young',
  },
  headerConfig: {
    navigationLinks: [
      {
        text: 'Home',
        url: '/data-admin/'
      },
    ]
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MainLayout {...mainLayoutProps}>
      <RouterProvider router={router} />
    </MainLayout>
  </StrictMode>,
)
