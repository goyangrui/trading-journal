import { useState, useEffect, useRef } from "react";

import moment from "moment";

import { FaTimes } from "react-icons/fa";

import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/JournalEntry";

function JournalEntry({ journalEntry }) {
  // global state variables and functions
  const { editJournal, trades } = useAppContext();

  // local state for notes
  const [notes, setNotes] = useState(journalEntry.notes);

  // local state variable for loading state
  const [isLoading, setIsLoading] = useState(false);

  // useRef hook to reference text area DOM element
  const textAreaEl = useRef(null);

  // handle change for text box (notes) and file input
  const handleChange = async (e) => {
    // if the event id is file-input
    if (e.target.className === "file-input") {
      setIsLoading(true);

      // call editJournal function with journalId, the screenshot file, and the action type (create)
      await editJournal({
        journalId: journalEntry._id,
        screenshotFile: e.target.files[0],
      });

      setIsLoading(false);
    } else {
      // otherwise it will be the text box that has been altered, in which case update the local state notes variable
      setNotes(e.target.value);

      textAreaEl.current.style.height = "44px";

      // get the scroll height from the event target (text area)
      const scrollHeight = e.target.scrollHeight;
      console.log(scrollHeight);

      // set the height property of the text area element to the scrollheight
      textAreaEl.current.style.height = `${scrollHeight}px`;
    }
  };

  // handle blur for notes (submit form if notes text box is blurred)
  const handleBlur = async () => {
    setIsLoading(true);

    // call editJournal function with journalId, notes
    await editJournal({ journalId: journalEntry._id, notes });

    setIsLoading(false);
  };

  // handle click of delete image button
  const handleDeleteImage = async ({ screenshotDocKey, screenshotLink }) => {
    setIsLoading(true);

    // call editJournal function with journalId, screenshotDocKey, screenshotLink
    await editJournal({
      journalId: journalEntry._id,
      screenshotDocKey,
      screenshotLink,
    });

    setIsLoading(false);
  };

  return (
    <Wrapper>
      {/* journal header */}
      <h5 className="journal-header">
        {/* date */}
        {moment(journalEntry.date).utc().format("MMM DD, YYYY")}
      </h5>

      {/* main journal content */}
      <form
        className="journal-content"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* notes text box */}
        <textarea
          id={`notes-${journalEntry._id}`}
          className="journal-notes"
          type="text"
          value={notes}
          placeholder="Enter notes here..."
          onChange={handleChange}
          onBlur={handleBlur}
          ref={textAreaEl}
        />

        {/* screenshots */}
        <div className="screenshots-container">
          {/* display screenshots */}
          {Object.entries(journalEntry.screenshots).map((screenshot, index) => {
            return (
              <div key={index} className="screenshot-container">
                {/* remove button with handler which passes screenshot link and key */}
                <div className="remove-button-container">
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={() => {
                      handleDeleteImage({
                        screenshotDocKey: screenshot[0],
                        screenshotLink: screenshot[1],
                      });
                    }}
                  >
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
              <label
                htmlFor={`file-input-${journalEntry._id}`}
                className="add-image-box"
              >
                Add Image
              </label>
              <input
                className="file-input"
                id={`file-input-${journalEntry._id}`}
                type="file"
                onChange={handleChange}
                onClick={(e) => {
                  e.target.value = null;
                }}
              />
            </>
          )}
        </div>
      </form>

      {/* table of relevant trades */}
      <table className="trades-table">
        {/* table header row with names of metrics and other information*/}
        <thead>
          <tr>
            <th>Status</th>
            <th>Open Date</th>
            <th>Market</th>
            <th>Symbol</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>Position Size</th>
            <th>$ Return</th>
            <th>% Return</th>
            <th>Net Return</th>
            <th>Side</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => {
            {
              /* filter trades array for trades that have the same execution date as the journal date */
              /* for each filtered trade in trades global state variable array, display the trades and their relevant trade metrics information as a row in the table body */
            }
            if (
              trade.openDate.slice(0, 10) === journalEntry.date.slice(0, 10)
            ) {
              return (
                <tr className="table-body-row" key={trade._id}>
                  <td>{trade.status}</td>
                  <td>{moment(trade.openDate).utc().format("MMM DD, YYYY")}</td>
                  <td>{trade.market}</td>
                  <td>{trade.symbol}</td>
                  <td>${Math.round(trade.averageEntry * 100) / 100}</td>
                  <td>${Math.round(trade.averageExit * 100) / 100}</td>
                  <td>{Math.round(trade.positionSize * 100) / 100}</td>
                  <td>${Math.round(trade.dollarReturn * 100) / 100}</td>
                  <td>{Math.round(trade.percentReturn * 100) / 100}%</td>
                  <td>${Math.round(trade.netReturn * 100) / 100}</td>
                  <td>{trade.side}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </Wrapper>
  );
}

export default JournalEntry;
