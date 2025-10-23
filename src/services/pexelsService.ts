import { createClient, Video } from "pexels";

const client = createClient(process.env.PEXELS_API_KEY!);

export const searchVideos = async (query: string, perPage = 10): Promise<any[]> => {
  try {
    const result = (await client.videos.search({ query, per_page: perPage })) as { videos: Video[] };
    return result.videos.map((video) => ({
      id: video.id,
      url: video.url,
      duration: video.duration,
      image: video.image,
      videoFiles: video.video_files,
      user: video.user?.name || "Desconocido",
    }));
  } catch (error) {
    console.error("Error al obtener videos desde Pexels:", error);
    throw new Error("No se pudieron obtener los videos desde Pexels");
  }
};

