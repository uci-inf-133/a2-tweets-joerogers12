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
	const tweetsLength = tweet_array.length;
	document.getElementById('numberTweets').innerText = tweetsLength;

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

	// Store the percentages of each category in an object
	const percentages = Object.entries(counts).reduce((acc, [category, count]) => {
		const percentage = 100 * count / tweetsLength;
		acc[category] = percentage.toFixed(2);
		return acc;
	}, {});

	// Set the count and percentage text in the respective category html tags
	Array.from(document.getElementsByClassName('completedEvents')).forEach((elem) => {
		elem.innerText = counts['completed_event'] || 0;
	});
	Array.from(document.getElementsByClassName('completedEventsPct')).forEach((elem) => {
		elem.innerText = (percentages['completed_event'] || 0) + "%";
	});

	Array.from(document.getElementsByClassName('liveEvents')).forEach((elem) => {
		elem.innerText = counts['live_event'] || 0;
	});
	Array.from(document.getElementsByClassName('liveEventsPct')).forEach((elem) => {
		elem.innerText = (percentages['live_event'] || 0) + "%";
	});

	Array.from(document.getElementsByClassName('achievements')).forEach((elem) => {
		elem.innerText = counts['achievement'] || 0;
	});
	Array.from(document.getElementsByClassName('achievementsPct')).forEach((elem) => {
		elem.innerText = (percentages['achievement'] || 0) + "%";
	});

	Array.from(document.getElementsByClassName('miscellaneous')).forEach((elem) => {
		elem.innerText = counts['miscellaneous'] || 0;
	});
	Array.from(document.getElementsByClassName('miscellaneousPct')).forEach((elem) => {
		elem.innerText = (percentages['miscellaneous'] || 0) + "%";
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});