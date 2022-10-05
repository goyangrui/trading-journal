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
  const {
    user,
    isLoading,
    showAlert,
    clearAlert,
    getSubscriptions,
    updateUser,
    changePassword,
  } = useAppContext();

  // local state variables for form fields on initial render
  const [values, setValues] = useState({
    ...initialState,
    username: user?.username || "",
    email: user?.email || "",
    image: user?.image || defaultImage,
  });

  // useEffect
  useEffect(() => {
    // on initial render of profile page, clear any alerts, get subscriptions and fetch the user
    getSubscriptions();
    clearAlert();
  }, []);

  // anytime the user global state variable changes, update the local state username, email, and image property
  useEffect(() => {
    console.log("user state variable initially set or changed");

    setValues({
      ...values,
      username: user?.username || "",
      email: user?.email || "",
      image: user?.image || defaultImage,
    });
  }, [user]);

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

    const submitData = async () => {
      // if it is the user info form that was submitted
      if (e.target.name === "info") {
        // only update username, email, and profile picture
        await updateUser(
          {
            username: values.username,
            email: values.email,
          },
          values.file
        );

        // clear the file state value after submission
        setValues({ ...values, file: null });
      }

      // otherwise if it is the user password form that was submitted
      if (e.target.name === "password") {
        // only update user password
        await changePassword({
          newPassword: values.newPassword,
          confirmation: values.confirmation,
        });

        // clear the password state values after submission
        setValues({ ...values, newPassword: "", confirmation: "" });
      }
    };

    submitData();
  };

  return (
    <Wrapper>
      <div className="container">
        {/* Alert */}
        {showAlert && <Alert />}
        {/* Change user information form*/}
        <form className="form" name="info" onSubmit={handleSubmit}>
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

          {/* submit button */}
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            Update
          </button>
        </form>

        {/* Change password form */}
        <form className="form" name="password" onSubmit={handleSubmit}>
          {/* form title */}
          <h3>change password</h3>

          {/* new password */}
          <FormRow
            name="newPassword"
            labelText="new password"
            type="password"
            value={values.newPassword}
            handleChange={handleChange}
          />

          {/* confirmation */}
          <FormRow
            name="confirmation"
            labelText="confirm password"
            type="password"
            value={values.confirmation}
            handleChange={handleChange}
          />

          {/* submit button */}
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            Update
          </button>
        </form>
      </div>
    </Wrapper>
  );
}

export default Profile;
