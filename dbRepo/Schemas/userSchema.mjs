import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: { type: String },
    contact: { type: Number },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role:{ type: String },
    createdOn: { type: Date, default: Date.now },
});
const userModel = mongoose.model('Users', userSchema);

export default userModel