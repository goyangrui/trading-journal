import mongoose from "mongoose";

// tag schema
// text property
// and createdBy property
const TagSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please provide a tag"],
    maxLength: 50,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

// export tag model
export default mongoose.model("Tag", TagSchema);
