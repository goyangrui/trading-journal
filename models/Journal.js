import mongoose from "mongoose";

/*
 * some general text for the user to type whatever they want
 * contain a list of links to images stored on AWS S3 (maximum of 2 images per journal entry)
 * date of entry
 * height value to store the height of the notes text area (default of 40)
 * an associated user id
 */

const JournalSchema = new mongoose.Schema({
  notes: {
    type: String,
    default: "",
  },
  screenshots: {
    type: Map,
    of: String,
    validate: {
      validator: mapLimit,
      message: "You can only have 2 screenshots per journal entry",
    },
  },
  date: {
    type: Date,
  },
  height: {
    type: Number,
    default: 40,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
  },
});

// custom validator function for making sure the length of the screenshots array is less than or equal to 2
function mapLimit() {
  // if adding the screenshot makes the length of the screenshots array greater than 2, return false (validator failed)
  // otherwise, add the screenshot
  return this.screenshots.size <= 2;
}

export default mongoose.model("Journal", JournalSchema);
