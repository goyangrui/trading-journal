import Wrapper from "../assets/wrappers/FeaturesSection1";

function FeaturesSection1({ image, text }) {
  return (
    <Wrapper>
      {/* top section (image) */}
      <div className="features-section">
        <div className="features-img-container">
          <img src={image} alt="dashboard picture" className="img" />
        </div>
      </div>
      {/* bottom section (text) */}
      <div className="features-section">{text}</div>
    </Wrapper>
  );
}

export default FeaturesSection1;
