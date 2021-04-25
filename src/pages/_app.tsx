import React,{ useEffect, useState } from 'react';
import dynamic from 'next/dynamic'

import Header from '../components/Header';
import Player from '../components/Player';

import '../styles/global-darkmode.scss';
import styles from '../styles/app.module.scss';
import { PlayerContextProvider } from '../contexts/PlayerContext';


// const LightTheme = React.lazy(() => import('./themes/lightTheme'));


function MyApp({ Component, pageProps }) {
	return (
		<PlayerContextProvider>
			<div className={styles.wrapper}>
				<main>
					<Header />
					<Component {...pageProps}></Component>
				</main>
				<Player />
			</div>
		</PlayerContextProvider>
	);
}

export default MyApp;
