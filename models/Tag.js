import mongoose from "mongoose";
import Trade from "./Trade.js";

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

// tag middleware that triggers before tag is removed
TagSchema.pre("deleteOne", { document: true, query: false }, async function () {
  // get this tag's id
  var tagId = this._id;

  // find all trades that have this tag
  const trades = await Trade.find({ createdBy: this.createdBy })
    .where(`tags.${tagId}`)
    .exists();

  // loop through each trade
  trades.forEach(async (trade, index) => {
    // delete the tag with this tagId from the current trade.tags map in loop
    trade.tags.delete(tagId);
    await trade.save();
  });
});

// export tag model
export default mongoose.model("Tag", TagSchema);
