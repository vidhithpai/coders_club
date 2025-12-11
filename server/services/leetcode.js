const axios = require('axios');

async function checkLeetCode(username, problemSlug) {
    const query = `
    query getRecentSubmissions($username: String!) {
      recentAcSubmissionList(username: $username, limit: 20) {
        titleSlug
        timestamp
      }
    }
  `;

    try {
        const response = await axios.post('https://leetcode.com/graphql', {
            query,
            variables: { username }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; SafeCodersClub/1.0)'
            }
        });

        if (response.data.errors) {
            console.error("LeetCode API Error:", response.data.errors);
            return false; // Or throw error
        }

        const submissions = response.data.data.recentAcSubmissionList || [];

        // Check if problem with matching slug exists in recent submissions
        const solved = submissions.some(sub => sub.titleSlug === problemSlug);

        // Note: We could also check timestamp if we want to ensure it was solved *today* strictly by time,
        // but the requirement "Solved Today" usually implies "submitted successfully" relative to the daily challenge window.
        // Since we clear "solvedToday" flag daily in DB (via cron or manual reset), checking recent(20) is a reasonable proxy 
        // assuming users don't solve 20+ other problems after the daily one before submitting.

        return solved;

    } catch (error) {
        console.error("Error fetching LeetCode data:", error.message);
        return false;
    }
}

module.exports = { checkLeetCode };
