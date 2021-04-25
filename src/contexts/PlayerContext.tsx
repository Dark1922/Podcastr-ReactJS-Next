import { createContext, ReactNode, useContext, useState } from 'react';
import { TypeEpisodePlayer } from '../utils/types';

type PlayerContextData = {
	// episodeList: Array<TypeEpisodePlayer>
	episodeList: TypeEpisodePlayer[];
	currentEpisodeIndex: number;
	isPlaying: boolean;
	togglePlay: () => void;
	play: (episode: TypeEpisodePlayer) => void;
	isLooping: boolean;
	isShuffling: boolean;
	toggleLoop: () => void;
	toggleShuffle: () => void;
	setPlayingState: (state: boolean) => void;
	playList: (list: TypeEpisodePlayer[], index: number) => void;
	playNext: () => void;
	playPrevious: () => void;
	clearPlayerState: () => void;
	hasPrevious: boolean;
	hasNext: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
	children: ReactNode;
};

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
	const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLooping, setIsLooping] = useState(false);
	const [isShuffling, setIsShuffling] = useState(false);

	function play(episode: TypeEpisodePlayer) {
		setEpisodeList([episode]);
		setCurrentEpisodeIndex(0);
		setIsPlaying(true);
	}

	function playList(list: TypeEpisodePlayer[], index: number) {
		setEpisodeList(list);
		setCurrentEpisodeIndex(index);
		setIsPlaying(true);
	}
	function toggleLoop() {
		setIsLooping(!isLooping);
	}
	function toggleShuffle() {
		setIsShuffling(!isShuffling);
	}

	function togglePlay() {
		setIsPlaying(!isPlaying);
	}
	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

	function clearPlayerState() {
		setEpisodeList([]);
		setCurrentEpisodeIndex(0);
	}

	const hasPrevious = currentEpisodeIndex > 0;

	const hasNext = isShuffling || currentEpisodeIndex < episodeList.length - 1;
	// const hasNext = currentEpisodeIndex + 1 < episodeList.length;

	function playNext() {
		if (isShuffling) {
			const nextRandomEpisodeIndex = Math.floor(Math.random() * (episodeList.length - 1));
			setCurrentEpisodeIndex(nextRandomEpisodeIndex);
		} else if (hasNext) {
			setCurrentEpisodeIndex(currentEpisodeIndex + 1);
		}
	}
	function playPrevious() {
		if (hasPrevious) {
			setCurrentEpisodeIndex(currentEpisodeIndex - 1);
		}
	}

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				isPlaying,
				play,
				togglePlay,
				isLooping,
				isShuffling,
				toggleLoop,
				toggleShuffle,
				setPlayingState,
				clearPlayerState,
				playList,
				playNext,
				playPrevious,
				hasPrevious,
				hasNext,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
}

export const usePlayer = () => {
	return useContext(PlayerContext);
};
