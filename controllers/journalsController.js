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
  // get the journal id and notes from the request body
  const { journalId, notes } = req.body;

  // get screenshot file from req.file from multer
  const screenshotFile = req.file;

  // return res.json({ journalId, notes, screenshotFile });

  // find the journal from the passed in id
  const journal = await Journal.findById(journalId);

  // check if the journal with the provided id exists
  if (!journal) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Journal with provided id could not be found",
    });
  }

  // store the file in AWS S3 screenshots bucket
  // if the screenshotFile was retrieved from the user
  if (screenshotFile) {
  }

  // push the screenshot link to the screenshots array in the journal document
  journal.screenshots.push(screenshotLink);
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
