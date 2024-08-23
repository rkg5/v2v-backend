const mongoose = require("mongoose");
require("dotenv").config();

const fileSchema = mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  ContentType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  createdByUser: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  fileTags: {
    type: [String],
  },
  fileCategory: {
    type: [String],
  },
  fileAccessGivenToUsers: {
    type: [
      {
        givenToUser: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        accessGivenAt: {
          type: Date,
        },
        accessExpiresAt: {
          type: Date,
        },
      },
    ],
  },
  fileAccessStatus: {
    type: [
      {
        accessedByUser: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        accessedAt: {
          type: Date,
        },
      },
    ],
  },
});

fileSchema.pre("save", async function () {
  console.log("Before saving the files");
  this.updatedAt = new Date();
});

const fileModel = new mongoose.model("file", fileSchema);

module.exports = fileModel;
