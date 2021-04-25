/* import Head from 'next/head';

import { useEffect } from 'react'; */
import Header from '../components/Header';
import Head from 'next/head';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import { params } from '../config';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Link from 'next/link';

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/functions';
import { PlayerContext, usePlayer } from '../contexts/PlayerContext';

import styles from './home.module.scss';

type Episode = {
	id: string;
	title: string;
	thumbnail: string;
	members: string;
	publishedAt: string;
	url: string;
	duration: number;
	durationAsString: string;
};

type HomeProps = {
	// episodes: Array<Episode>;
	latestEpisodes: Episode[];
	allEpisodes: Episode[];
};

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
	//SPA
	/* 	useEffect(() => {
		fetch('http://localhost:3333/episodes')
			.then((response) => response.json())
			.then((data) => console.log(data));
	}, []); */

	const { playList } = usePlayer();

	const episodeList = [...latestEpisodes, ...allEpisodes];
	return (
		<div className={styles.homePage}>
			<Head>
				<title> HOME | Podcastr</title>
			</Head>

			<section className={styles.latestEpisodes}>
				<h2> Últimos lançamentos</h2>
				<ul>
					{latestEpisodes.map((episode, index) => {
						return (
							<li key={episode.id}>
								{/* <div style={{width: '6rem'}}>
								
								</div> */}

								<div style={{ width: '6rem' }}>
									<Image
										width={192}
										height={192}
										src={episode.thumbnail}
										alt={episode.title}
										objectFit="cover"
									/>
								</div>
								<div className={styles.episodeDetails}>
									<Link href={`/episodes/${episode.id}`}>
										<a>{episode.title}</a>
									</Link>
									<p>{episode.members}</p>
									<span>{episode.publishedAt}</span>
									<span>{episode.durationAsString}</span>
								</div>
								<button type="button" onClick={() => playList(episodeList, index)}>
									<img src="/play-green.svg" alt="Tocar episódio" />
								</button>
							</li>
						);
					})}
				</ul>
			</section>
			<section className={styles.allEpisodes}>
				<h2> Todos os episódios</h2>
				<table cellSpacing={0}>
					<thead>
						<tr>
							<th></th>
							<th>Podcast</th>
							<th>Integrantes</th>
							<th>Data</th>
							<th>Duração</th>
						</tr>
					</thead>
					<tbody>
						{allEpisodes.map((episode, index) => {
							return (
								<tr key={episode.id}>
									<td style={{ width: 72 }}>
										<Image
											width={120}
											height={120}
											src={episode.thumbnail}
											alt={episode.title}
											objectFit="cover"
										/>
									</td>
									<td>
										<Link href={`/episodes/${episode.id}`}>
											<a>{episode.title}</a>
										</Link>
									</td>
									<td>{episode.members}</td>
									<td style={{ width: 100 }}>{episode.publishedAt}</td>
									<td>{episode.durationAsString}</td>
									<td>
										<button
											type="button"
											onClick={() => playList(episodeList, index + latestEpisodes.length)}
										>
											<img src="/play-green.svg" alt="Tocar episódio" />
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<ul></ul>
			</section>
		</div>
	);
}

/* //SERVER SIDE RENDERING

export async function getServerSideProps() {
	const response = await fetch('http://localhost:3333/episodes');
	const data = await response.json();

	return {
		props: {
			episodes: data,
		},
	};
} */

//SSG - SITE STATIC GENERATION

export const getStaticProps: GetStaticProps = async () => {
	// Usando o fetch
	/* const response = await fetch(`http://localhost:3333/episodes?_limit=${params.limit_page}&_sort=published_at&_order=desc`);
	const data = await response.json(); */
	const { data } = await api.get('episodes', {
		params: {
			_limit: params.limit_page,
			_sort: 'published_at',
			_order: 'desc',
		},
	});

	const episodes = data.map(
		(episode): Episode => {
			return {
				id: episode.id,
				title: episode.title,
				thumbnail: episode.thumbnail,
				members: episode.members,
				publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
				duration: Number(episode.file.duration),
				durationAsString: convertDurationToTimeString(episode.file.duration),
				url: episode.file.url,
			};
		}
	);

	const latestEpisodes = episodes.slice(0, 2);
	const allEpisodes = episodes.slice(2, episodes.length);

	return {
		props: {
			latestEpisodes: latestEpisodes,
			allEpisodes: allEpisodes,
		},
		revalidate: 60 * 60 * 8,
	};
};
