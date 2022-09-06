import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    minLength: [4, "Username must be at least 4 characters long"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Please provide a password"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  profile: {
    type: String,
    default: "",
  },
  customerId: {
    type: String,
    required: [true, "Please provide stripe customer ID"],
  },
});

// Middleware

// (this prehook hashes the password property and fires when create() is called)
UserSchema.pre("save", async function () {
  // if the password was not modified, then don't hash the password (for updateUser)
  if (!this.isModified("password")) {
    console.log("password not modified");
    return;
  }

  // otherwise if the password was changed, or a new user was created, generate salt, and hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);

  // set this document's password property to the newly hashed password
  this.password = hashedPassword;
});

// Custom instance methods

// create JWT token
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      username: this.username,
      email: this.email,
      image: this.profile,
      customerId: this.customerId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

// Export User Model
export default mongoose.model("User", UserSchema);
