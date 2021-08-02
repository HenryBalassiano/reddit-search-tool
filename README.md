<ins> <h2> What does this site/app do? </h2></ins>
<ul> <li> Analytics provided when user entered, displaying aggregated data from the Pushshift, and the Miser API.
  </li>
<img src="https://i.imgur.com/knXxwt1.gif" width="200" height="200" />
 height="100%" />

<li> No limit on size amount, Pushshift has a max limit set to 100. This site gets around that by constantly making requests and setting a before parameter to every new request with a value of the last request, last object's property <code>created_utc></code>.
  
<li> Filter for deleted posts/comments and non deleted posts/comments.
  
 <li> Posts/comments are synced up with Reddit. Currently Pushshift does not re-gather the data it collects, so the data on Pushshift may not reflect what is currently shown. This site gets around that by using the <code>ID's</code> from Pushshift's API and requesting them on Reddit's API. 

</ul>








https://redditsearchtool.com/
