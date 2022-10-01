import { useState, useEffect } from "react";
import moment from "moment";

import { useAppContext } from "../context/appContext";

import { Loading } from ".";
import Wrapper from "../assets/wrappers/JournalsList";

function JournalsList() {
  // global state variables and functions
  const { trades, getTrades, getJournals, journals } = useAppContext();

  // local state variables and functions
  const [isLoading, setIsLoading] = useState(true);

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

  // if trade and journal data is loading
  if (isLoading) {
    return <Loading />;
  } else {
    // otherwise, return the list of journal entries
    return (
      <Wrapper>
        {/* for every journal in global journals state variable */}
        {journals.map((journalEntry, index) => {
          // return a journal entry component with date, journal notes, screenshots, and table of trades
          return (
            <div className="journal-entry" key={index}>
              {/* journal header */}
              <h5 className="journal-header">
                {/* date */}
                {moment(journalEntry.date).format("MMM DD, YYYY")}
              </h5>

              {/* main journal content */}
              <div className="journal-content">
                {/* notes */}
                Notes:
                <input className="journal-notes" type="text" />
                {/* screenshots */}
                {/* table of relevant trades */}
              </div>
            </div>
          );
        })}
      </Wrapper>
    );
  }
}

export default JournalsList;
