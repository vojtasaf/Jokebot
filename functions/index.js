/* eslint-disable indent */
/* eslint-disable no-tabs */
const functions = require("firebase-functions");

// Get Tweet objects by ID, using bearer token authentication
// https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/quick-start

const needle = require("needle");
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

// The code below sets the bearer token from your environment variables
// eslint-disable-next-line max-len
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'

let bearerToken = process.env.BEARER_TOKEN;

if (process.env.GCLOUD_PROJECT === "jokebot-ed58d") {
	bearerToken = functions.config().twitterapi.token;
}

// this is the ID for @Dadsaysjokes
const userId = "905028905026846720";
const url = `https://api.twitter.com/2/users/${userId}/tweets`;

app.get("/jokes", (req, res) => {
	const getUserTweets = async () => {
		const userTweets = [];

		const params = {
			// eslint-disable-next-line quote-props
			max_results: 100,
			"tweet.fields": "created_at",
		};

		const options = {
			headers: {
				"User-Agent": "v2UserTweetsJS",
				// eslint-disable-next-line quote-props
				authorization: `Bearer ${bearerToken}`,
			},
		};

		let hasNextPage = true;
		const nextToken = null;

		while (hasNextPage) {
			const resp = await getPage(params, options, nextToken);
			if (
				resp &&
				resp.meta &&
				resp.meta.result_count &&
				resp.meta.result_count > 0
			) {
				if (resp.data) {
					// eslint-disable-next-line prefer-spread
					userTweets.push.apply(userTweets, resp.data);
				}
				if (resp.meta.next_token) {
					// nextToken = resp.meta.next_token;
					hasNextPage = false; // getting only 1 page
				} else {
					hasNextPage = false;
				}
			} else {
				hasNextPage = false;
			}
		}

		const randomIndex = Math.floor(Math.random() * userTweets.length);
		console.log(userTweets[randomIndex].text);
		res.json(userTweets[randomIndex].text);
	};

	const getPage = async (params, options, nextToken) => {
		if (nextToken) {
			params.pagination_token = nextToken;
		}

		try {
			const resp = await needle("get", url, params, options);

			if (resp.statusCode != 200) {
				console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
				return;
			}
			return resp.body;
		} catch (err) {
			throw new Error(`Request failed: ${err}`);
		}
	};

	getUserTweets();
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.app = functions.https.onRequest(app);
