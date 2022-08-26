import { FaTimes } from "react-icons/fa";

import { useAppContext } from "../context/appContext";

import Wrapper from "../assets/wrappers/Alert";

function Alert() {
  // global state variables and functions
  const { alertText, alertType, clearAlert } = useAppContext();

  // close button handler
  const closeButtonHandler = () => {
    clearAlert();
  };

  return (
    <Wrapper className={`alert alert-${alertType}`}>
      {/* if the alertType is danger, show this heading */}
      {alertType === "danger" && (
        <h5>
          {`The form contains ${alertText.split(",").length} error${
            alertText.split(",").length > 1 ? "s" : ""
          }`}
        </h5>
      )}
      {/* return unordered list of alert text message(s) */}
      <ul
        className={
          alertType === "danger"
            ? "list-container list-container-danger"
            : "list-container"
        }
      >
        {/* list of items */}
        <div className="list">
          {alertText.split(",").map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </div>

        {/* close button (if alert type is success) */}
        {alertType === "success" && (
          <button
            type="button"
            className={`close-btn close-btn-${alertType}`}
            onClick={closeButtonHandler}
          >
            <FaTimes />
          </button>
        )}
      </ul>
    </Wrapper>
  );
}

export default Alert;
