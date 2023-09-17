import tweepy
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


apiKey = "AfCab4Z23XbAbkLlr5ofeljme"
apiSecretKey = "8HmOsrH6YMfOoxxXDlWVD1r7CYM54ICeSokYLL8A60iZZmFryE"

accessToken = "4254075494-9bHKb2KRMQFxXP9nL76IUo15DC8F0yIkHnLrHgk"
accessTokenSecret = "uL5oHPgfglZC8yEmzJN5Ntv7gyYlzhe0kmkaEMWrp5Q2g"

oauth = OAuth1(apiKey, apiSecretKey, accessToken, accessTokenSecret)

@app.route('/create_tweet', methods=['POST'])
def create_tweet():
    app.logger.info('Received JSON data: %s', request.json)
    tweetText = request.json['text']
    tweetURL = "https://api.twitter.com/1.1/statuses/update.json"
    response = requests.post(tweetURL, auth=oauth, params={'status': tweetText})
    app.logger.info('Sending response: %s', response.text)
    if response.status_code == 201:
        return jsonify(success=True, message="Tweet sent!")
    else:
        jsonify(success=False, message=f"Tweet was not sent. Status code: {response.status_code}, Message: {response.text}")

@app.route('/delete_tweet', methods=['DELETE'])
def delete_tweet():
    app.logger.info('Received JSON data: %s', request.json)
    tweetID = request.json['tweet_id']
    tweetURL = f"https://api.twitter.com/2/tweets/{tweetID}"
    response = requests.delete(tweetURL, auth=oauth)
    app.logger.info('Sending response: %s', response.text)
    if response.status_code in [200, 204]:  
        return jsonify(success=True, message="Tweet was deleted!")
    else:
        return jsonify(success=False, message=f"Tweet was not deleted. Status code: {response.status_code}, Message: {response.text}")

if __name__ == "__main__":
    app.run(debug=True)
