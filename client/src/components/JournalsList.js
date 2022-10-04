import { useState, useEffect } from "react";

import { useAppContext } from "../context/appContext";

import { Loading, JournalEntry } from ".";
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
        {journals.map((journalEntry) => {
          // return a journal entry component with date, journal notes, screenshots, and table of trades
          return (
            <JournalEntry key={journalEntry._id} journalEntry={journalEntry} />
          );
        })}
      </Wrapper>
    );
  }
}

export default JournalsList;
