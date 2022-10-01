import mongoose from "mongoose";

/*
 * some general text for the user to type whatever they want
 * contain a list of links to images stored on AWS S3 (maximum of 2 images per journal entry)
 * date of entry
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
  createdBy: {
    type: mongoose.Types.ObjectId,
  },
});

// custom validator function for making sure the length of the screenshots array is less than or equal to 2
function mapLimit() {
  console.log(this.screenshots);
  // if adding the screenshot makes the length of the screenshots array greater than 2, return false (validator failed)
  // return this.screenshots.length <= 2;
  return true;
}

export default mongoose.model("Journal", JournalSchema);
