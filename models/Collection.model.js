const { Schema, model } = require("mongoose");

const collectionSchema = new Schema(
  {
    collectionName: {
      type: String,
      required: true,
      trim: true,
    },
    collectionDescription: {
      type: String,
      required: true,
      trim: true,
    },
    collectionOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    collectionPlants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Plants",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Collections", collectionSchema);
