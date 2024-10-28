import logo from './logo.svg';
import Test from './Test';
import Admin from './Admin';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Test/>,
  },
  {
    path: "/admin",
    element: <Admin/>,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
