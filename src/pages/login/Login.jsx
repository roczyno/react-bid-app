import { Link, useNavigate } from "react-router-dom";
import { Google, Facebook, Twitter } from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/apiCalls";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetching } = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(dispatch, { email, password });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const google = () => {
    toast.info("Google login not implemented yet");
  };

  return (
    <div className="w-full min-h-[90vh] bg-gradient-to-r from-primary/50 to-primary/50 bg-[url('/src/assets/bg.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center p-5">
      <div className="relative w-full max-w-lg bg-white rounded-lg flex flex-col shadow-xl">
        <ToastContainer />
        
        <form onSubmit={handleLogin} className="p-5 md:p-6 flex flex-col gap-4">
          <h4 className="text-center text-xl md:text-2xl font-medium mb-3">Sign in</h4>
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded border border-gray-300 outline-none text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 rounded border border-gray-300 outline-none text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="remember" className="accent-primary" />
              <label htmlFor="remember" className="text-sm">Remember me</label>
            </div>
            <Link className="link" to="/forgot-password">
              <span className="text-primary text-sm hover:underline">Recover password</span>
            </Link>
          </div>
          
          <button 
            type="submit" 
            disabled={isFetching}
            className="p-3 bg-primary border-none rounded text-white cursor-pointer text-base font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isFetching ? "Signing in..." : "Sign in"}
          </button>

          <div className="my-5 w-full h-px bg-gray-300 flex justify-center items-center">
            <div className="px-4 bg-white text-gray-500 text-sm">Or</div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-4 border border-gray-300 rounded p-3 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors text-sm" onClick={google}>
              <Google />
              Sign in with google
            </div>
            <div className="flex items-center justify-center gap-4 border border-gray-300 rounded p-3 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors text-sm">
              <Facebook />
              Sign in with facebook
            </div>
            <div className="flex items-center justify-center gap-4 border border-gray-300 rounded p-3 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors text-sm">
              <Twitter />
              Sign in with twitter
            </div>
          </div>
        </form>
        
        <div className="bg-gray-100 text-gray-600 w-full min-h-[60px] flex items-center justify-center text-center p-4 rounded-b-lg">
          <Link to="/register" className="link">
            <span className="text-primary hover:underline">You dont have an account? Sign up here</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;