import Wrapper from "../assets/wrappers/Register";

import { Link } from "react-router-dom";

function Register() {
  return (
    <Wrapper>
      <div className="container">
        {/* form */}
        <form className="form">
          {/* title */}
          <h2>sign-up form</h2>
          {/* username */}
          <div className="form-row">
            <label htmlFor="username" className="form-label">
              username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
            />
          </div>
          {/* email */}
          <div className="form-row">
            <label htmlFor="email" className="form-label">
              email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
            />
          </div>
          {/* password */}
          <div className="form-row">
            <label htmlFor="password" className="form-label">
              password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
            />
          </div>
          {/* submit button */}
          <button type="submit" className="btn btn-block">
            Create Account
          </button>
          <p>
            {"Already have an account? "}
            <Link to="/login" className="redirect-btn">
              Login
            </Link>
          </p>
        </form>
      </div>
    </Wrapper>
  );
}

export default Register;
