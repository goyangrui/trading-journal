import Wrapper from "../assets/wrappers/Avatar";

function Avatar({ name, image, handleFileInput }) {
  return (
    <Wrapper>
      {/* image contained within label for file input type */}
      <label htmlFor="file-input">
        <img src={image} alt="profile" className="img" />
      </label>
      <input
        name={name}
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleFileInput}
      />
    </Wrapper>
  );
}

export default Avatar;
