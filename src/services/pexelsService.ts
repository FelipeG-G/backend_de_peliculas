import { createClient, Video } from "pexels";

const client = createClient(process.env.PEXELS_API_KEY!);

/**
 * Search videos from Pexels API.
 *
 * @param query - Search keyword or phrase.
 * @param perPage - Number of videos to retrieve (default: 10).
 * @returns An array of formatted video objects.
 */
export const searchVideos = async (query: string, perPage = 10): Promise<any[]> => {
  try {
    const result = (await client.videos.search({ query, per_page: perPage })) as { videos: Video[] };
    return result.videos.map((video) => ({
      id: video.id,
      url: video.url,
      duration: video.duration,
      image: video.image,
      videoFiles: video.video_files,
      user: video.user?.name || "Unknown",
    }));
  } catch (error) {
    console.error("Error fetching videos from Pexels:", error);
    throw new Error("Failed to fetch videos from Pexels");
  }
};
