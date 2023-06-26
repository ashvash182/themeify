from flask import Flask, redirect, request, make_response, jsonify
from flask_cors import CORS
from urllib.parse import urlencode
import os
import json
import numpy as np
from langdetect import detect
import re
import string
import random
import time

import psycopg2

from musixmatch import musixmatch
import spotipy
from spotipy.oauth2 import SpotifyOAuth

import openai

app = Flask(__name__)
cors = CORS(app)

muxixmatch = musixmatch.Musixmatch('43a20a41274881984e9e5c68bca9b428')

openai.api_key = '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'

client_id = "425323e46f604cdf8e9dc7fab647b3fb"
client_secret = "837fc99441ed41c7a2e81ea88d31fb15"
redirect_uri =  'http://localhost:3000/callback'
scope = os.getenv('scopes', default='user-read-email ' +
'user-read-private ' +
'user-library-read ' +
'user-library-modify ' +
'user-read-playback-state ' +
'user-modify-playback-state ' +
'user-read-currently-playing ' +
'user-top-read ' +
'user-follow-read')

conn = psycopg2.connect(
    host="themeify.cenj6k9pddwc.us-east-2.rds.amazonaws.com",
    database="postgres",
    user = "themeify182",
    password = "Ashvash182"
)

cur = conn.cursor()

cur.execute("""
        CREATE TABLE IF NOT EXISTS themeify_data (
            user_id VARCHAR(255) PRIMARY KEY,
            themes TEXT[] NOT NULL
        )
        """)

# cur.execute(""" DROP TABLE themeify_data """)
# conn.commit()

def generate_random_string(length):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for _ in range(length))

@app.route('/login', methods=['GET', 'POST'])
def login_redir():
    params = {'client_id' : client_id,
              'response_type': 'code',
              'scope' : scope,
              'redirect_uri' : 'http://localhost:3000/callback'
              }
    return jsonify('http://accounts.spotify.com/authorize?' + urlencode(params))

@app.route('/access-token-grant', methods=['GET', 'POST'])
def access_token():
    code = request.args.get('code')

    sp_oauth = SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri='http://localhost:3000/callback',
        scope=scope
    )

    token_info = sp_oauth.get_access_token(code)
    return jsonify(token_info)

@app.route('/user-top-tracks', methods = ['GET', 'POST'])
def get_top_track_themes():
    access_token = request.args.get('access_token')
    
    sp = spotipy.Spotify(auth=access_token)

    try:
        data = sp.current_user_top_tracks(time_range='short_term')
        userInfo = sp.current_user()
    except:
        return('error with retrieving top tracks/user info')
    
    userID = str(userInfo['id'])

    print('user is ', userInfo['display_name'])
    existsQuery = (
        "SELECT * FROM themeify_data WHERE user_id = %s"
    )

    cur.execute(existsQuery, (userID,))

    checkExists = cur.fetchone()

    if (len(checkExists) > 0):
        return jsonify({'user' : userInfo, 'existingThemes' : checkExists[1], 'userExists' : True})

    song_names = []
    song_ids = []
    artist_names = []
    popularities = []
    images = []

    for d in data['items']:
        song_names.append(d['name'])
        song_ids.append(d['id'])
        artists = list(map(lambda a: a['name'], d['artists']))
        artist_names.append(artists)
        popularities.append(d['popularity'])
        images.append(d['album']['images'][0]['url'])

    lyrics_list = []

    for i in range(len(song_names)):
        try:
            name = song_names[i]
            first_artist = artist_names[i][0]
            lyric = muxixmatch.matcher_lyrics_get(name, first_artist)
            lyric = lyric['message']['body']['lyrics']['lyrics_body']
            lyrics_list.append(lyric)
        except:
            lyrics_list.append('None')
    
    cleaned_lyrics = []

    for lyric in lyrics_list:
        if ((lyric=='None') | (lyric=='')):
            cleaned_lyrics.append('None')
            continue
        clean = re.sub(r'\*[^*]*\*', '', lyric)
        cleaned_lyrics.append(clean)

    final = []

    for lyric in cleaned_lyrics:
        final.append(re.sub(r'\s*\(\d+\)$', '', lyric))

    return jsonify({'user' : userInfo, 'tracks' : data, 'lyrics' : final, 'userExists' : False})

@app.route('/find-themes', methods=['GET', 'POST'])
def spotify_sentiment_analysis():
    # Only doing top 10 (For rate limiting purposes)
    lyrics_list = request.args.get('lyrics').split('...')[:-1][:10]
    user_id = request.args.get('userID')
    lyrics = request.args.get('lyrics')
    tokens = 0

    response = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo-0613",
        messages=[
            {'role': 'system', 'content': 'You will extract and rank the eight most significant emotional themes present in the provided song lyrics. Each song is separated by ..., and each theme should be one to three words in length, like "nostalgia", or "inner reflection", or "young love". The output should be entirely lowercase, and be listed in decreasing order of significance. Here is example output: nostalgia, unrequited love, passion, sadness, exuberant youthfulness.'},
            {'role': 'user', 'content': lyrics}
        ]
    )
    tokens += response.usage.total_tokens
    output = response.choices[0].message.content.split(", ")

    # expected_format = '\w+, \w+, \w+, \w+, \w+, \w+, \w+, \w+'
    # SET UP REGEX CHECKS FOR OUTPUT FORMAT

    sql = ("""
        INSERT INTO themeify_data (user_id, themes) VALUES (%s, %s);
            """)
    cur.execute(sql, (user_id, (output)))
    conn.commit()
    return jsonify({'themes' : output, 'tokens' : tokens})