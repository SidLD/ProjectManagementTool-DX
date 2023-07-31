import { RouterProvider } from "react-router-dom";
import routers from "./modules/routers";

function App() {
  return (
      <RouterProvider router={routers} />
  );
}

export default App;