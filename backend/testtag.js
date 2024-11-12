const mongoose = require("mongoose");
const TagSchema = new mongoose.Schema({
    tag: String,
    tagId: Number
})
module.exports = TagSchema;