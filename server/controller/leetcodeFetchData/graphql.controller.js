let fetch = require("node-fetch");
const fetchGraphQLUtils = require("./graphql.utils");
const { userProfileQuery } = require("./querry");
const FriendsId = require("../../model/friends_id");
const LeetcodeData = require("../../model/leetcodeDataModel");

const fetchGraphQLData = async (req, res) => {
  try {
    const existfriendId = await FriendsId.exists({
      username: req.user.username,
    });

    if (!existfriendId)
      return res
        .status(404)
        .json({ Status: " success", message: "No friend Found", data: [] });
    const data = await FriendsId.find({ username: req.user.username });
    let leetcodeFinalData = [];
    for (let i = 0; i < data.length; i++) {
      try {
        const graphqldata = await fetchGraphQLUtils(userProfileQuery, {
          username: data[i].friend_id,
        });
        let newdata = await LeetcodeData({
          username: graphqldata.data.matchedUser.username,
          realName: graphqldata.data.matchedUser?.profile.realName,
          userAvatar: graphqldata.data.matchedUser?.profile.userAvatar,
          attendedContestsCount:
            graphqldata.data.userContestRanking?.attendedContestsCount,
          globalRanking: graphqldata.data.userContestRanking?.globalRanking,
          rating: graphqldata.data.userContestRanking?.rating,
          totalParticipants:
            graphqldata.data.userContestRanking?.totalParticipants,
          problemsolved: [
            {
              difficulty: "All",
              count: graphqldata.data.allQuestionsCount.find(
                (item) => item.difficulty === "All"
              ).count,
              solved:
                graphqldata.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                  (item) => item.difficulty === "All"
                ).count,
            },
            {
              difficulty: "Hard",
              count: graphqldata.data.allQuestionsCount.find(
                (item) => item.difficulty === "Hard"
              ).count,
              solved:
                graphqldata.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                  (item) => item.difficulty === "Hard"
                ).count,
            },
            {
              difficulty: "Medium",
              count: graphqldata.data.allQuestionsCount.find(
                (item) => item.difficulty === "Medium"
              ).count,
              solved:
                graphqldata.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                  (item) => item.difficulty === "Medium"
                ).count,
            },
            {
              difficulty: "Easy",
              count: graphqldata.data.allQuestionsCount.find(
                (item) => item.difficulty === "Easy"
              ).count,
              solved:
                graphqldata.data.matchedUser.submitStatsGlobal.acSubmissionNum.find(
                  (item) => item.difficulty === "Easy"
                ).count,
            },
          ],
        });
        leetcodeFinalData.push(newdata);
      } catch (e) {console.log(e)}
    }
    res.json(leetcodeFinalData);
  } catch (err) {
    return res
      .status(500)
      .json({ status: "failed", message: err.message || "An error Occoured" });
    // }
    // try {
    //   const username = req.params.username;
    //   const data = await fetchGraphQLUtils(userProfileQuery, {
    //     username: username,
    //   });
    //   return res.status(200).json(data);
    // } catch (e) {
    //   console.log(e);
  }
};

module.exports = fetchGraphQLData;
