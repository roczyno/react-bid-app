import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Product from "./pages/product/Product";
import Auctions from "./pages/auctions/Auctions";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import MyAuctionsPage from "./pages/myAuctionsPage/MyAuctionsPage";
import { useSelector } from "react-redux";
import Subscription from "./pages/subscription/Subscription";
import Chat from "./pages/chat/Chat";
import Dashboard from "./pages/dashboard/Dashboard";

const App = () => {
  const user = useSelector((state) => state.user.currentUser);

  const Layout = () => {
    return (
      <>
        <Navbar />
        <Outlet />
        <Footer />
      </>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/product/:id",
          element: <Product />,
        },
        {
          path: "/auctions",
          element: <Auctions />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/login",
          element: user ? <Home /> : <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/verify",
          element: <VerifyEmail />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
        {
          path: "/my-auctions",
          element: user ? <MyAuctionsPage /> : <Login />,
        },
        {
          path: "/upgrade",
          element: user ? <Subscription /> : <Login />,
        },
        {
          path: "/chat",
          element: <Chat />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
