import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import "../styles/Analytics.css";
import moment from "moment";
import parse from "html-react-parser";

function Analytics({
	username,
	setDataRecieved,
	dataRecieved,
	syncingData,
	toggleInput,
	minAnalytics,
	changeAnalyticsSize,
	api,
	setAnalyticalComments,
	setAllDetails,
	analyticalComments,
	allDetails,
}) {
	const [analyticData, setAnalyticData] = useState(false);
	const [commentData, setCommentData] = useState(false);
	const [submissionData, setSubmissionData] = useState(false);
	const [bestComment, setBestComment] = useState(false);
	const [worstComment, setWorstComment] = useState(false);
	const [detailsObj, setDetailsObj] = useState(false);

	const [subObj, setSubObj] = useState({
		options: {
			labels: [],
			colors: [
				"#EC6B56",
				"#FFC154",
				"#47B39C",
				"#9BBFE0",
				"#E8A09A",
				"#FBE29F",
				"#C6D68F",
				"#003F5C",
				"#58508D",
				"#BC5090",
				"#FF6361",
				"#FFA600",
				"#0077b6",
				"#F66D44",
				"#FEAE65",
				"#E6F69D",
				"#AADEA7",
				"#64C2A6",
				"#2D87BB",
			],
			legend: {
				labels: {
					colors: toggleInput ? "#212529" : "#eee",
					useSeriesColors: false,
				},
				markers: {
					width: 12,
					height: 12,
					strokeWidth: 0,
					strokeColor: "#444",
					fillColors: undefined,
					radius: 12,
					customHTML: undefined,
					onClick: undefined,
					offsetX: 0,
					offsetY: 0,
				},
			},
		},
		series: [],
	});

	const [comObj, setComObj] = useState({
		options: {
			labels: [],
			colors: [
				"#F47A1F",
				"#FDBB2F",
				"#377B2B",
				"#AADEA7",
				"#007CC3",
				"#00529B",
				"#FD6787",
				"#FFF44C",
				"#288EEB",
				"#7982B9",
				"#1b263b",
				"#415a77",
				"#778da9",
				"#f7d1cd",
				"#e8c2ca",
				"#A5C1DC",
				"#b392ac",
				"#735d78",
				"#A5C1DC",
			],
			legend: {
				labels: {
					colors: toggleInput ? "#212529" : "#eee",
					useSeriesColors: false,
				},
				markers: {
					width: 12,
					height: 12,
					strokeWidth: 0,
					strokeColor: "#444",
					fillColors: undefined,
					radius: 12,
					customHTML: undefined,
					onClick: undefined,
					offsetX: 0,
					offsetY: 0,
				},
			},
		},
		series: [],
	});
	const timer = (ms) => new Promise((res) => setTimeout(res, ms));

	useEffect(() => {
		setAnalyticalComments(false);

		async function fetchSubAggs() {
			try {
				console.info("fetching analytics");
				let responseSubmissions = await fetch(
					`https://archivesort.org/discuss/reddit/miser?type=submissions&author=${username.toLowerCase()}&aggs=subreddits`
				);

				console.info(responseSubmissions.url);

				let subData = await responseSubmissions.json();

				if (!subData.data[0]) {
					return false;
				}

				if (subData.data) {
					for (var i = 0; i < subData.data.slice(0, 15).length; i++) {
						subObj.series.push(subData.data[i].total);
						subObj.options.labels.push(subData.data[i]._id);
					}
				} else {
					return false;
				}
				setSubmissionData(true);
			} catch (err) {
				console.log(err);
			}
		}

		async function fetchComAggs() {
			try {
				console.info("fetching analytics");

				let responseComments = await fetch(
					`https://archivesort.org/discuss/reddit/miser?type=comments&author=${username.toLowerCase()}&aggs=subreddits`
				);
				console.info(responseComments.url);

				let comData = await responseComments.json();

				if (!comData.data[0]) {
					return false;
				}

				if (comData.data) {
					for (var i = 0; i < comData.data.slice(0, 15).length; i++) {
						comObj.series.push(comData.data[i].total);
						comObj.options.labels.push(comData.data[i]._id);
					}
				} else {
					return false;
				}

				setCommentData(true);
			} catch (err) {
				console.log(err);
			}
		}

		async function commentAnalytics() {
			setAnalyticalComments(false);
			try {
				let before;

				const queue = [];
				let commentArr = [];

				let limit = 5;
				let min = 0;

				while (min < limit) {
					if (queue.length > 0) {
						before = queue.slice(-1)[0];
					}

					console.info("fetching comment analytics");

					let response = await fetch(
						`https://api.pushshift.io/reddit/search/comment/?size=100&author=${username.toLowerCase()}${
							before ? `&before=${before}` : ""
						}&html_decode=true`
					);

					console.info(response.url);

					let comDataAns = await response.json();

					if (comDataAns.data.length === 0) {
						if (commentArr.length === 0) {
							console.info("break");
							break;
						} else {
							break;
						}
					}
					queue.push(comDataAns.data.slice(-1)[0].created_utc);

					min += 1;
					for (var i = 0; i < comDataAns.data.length; i++) {
						commentArr.push(comDataAns.data[i]);
					}

					console.info("cooldown between analytics request");
					await timer(1500);
				}

				setBestComment(
					commentArr
						.reduce(function (a, b) {
							return a.concat(b);
						}, [])
						.sort((a, b) => {
							return b.score - a.score;
						})[0]
				);
				setWorstComment(
					commentArr
						.reduce(function (a, b) {
							return a.concat(b);
						}, [])
						.sort((a, b) => {
							return a.score - b.score;
						})[0]
				);

				setAnalyticalComments(true);
			} catch (err) {
				console.log(err);
			}
		}
		const userObj = {
			img: "",
			submissionKarma: "",
			commentKarma: "",
			creationDate: "",
		};

		async function userDetails() {
			setAllDetails(false);

			try {
				console.info("fetching analytics");

				let userDetailsRes = await fetch(
					`https://www.reddit.com/user/${username.toLowerCase()}/about.json?utm_source=reddit&utm_medium=usertext&utm_name=redditdev&utm_content=t3_1p9s0w`
				);

				let userDetailsData = await userDetailsRes.json();
				console.info(userDetailsRes.url);
				console.log(userDetailsData.error);
				if (userDetailsData.error !== 404) {
					userObj.img = userDetailsData.data.icon_img.replace(
						/^(.+?\.(png|jpe?g)).*$/i,
						"$1"
					);
					userObj.submissionKarma = userDetailsData.data.link_karma;
					userObj.commentKarma = userDetailsData.data.comment_karma;
					userObj.creationDate = userDetailsData.data.created;
				} else {
					setAllDetails(true);
				}
				if (!userDetailsData.data) {
					return false;
				}
				setAllDetails(true);
			} catch (err) {
				console.log(err);
			}
		}
		setDetailsObj(userObj);
		userDetails();
		fetchSubAggs();
		fetchComAggs();
		commentAnalytics();
	}, []);
	const SnuOwnd = require("snuownd");

	const bestDate = new Date(bestComment ? bestComment.created_utc * 1000 : "");
	const worstDate = new Date(
		worstComment ? worstComment.created_utc * 1000 : ""
	);
	const creationDate = new Date(
		detailsObj ? detailsObj.creationDate * 1000 : ""
	);

	const userCreationDate = creationDate.toString();

	const bestPostDate = bestDate.toString();
	const worstPostDate = worstDate.toString();
	const bestCommentBody = SnuOwnd.getParser().render(
		bestComment ? bestComment.body : ""
	);
	const worstCommentBody = SnuOwnd.getParser().render(
		worstComment ? worstComment.body : ""
	);
	return (
		<div className={toggleInput ? "light-analytics" : "dark-analytics"}>
			<div>
				{syncingData && api[0] && analyticalComments && allDetails ? (
					<div
						id={`${minAnalytics ? "analytics-minimized" : ""}`}
						onClick={minAnalytics ? changeAnalyticsSize : ""}
					>
						<div id="results-header">
							<h2
								id="results-min"
								onClick={changeAnalyticsSize}
								className="analysis-tag"
							>
								Analytics{" "}
								<i
									className={`fa fa-${minAnalytics ? "plus" : "minus"}-square`}
									aria-hidden="true"
								></i>
							</h2>
						</div>
						<div id={`an-${minAnalytics ? "hover" : "parent"}`}>
							{" "}
							<div
								id={minAnalytics ? "analytics-minimized-inner" : "analytics"}
							>
								<div id="in-beta-parent">
									<span id="in-beta-tag">In Beta</span>{" "}
									<div>
										{" "}
										<img
											id="user-img"
											src={detailsObj.img}
											width="75px"
											height="75px"
										/>
									</div>
									<h1 id="username-header-tag">
										{" "}
										<span id="overview">Overview for</span>{" "}
										<a
											href={`https://www.reddit.com/user/${username}/`}
											target="_blank"
										>
											/u/{username}
										</a>{" "}
									</h1>
									<div id="creation-date">
										<h4>
											{" "}
											Redditor Since{" "}
											{moment(new Date(userCreationDate)).calendar()}
										</h4>
									</div>
									<div id="karma-status">
										<h4>
											Comment Karma:{" "}
											{Math.abs(detailsObj.commentKarma) > 999
												? Math.sign(detailsObj.commentKarma) *
														(Math.abs(detailsObj.commentKarma) / 1000).toFixed(
															1
														) +
												  "k"
												: Math.sign(detailsObj.commentKarma) *
												  Math.abs(detailsObj.commentKarma)}
										</h4>
										<h4>
											Link Karma:{" "}
											{Math.abs(detailsObj.submissionKarma) > 999
												? Math.sign(detailsObj.submissionKarma) *
														(
															Math.abs(detailsObj.submissionKarma) / 1000
														).toFixed(1) +
												  "k"
												: Math.sign(detailsObj.submissionKarma) *
												  Math.abs(detailsObj.submissionKarma)}
										</h4>
									</div>
									<div id="subtext">
										{" "}
										<small>
											*Data is available from 500 comments and 1000 submissions
											ago (Miser/Pushshift API limitations)
										</small>
									</div>
								</div>{" "}
								<div id="charts-wrapper">
									<div id="charts-parent">
										{submissionData ? (
											<div id="analytics-child">
												<h2>Top 15 Subreddits Breakdown By Submissions </h2>
												<Chart
													class="chart"
													options={subObj.options}
													series={subObj.series}
													type="pie"
													width="380px"
												/>
											</div>
										) : (
											""
										)}
										{commentData ? (
											<div id="analytics-child">
												<h2>Top 15 Subreddits Breakdown By Comments </h2>

												<Chart
													class="chart"
													options={comObj.options}
													series={comObj.series}
													type="pie"
													width="380px"
												/>
											</div>
										) : (
											""
										)}{" "}
									</div>
								</div>
								<div id="best-comment-parent">
									{" "}
									<h3>
										{" "}
										<a
											href={`https://www.reddit.com/${bestComment.permalink}`}
											target="_blank"
										>
											Best Comment
										</a>
									</h3>
								</div>{" "}
								<div id="best-comment-wrapper">
									<div id="best-comment">
										<div>
											<div>
												<div>
													<div>
														<div id="details-best">
															<a title={new Date(bestDate)}>
																{" "}
																{moment(new Date(bestDate)).fromNow()} in{" "}
															</a>
															<a className="subreddit">
																r/{bestComment.subreddit}
															</a>{" "}
															<span className="best-upvote-comment">
																{" "}
																<i class="fa fa-arrow-up" aria-hidden="true">
																	<span id="score">
																		{" "}
																		{Math.abs(bestComment.score) > 999
																			? Math.sign(bestComment.score) *
																					(
																						Math.abs(bestComment.score) / 1000
																					).toFixed(1) +
																			  "k"
																			: Math.sign(bestComment.score) *
																			  Math.abs(bestComment.score)}
																	</span>
																</i>
															</span>
														</div>{" "}
														<div>
															{" "}
															<div>
																<p id="best-comment-body">
																	{parse(bestCommentBody)}
																</p>{" "}
															</div>
														</div>
													</div>
												</div>
											</div>{" "}
										</div>
									</div>
								</div>
								<div id="worst-comment-parent">
									{" "}
									<h3>
										{" "}
										<a
											href={`https://www.reddit.com/${worstComment.permalink}`}
											target="_blank"
										>
											Worst Comment
										</a>
									</h3>
								</div>{" "}
								<div id="worst-comment-wrapper">
									<div id="worst-comment">
										<div>
											<div>
												<div>
													<div>
														<div id="details-worst">
															<a title={new Date(worstDate)}>
																{" "}
																{moment(new Date(worstDate)).fromNow()} in{" "}
															</a>
															<a className="subreddit">
																r/{worstComment.subreddit}
															</a>{" "}
															<span className="worst-upvote-comment">
																{" "}
																<i class="fa fa-arrow-up" aria-hidden="true">
																	<span id="score">
																		{" "}
																		{Math.abs(worstComment.score) > 999
																			? Math.sign(worstComment.score) *
																					(
																						Math.abs(worstComment.score) / 1000
																					).toFixed(1) +
																			  "k"
																			: Math.sign(worstComment.score) *
																			  Math.abs(worstComment.score)}
																	</span>
																</i>
															</span>
														</div>{" "}
														<div>
															{" "}
															<div>
																{" "}
																<p id="worst-comment-body">
																	{parse(worstCommentBody)}
																</p>
															</div>
														</div>
													</div>
												</div>
											</div>{" "}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					""
				)}
			</div>{" "}
		</div>
	);
}

export default Analytics;
