const { Schema, model } = require("mongoose");

const goalSchema = new Schema(
  {
    plantName: {
      type: String,
      trim: true,
      required: true,
    },
    plantPicture: {
      type: String,
      default:
        "../../plant-app-frontend/src/assets/img/brand/generic_plant.png  ",
    },
    plantLink: { type: String },
    plantOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    plantActions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Action",
      },
    ],
    plantCollection: [
      {
        type: Schema.Types.ObjectId,
        ref: "Collection",
      },
    ],
    plantDate: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Plant", goalSchema);
