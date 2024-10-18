import {Link } from "react-router-dom";
import {MainLayout} from "author-design-system-react"

export const App = () => {
  return (
    <>
      <MainLayout text="Dataset Catalogue">
        <Link to={`/data-admin/login`}>Login</Link>
      </MainLayout>
    </>
  )
}
