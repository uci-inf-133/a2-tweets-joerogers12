class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        // identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        // Define lowercase standard for tweet text
        const tweet = this.text.toLowerCase();
        
        // live_event, the text contains 'right now'
        if (tweet.includes("right now")) {
            return "live_event";
        }
        // achievement, the text contains 'achieved' or 'goal'
        else if (tweet.includes("achievement") || tweet.includes("goal")) {
            return "achievement";
        }
        // completed_event, the text starts with 'just'
        else if (tweet.startsWith("just")) {
            return "completed_event";
        }
        // everything else is miscellaneous
        else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        // identify whether the tweet is written
        if (this.text.includes(" - ")) {
            return true;
        }
        else {
            return false;
        }
    }

    get writtenText():string {
        const tweet = this.text;
        
        if(!this.written) {
            return "";
        }

        // split at " - "
        const parts = this.text.split(" - ");
        if (parts.length < 2) return "";

        // Remove URL if present
        let textPart = parts[1].split(" http")[0];
        return textPart.trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        // parse the activity type from the text of the tweet
        const tweet = this.text;

        // Find the word after 'mi' or 'km', this is the activity per the tweet structure
        const match = tweet.match(/(?:mi|km)\s+(\w+)/i);

        if (!match) return "other";

        return match[1].toLowerCase();
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        // Extract the distance from the text of the tweet
        const tweet = this.text;

        // Match a distance and its unit (km or mi)
        const match = tweet.match(/(\d+(\.\d+)?)\s*(km|mi)/i);
        if (!match) return 0;

        const distanceNum = parseFloat(match[1]);
        const units = match[3].toLowerCase();

        // Convert km to mi
        return units === 'km' ? distanceNum / 1.609 : distanceNum;
    }

    getHTMLTableRow(rowNumber:number):string {
        // return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        // Define the activity and written text of the tweet
        let activity = this.activityType;
        let text = this.writtenText;

        // Extract the URL if present
        const linkMatch = this.text.match(/http\S+/);
        const link = linkMatch ? linkMatch[0] : "#";

        return `
            <tr>
                <th scope="row">${rowNumber}</th>
                <td>${activity}</td>
                <td>${text} <a href="${link}" target="_blank">${link}</a></td>
            </tr>
        `;
    }
}