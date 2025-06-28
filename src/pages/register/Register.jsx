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
    <div className="w-full min-h-[90vh] bg-gradient-to-r from-primary/50 to-primary/50 bg-[url('/src/assets/bg.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center p-5">
      <ToastContainer />
      <div className="relative w-full max-w-lg bg-white rounded-lg flex flex-col shadow-xl">
        
        <form onSubmit={handleRegister} className="p-5 md:p-6 flex flex-col gap-3">
          <h4 className="text-center text-xl md:text-2xl font-medium mb-3">Sign up</h4>
          
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="p-3 rounded border border-gray-300 outline-none text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="p-3 rounded border border-gray-300 outline-none text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded border border-gray-300 outline-none text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          
          <input
            type="tel"
            placeholder="Phone Number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
          
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="p-3 rounded border border-gray-300 outline-none text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />

          <button 
            type="submit" 
            disabled={isLoading}
            className="p-3 bg-primary border-none rounded text-white cursor-pointer text-base font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing up..." : "Sign up"}
          </button>

          <div className="my-4 w-full h-px bg-gray-300 flex justify-center items-center">
            <div className="px-4 bg-white text-gray-500 text-sm">Or</div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-4 border border-gray-300 rounded p-3 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors text-sm" onClick={google}>
              <Google />
              Sign up with google
            </div>
            <div className="flex items-center justify-center gap-4 border border-gray-300 rounded p-3 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors text-sm">
              <Facebook />
              Sign up with facebook
            </div>
            <div className="flex items-center justify-center gap-4 border border-gray-300 rounded p-3 text-gray-600 cursor-pointer hover:bg-gray-50 transition-colors text-sm">
              <Twitter />
              Sign up with twitter
            </div>
          </div>
        </form>
        
        <div className="bg-gray-100 text-gray-600 w-full min-h-[50px] flex items-center justify-center text-center p-4 rounded-b-lg">
          <Link to="/login" className="link">
            <span className="text-primary hover:underline">Already have an account? Sign in here</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;