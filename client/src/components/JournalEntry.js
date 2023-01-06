import { useState, useEffect, useRef } from "react";

import moment from "moment";

import { FaTimes } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/JournalEntry";

function JournalEntry({ journalEntry, handleClickImage }) {
  // global state variables and functions
  const {
    editJournal,
    getTrades,
    trades,
    toggleEditTradeModal,
    header,
    reverse,
    setHeaderSet,
  } = useAppContext();

  // local state for notes
  const [notes, setNotes] = useState(journalEntry.notes);

  // local state for the height of the notes textarea
  const [height, setHeight] = useState(journalEntry.height);

  // local state variable for loading state
  const [isLoading, setIsLoading] = useState(false);

  // // local state variable to determine which header has been set, and whether it should be sorted in reverse order or not
  // const [headerSet, setHeaderSet] = useState({
  //   header: "",
  //   reverse: false,
  // });

  // local state variable for determining if a request is still being processed
  const [process, setProcess] = useState(false);

  // useRef hook to reference text area DOM element
  const textAreaEl = useRef(null);

  // on the initial render, set the journal entry notes textarea to the stored value
  useEffect(() => {
    textAreaEl.current.style.height = `${height}px`;
  }, []);

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
      // otherwise it will be the text box that has been altered, in which case update the local state notes and height variable
      setNotes(e.target.value);

      textAreaEl.current.style.height = "44px";

      // get the scroll height from the event target (text area)
      const scrollHeight = e.target.scrollHeight;
      console.log(scrollHeight);

      // set the height property of the text area element to the scrollheight
      textAreaEl.current.style.height = `${scrollHeight}px`;

      // store the scroll height in the local state height variable
      setHeight(scrollHeight);
    }
  };

  // handle blur for notes (submit form if notes text box is blurred)
  const handleBlur = async () => {
    setIsLoading(true);

    // call editJournal function with journalId, notes
    await editJournal({ journalId: journalEntry._id, notes, height });

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

  // function for handling click of trade table row (to open edit trade modal)
  const handleTradeRowClick = (trade) => {
    toggleEditTradeModal(trade);
  };

  // handle header click (for sorting trades on backend, and fetching them)
  const handleSort = async (e, headerNew) => {
    setProcess(true);

    // if the passed in header is the same as the header that is set
    if (headerNew === header) {
      // set reverse value to the opposite of the current reverse value
      const reverseNew = !reverse;

      // send request to backend to sort the trades according to header, and reverse state
      await getTrades(headerNew, reverseNew, undefined, undefined, true);

      // reverse the headerSet reverse state variable
      setHeaderSet(header, reverseNew);
    } else {
      // otherwise, if the passed in header is different
      // set reverse back to false (default)
      const reverseNew = false;

      // send request to backend to sort the trades according to header, and reverse state
      await getTrades(headerNew, reverseNew, undefined, undefined, true);

      // set the headerSet header to the passed in header, and set reverse to true
      setHeaderSet(headerNew, reverseNew);
    }

    setTimeout(() => {
      setProcess(false);
    }, 500);
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
                <img
                  onClick={handleClickImage}
                  src={screenshot[1]}
                  alt="screenshot"
                />
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
      <div className="table-container">
        <table className="trades-table">
          {/* table header row with names of metrics and other information*/}
          <thead>
            <tr>
              <th
                onClick={(e) => {
                  handleSort(e, "status");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                Status
                {reverse === true && header === "status" ? (
                  <IoMdArrowDropdown />
                ) : reverse === false && header === "status" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
              <th
                onClick={(e) => {
                  handleSort(e, "openDate");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                Open Date
                {reverse === true && header === "openDate" ? (
                  <IoMdArrowDropdown />
                ) : reverse === false && header === "openDate" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
              <th
                onClick={(e) => {
                  handleSort(e, "market");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                Market
                {reverse === true && header === "market" ? (
                  <IoMdArrowDropdown />
                ) : reverse === false && header === "market" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
              <th
                onClick={(e) => {
                  handleSort(e, "symbol");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                Symbol
                {reverse === true && header === "symbol" ? (
                  <IoMdArrowDropdown />
                ) : reverse === false && header === "symbol" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
              <th
                onClick={(e) => {
                  handleSort(e, "averageEntry");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                Entry
                {reverse === true && header === "averageEntry" ? (
                  <IoMdArrowDropdown />
                ) : reverse === false && header === "averageEntry" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
              <th
                onClick={(e) => {
                  handleSort(e, "averageExit");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                Exit
                {reverse === true && header === "averageExit" ? (
                  <IoMdArrowDropdown />
                ) : reverse === false && header === "averageExit" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
              <th
                onClick={(e) => {
                  handleSort(e, "positionSize");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                Position Size
                {reverse === true && header === "positionSize" ? (
                  <IoMdArrowDropdown />
                ) : reverse === false && header === "positionSize" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
              <th
                onClick={(e) => {
                  handleSort(e, "dollarReturn");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                $ Return
                {reverse === true && header === "dollarReturn" ? (
                  <IoMdArrowDropdown />
                ) : reverse === false && header === "dollarReturn" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
              <th
                onClick={(e) => {
                  handleSort(e, "percentReturn");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                % Return
                {reverse === true && header === "percentReturn" ? (
                  <IoMdArrowDropdown />
                ) : reverse === false && header === "percentReturn" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
              <th
                onClick={(e) => {
                  handleSort(e, "netReturn");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                Net Return
                {reverse === true && header === "netReturn" ? (
                  <IoMdArrowDropdown />
                ) : reverse === false && header === "netReturn" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
              <th
                onClick={(e) => {
                  handleSort(e, "side");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                Side
                {reverse === true && header === "side" ? (
                  <IoMdArrowDropdown />
                ) : reverse === false && header === "side" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
            </tr>
          </thead>
          {/* for each trade in trades global state variable array, display the trades and their relevant trade metrics information as a row in the table body */}
          <tbody>
            {trades.map((trade) => {
              // filter trades array for trades that have the same execution date as the journal date
              // for each filtered trade in trades global state variable array, display the trades and their relevant trade metrics information as a row in the table body
              if (
                trade.openDate.slice(0, 10) === journalEntry.date.slice(0, 10)
              ) {
                return (
                  <tr
                    className="table-body-row"
                    key={trade._id}
                    onClick={(e) => {
                      handleTradeRowClick(trade);
                    }}
                  >
                    <td>
                      <span
                        className={`label ${
                          trade.status === "OPEN"
                            ? "status-open"
                            : trade.status === "WIN"
                            ? "status-win"
                            : "status-loss"
                        }`}
                      >
                        {trade.status}
                      </span>
                    </td>
                    <td>
                      {moment(trade.openDate).utc().format("MMM DD, YYYY")}
                    </td>
                    <td>{trade.market}</td>
                    <td>{trade.symbol}</td>
                    <td>${Math.round(trade.averageEntry * 100) / 100}</td>
                    <td>${Math.round(trade.averageExit * 100) / 100}</td>
                    <td>{Math.round(trade.positionSize * 100) / 100}</td>
                    <td>
                      <span
                        className={`${
                          trade.dollarReturn > 0
                            ? "return-win"
                            : trade.dollarReturn === 0
                            ? "return-even"
                            : "return-loss"
                        }`}
                      >
                        ${Math.round(trade.dollarReturn * 100) / 100}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${
                          trade.dollarReturn > 0
                            ? "return-win"
                            : trade.dollarReturn === 0
                            ? "return-even"
                            : "return-loss"
                        }`}
                      >
                        {Math.round(trade.percentReturn * 100) / 100}%
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${
                          trade.dollarReturn > 0
                            ? "return-win"
                            : trade.dollarReturn === 0
                            ? "return-even"
                            : "return-loss"
                        }`}
                      >
                        ${Math.round(trade.netReturn * 100) / 100}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`label ${
                          trade.side === "LONG" ? "side-long" : "side-short"
                        }`}
                      >
                        {trade.side}
                      </span>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
}

export default JournalEntry;
