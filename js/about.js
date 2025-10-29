function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	// Find the min and max dates of the tweets
	const minDate = new Date(
		Math.min(...runkeeper_tweets.map((tweet) => {
			return new Date(tweet.created_at);
		}))
	);
	let maxDate = new Date(
		Math.max(...runkeeper_tweets.map((tweet) => {
			return new Date(tweet.created_at);
		}))
	);

	document.getElementById('firstDate').innerText = minDate.toLocaleDateString();
	document.getElementById('lastDate').innerText = maxDate.toLocaleDateString();
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});