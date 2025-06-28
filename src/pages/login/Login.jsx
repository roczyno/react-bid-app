import "./login.scss";
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
    // Implement Google OAuth if needed
    toast.info("Google login not implemented yet");
  };

  return (
    <div className="login">
      <div className="container">
        <ToastContainer />
        <form onSubmit={handleLogin}>
          <h4>Sign in</h4>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="others">
            <div className="remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" className="label">
                Remember me
              </label>
            </div>
            <Link className="link" to="/forgot-password">
              <span>Recover password</span>
            </Link>
          </div>
          <button type="submit" disabled={isFetching}>
            {isFetching ? "Signing in..." : "Sign in"}
          </button>

          <div className="or-container">
            <div className="or">Or</div>
          </div>

          <div className="item" onClick={google}>
            <Google />
            Sign in with google
          </div>
          <div className="item">
            <Facebook />
            Sign in with facebook
          </div>
          <div className="item">
            <Twitter />
            Sign in with twitter
          </div>
        </form>
        <div className="sign_up">
          <Link to="/register" className="link">
            You dont have an account? Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;