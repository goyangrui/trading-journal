import Journal from "../models/Journal.js";
import { StatusCodes } from "http-status-codes";

const createJournal = async (req, res) => {
  // get the text and date from the request body
  const { date } = req.body;
  let { notes } = req.body;

  // get the user id from req.user
  const { userId } = req.user;

  // if the date doesn't exist
  if (!date) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide date of journal entry" });
  }

  // find the journal entry with the provided date (return null if not found)
  const foundJournal = await Journal.findOne({ date });

  console.log(foundJournal);

  // if the journal with the specified date was found, don't create another journal entry
  if (foundJournal) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Journal entry with provided date already exists" });
  }

  // create a journal entry with the provided date, and notes from the request body, and userId from the req.user object
  const journal = await Journal.create({ notes, date, createdBy: userId });

  res.status(StatusCodes.CREATED).json(journal);
};

const editJournal = async (req, res) => {
  // get the journal id from the request body
  const { journalId } = req.body;

  // find the journal from the passed in id
  const journal = await Journal.findById(journalId);

  // push the screenshot to the screenshots array in the journal document
  journal.screenshots.push("item1");
  // try and save the document with updated screenshots array (mongoose will throw validation error if pushing the screenshot
  // puts the screenshots array above 2 items)
  await journal.save();

  res.send("edit journal");
};

const deleteJournal = async (req, res) => {
  await Journal.deleteMany({});
  res.send("deleted all journals");
};

export { createJournal, editJournal, deleteJournal };
