import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/functions';

import { VolumeSlider } from 'react-media-slider';

export default function Player() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [progress, setProgress] = useState(0);
	const [volume, setVolume] = useState(1);

	const {
		episodeList,
		currentEpisodeIndex,
		isPlaying,
		togglePlay,
		setPlayingState,
		playPrevious,
		playNext,
		hasNext,
		hasPrevious,
		isLooping,
		toggleLoop,
		isShuffling,
		toggleShuffle,
		clearPlayerState,
	} = usePlayer();

	useEffect(() => {
		if (!audioRef.current) {
			return;
		}
		if (isPlaying) {
			audioRef.current.play();
		} else {
			audioRef.current.pause();
		}
	}, [isPlaying]);

	const episode = episodeList[currentEpisodeIndex];

	const setupProgressListener = () => {
		audioRef.current.currentTime = 0;
		audioRef.current.addEventListener('timeupdate', () => {
			setProgress(Math.floor(audioRef.current.currentTime));
		});
	};
	function handleEpisodeEnded() {
		if (hasNext) {
			playNext();
		} else {
			clearPlayerState();
		}
	}

	function handleSeek(amount: number) {
		audioRef.current.currentTime = amount;
		setProgress(amount);
	}

	function handleVolume(amount: number) {
		if (audioRef.current) {
			audioRef.current.volume = amount;
			setVolume(amount);
		}
	}

	return (
		<div className={styles.playerContainer}>
			<header>
				<img src="/playing.svg" alt="Tocando agora" />
				<strong>Tocando agora </strong>
			</header>
			{episode ? (
				<div className={styles.currentEpisode}>
					<Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
					<strong>{episode.title}</strong>
					<span>{episode.members}</span>
				</div>
			) : (
				<div className={styles.emptyPlayer}>
					<strong>Selecione um podcast para ouvir</strong>
				</div>
			)}

			<footer className={!episode ? styles.empty : ''}>
				<div className={styles.progress}>
					<span>{convertDurationToTimeString(progress)}</span>
					<div className={styles.slider}>
						{episode ? (
							<Slider
								max={episode.duration}
								value={progress}
								onChange={handleSeek}
								trackStyle={{ backgroundColor: '#04d361' }}
								railStyle={{ backgroundColor: '#9f75ff' }}
								handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
							/>
						) : (
							<div className={styles.emptySlider}></div>
						)}
					</div>
					<span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
				</div>

				{episode && (
					<audio
						ref={audioRef}
						src={episode.url}
						autoPlay
						loop={isLooping}
						onEnded={handleEpisodeEnded}
						onPlay={() => setPlayingState(true)}
						onPause={() => setPlayingState(false)}
						onLoadedMetadata={setupProgressListener}
					></audio>
				)}
				<div className={styles.buttons}>
					<button
						type="button"
						disabled={!episode || episodeList.length < 2}
						onClick={() => toggleShuffle()}
						className={isShuffling ? styles.isActive : ''}
					>
						<img src="/shuffle.svg" alt="Embaralhar" />
					</button>
					<button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrevious()}>
						<img src="/play-previous.svg" alt="Tocar anterior" />
					</button>

					<button type="button" disabled={!episode} className={styles.playButton} onClick={togglePlay}>
						{isPlaying ? <img src="/pause.svg" alt="Pausar" /> : <img src="/play.svg" alt="Tocar" />}
					</button>
					<button type="button" disabled={!episode || !hasNext} onClick={() => playNext()}>
						<img src="/play-next.svg" alt="Tocar a próxima" />
					</button>
					<button
						type="button"
						disabled={!episode}
						onClick={() => toggleLoop()}
						className={isLooping ? styles.isActive : ''}
					>
						<img src="/repeat.svg" alt="Repetir" />
					</button>
				</div>
				<div className={styles.sliderVolume} style={{display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
					<img src="/volume.svg" alt="Tocar a próxima" style={{ color: 'white' }} />

					<Slider
						style={{ width: '70%' }}
						max={1}
						step={0.05}
						value={volume}
						onChange={handleVolume}
						trackStyle={{ backgroundColor: '#04d361' }}
						railStyle={{ backgroundColor: '#9f75ff' }}
						handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
					/>
					<span style={{marginLeft: '1rem', fontSize: '0.6rem'}}>{`${Math.floor(volume * 100)} %`}</span>
				</div>
			</footer>
		</div>
	);
}
