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

        // parse the written text from the tweet
        let i = 0;

        // Go to beginning of written text after ' - '
        while (tweet[i] !== "-") {
            ++i;
        }
        i = i + 2;

        // Save written portion, until url starting with " ht"
        let writtenPortion:string = "";
        while (tweet[i] !== " " && tweet[i + 1] !== "h" && tweet[i + 2] !== "t") {
            writtenPortion += tweet[i];
            ++i;
        }
        
        return writtenPortion;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        // parse the activity type from the text of the tweet
        // Find the word after 'mi' or 'km'
        const tweet = this.text;

        let i = 0;
        while (
            (tweet[i] !== ' ' && tweet[i + 1] !== 'm' && tweet[i + 2] !== 'i' && tweet[i + 3] !== ' ')
         || (tweet[i] !== ' ' && tweet[i + 1] !== 'k' && tweet[i + 2] !== 'm' && tweet[i + 3] !== ' ')
        ) {
            i++;    
        }
        i = i + 4;

        let activity:string = "";

        while (tweet[i] !== ' ') {
            activity += tweet[i];
            i++;
        }

        return activity;
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        // prase the distance from the text of the tweet
        const tweet = this.text;

        let i = 0;
        // Use regular expression to find first number
        while (!/^\d$/.test(tweet[i])) {
            i++;
        }
        
        let distance = "";
        while (tweet[i] !== ' ') {
            distance += tweet[i];
            i++;
        }
        i++;

        // Get units, km or mi
        let units = "";
        while (tweet[i] !== '  ') {
            units += tweet[i];
            i++;
        }

        if (units === 'km') {
            return Number(distance) / 1.609;
        }

        return Number(distance);
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}