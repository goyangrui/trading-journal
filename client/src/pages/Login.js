import Wrapper from "../assets/wrappers/Register";

import { Link } from "react-router-dom";

function Login() {
  return (
    <Wrapper>
      <div className="container">
        {/* form */}
        <form className="form">
          {/* title */}
          <h2>login form</h2>
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
            Login
          </button>
          <p>
            {"Don't have an account yet? "}
            <Link to="/register" className="redirect-btn">
              Register
            </Link>
          </p>
        </form>
      </div>
    </Wrapper>
  );
}

export default Login;
