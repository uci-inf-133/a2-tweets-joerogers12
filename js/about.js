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
	const maxDate = new Date(
		Math.max(...runkeeper_tweets.map((tweet) => {
			return new Date(tweet.created_at);
		}))
	);

	// Formats the display of the date
	const dateFormat = {
		weekday: "long",
		year: "numeric",
		month: "long",  
		day: "numeric",
	};

	// Set the text in the proper html tags of the DOM
	document.getElementById('firstDate').innerText = minDate.toLocaleDateString("en-US", dateFormat);
	document.getElementById('lastDate').innerText = maxDate.toLocaleDateString("en-US", dateFormat);

	// Store the counts of each category in an object
	const counts = tweet_array.reduce((acc, tweet) => {
		const category = tweet.source;
		acc[category] = (acc[category] || 0) + 1;
		return acc;
	}, {});

	// Set the text in the respective category html tags
	Array.from(document.getElementsByClassName('completedEvents')).forEach((elem) => {
		elem.innerText = counts['completed_event'] || 0;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});