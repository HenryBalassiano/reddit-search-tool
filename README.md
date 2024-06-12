<div>
	<u> <h1> Now deprecated due to Reddit's update to API policy, you can find more info <a href='https://www.reddit.com/r/reactjs/comments/ov79m5/i_made_a_reddit_search_tool_that_displays/'> within this Reddit post </a>  which details the functionality of the application during the time it was active  </u></div>

<u> <h1> <a href='https://redditsearchtool.com/'> Reddit Search Tool </a> </u></div>

<div style='display:flex;flex-direction:row'>
<img src='https://img.shields.io/github/v/release/henrybalassiano/reddit-search-tool'>
	<img src='https://img.shields.io/github/last-commit/henrybalassiano/reddit-search-tool'>
	<img src='https://img.shields.io/github/stars/henrybalassiano/reddit-search-tool?style=social'>
	</div>

<h2> What does this site/app do?</h2>
<ul> <li> Displays analytics on a Reddit user by aggregating data from the Pushshift and Miser API  </li>
<img src='https://media2.giphy.com/media/18AgCwgX85s1WdVrrp/giphy.gif'>

<br/>
<li> No limit on the size of Pushshift's requests. Currently, Pushshift's size parameter has a max value of 100, this site gets around that by continuously making requests and setting the next requests <code>before</code> value to the last requests, last items <code>created_utc</code> </li>
<li> Option to search for both comments and submissions simultaneously. As of now, Pushshift only allows you to search for either <code>submissions</code> or <code>comments</code>, but not in the same request. This site gives you the option to search for both by requesting one of each value type and sorting the response data </li>

<li> Pushshift's data is synced up with Reddit. As of now, Pushshift does not update the data it collects, so the data you see on Pushshift may not reflect what it actually is on Reddit. This site gets around that by requesting the <code>ID's</code> from Pushshift on Reddit's API</li>

<li> Option to search through multiple API's. This site has integrated an option to search through the Pushshift, Miser, and the Reddit API's </li>

<li> The UI has full markdown support</li>
<img src='https://media.giphy.com/media/W1Fa0nCPf79dEgkMpq/giphy.gif'>
<u><h2> Disclaimer</h2></u>
This is a work in progress and 100% has bugs of some kind in it, bug fixes/new features are continuously being added

<u> <h2> Contact</h2></u>

<p> If you have any questions regarding this project or have any other inquiries, please feel free to contact me at henrybalassiano@gmail.com or submit a <code>pull request</code></p>
