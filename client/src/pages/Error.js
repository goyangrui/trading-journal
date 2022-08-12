import Wrapper from "../assets/wrappers/Error";

import errorImage from "../assets/images/404_image.svg";

function Error() {
  return (
    <Wrapper>
      <img src={errorImage} alt="error" className="img" />
      <div className="text-container">
        <h2 className="error-text">page not found!</h2>
      </div>
    </Wrapper>
  );
}

export default Error;
