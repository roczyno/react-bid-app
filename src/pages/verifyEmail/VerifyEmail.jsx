import "./verifyEmail.scss";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  return (
    <div className="verify_email">
      <div className="container">
        <div className="wrapper">
          <h4>Sign up</h4>
          <hr />
          <span>Thank you!!!</span>

          <p>
            We sent an email to your google account. Click confirmation link in
            the email to verify
          </p>
          <button>
            <a href="http://mail.google.com" target="blank" className="link">
              Open Email app
            </a>
          </button>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
