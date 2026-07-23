import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
    },

    displayName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    accessToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);