function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	// Add the different activity types, their counts, and their average distances to objects
	const activityCounts = {};
	const activityDistances = {};

	tweet_array.forEach(tweet => {
		const type = tweet.activityType;
		const distance = tweet.distance;
		
		if (type && type !== "unknown") {
			// Increment count
			activityCounts[type] = (activityCounts[type] || 0) + 1;

			// Update running average
			if (activityDistances[type] === undefined) {
				// First entry — set directly
				activityDistances[type] = distance;
			} 
			else {
				// Running average formula
				const count = activityCounts[type];
				const prevAvg = activityDistances[type];
				activityDistances[type] = ((prevAvg * (count - 1)) + distance) / count;
			}
		}
	});
	console.log(activityCounts); // debugging
	console.log(activityDistances); // debugging

	// Modify the html to display different types
	document.getElementById("numberActivities").innerText = Object.keys(activityCounts).length;

	// Find the 3 most logged activities by sorting it as an array and taking top 3
	const countEntries = Object.entries(activityCounts);
	countEntries.sort((a, b) => b[1] - a[1]);
	const top3Count = countEntries.slice(0, 3);

	// Modify the html to display the top 3 activities
	document.getElementById("firstMost").innerText = top3Count[0][0];
	document.getElementById("secondMost").innerText = top3Count[1][0];
	document.getElementById("thirdMost").innerText = top3Count[2][0];

	// Find the longest and shortest average distance of top 3
	const top3Names = top3Count.map(entry => entry[0]);
	const top3Distances = top3Names.map(name => activityDistances[name] || 0);
	const longestAvgDistance = Math.max(...top3Distances);
	const shortestAvgDistance = Math.min(...top3Distances); 
	const longest = top3Names[top3Distances.indexOf(longestAvgDistance)];
	const shortest = top3Names[top3Distances.indexOf(shortestAvgDistance)];

	// Modify the html to display the longest and shortest activities
	document.getElementById("longestActivityType").innerText = longest;
	document.getElementById("shortestActivityType").innerText = shortest;

	// Find the average distance of weekend and weekdays
	const weekDistances = {
    weekend: { sum: 0, count: 0 },
    weekday: { sum: 0, count: 0 }
	};

	tweet_array.forEach(tweet => {
			const day = tweet.time.getDay();
			const key = (day === 0 || day === 6) ? "weekend" : "weekday";

			weekDistances[key].sum += tweet.distance;
			weekDistances[key].count += 1;
	});

	// Compute averages
	const avgWeekend = weekDistances["weekend"].sum / weekDistances["weekend"].count;
	const avgWeekday = weekDistances["weekday"].sum / weekDistances["weekday"].count;

	console.log(weekDistances); // debugging

	// Modify the html to show which days had longer distances
	document.getElementById("weekdayOrWeekendLonger").innerText = avgWeekend > avgWeekday ? "Weekends" : "Weekdays";

	const activityValues = Object.entries(activityCounts).map(([type, count]) => ({
    type,
    count
	}));

	activity_vis_spec = {
	  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
	  description: "A graph of the number of Tweets containing each type of activity.",
	  data: {
	    values: activityValues
	  },
		mark: "bar",
		encoding: {
			x: { field: "type", type: "ordinal", title: "Activity Type" },
			y: { field: "count", type: "quantitative", title: "Count" },
			color: { field: "type", type: "nominal" }
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	// create the visualizations which group the three most-tweeted activities by the day of the week.
	// Use those visualizations to answer the questions about which activities tended to be longest and when.
	const top3TweetData = tweet_array
			.filter(tweet => top3Names.includes(tweet.activityType))
			.map(tweet => ({
					day: tweet.time.getDay(), // 0=Sunday, 6=Saturday
					distance: tweet.distance,
					type: tweet.activityType
			}));

	const top3RawSpec = {
			$schema: "https://vega.github.io/schema/vega-lite/v5.json",
			description: "Distances by day of the week for top 3 activities",
			data: { values: top3TweetData },
			mark: "point",
			encoding: {
					x: { field: "day", type: "ordinal", title: "Time (Day)" },
					y: { field: "distance", type: "quantitative", title: "Distance (mi)" },
					color: { field: "type", type: "nominal" }
			}
	};

	const top3MeanSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Distances by day of the week for top 3 activities (mean)",
    data: { values: top3TweetData },
    mark: "point",
    encoding: {
        x: { field: "day", type: "ordinal", title: "Time (Day)" },
        y: { field: "distance", type: "quantitative", title: "Mean of Distance", aggregate: "mean" },
        color: { field: "type", type: "nominal" }
    }
	};

	let showingMean = false;

	document.getElementById("aggregate").addEventListener("click", () => {
			showingMean = !showingMean;
			vegaEmbed("#distanceVis", showingMean ? top3MeanSpec : top3RawSpec, { actions: false });
	});

	// Initial load
	vegaEmbed("#distanceVis", top3RawSpec, { actions: false });

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});