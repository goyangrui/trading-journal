import Wrapper from "../assets/wrappers/Features";

import { FeaturesSection1 } from "../components";

// import feature section props data
import featureSectionProps from "../utils/features-section";

function Features() {
  return (
    <Wrapper>
      <div className="container">
        {/* for every feature section property */}
        {featureSectionProps.map((feature) => {
          // return a feature section component with the feature's image, and text
          return (
            <FeaturesSection1
              key={feature.id}
              image={feature.image}
              text={feature.text}
            />
          );
        })}
      </div>
    </Wrapper>
  );
}

export default Features;
