import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({   //<Custom data Type> Generic
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
},{timestamps: true});

// DATA ----->  PRE-HOOKS     --------> DATABASE

//PRE-HOOKS are used to perform actions before certain events, like saving a document.
// In this case, we are hashing the password before saving the user document.
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = models.User || model<IUser>("User",userSchema);

export default User;