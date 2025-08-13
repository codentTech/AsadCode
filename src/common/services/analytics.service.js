import api from "../utils/api";

class AnalyticsService {
  /**
   * Get analytics for a specific social media platform
   * @param {string} platform - The social media platform (facebook, instagram, twitter, tiktok, youtube)
   * @returns {Promise} Analytics data for the platform
   */
  async getPlatformAnalytics(platform) {
    try {
      const response = await api().get(`/auth/analytics/${platform}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${platform} analytics:`, error);
      throw error;
    }
  }

  /**
   * Get analytics for all connected platforms
   * @returns {Promise} Analytics data for all platforms
   */
  async getAllPlatformsAnalytics() {
    try {
      // Get user's connected social accounts first
      const accountsResponse = await api().get("/auth/social-accounts");
      const accounts = accountsResponse.data?.data || [];

      // Fetch analytics for each connected platform
      const analyticsPromises = accounts.map((account) =>
        this.getPlatformAnalytics(account.platform)
      );

      const analyticsResults = await Promise.allSettled(analyticsPromises);

      // Filter successful results and format data
      const successfulAnalytics = analyticsResults
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value?.data);

      return successfulAnalytics;
    } catch (error) {
      console.error("Error fetching all platforms analytics:", error);
      throw error;
    }
  }

  /**
   * Get combined analytics summary across all platforms
   * @returns {Promise} Combined analytics summary
   */
  async getCombinedAnalyticsSummary() {
    try {
      const allAnalytics = await this.getAllPlatformsAnalytics();

      // Calculate combined metrics
      const combinedSummary = {
        totalFollowers: 0,
        totalEngagement: 0,
        totalPosts: 0,
        platforms: [],
        overallEngagementRate: 0,
      };

      allAnalytics.forEach((analytics) => {
        if (analytics && analytics.summary) {
          const { platform, summary } = analytics;

          // Platform-specific metrics
          let platformData = {
            name: platform.charAt(0).toUpperCase() + platform.slice(1),
            platform: platform,
            followers: 0,
            engagement: 0,
            posts: 0,
            engagementRate: 0,
          };

          switch (platform) {
            case "instagram":
              platformData.followers = summary.total_impressions || 0;
              platformData.engagement = summary.total_reach || 0;
              platformData.engagementRate = summary.profile_views || 0;
              break;
            case "facebook":
              platformData.followers = summary.total_impressions || 0;
              platformData.engagement = summary.total_engagement || 0;
              platformData.engagementRate = summary.new_followers || 0;
              break;
            case "twitter":
              platformData.followers = summary.total_tweets || 0;
              platformData.engagement = summary.total_likes || 0;
              platformData.engagementRate = summary.engagement_rate || 0;
              break;
            case "tiktok":
              platformData.followers = summary.total_videos || 0;
              platformData.engagement = summary.total_views || 0;
              platformData.engagementRate = summary.engagement_rate || 0;
              break;
            case "youtube":
              platformData.followers = summary.total_subscribers || 0;
              platformData.engagement = summary.total_views || 0;
              platformData.engagementRate = summary.total_videos || 0;
              break;
          }

          combinedSummary.platforms.push(platformData);
          combinedSummary.totalFollowers += platformData.followers;
          combinedSummary.totalEngagement += platformData.engagement;
          combinedSummary.totalPosts += platformData.posts;
        }
      });

      // Calculate overall engagement rate
      if (combinedSummary.totalFollowers > 0) {
        combinedSummary.overallEngagementRate = (
          (combinedSummary.totalEngagement / combinedSummary.totalFollowers) *
          100
        ).toFixed(2);
      }

      return combinedSummary;
    } catch (error) {
      console.error("Error fetching combined analytics summary:", error);
      throw error;
    }
  }
}

export default new AnalyticsService();
