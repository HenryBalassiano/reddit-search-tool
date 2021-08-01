import '../styles/Items.css';
import Loader from './Loader';
import { useEffect, useRef, useState } from 'react';
import Marker from 'react-mark.js/Marker';
import parse from 'html-react-parser';
import moment from 'moment';

function Items({
	api,
	errorMessage,
	error,
	data,
	setMore,
	minimizeR,
	showResults,
	size,
	loadingMessage,
	searchTerm,
	changeResultsSize,
	resultAmt,
	toggleInput,
	syncingData,
	loading,
	requests,
	itemCount,
	allDetails,
	analyticalComments,
	author,
}) {
	const results = useRef(false);
	const bodyText = useRef(false);
	const titleText = useRef(false);
	const [imageExpanded, setImageExpand] = useState({ expanded: '' });
	const showMore = useRef();
	const description = useRef();
	const more = (event) => {
		setMore(true);
	};
	function expand(i) {
		setImageExpand({ expanded: i });
		if (imageExpanded) {
			setImageExpand(false);
		}
	}
	const SnuOwnd = require('snuownd');
	return (
		<div
			id={`${minimizeR ? 'results-minimized' : ''}`}
			onClick={minimizeR ? changeResultsSize : ''}
		>
			<div id="results-header">
				<h2
					id="results-min"
					onClick={changeResultsSize}
					className={toggleInput ? 'light-results-tag' : ''}
				>
					Results - {resultAmt}{' '}
					<i
						onClick={changeResultsSize}
						className={`fa fa-${minimizeR ? 'plus' : 'minus'}-square`}
						aria-hidden="true"
					></i>
				</h2>
			</div>
			<div
				id={`item-${minimizeR ? 'hover' : 'parent'}`}
				ref={showResults}
				className={toggleInput ? 'light-results' : ''}
			>
				<div ref={error} id="error">
					{' '}
					{errorMessage}
				</div>
				{!syncingData && errorMessage !== 'No Results' ? (
					<div id="loader-wrapper">
						<Loader toggleInput={toggleInput} />{' '}
						<div id="loading-text">
							Loading &#8226;{' '}
							{`Fetching ${itemCount}/${size} items in ${requests} requests`}
						</div>{' '}
					</div>
				) : (
					''
				)}
				{syncingData && !analyticalComments && errorMessage !== 'No Results' ? (
					<div id="loader-wrapper">
						<Loader toggleInput={toggleInput} />{' '}
						<div id="loading-text">
							Loading &#8226; {`Fetching Analytics...`}
						</div>{' '}
					</div>
				) : (
					''
				)}
				{syncingData &&
					analyticalComments &&
					allDetails &&
					api.slice(0, size).map((e, i) => {
						const months = {
							Jan: '1',
							Feb: '2',
							Mar: '3',
							Apr: '4',
							May: '5',
							Jun: '6',
							Jul: '7',
							Aug: '8',
							Sep: '9',
							Oct: '10',
							Nov: '11',
							Dec: '12',
						};
						const date = new Date(e.created_utc * 1000);
						const postDate = date.toString();

						const num = months[postDate.slice(4, 7)];

						if (!e) {
							showMore.current.style.display = 'none';
							return;
						}

						let permalink;
						if (e.permalink) {
							permalink = e.permalink;
						} else if (e.link_id) {
							permalink = `/comments/${e.link_id.split('_')[1]}/_/${e.id}`;
						}

						let currentDate =
							num + '/' + postDate.slice(8, 10) + '/' + postDate.slice(11, 15);

						if (api.length > 0 && results) {
							showMore.current.style.display = 'block';
							if (minimizeR) {
								showMore.current.style.display = 'none';
							}
							if (size > api.length) {
								showMore.current.style.display = 'none';
							}
							if (api.length === 0) {
								error.current.style.display = 'block';
							} else {
								error.current.style.display = 'none';
							}
							if (size > api.length) {
								showMore.current.style.display = 'block';
							}
							if (size > api.length) {
								showMore.current.style.display = 'none';
							}

							const text = SnuOwnd.getParser().render(
								e.body ? e.body : e.selftext ? e.selftext : ''
							);
							return (
								<div
									className="parent"
									id={`results-${minimizeR ? 'minimize' : 'maximize'}`}
									key={i}
								>
									<div className="details">
										{' '}
										<div className="image-parent">
											{e.domain ? (
												<div id="image-child">
													{(e.thumbnail !== 'self' &&
														e.thumbnail !== 'default' &&
														e.thumbnail !== 'nsfw' &&
														e.thumbnail !== 'image' &&
														e.thumbnail !== 'spoiler') ||
													(e.thumbnail === 'nsfw' &&
														localStorage.getItem('setting3') !== 'checked') ? (
														<div
															id="image"
															onClick={() => {
																setImageExpand({ expanded: i });
																if (imageExpanded.expanded === i) {
																	setImageExpand({ expanded: false });
																}
															}}
															style={{
																backgroundImage: `url(${
																	e.url.substring(e.url.length - 3) === 'bmp' ||
																	e.url.substring(e.url.length - 3) === 'jpg' ||
																	e.url.substring(e.url.length - 3) === 'png' ||
																	e.url.substring(e.url.length - 3) === 'gif'
																		? e.url
																		: e.thumbnail
																})`,
															}}
														>
															{localStorage.getItem('setting3') !== 'checked' &&
															!e.url.match(
																'^(https?|ftp)://.*(jpg|png|gif|bmp)'
															) &&
															!e.thumbnail.match(
																'^(https?|ftp)://.*(jpg|png|gif|bmp)'
															) &&
															e.thumbnail === 'nsfw' ? (
																<div id="nsfw">
																	{' '}
																	{e.is_deleted ? (
																		<i
																			class="fa fa-trash"
																			style={{
																				fontSize: '25px',
																				color: 'white',
																				zIndex: '999',
																			}}
																			aria-hidden="true"
																		></i>
																	) : (
																		''
																	)}
																	<div
																		style={{
																			opacity: e.is_deleted ? '0.4' : '',
																			filter: 'brightness(0.75)',
																		}}
																	>
																		<i
																			className="fa fa-eye-slash"
																			aria-hidden="true"
																		></i>
																	</div>{' '}
																</div>
															) : (
																''
															)}
															<i
																class="fa fa-expand"
																style={{
																	fontSize: '25px',
																	color: 'white',
																	zIndex: '999',
																}}
																aria-hidden="true"
															></i>
														</div>
													) : (
														''
													)}
													{(e.thumbnail === 'default' &&
														e.domain.slice(0, 4) === 'self') ||
													e.thumbnail === 'self' ? (
														<div id="self-post">
															{e.is_deleted ? (
																<i
																	class="fa fa-trash"
																	style={{
																		fontSize: '25px',
																		color: 'white',
																		zIndex: '999',
																	}}
																	aria-hidden="true"
																></i>
															) : (
																''
															)}
															<div
																style={{
																	opacity: e.is_deleted ? '0.4' : '',
																	filter: 'brightness(0.75)',
																}}
															>
																<i
																	className="fa fa-file-text"
																	aria-hidden="true"
																></i>
															</div>{' '}
														</div>
													) : (
														''
													)}
													{(e.thumbnail === 'nsfw' &&
														localStorage.getItem('setting3') === 'checked') ||
													(e.thumbnail === 'spoiler' &&
														localStorage.getItem('setting3') === 'checked') ? (
														<div id="nsfw">
															{' '}
															{e.is_deleted ? (
																<i
																	class="fa fa-trash"
																	style={{
																		fontSize: '25px',
																		color: 'white',
																		zIndex: '999',
																	}}
																	aria-hidden="true"
																></i>
															) : (
																''
															)}
															<div
																style={{
																	opacity: e.is_deleted ? '0.4' : '',
																	filter: 'brightness(0.75)',
																}}
															>
																<i
																	className="fa fa-user-secret"
																	aria-hidden="true"
																></i>
															</div>{' '}
														</div>
													) : (
														''
													)}

													{(e.domain.slice(0, 4) !== 'self' &&
														e.thumbnail === 'default') ||
													(e.thumbnail !== 'nsfw' &&
														e.thumbnail === 'image') ? (
														<div id="link-post">
															{e.is_deleted ? (
																<i
																	class="fa fa-trash"
																	style={{
																		fontSize: '25px',
																		color: 'white',
																		zIndex: '999',
																	}}
																	aria-hidden="true"
																></i>
															) : (
																''
															)}
															<div
																style={{
																	opacity: e.is_deleted ? '0.4' : '',
																	filter: 'brightness(0.75)',
																}}
															>
																<i class="fa fa-link" aria-hidden="true"></i>
															</div>{' '}
														</div>
													) : (
														''
													)}
												</div>
											) : (
												''
											)}
											<div id="align-vertically">
												<div id="details-child">
													<Marker mark={searchTerm}>
														{e.title ? (
															<div id="title" ref={titleText}>
																<a id="title-anchor">
																	<p>
																		<a
																			id="title-anchor-child"
																			href={
																				e.full_link ||
																				`https://reddit.com${permalink}`
																			}
																		>
																			{' '}
																			{e.title}
																		</a>{' '}
																		{e.is_deleted ? (
																			<span id="is-deleted">
																				{e.is_deleted}{' '}
																				<i
																					style={{
																						position: 'relative',
																						lineHeight: '0px',
																						fontWeight: '200',
																						display: 'inline-block',
																					}}
																					class="fa fa-trash-o"
																					aria-hidden="true"
																				></i>
																			</span>
																		) : (
																			''
																		)}
																		{e.over_18 ? (
																			<span id="NSFW-flair">
																				NSFW{' '}
																				<i
																					style={{
																						position: 'relative',
																						lineHeight: '0px',
																						fontWeight: '200',
																						display: 'inline-block',
																					}}
																					class="fa fa-eye-slash"
																					aria-hidden="true"
																				></i>
																			</span>
																		) : (
																			''
																		)}
																		{e.stickied ? (
																			<span id="stickied-flair">
																				Stickied{' '}
																				<i
																					style={{
																						position: 'relative',
																						lineHeight: '0px',
																						fontWeight: '200',
																						display: 'inline-block',
																					}}
																					class="fa fa-sticky-note-o"
																					aria-hidden="true"
																				></i>
																			</span>
																		) : (
																			''
																		)}
																		{e.locked ? (
																			<span id="locked-flair">
																				Locked{' '}
																				<i
																					style={{
																						position: 'relative',
																						lineHeight: '0px',
																						fontWeight: '200',
																						display: 'inline-block',
																					}}
																					class="fa fa-lock"
																					aria-hidden="true"
																				></i>
																			</span>
																		) : (
																			''
																		)}
																		{e.distinguished ? (
																			<span id="distinguished-flair">
																				{e.distinguished === 'moderator'
																					? 'moderator'
																					: 'admin'}{' '}
																				<i
																					style={{
																						position: 'relative',
																						lineHeight: '0px',
																						fontWeight: '200',
																						display: 'inline-block',
																					}}
																					class="fa fa-shield"
																					aria-hidden="true"
																				></i>
																			</span>
																		) : (
																			''
																		)}
																		<a id="domain" href={e.url}>
																			({e.domain})
																		</a>
																	</p>
																</a>
															</div>
														) : (
															''
														)}
													</Marker>
													<a>
														{e.kind === 't3' ? 'submitted' : 'commented'} by{' '}
													</a>
													<a className="author">u/{e.author}</a>
													<a title={new Date(postDate)}>
														{' '}
														{moment(new Date(postDate)).fromNow()} in{' '}
													</a>
													<a className="subreddit">r/{e.subreddit}</a>{' '}
													{e.is_deleted && e.kind === 't1' ? (
														<i
															class="fa fa-trash-o"
															title={e.is_deleted}
															style={{
																fontSize: '15px',
																color: '#eee',
																zIndex: '999',
															}}
															aria-hidden="true"
														></i>
													) : (
														''
													)}
													<div id="tags">
														<div id="upvote">
															<i class="fa fa-arrow-up" aria-hidden="true">
																{' '}
																<span id="score">
																	{Math.abs(e.synced_score) > 999
																		? Math.sign(e.synced_score) *
																				(
																					Math.abs(e.synced_score) / 1000
																				).toFixed(1) +
																		  'k'
																		: Math.sign(e.synced_score) *
																		  Math.abs(e.synced_score)}
																</span>
															</i>
														</div>
														{e.kind === 't3' ? (
															<div id="upvote-percentage">
																<i class="fa fa-line-chart" aria-hidden="true">
																	{' '}
																	<span id="score">
																		{e.upvote_ratio
																			? Math.trunc(e.upvote_ratio * 100)
																			: 100}
																		%
																	</span>
																</i>
															</div>
														) : (
															''
														)}
														{e.kind === 't3' ? (
															<div id="upvote-percentage">
																<i class="fa fa-commenting" aria-hidden="true">
																	{' '}
																	<span id="score">{e.synced_comments}</span>
																</i>
															</div>
														) : (
															''
														)}
													</div>
												</div>
											</div>
										</div>
										{e.body ||
										e.selftext ||
										(e.kind === 't3' && imageExpanded.expanded === i) ? (
											<div id="body-parent">
												<Marker mark={searchTerm}>
													<div id="body" ref={bodyText}>
														{parse(text)}
														{e.kind === 't3' &&
														e.thumbnail !== 'self' &&
														e.thumbnail !== 'default' &&
														e.thumbnail !== 'nsfw' &&
														e.thumbnail !== 'image' &&
														e.thumbnail !== 'spoiler' ? (
															!e.url.match(
																'^(https?|ftp)://.*(jpg|png|gif|bmp)'
															) ? (
																<a href={e.url} target="_blank">
																	{e.url}
																</a>
															) : (
																''
															)
														) : (
															''
														)}
														{e.kind === 't3' ? (
															<div id="body-image">
																{e.url.match(
																	'^(https?|ftp)://.*(jpg|png|gif|bmp)'
																) ? (
																	<img src={e.url} />
																) : (
																	''
																)}{' '}
															</div>
														) : (
															''
														)}
													</div>
												</Marker>
											</div>
										) : (
											false
										)}
										<div className="footer">
											<div id="view-on-reddit">
												<a
													href={e.full_link || `https://reddit.com${permalink}`}
													target="_blank"
													rel="noreferrer"
												>
													view on reddit
												</a>
											</div>
											<div id="view-on-reddit">
												<a
													href={`https://www.removeddit.com${permalink}`}
													target="_blank"
													rel="noreferrer"
												>
													view on removeddit
												</a>
											</div>
										</div>
									</div>
								</div>
							);
						} else {
							showMore.current.style.display = 'none';
						}
					})}{' '}
				<button
					id="load-more"
					onClick={more}
					ref={showMore}
					style={{ pointerEvents: loadingMessage ? 'none' : '' }}
				>
					<div id="load-more-wrapper">
						{loadingMessage ? (
							<div id="load-more-parent">
								{' '}
								<i
									className="fa fa-cog fa-spin"
									style={{
										color: 'white',
										fontSize: '2em',
										position: 'relative',
										display: 'flex',
										alignContent: 'center',
										fontSmooth: 'auto',
										bottom: '1px',
										color: toggleInput ? '#495057' : '#eee',
									}}
								></i>
							</div>
						) : (
							''
						)}
						<div id="load-more-text">
							{loadingMessage
								? `Loading • Fetching ${itemCount}/${size} items in ${requests} requests`
								: 'Load More'}{' '}
						</div>{' '}
					</div>{' '}
				</button>{' '}
			</div>
		</div>
	);
}

export default Items;
