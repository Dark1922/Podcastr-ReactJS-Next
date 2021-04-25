export type TypeEpisode = {
	id: string;
	title: string;
    description: string;
	thumbnail: string;
	members: string;
	publishedAt: string;
	url: string;
	duration: number;
	durationAsString: string;
};

export type TypeEpisodePlayer = {
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	url: string;
}