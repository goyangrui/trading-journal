import { Link } from "react-router-dom";

import Wrapper from "../assets/wrappers/Landing";

import heroImage from "../assets/images/hero-image.svg";

function Landing() {
  return (
    <Wrapper>
      <section className="container hero">
        <img src={heroImage} alt="analyzing charts" className="img" />
        <div className="hero-text">
          <h1>
            a clean and effective <span>trading journal</span>
          </h1>
          <p className="hero-paragraph">
            Enter and visualize your trades with minimal friction with this
            simple and intuitive trading journal web application!
          </p>
          <Link to="/pricing" className="btn">
            Get started
          </Link>
        </div>
      </section>
    </Wrapper>
  );
}

export default Landing;
