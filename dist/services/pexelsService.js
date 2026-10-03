"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVideos = void 0;
const pexels_1 = require("pexels");
const client = (0, pexels_1.createClient)(process.env.PEXELS_API_KEY);
/**
 * Search videos from Pexels API.
 *
 * @param query - Search keyword or phrase.
 * @param perPage - Number of videos to retrieve (default: 10).
 * @returns An array of formatted video objects.
 */
const searchVideos = async (query, perPage = 10) => {
    try {
        const result = (await client.videos.search({ query, per_page: perPage }));
        return result.videos.map((video) => ({
            id: video.id,
            url: video.url,
            duration: video.duration,
            image: video.image,
            videoFiles: video.video_files,
            user: video.user?.name || "Unknown",
        }));
    }
    catch (error) {
        console.error("Error fetching videos from Pexels:", error);
        throw new Error("Failed to fetch videos from Pexels");
    }
};
exports.searchVideos = searchVideos;
//# sourceMappingURL=pexelsService.js.map