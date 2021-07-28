import Chart from 'react-apexcharts';
import { useState, useEffect } from 'react';
import '../styles/Analytics.css';

function Analytics({
	username,
	setDataRecieved,
	dataRecieved,
	syncingData,
	toggleInput,
	minAnalytics,
	changeAnalyticsSize,
}) {
	const [analyticData, setAnalyticData] = useState(false);
	const [commentData, setCommentData] = useState(false);
	const [submissionData, setSubmissionData] = useState(false);

	const [subObj, setSubObj] = useState({
		options: {
			labels: [],
			colors: [
				'#1d1d1b',
				'#370617',
				'#6a040f',
				'#9d0208',
				'#d00000',
				'#dc2f02',
				'#e85d04',
				'#f48c06',
				'#faa307',
				'#ffba08',
				'#03045e',
				'#023e8a',
				'#0077b6',
				'#0096c7',
				'#00b4d8',
				'#48cae4',
				'#CCCCFF',
				'#6495ED',
				'#9FE2BF',
			],
			legend: {
				labels: {
					colors: toggleInput ? '#212529' : '#eee',
					useSeriesColors: false,
				},
				markers: {
					width: 12,
					height: 12,
					strokeWidth: 0,
					strokeColor: '#444',
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
				'#797d62',
				'#9b9b7a',
				'#baa587',
				'#f1dca7',
				'#ffcb69',
				'#e8ac65',
				'#d08c60',
				'#b58463',
				'#997b66',
				'#0d1b2a',
				'#1b263b',
				'#415a77',
				'#778da9',
				'#f7d1cd',
				'#e8c2ca',
				'#d1b3c4',
				'#b392ac',
				'#735d78',
				'#ffc09f',
			],
			legend: {
				labels: {
					colors: toggleInput ? '#212529' : '#eee',
					useSeriesColors: false,
				},
				markers: {
					width: 12,
					height: 12,
					strokeWidth: 0,
					strokeColor: '#444',
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

	useEffect(() => {
		async function fetchSubAggs() {
			try {
				console.info('fetching analytics');
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
				setDataRecieved(true);
				setSubmissionData(true);
			} catch (err) {
				console.log(err);
			}
		}

		async function fetchComAggs() {
			try {
				console.info('fetching analytics');

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

				setDataRecieved(true);
				setCommentData(true);
			} catch (err) {
				console.log(err);
			}
		}
		fetchSubAggs();
		fetchComAggs();
	}, []);

	return (
		<div>
			{dataRecieved && syncingData ? (
				<div id={`${minAnalytics ? 'analytics-minimized' : ''}`}>
					<div id="results-header">
						<h2
							id="results-min"
							onClick={changeAnalyticsSize}
							className="analysis-tag"
						>
							Analytics{' '}
							<i
								className={`fa fa-${minAnalytics ? 'plus' : 'minus'}-square`}
								aria-hidden="true"
							></i>
						</h2>
					</div>
					<div
						id={`an-${minAnalytics ? 'hover' : 'parent'}`}
						onClick={changeAnalyticsSize}
					>
						<div id={minAnalytics ? 'analytics-minimized-inner' : 'analytics'}>
							<div id="in-beta-parent">
								<span id="in-beta-tag">In Beta</span>
							</div>{' '}
							<h2>Top 15 Subreddits Breakdown By Submissions </h2>
							<div id="analytics-child">
								<Chart
									class="chart"
									options={subObj.options}
									series={subObj.series}
									type="pie"
									width="440px"
								/>
							</div>{' '}
							{commentData ? (
								<h2>Top 15 Subreddits Breakdown By Comments </h2>
							) : (
								''
							)}
							{commentData ? (
								<div id="analytics-child">
									<Chart
										class="chart"
										options={comObj.options}
										series={comObj.series}
										type="pie"
										width="440px"
									/>
								</div>
							) : (
								''
							)}
						</div>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
}

export default Analytics;
