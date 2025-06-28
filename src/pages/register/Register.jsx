import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { Google, Facebook, Twitter } from "@mui/icons-material";
import { useState } from "react";
import { publicRequest } from "../../requestMethods";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (password !== ConfirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const res = await publicRequest.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });
      navigate("/login");
      res.data && toast(res.data.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        toast(error.response.data[0].error);
      }
    }
  };

  const google = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };
  return (
    <div className="register">
      <ToastContainer />
      <div className="container">
        <form onSubmit={handleRegister}>
          <h4>Sign up</h4>
          <input
            type="text"
            placeholder="firstName"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="lastName"
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">Sign up</button>

          <div className="or-container">
            <div className="or">Or</div>
          </div>

          <div className="item" onClick={google}>
            <Google />
            Sign up with google
          </div>
          <div className="item">
            <Facebook />
            Sign up with facebook
          </div>
          <div className="item">
            <Twitter />
            Sign up with twitter
          </div>
        </form>
        <div className="sign_in">
          <Link to="/login" className="link">
            You dont have an account? Sign in here
          </Link>
        </div>
        {error && (
          <span style={{ color: "red", textAlign: "center" }}>{error}</span>
        )}
      </div>
    </div>
  );
};

export default Register;
