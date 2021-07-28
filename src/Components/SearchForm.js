import { useEffect, useState, useRef, useReducer } from 'react';
import '../styles/searchForm.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function SearchForm({
	updateData,
	setSearch,
	minimize,
	setMinimize,
	search,
	showResults,
	showFava,
	changeQuerySize,
	toggleInput,
	setApi,
	apis,
	syncingData,
	setDeletionStatus,
	deletionStatus,
}) {
	const advancedRow = useRef();
	const apiAdvanced = useRef();
	const developerRow = useRef();
	const authorInput = useRef();

	const subredditInput = useRef();
	const over_18Input = useRef();
	const stickiedInput = useRef();
	const searchInput = useRef();
	const is_selfInput = useRef();
	const beforeInput = useRef();
	const afterInput = useRef();
	const distinguishedInput = useRef();
	const lockedInput = useRef();
	const scoreInput = useRef();
	const idInput = useRef();
	const link_idInput = useRef();
	const qInput = useRef();
	const sizeInput = useRef();

	const parseParams = (querystring) => {
		const params = new URLSearchParams(querystring);
		const obj = {};
		for (const key of params.keys()) {
			if (params.getAll(key).length > 1) {
				obj[key] = params.getAll(key);
			} else {
				obj[key] = params.get(key);
			}
		}

		return obj;
	};

	const paramsObj = parseParams(window.location.search);

	const [userinput, setUserInput] = useState({
		author: paramsObj.author ? paramsObj.author.replace(/ /g, '') : '',
		subreddit: paramsObj.subreddit ? paramsObj.subreddit : '',
		type: paramsObj.type ? paramsObj.type : '',
		size: parseInt(paramsObj.size) ? parseInt(paramsObj.size) : 100,
		score: paramsObj.score ? paramsObj.score : '',
		before: paramsObj.before
			? Math.floor((new Date(paramsObj.before).getTime() / 1000) * 1000)
			: '',
		after: paramsObj.after
			? Math.floor((new Date(paramsObj.after).getTime() / 1000) * 1000)
			: '',
		q: paramsObj.q ? paramsObj.q : '',
		over_18: paramsObj.over_18 ? paramsObj.over_18 : '',
		stickied: paramsObj.stickied ? paramsObj.stickied : '',
		is_self: paramsObj.is_self ? paramsObj.is_self : '',
		locked: paramsObj.locked ? paramsObj.locked : '',
		distinguished: paramsObj.distinguished ? paramsObj.distinguished : '',
		id: paramsObj.id ? paramsObj.id : '',
		link_id: paramsObj.link_id ? paramsObj.link_id : '',
	});
	const [required, setRequired] = useState(false);

	const Search = (e) => {
		updateData(userinput);
		e.preventDefault();
		setSearch(false);
		setMinimize(true);
		showFava.current.style.display = 'flex';

		showResults.current.style.display = 'block';

		var str = '';

		for (var key in userinput) {
			if (str != '') {
				str += '&';
			}
			str += key + '=' + encodeURIComponent(userinput[key]);
			str = str.replace(/[^=&]+=(&|$)/g, '').replace(/&$/, '');

			window.location.search = str;
		}
	};

	function fetchDataWhenQuery() {
		updateData(userinput);
		setSearch(false);
		setMinimize(true);
		showFava.current.style.display = 'flex';
		showResults.current.style.display = 'block';
	}

	useEffect(() => {
		let done = false;
		function callOnce() {
			if (window.location.search && !done) {
				done = true;
				fetchDataWhenQuery();
			}
		}
		callOnce();
	}, []);
	useEffect(() => {
		if (localStorage.getItem('setting1') === 'checked') {
			advancedRow.current.style.display = 'flex';
		}
		if (localStorage.getItem('setting2') === 'checked') {
			developerRow.current.style.display = 'flex';
		}
	});
	useEffect(() => {
		if (apis === 'Miser' && !userinput.author) {
			authorInput.current.required = true;
			setRequired(true);
		} else {
			authorInput.current.required = false;
			setRequired(false);
		}
	}, [apis, userinput.author]);
	useEffect(() => {
		if (apis === 'Reddit') {
			authorInput.current.disabled = true;
			searchInput.current.disabled = true;
			over_18Input.current.disabled = true;
			stickiedInput.current.disabled = true;
			subredditInput.current.disabled = true;
			distinguishedInput.current.disabled = true;
			scoreInput.current.disabled = true;
			lockedInput.current.disabled = true;
			is_selfInput.current.disabled = true;
			idInput.current.disabled = true;
			link_idInput.current.disabled = true;
			beforeInput.current.disabled = true;
			afterInput.current.disabled = true;
			qInput.current.required = true;
			sizeInput.current.disabled = true;
		} else {
			authorInput.current.disabled = false;
			searchInput.current.disabled = false;
			over_18Input.current.disabled = false;
			stickiedInput.current.disabled = false;
			subredditInput.current.disabled = false;
			distinguishedInput.current.disabled = false;
			scoreInput.current.disabled = false;
			lockedInput.current.disabled = false;
			is_selfInput.current.disabled = false;
			idInput.current.disabled = false;
			link_idInput.current.disabled = false;
			beforeInput.current.disabled = false;
			afterInput.current.disabled = false;
			qInput.current.required = false;
			sizeInput.current.disabled = false;
		}
	});

	function ClearButton() {
		setUserInput({
			author: '',
			subreddit: '',
			type: '',
			size: 100,
			score: '',
			before: '',
			after: '',
			q: '',
			over_18: '',
			stickied: '',
			is_self: '',
			locked: '',
			distinguished: '',
			id: '',
			link_id: '',
		});
	}
	return (
		<div
			id={`${minimize ? 'search-query-minimized' : 'search-query-maximized'}`}
		>
			{' '}
			<div className="panel-header">
				<h2
					id="search-min"
					onClick={changeQuerySize}
					className={toggleInput ? 'light-search-tag' : ''}
				>
					Search Query{' '}
					<i
						onClick={changeQuerySize}
						class={`fa fa-${minimize ? 'plus' : 'minus'}-square`}
						aria-hidden="true"
					></i>
				</h2>
			</div>
			<div
				id={`form-${minimize ? 'hover' : 'parent'}`}
				onClick={minimize ? changeQuerySize : ''}
				className={toggleInput ? 'light-form' : ''}
			>
				<div id={toggleInput ? 'form-light' : 'form'}>
					<form
						onSubmit={Search}
						class={`form-${minimize ? 'minimize' : 'maximize'}`}
					>
						<div id="row-1">
							<div className="row-wrapper">
								<label>
									username
									<div id="username-parent">
										<span id="username-descrip">yields analytics</span>
									</div>
								</label>
								<input
									value={userinput.author}
									placeholder="Username (e.g. thisisbillgates)"
									type="text"
									onChange={(e) => {
										setUserInput({
											...userinput,
											author: e.target.value.replace(/ /g, ''),
										});
									}}
									ref={authorInput}
									id={`author-${required ? 'required' : 'input'}`}
								></input>{' '}
							</div>
							<div className="row-wrapper">
								<label>subreddit</label>
								<input
									value={userinput.subreddit}
									placeholder="Subreddit"
									type="text"
									ref={subredditInput}
									onChange={(e) => {
										setUserInput({
											...userinput,
											subreddit: e.target.value.replace(/ /g, ''),
										});
									}}
									id="subreddit-input"
								></input>{' '}
							</div>
							<div className="row-wrapper">
								<label id="search-for-input">search for</label>
								<select
									onChange={(e) => {
										setUserInput({ ...userinput, type: e.target.value });
									}}
									value={userinput.type}
									ref={searchInput}
								>
									{' '}
									<option>Any</option>
									<option>Comments</option>
									<option>Submissions</option>
								</select>{' '}
							</div>{' '}
						</div>
						<div id="row-2">
							<div id="num-input">
								<div id="score-input">
									<div className="row-wrapper">
										<label>score</label>
										<input
											ref={searchInput}
											placeholder="Score"
											type="number"
											id="score-input-box"
											min="25"
											step="25"
											ref={scoreInput}
											value={userinput.score}
											onChange={(e) => {
												setUserInput({ ...userinput, score: e.target.value });
											}}
										></input>{' '}
									</div>{' '}
								</div>
							</div>
							<div className="row-wrapper">
								<div id="before-input">
									<label>before</label>
									<DatePicker
										popperProps={{
											positionFixed: true,
										}}
										ref={beforeInput}
										value={new Date(userinput.before * 1000)}
										selected={userinput.before}
										onChange={(e) => {
											setUserInput({ ...userinput, before: e });
										}}
									/>{' '}
									<span class="fa fa-calendar-o"></span>
								</div>{' '}
							</div>
							<div className="row-wrapper">
								<div id="after-input">
									<label>after</label>
									<DatePicker
										popperProps={{
											positionFixed: true,
										}}
										ref={afterInput}
										type="text"
										selected={userinput.after}
										onChange={(e) => setUserInput({ ...userinput, after: e })}
									/>{' '}
									<span class="fa fa-calendar-o"></span>
								</div>
							</div>{' '}
						</div>{' '}
						<div id="advanced-row" ref={advancedRow}>
							<div className="row-wrapper">
								<label>NSFW</label>
								<select
									ref={over_18Input}
									className="advanced-input"
									value={userinput.over_18}
									onChange={(e) => {
										setUserInput({ ...userinput, over_18: e.target.value });
									}}
								>
									<option>Any</option>

									<option>True</option>
									<option>False</option>
								</select>{' '}
							</div>{' '}
							<div className="row-wrapper">
								<label>Stickied</label>
								<select
									ref={stickiedInput}
									className="advanced-input"
									value={userinput.stickied}
									onChange={(e) => {
										setUserInput({ ...userinput, stickied: e.target.value });
									}}
								>
									<option>Any</option>

									<option>True</option>
									<option>False</option>
								</select>{' '}
							</div>{' '}
							<div className="row-wrapper">
								<label>Is Self</label>
								<select
									ref={is_selfInput}
									className="advanced-input"
									value={userinput.is_self}
									onChange={(e) => {
										setUserInput({ ...userinput, is_self: e.target.value });
									}}
								>
									<option>Any</option>

									<option>True</option>
									<option>False</option>
								</select>{' '}
							</div>
							<div className="row-wrapper">
								<label>Locked</label>
								<select
									ref={lockedInput}
									className="advanced-input"
									value={userinput.locked}
									onChange={(e) => {
										setUserInput({ ...userinput, locked: e.target.value });
									}}
								>
									<option>Any</option>

									<option>True</option>
									<option>False</option>
								</select>{' '}
							</div>{' '}
							<div className="row-wrapper">
								<label>Distinguished</label>
								<select
									ref={distinguishedInput}
									className="advanced-input"
									value={userinput.distinguished}
									onChange={(e) => {
										setUserInput({
											...userinput,
											distinguished: e.target.value,
										});
									}}
								>
									<option>Any</option>

									<option>Admin</option>
									<option>Moderator</option>
								</select>{' '}
							</div>
						</div>
						<div id="row-3">
							<div id="search-term-input">
								<div className="row-wrapper">
									<label>Search Terms</label>
									<input
										value={userinput.q}
										placeholder="Search Terms"
										type="text"
										ref={qInput}
										onChange={(e) => {
											setUserInput({
												...userinput,
												q: e.target.value,
											});
										}}
									></input>{' '}
								</div>
							</div>
							<div className="row-wrapper">
								<label>amount returned</label>
								<input
									placeholder="Size"
									onChange={(e) => {
										setUserInput({
											...userinput,
											size: parseInt(e.target.value),
										});
									}}
									ref={sizeInput}
									value={userinput.size}
									type="number"
									min="25"
									step="25"
									id="amnt-ret"
								></input>{' '}
							</div>{' '}
							<div className="row-wrapper" id="api-wrapper">
								<label>API</label>
								<select
									id="advanced-api-search"
									onChange={(e) => {
										setApi(e.target.value);
									}}
									value={apis}
								>
									<option>Pushshift</option>

									<option>Reddit</option>
									<option>Miser</option>
								</select>{' '}
							</div>
							<div className="row-wrapper" id="api-wrapper">
								<label>Deletion Status</label>
								<select
									id="advanced-api-search"
									onChange={(e) => {
										setDeletionStatus(e.target.value);
									}}
									value={deletionStatus}
								>
									<option>All Submissions/Comments </option>

									<option>Deleted Submissions/Comments</option>
								</select>{' '}
							</div>
						</div>
						<div id="developer-row" ref={developerRow}>
							<div className="row-wrapper">
								<label>ID</label>
								<input
									ref={idInput}
									placeholder="ID"
									type="text"
									onChange={(e) => {
										setUserInput({
											...userinput,
											id: e.target.value,
										});
									}}
								></input>{' '}
							</div>{' '}
							<div className="row-wrapper">
								<label>Link ID</label>
								<input
									ref={link_idInput}
									placeholder="Link ID"
									type="text"
									onChange={(e) => {
										setUserInput({
											...userinput,
											link_id: e.target.value.replace(/ /g, ''),
										});
									}}
								></input>{' '}
							</div>{' '}
						</div>
						<div id="row-4">
							{' '}
							<div>
								<div className="row-wrapper">
									<input
										id="clear-btn"
										value="Clear"
										onClick={ClearButton}
										type="button"
									></input>
								</div>
							</div>
							<div id="search-btn">
								<div className="row-wrapper">
									<input id="search-btn" value="Search" type="submit"></input>{' '}
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
export default SearchForm;
