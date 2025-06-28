import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { Google, Facebook, Twitter } from "@mui/icons-material";
import { useState } from "react";
import { register } from "../../redux/apiCalls";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        phone
      });
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const google = () => {
    toast.info("Google registration not implemented yet");
  };

  return (
    <div className="register">
      <ToastContainer />
      <div className="container">
        <form onSubmit={handleRegister}>
          <h4>Sign up</h4>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign up"}
          </button>

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
            Already have an account? Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;