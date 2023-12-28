
import {React} from 'react';
import {
  createBrowserRouter,
  RouterProvider,BrowserRouter
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./pages/Home/Home"
import Album from "./pages/Album/Album"
import ConvertPage from "./pages/ConvertPage/ConvertPage"

import NoMatch from './Components/NoMatch/Nomatch';
import Navbar from "./Components/Navbar/Navbar"
import Footer from "./Components/Footer/Footer"

function App() {

  const router = createBrowserRouter([
      {
      path : "/",
      element : <Home />,
      loader: async () => { return null; },
      },
      {
        path : "/album",
        element : <Album />,
        loader: async () => { return null; },
      },
      {
        path : "/convert",
        element : <ConvertPage />,
        loader: async () => { return null; },
        },
      {
      path: "*",
      element : <NoMatch/>
      },
    
  ])
  return (
    
    <> 
      <Navbar />
      <RouterProvider router={router} />
      <Footer />
    </>

  );
}

export default App;