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
          <p>
            I'm baby fingerstache fam cloud bread chillwave praxis pork belly.
            Pitchfork church-key echo park, post-ironic kale chips unicorn plaid
            mustache tilde ascot offal cronut 90's. Occupy pork belly selfies,
            gluten-free jean shorts praxis four loko vegan intelligentsia
            pour-over YOLO. Fashion axe aesthetic waistcoat celiac deep v.
            Gluten-free same XOXO, farm-to-table +1 chartreuse neutra direct
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
