import Tag from "../models/Tag.js";

import { StatusCodes } from "http-status-codes";

// get tags
const getTags = async (req, res) => {
  // get userId from the req.user object
  const { userId } = req.user;

  console.log(userId);

  // find tags with the given userId
  const tags = await Tag.find({ createdBy: userId });

  res.status(StatusCodes.OK).json({ tags });
};

// create tag
const createTag = async (req, res) => {
  // get the tag text from the request body
  const { text } = req.body;

  // get the userId from the req.user object
  const { userId } = req.user;

  // check if a tag with the given user Id AND text already exists
  const foundTag = await Tag.findOne({ text, userId });
  if (foundTag) {
    // if the tag already exists, return an error to the client
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Tag already exists" });
  }

  // create tag with given text and userId
  const tag = await Tag.create({ text, createdBy: userId });

  res.status(StatusCodes.CREATED).json({ tag });
};

// delete tag
const deleteTag = async (req, res) => {
  // get id of tag from the request url parameters
  const { id } = req.params;

  // delete the tag with the given id
  const tag = await Tag.findOne({ _id: id });
  const tagDeleted = await tag.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "tag deleted", tagDeleted });
};

export { getTags, createTag, deleteTag };
