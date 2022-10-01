import { StatusCodes } from "http-status-codes";
import Journal from "../models/Journal.js";

// import AWS S3 service functions
import { s3UploadScreenshot, s3DeleteScreenshot } from "../aws/s3Service.js";

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
  const journal = await Journal.create({
    notes,
    date,
    createdBy: userId,
    screenshots: new Map(),
  });

  res.status(StatusCodes.CREATED).json(journal);
};

const editJournal = async (req, res) => {
  // get the user id from req.user
  const { userId } = req.user;

  // get the journal id and notes from the request body
  const { journalId, notes } = req.body;

  // get the screenshot file action type from request body
  const { action } = req.body;

  // find the journal from the passed in id
  const journal = await Journal.findById(journalId);

  // check if the journal with the provided id exists
  if (!journal) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Journal with provided id could not be found",
    });
  }

  // if the action type is "create"
  if (action === "create") {
    // get screenshot file from req.file from multer
    const screenshotFile = req.file;

    // store the file in AWS S3 screenshots bucket
    // if the screenshotFile was retrieved from the user
    if (screenshotFile) {
      // upload the screenshot to S3
      let { key: screenshotKey, imageURL: screenshotLink } =
        await s3UploadScreenshot(screenshotFile);

      // get the key from the screenshot link
      screenshotKey = screenshotKey.split(":")[0];

      // try and set the screenshot key to the screenshot link in the screenshots map in journal document
      journal.screenshots.set(screenshotKey, screenshotLink);
    }
  } else {
    // otherwise, the user is trying to delete the screenshot
    // get screenshot key from the request body
    let { screenshotKey } = req.body;

    console.log(screenshotKey);

    // delete the screenshot from S3
    await s3DeleteScreenshot(screenshotKey);

    // remove the screenshot from the journal list of screenshots
    // TODO
  }

  // update the notes to the journal document
  journal.notes = notes;

  // try and save the document with updated screenshots, and notes (mongoose will throw validation error if pushing the screenshot
  // puts the screenshots array above 2 items)
  await journal.save();

  res.status(StatusCodes.OK).json(journal);
};

const deleteJournal = async (req, res) => {
  await Journal.deleteMany({});
  res.send("deleted all journals");
};

export { createJournal, editJournal, deleteJournal };
