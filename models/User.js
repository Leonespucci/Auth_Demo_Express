const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username : {
        type: String,
        required : [true, 'Username tidak boleh kosong'],
    },
    password : {
    type : String,
    required : [true, 'Password Harus di isi']
    }
});

//for login
userSchema.statics.findByCredentials = async function (username, password){
    const user = await this.findOne({username})
    const isMatch = await bcrypt.compare(password, user.password)
    return isMatch ? user : false
}

//for register
userSchema.pre('save', async function (next){
    if(!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

module.exports = mongoose.model('User', userSchema);