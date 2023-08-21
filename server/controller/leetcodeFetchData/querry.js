exports.userProfileQuery = `query userProblemsSolved($username: String!)
    {
    allQuestionsCount
    {
    difficulty
    count
    }
    matchedUser(username: $username) 
        {
        username
        profile {
        userAvatar
        realName}
        submitStatsGlobal
            {
            acSubmissionNum
                {
                difficulty
                count
                }
            }
        }
        userContestRanking(username:$username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
        badge{
        name
            }
    }
    }`;
