import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  profileImage: { type: String, default: '' },
  address: {
    address1: { type: String, default: '' },
    address2: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' }
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  lastLogin: { type: Date },
}, { timestamps: true });


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
