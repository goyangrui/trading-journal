import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

import { useAppContext } from "../context/appContext";

import { Loading, JournalEntry } from ".";
import Wrapper from "../assets/wrappers/JournalsList";

function JournalsList() {
  // global state variables and functions
  const { trades, getTrades, getJournals, journals } = useAppContext();

  // local state variables and functions
  const [isLoading, setIsLoading] = useState(true);

  // local state variable for image modal
  const [imageModal, setImageModal] = useState({
    display: false,
    src: undefined,
  });

  // useEffect
  // on initial render, load all journals and corresponding trades
  useEffect(() => {
    const loadData = async () => {
      await getTrades();
      await getJournals();

      // set local isLoading state variable to false once data has been fetched
      setIsLoading(false);
    };

    loadData();
  }, []);

  // handle click of image
  const handleClickImage = async (e) => {
    // toggle image modal and set the local state image source variable
    setImageModal({ ...imageModal, display: true, src: e.target.src });
  };

  // handle click of close button in image modal
  const handleCloseImage = async (e) => {
    setImageModal({ ...imageModal, display: false, src: undefined });
  };

  // if trade and journal data is loading
  if (isLoading) {
    return <Loading />;
  } else {
    // otherwise, return the list of journal entries
    return (
      <Wrapper>
        {/* for every journal in global journals state variable */}
        {journals.map((journalEntry) => {
          // return a journal entry component with date, journal notes, screenshots, and table of trades
          return (
            <JournalEntry
              key={journalEntry._id}
              journalEntry={journalEntry}
              handleClickImage={handleClickImage}
            />
          );
        })}

        {/* show image modal if the display state variable is set to true */}
        {imageModal.display && (
          <div className="image-modal">
            {/* modal content */}
            <div className="image-modal-content">
              {/* close modal button */}
              <div className="modal-button-container">
                <button
                  onClick={handleCloseImage}
                  type="button"
                  className="modal-close-btn"
                >
                  <FaTimes />
                </button>
              </div>
              {/* image */}
              <img className="img" src={imageModal.src} alt="image modal" />
            </div>
          </div>
        )}

        {/* if there is no journals */}
        {journals.length === 0 && <h5>No journals</h5>}
      </Wrapper>
    );
  }
}

export default JournalsList;
