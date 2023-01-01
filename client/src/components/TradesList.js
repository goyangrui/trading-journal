import { useState, useEffect, useRef } from "react";
import moment from "moment";

import { useAppContext } from "../context/appContext";

import { Loading } from ".";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

import Wrapper from "../assets/wrappers/TradesList";

function TradesList() {
  // global state variables
  const {
    getTrades,
    trades,
    setSelectedTrades,
    selectedTrades,
    toggleEditTradeModal,
  } = useAppContext();

  // local state variables
  // local isLoading for trades list
  const [isLoading, setIsLoading] = useState(true);

  // local state variable for tracking if the 'check-all-box' has been checked or not
  const [allChecked, setAllChecked] = useState(false);

  // local state variable for tag display on hover
  const [showTags, setShowTags] = useState({
    display: false,
    tags: undefined,
    tradeId: undefined,
  });

  // local state variable to determine which header has been set, and whether it should be sorted in reverse order or not
  const [headerSet, setHeaderSet] = useState({
    header: "",
    reverse: false,
  });

  // local state variable for determining if a request is still being processed
  const [process, setProcess] = useState(false);

  // useEffect
  // on initial render, send get request to get trades from server. Set isLoading to false once getTrades proccess has been completed.
  useEffect(() => {
    const loadData = async () => {
      await getTrades();
      // set isLoading to false (to display the trades list)
      setIsLoading(false);
    };

    loadData();
  }, []);

  // once the trades global state variable has been changed, update global selectedTrades state accordingly (if trades array state is empty, do nothing, otherwise set the selected
  // trades state to all false by default)
  useEffect(() => {
    // if trades is NOT empty
    if (trades.length) {
      // map the trades object to a map of trading id's as the key, and false as the value
      const tradeIdMap = new Map(
        trades.map((trade) => {
          return [trade._id, false];
        })
      );

      // convert the Map to an object
      const tradeIdObject = Object.fromEntries(tradeIdMap);

      // set the global selectedTrades state
      setSelectedTrades({ ...tradeIdObject });
    }
    // otherwise do nothing
  }, [trades]);

  // whenever the global selectedTrades state changes, first check if the selectedTrades state is empty. If it's empty, do nothing, otherwise check if all of the values are true.
  // If not, set the allChecked to false, and if so, set allChecked to true
  useEffect(() => {
    // if global selectedTrades state is NOT empty
    if (Object.keys(selectedTrades).length) {
      // convert object of key value pairs to array of key value pairs
      const selectedTradesArr = Object.entries(selectedTrades);

      // use Array.prototype.every to check if the second index of every key value pair (the true or false value) is true
      const allTrue = selectedTradesArr.every((pair) => {
        return pair[1];
      });

      // if all values of the selectedTradesArr are true
      if (allTrue) {
        // set the state of allChecked to true
        setAllChecked(true);
      } else {
        // otherwise set the state of allChecked to false
        setAllChecked(false);
      }
    }
    // otherwise do nothing
  }, [selectedTrades]);

  // function for handling the checkbox which has been clicked
  const handleCheckboxClick = (e, tradeId) => {
    // if the checkbox that was clicked was the 'check-all-box' checkbox
    if (tradeId === "check-all-box") {
      // the new state is whatever the opposite of the current allChecked state is (i.e. if the checkbox is currently checked, set to to unchecked, and vice versa)
      const newState = !allChecked;

      // set allChecked to the new state
      setAllChecked(newState);

      // if the newState is true
      if (newState) {
        // set all of the check boxes to true
        Object.keys(selectedTrades).forEach((key) => {
          selectedTrades[key] = true;
        });
        setSelectedTrades({ ...selectedTrades });
      } else {
        // otherwise if newState is false
        // set all of the check boxes to false
        Object.keys(selectedTrades).forEach((key) => {
          selectedTrades[key] = false;
        });
        setSelectedTrades({ ...selectedTrades });
      }
    } else {
      // otherwise, if it was a normal checkbox box
      // set the selectedTrades state at clicked checkbox id to the opposite of what it previously was
      setSelectedTrades({
        ...selectedTrades,
        [tradeId]: !selectedTrades[tradeId],
      });
    }
  };

  // function for handling click of trade table row (to open edit trade modal)
  const handleTradeRowClick = (e, trade) => {
    // only toggle edit trade modal if the event target className is not 'check-box', and if it is not an SVG
    if (
      e.target.tagName !== "svg" &&
      e.target.tagName !== "path" &&
      e.target.className !== "check-box"
    ) {
      toggleEditTradeModal(trade);
    }
  };

  // function for handling hover of tag cell
  const handleTagHover = async (e, tags, display, tradeId, index) => {
    // only show pop-out tags if the scrollWidth of the tag cell is greater than its clientWidth (indicating overflow of tags), and that the display property is true
    if (
      display &&
      tagCells.current[index].scrollWidth > tagCells.current[index].clientWidth
    ) {
      // set the position of the pop-out tags to be right next to the hovered element
      // first, get the y position of the hovered element
      const y = e.target.getBoundingClientRect().y;

      // get the width of the tags header element
      const width = tagsHeader.current.getBoundingClientRect().width;

      // set the position of the pop-out tag at the given index
      popOutTags.current[index].style.top = `${y - 5}px`;
      popOutTags.current[index].style.right = `${width + 15}px`;

      // set display property to be whatever is passed in, and tags to be whatever is passed in
      setShowTags({
        ...showTags,
        display,
        tags,
        tradeId,
      });
    } else {
      // otherwise, do nothing (set the showTags state variable to default state)
      setShowTags({
        ...showTags,
        display: false,
        tags: undefined,
        tradeId: undefined,
      });
    }
  };

  // handle header click (for sorting trades on backend, and fetching them)
  const handleSort = async (e, header) => {
    setProcess(true);

    // if the passed in header is the same as the header that is set
    if (header === headerSet.header) {
      // preserve the reverse value for the set header
      const reverse = headerSet.reverse;

      // send request to backend to sort the trades according to header, and reverse state
      await getTrades(header, reverse);

      // reverse the headerSet reverse state variable
      setHeaderSet({ ...headerSet, reverse: !headerSet.reverse });
    } else {
      // otherwise, if the passed in header is different
      // set reverse back to false (default)
      const reverse = false;

      // send request to backend to sort the trades according to header, and reverse state
      await getTrades(header, reverse);

      // set the headerSet header to the passed in header, and set reverse to true
      setHeaderSet({ ...headerSet, header, reverse: true });
    }

    setTimeout(() => {
      setProcess(false);
    }, 500);
  };

  // reference to the pop-out tag elements
  const popOutTags = useRef([]);

  // reference to individual tag cells
  const tagCells = useRef([]);

  // reference to tags header element (width used as reference for determining offset of pop-out tags)
  const tagsHeader = useRef();

  // everytime the trades array changes, update the popOutTags reference array to be the new trades array (i.e. update the length of the popOutTags array)
  useEffect(() => {
    popOutTags.current = popOutTags.current.slice(0, trades.length);
    tagCells.current = tagCells.current.slice(0, trades.length);
  }, [trades]);

  // if getTrades is still loading
  if (isLoading) {
    return (
      <div className="loading-container">
        <Loading />
      </div>
    );
  } else {
    // otherwise return the list of trades
    return (
      <Wrapper>
        <table className="trades-table">
          {/* table header row with names of metrics and other information*/}
          <thead>
            <tr>
              <th onClick={(e) => handleCheckboxClick(e, "check-all-box")}>
                {/* if the check all checkboxes checkbox is checked, display the checked checkbox svg */}
                {allChecked ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
              </th>
              <th
                onClick={(e) => {
                  handleSort(e, "status");
                }}
                className={process ? "table-header disabled" : "table-header"}
              >
                Status
                {headerSet.reverse === true && headerSet.header === "status" ? (
                  <IoMdArrowDropdown />
                ) : headerSet.reverse === false &&
                  headerSet.header === "status" ? (
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
                {headerSet.reverse === true &&
                headerSet.header === "openDate" ? (
                  <IoMdArrowDropdown />
                ) : headerSet.reverse === false &&
                  headerSet.header === "openDate" ? (
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
                {headerSet.reverse === true && headerSet.header === "market" ? (
                  <IoMdArrowDropdown />
                ) : headerSet.reverse === false &&
                  headerSet.header === "market" ? (
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
                {headerSet.reverse === true && headerSet.header === "symbol" ? (
                  <IoMdArrowDropdown />
                ) : headerSet.reverse === false &&
                  headerSet.header === "symbol" ? (
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
                {headerSet.reverse === true &&
                headerSet.header === "averageEntry" ? (
                  <IoMdArrowDropdown />
                ) : headerSet.reverse === false &&
                  headerSet.header === "averageEntry" ? (
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
                {headerSet.reverse === true &&
                headerSet.header === "averageExit" ? (
                  <IoMdArrowDropdown />
                ) : headerSet.reverse === false &&
                  headerSet.header === "averageExit" ? (
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
                {headerSet.reverse === true &&
                headerSet.header === "positionSize" ? (
                  <IoMdArrowDropdown />
                ) : headerSet.reverse === false &&
                  headerSet.header === "positionSize" ? (
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
                {headerSet.reverse === true &&
                headerSet.header === "dollarReturn" ? (
                  <IoMdArrowDropdown />
                ) : headerSet.reverse === false &&
                  headerSet.header === "dollarReturn" ? (
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
                {headerSet.reverse === true &&
                headerSet.header === "percentReturn" ? (
                  <IoMdArrowDropdown />
                ) : headerSet.reverse === false &&
                  headerSet.header === "percentReturn" ? (
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
                {headerSet.reverse === true &&
                headerSet.header === "netReturn" ? (
                  <IoMdArrowDropdown />
                ) : headerSet.reverse === false &&
                  headerSet.header === "netReturn" ? (
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
                {headerSet.reverse === true && headerSet.header === "side" ? (
                  <IoMdArrowDropdown />
                ) : headerSet.reverse === false &&
                  headerSet.header === "side" ? (
                  <IoMdArrowDropup />
                ) : (
                  ""
                )}
              </th>
              <th ref={tagsHeader}>Tags</th>
            </tr>
          </thead>
          {/* for each trade in trades global state variable array, display the trades and their relevant trade metrics information as a row in the table body */}
          <tbody>
            {trades.map((trade, i) => {
              return (
                <tr
                  className="table-body-row"
                  key={trade._id}
                  onClick={(e) => {
                    handleTradeRowClick(e, trade);
                  }}
                >
                  <td
                    className="check-box"
                    onClick={(e) => handleCheckboxClick(e, trade._id)}
                  >
                    {/* if the state of the selectedTrade at tradeId is true (i.e. selected) */}
                    {selectedTrades[trade._id] ? (
                      // display the checked checkbox svg
                      <ImCheckboxChecked className="check-box" />
                    ) : (
                      // otherwise display the unchecked checkbox svg
                      <ImCheckboxUnchecked className="check-box" />
                    )}
                  </td>
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
                  <td>{moment(trade.openDate).utc().format("MMM DD, YYYY")}</td>
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

                  <td
                    className="tag-cell"
                    onMouseEnter={(e) => {
                      handleTagHover(
                        e,
                        trade.tags,
                        true,
                        `tag-cell-${trade._id}`,
                        i
                      );
                    }}
                    onMouseLeave={(e) => {
                      handleTagHover(e, trade.tags, false);
                    }}
                    ref={(el) => (tagCells.current[i] = el)}
                  >
                    {Object.entries(trade.tags).map((tag) => {
                      return (
                        <span key={tag[0]} className="label tag">
                          {tag[1]}
                        </span>
                      );
                    })}

                    {/* Tag pop-out cell */}
                    {/* only show pop-out tags if showTags display is set and that the hovered cell id is the same as the one that is set */}
                    <div
                      className={
                        showTags.display &&
                        showTags.tradeId === `tag-cell-${trade._id}`
                          ? `pop-out-tags`
                          : `pop-out-tags hidden`
                      }
                      ref={(el) => (popOutTags.current[i] = el)}
                    >
                      {/* if showTags.tags array length is not undefined*/}
                      {showTags.tags &&
                        // for every tag in showTags state variable
                        Object.entries(showTags.tags).map((tag) => {
                          // show the pop out tags
                          return (
                            <span key={tag[0]} className="label tag">
                              {tag[1]}
                            </span>
                          );
                        })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!trades.length && <h5 className="no-trades">no trades</h5>}
      </Wrapper>
    );
  }
}

export default TradesList;
