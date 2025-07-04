import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  active: { type: Boolean, default: true }, // <-- user active status
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
