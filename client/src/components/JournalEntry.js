import { useState } from "react";

import moment from "moment";

import { FaTimes } from "react-icons/fa";

import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/JournalEntry";

function JournalEntry({ journalEntry }) {
  // global state variables and functions
  const { editJournal } = useAppContext();

  // local state variables and functions
  const [state, setState] = useState({
    journalId: journalEntry._id,
    notes: journalEntry.notes,
    screenshots: journalEntry.screenshots,
    screenshotFile: null,
    action: "create",
  });

  const [isLoading, setIsLoading] = useState(false);

  // handle change
  const handleChange = (e) => {
    // if it is a file input that has changed
    if (e.target.id === "file-input") {
      // get the screenshotFile state property to the file that was just added
      const value = e.target.files[0];
      setState({ ...state, screenshotFile: value });
    } else {
      // otherwise (if the notes text box has been changed)
      const key = e.target.id.split("-")[0];
      const value = e.target.value;
      console.log(key);
      setState({ ...state, [key]: value });
    }
  };

  // form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = async () => {
      // set loading to true to prevent user from making further submissions until current submission has been processed
      setIsLoading(true);

      // send request to backend to edit journal based on state variables
      await editJournal(state);

      setIsLoading(false);

      // set screenshotFile state back to null
      setState({ ...state, screenshotFile: null });
    };
    submitData();
  };

  return (
    <Wrapper>
      {/* journal header */}
      <h5 className="journal-header">
        {/* date */}
        {moment(journalEntry.date).format("MMM DD, YYYY")}
      </h5>

      {/* main journal content */}
      <form className="journal-content" onSubmit={handleSubmit}>
        {/* notes text box */}
        <label htmlFor={`notes-${journalEntry._id}`}>Notes:</label>
        <input
          id={`notes-${journalEntry._id}`}
          className="journal-notes"
          type="text"
          value={state.notes}
          onChange={handleChange}
        />

        {/* screenshots */}
        <div className="screenshots-container">
          {/* display screenshots */}
          {Object.entries(journalEntry.screenshots).map((screenshot, index) => {
            return (
              <div key={index} className="screenshot-container">
                <div className="remove-button-container">
                  <button type="button" className="remove-image-button">
                    <FaTimes />
                  </button>
                </div>
                <img src={screenshot[1]} alt="screenshot" />
              </div>
            );
          })}
          {/* only display a file-input box if the screenshots objects length is less than 2 */}
          {Object.keys(journalEntry.screenshots).length < 2 && (
            <>
              <label htmlFor="file-input" className="add-image-box">
                Add Image
              </label>
              <input id="file-input" type="file" onChange={handleChange} />
            </>
          )}
        </div>

        {/* table of relevant trades */}
      </form>
    </Wrapper>
  );
}

export default JournalEntry;
