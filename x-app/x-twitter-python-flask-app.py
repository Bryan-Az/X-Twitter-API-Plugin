import tweepy
import os
from flask import Flask, request, jsonify
from requests_oauthlib import OAuth1
import json
import logging
import sys
import requests

app = Flask(__name__)
root = logging.getLogger()
root.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
root.addHandler(handler)


apiKey = os.getenv('API_KEY', 'use_your_api')
apiSecretKey = os.getenv('API_SECRET_KEY', 'use_your_api')
accessToken = os.getenv('ACCESS_TOKEN', 'use_your_api')
accessTokenSecret = os.getenv('ACCESS_TOKEN_SECRET', 'use_your_api')

tweepyAuth = tweepy.Client(
    consumer_key=apiKey,
    consumer_secret=apiSecretKey,
    access_token= accessToken,
    access_token_secret=accessTokenSecret
)

oauth = OAuth1(apiKey, apiSecretKey, accessToken, accessTokenSecret)

@app.route('/create_tweet', methods=['POST'])
def create_tweet():
    app.logger.info('Received JSON data: %s', request.json)
    tweetText = request.json['tweet_content']
    try:
        response = tweepyAuth.create_tweet(text=tweetText)
        app.logger.info('Tweet created with ID: %s', response.data['id'])
        return jsonify(success=True, message="Tweet sent!")
    except tweepy.TweepyException as e:
        app.logger.error('Error creating tweet: %s', e.response.text)
        return jsonify(success=False, message=f"Tweet was not sent. Error: {e.response.text}")

@app.route('/delete_tweet', methods=['DELETE'])
def delete_tweet():
    app.logger.info('Received JSON data: %s', request.json)
    tweetID = request.json['tweet_id']

    try:
        response = tweepyAuth.delete_tweet(id=tweetID)
        app.logger.info('Tweet with ID %s was deleted', tweetID)
        return jsonify(success=True, message="Tweet was deleted!")
    except tweepy.TweepyException as e:
        app.logger.error('Error deleting tweet: %s', e.response.text)
        return jsonify(success=False, message=f"Tweet was not deleted. Error: {e.response.text}")

if __name__ == "__main__":
    app.run(debug=True)
