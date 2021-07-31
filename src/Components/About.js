import '../styles/About.css';

function About() {
	return (
		<div id="about">
			<main>
				{' '}
				<section>
					{' '}
					<h2>About</h2>{' '}
					<p>
						{' '}
						This site was inspired{' '}
						<a id="site" href="https://github.coddit.xyz">
							https://github.coddit.xyz
						</a>{' '}
						, I'm a pretty terrible designer so I decided to model this site's
						design off that one. I think he (or she) did a great job.
						Unfortunately as of now that site is down, so you'll have to stick
						with my awful site. :({' '}
					</p>{' '}
					<p>
						If you would like to contact the creator of Pushshift to request
						data deletion or other inquiries, you can reach him at
						/u/Stuck_In_the_Matrix, I am not associated with him or his API in
						any way.{' '}
					</p>
				</section>{' '}
				<section>
					{' '}
					<h2>FAQ</h2> <h3>How does this site?</h3>{' '}
					<p>
						{' '}
						As of now, Pushshift does not update the data it collects, so you
						are left with data that does not match up with what it currently
						has. This site gets around that by gathering the ID's from pushshift
						and requesting them on Reddit's API. This allows all the things that
						weren't previously updated to now be synced up with Reddit.
					</p>{' '}
					<p>
						{' '}
						The analytics works by aggregating data from Pushshift and Miser.
						All of this may result in long loading times.
					</p>{' '}
				</section>{' '}
				<section>
					{' '}
					<h2>Links to Other Sites</h2>{' '}
					<ul>
						{' '}
						<li>
							<a href="https://pushshift.io/">Pushshift's Website</a>
						</li>{' '}
						<li>
							<a href="https://reddit-api.readthedocs.io/en/latest/">
								Pushshift readthedocs
							</a>
						</li>{' '}
						<li>
							<a href="https://github.com/pushshift/api">
								Pushshift API GitHub Repo
							</a>
						</li>{' '}
						<li>
							<a href="https://www.reddit.com/r/pushshift/">
								r/Pushshift Subreddit
							</a>
						</li>{' '}
						<li>
							{' '}
							<strong>Alternatives to This Mess:</strong>{' '}
							<ul>
								{' '}
								<li>
									{' '}
									<strong>Post Search</strong>{' '}
									<ul>
										{' '}
										<li>
											<a href="https://redditsearch.io/">redditsearch.io</a>
										</li>{' '}
										<li>
											<a href="https://github.coddit.xyz/">
												https://github.coddit.xyz
											</a>
										</li>{' '}
										<li>
											<a href="https://camas.github.io/reddit-search/">
												camas.github.io/reddit-search
											</a>
										</li>{' '}
										<li>
											<a href="https://archivesort.org/redditfinder/">
												archivesort.org/redditfinder
											</a>
										</li>{' '}
										<li>
											<a href="https://go.gummysearch.com/reddit/">
												gummysearch.com/reddit
											</a>
										</li>{' '}
										<li>
											<a href="https://redditcommentsearch.com/">
												redditcommentsearch.com
											</a>
										</li>{' '}
									</ul>{' '}
								</li>{' '}
								<li>
									{' '}
									<strong>Post Recovery</strong>{' '}
									<ul>
										{' '}
										<li>
											<a href="https://www.reveddit.com/">reveddit.com</a>
										</li>{' '}
										<li>
											<a href="https://removeddit.com/">removeddit.com</a>
										</li>{' '}
									</ul>{' '}
								</li>{' '}
							</ul>{' '}
						</li>{' '}
					</ul>{' '}
				</section>{' '}
				<section>
					{' '}
					<h2>Contact</h2>{' '}
					<p>
						Email:{' '}
						<a href="mailto:henrybalassiano@gmail.com">
							henrybalassiano@gmail.com
						</a>
					</p>{' '}
				</section>{' '}
			</main>
		</div>
	);
}

export default About;
