import { useState, useEffect } from "react";

import Wrapper from "../../assets/wrappers/Profile";

import { useAppContext } from "../../context/appContext";

import { FormRow, Alert, Avatar } from "../../components";

// default profile picture
import defaultImage from "../../assets/images/default-avatar.jpg";

// initial state
const initialState = {
  username: "",
  email: "",
  newPassword: "",
  confirmation: "",
  image: "",
  file: null,
};

function Profile() {
  // global state variables and functions
  const { user, isLoading, showAlert, updateUser, changePassword } =
    useAppContext();

  // local state variables for form fields
  const [values, setValues] = useState({
    ...initialState,
    username: user?.username,
    email: user?.email,
    image: user?.image || defaultImage,
  });

  // handle change of form input fields
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // handle change of file input
  const handleFileInput = (e) => {
    // set the file input name key to the file object
    setValues({ ...values, [e.target.name]: e.target.files[0] });
  };

  // handle update form submissions
  const handleSubmit = (e) => {
    e.preventDefault();

    // if it is the user info form that was submitted
    if (e.target.name === "info") {
      // only update username, email, and profile picture
      updateUser(
        {
          username: values.username,
          email: values.email,
        },
        values.file
      );
    }

    // otherwise if it is the user password form that was submitted
  };

  return (
    <Wrapper>
      <div className="container">
        {/* Change user information form*/}
        <form className="form" name="info" onSubmit={handleSubmit}>
          {/* Alert */}
          {showAlert && <Alert />}

          {/* form title */}
          <h3>Profile</h3>

          {/* Profile picture (file type input only accepts images) */}
          <Avatar
            name="file"
            image={values.image}
            handleFileInput={handleFileInput}
          />

          {/* form fields */}

          {/* username */}
          <FormRow
            name="username"
            type="text"
            value={values.username}
            handleChange={handleChange}
          />

          {/* email */}
          <FormRow
            name="email"
            type="email"
            value={values.email}
            handleChange={handleChange}
          />

          {/* buttons container */}
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            Update
          </button>
        </form>
      </div>
    </Wrapper>
  );
}

export default Profile;
