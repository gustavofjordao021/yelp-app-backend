const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://cl.goliath.com/image/upload/t_tn,f_auto,q_auto,$h_480,$w_895/go/2020/01/baby-yoda-life-size-figure-584x600-895x480.jpg",
    },
    collections: [
      {
        type: Schema.Types.ObjectId,
        ref: "Collections",
      },
    ],
    plants: [
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

module.exports = model("User", userSchema);
