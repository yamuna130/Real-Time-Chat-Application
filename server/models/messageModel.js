import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    text: { type: String, default: "" },
    fileUrl: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
