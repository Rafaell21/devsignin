import * as bcrypt from 'bcrypt'
import * as mongoose from 'mongoose'


export const UsersSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
});


UsersSchema.pre('save', async function (next: (err ? : Error) => void) {
    try {
        if (!this.isModified('password')) {
            return next()
        }

        this['password'] = await bcrypt.hash(this['password'], 10)
    } catch (err) {
        return next(err)
    }

});