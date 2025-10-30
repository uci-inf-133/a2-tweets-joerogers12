function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	// Add the different activity types and their counts to an object
	const activityCounts = {};
	tweet_array.forEach(tweet => {
		const type = tweet.activityType;
		if (type && type !== "unknown") {
			activityCounts[type] = (activityCounts[type] || 0) + 1;
		}
	});
	console.log(activityCounts); // debugging

	// Modify the html to display different types
	document.getElementById("numberActivities").innerText = Object.keys(activityCounts).length;

	// Find the 3 most logged activities by sorting it as an array and taking top 3
	const entries = Object.entries(activityCounts);
	entries.sort((a, b) => b[1] - a[1]);
	const top3 = entries.slice(0, 3);

	// Modify the html to display the top 3 activities
	document.getElementById("firstMost").innerText = top3[0][0];
	document.getElementById("secondMost").innerText = top3[1][0];
	document.getElementById("thirdMost").innerText = top3[2][0];

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});