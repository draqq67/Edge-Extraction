import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./pages/Home/Home";
import Album from "./pages/Album/Album";
import ConvertPage from "./pages/ConvertPage/ConvertPage";
import NoMatch from './Components/NoMatch/Nomatch';
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Login from "./pages/Login/Login";
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function LoginPage() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Login />;
}

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "album", element: <Album /> },
      { path: "convert", element: <ConvertPage /> },
      { path: "*", element: <NoMatch /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
