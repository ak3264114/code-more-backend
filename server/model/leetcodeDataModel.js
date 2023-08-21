const mongoose = require("mongoose");

var leetcodeCodeDataSchema = new mongoose.Schema({
  username: { type: String },
  realName: { type: String },
  userAvatar: { type: String },
  attendedContestsCount: { type: Number },
  globalRanking: { type: Number },
  rating: { type: Number },
  totalParticipants: { type: Number },
  problemsolved: [
    {
      difficulty: { type: String },
      count: { type: Number },
      solved: { type: Number },
    },
  ],
});

const LeetcodeData = mongoose.model("leetcodeData", leetcodeCodeDataSchema);
module.exports = LeetcodeData;
