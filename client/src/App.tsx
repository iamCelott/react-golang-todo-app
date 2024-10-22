import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

function App() {
  return (
    <>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </>
  );
}

export default App;
