import { StatusCodes } from "http-status-codes";
import Journal from "../models/Journal.js";

// import AWS S3 service functions
import { s3UploadScreenshot, s3DeleteScreenshot } from "../aws/s3Service.js";

const getJournals = async (req, res) => {
  // get the user ID from the req.user object
  const { userId } = req.user;

  // get all journal entries with the userId
  const journals = await Journal.find({ createdBy: userId });

  res.status(StatusCodes.OK).json({ journals });
};

const createJournal = async (req, res) => {
  // get the text and date from the request body
  // get method from request body (manual creation, or from trade creation)
  const { date, notes, method } = req.body;

  // get the user id from req.user
  const { userId } = req.user;

  // if the date doesn't exist
  if (!date) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide date of journal entry" });
  }

  // find the journal entry with the provided date AND createdBy userId (return null if not found)
  const foundJournal = await Journal.findOne({ date, createdBy: userId });

  // if the journal with the specified date was found
  if (foundJournal) {
    // if the method is through trade creation, don't throw an exception
    if (method === "trade-creation") {
      return res
        .status(StatusCodes.OK)
        .json({ msg: "Journal was not created" });
    } else {
      // otherwise if the journal entry was created manually
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Journal entry with provided date already exists" });
    }
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
  // get the journal id from the request body
  const { journalId } = req.body;

  // find the journal from the passed in id
  const journal = await Journal.findById(journalId);

  // check if the journal with the provided id exists
  if (!journal) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Journal with provided id could not be found",
    });
  }

  // -- NOTES --
  // get the notes and textarea height from the request body
  let { notes, height } = req.body;

  // if the notes exists (can be empty string, but not undefined)
  if (notes !== undefined) {
    // update the notes to the journal document
    journal.notes = notes;
  }

  // if the height exists
  if (height !== undefined) {
    // cast height to integer
    height = parseInt(height);
    // update the height to the journal document

    journal.height = height;
  }

  // -- SCREENSHOTS --
  // get screenshot file from req.file from multer
  const screenshotFile = req.file;

  // -- ADD SCREENSHOT --
  // only add screenshot to S3 bucket and journal screenshots map
  // if the number of screenshots in the journal is less than 2, and the screenshotFile exists from the user request
  if (journal.screenshots.size < 2 && screenshotFile) {
    // store the file in AWS S3 screenshots bucket
    let { key: screenshotKey, imageURL: screenshotLink } =
      await s3UploadScreenshot(screenshotFile);

    // get the uuid key from the screenshotKey (for Journal document)
    const screenshotDocKey = screenshotKey.split("::")[0];

    // set the screenshot key to the screenshot link in the screenshots map in journal document
    journal.screenshots.set(screenshotDocKey, screenshotLink);

    console.log(journal);
  }

  // -- REMOVE SCREENSHOT --
  // get screenshot doc key and link from the request body
  const { screenshotLink, screenshotDocKey } = req.body;

  // only if the user provided the screenshot link and doc key, delete the screenshot
  if (screenshotLink && screenshotDocKey) {
    // extrapolate the screenshot key for the S3 bucket from the screenshotLink
    const screenshotKey = screenshotLink.split(
      process.env.AWS_SCREENSHOT_URL
    )[1];

    // if the screenshot key (from the link spliting) exists
    if (screenshotKey) {
      // delete the screenshot from S3
      await s3DeleteScreenshot(screenshotKey);

      // remove the screenshot from the journal list of screenshots
      journal.screenshots.delete(screenshotDocKey);
    }
  }

  // try and save the document with updated screenshots, and notes (mongoose will throw validation error if pushing screenshots map size above 2)
  await journal.save();

  res.status(StatusCodes.OK).json(journal);
};

const deleteJournal = async (req, res) => {
  await Journal.deleteMany({});
  res.send("deleted all journals");
};

export { createJournal, editJournal, deleteJournal, getJournals };
