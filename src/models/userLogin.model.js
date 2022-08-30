const mongoose = require('mongoose');
const userLoginSchema = mongoose.Schema({
    deleted_flg: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: String
    },
    device_id: {
        type: String
    },
    login_time: {
        type: Date
    }
}, {
    timestamps: true
})
userLoginSchema.index({
    user_id: 1
})
module.exports = mongoose.model("userLogin", userLoginSchema)