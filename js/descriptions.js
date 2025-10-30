// Define written tweets globally
let written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	// Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	written_tweets = tweet_array.filter(tweet => tweet.written);

	// Initialize with empty search
	tableUpdate([], "");
}

function addEventHandlerForSearch() {
	// Search the written tweets as text is entered into the search box, and add them to the table
	// input is the text entered by user
	const input = document.getElementById('textFilter');
	if (!input) return;

	// Listener updates search results with each text change
	input.addEventListener('input', () => {
		const searchText = input.value.toLowerCase();

		// If empty search box display empty table
		if (searchText === '') {
			tableUpdate([], "");
			return;
		}

		// Filter for only tweets that include search input
		const filteredTweets = written_tweets.filter(tweet =>
			tweet.writtenText.toLowerCase().includes(searchText)
		);

		// Update table with search criteria
		tableUpdate(filteredTweets, input.value);
	})
}

// Helper function to handle updating table
function tableUpdate(tweets, input) {
	// Get the table from html
	const tableBody = document.getElementById('tweetTable');
	if (!tableBody) return;

	tableBody.innerHTML = '';

	// Add table row from tweet method
	let html = "";
	tweets.forEach((tweet, index) => {
			html += tweet.getHTMLTableRow(index + 1);
	});
	tableBody.innerHTML = html;

	// Update the html with tweets count and search text
	document.getElementById('searchCount').innerText = tweets.length.toString();
	document.getElementById('searchText').innerText = input;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});