from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlencode
import os
import numpy as np
import re

from musixmatch import musixmatch
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv

import openai

app = Flask(__name__)
cors = CORS(app)

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

load_dotenv()

muxixmatch = musixmatch.Musixmatch(os.getenv('MUSIXMATCH_KEY'))

openai.api_key = os.getenv('OPENAI_KEY')

client_id = os.getenv('SPOTIFY_CLIENT_ID')
client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
redirect_uri = 'http://my-laptop.themeify.net/home'
scope = 'user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-read-currently-playing user-top-read user-follow-read'

@app.route('/api/login', methods=['GET', 'POST'])
def login_redir():
    params = {'client_id' : client_id,
              'response_type': 'code',
              'scope' : scope,
              'redirect_uri' : 'http://my-laptop.themeify.net/home'
              }
    return jsonify('http://accounts.spotify.com/authorize?' + urlencode(params))

@app.route('/api/access-token-grant', methods=['GET', 'POST'])
def get_access_token():
    code = request.json['params']['code']

    sp_oauth = SpotifyOAuth(
        client_id=client_id,
        client_secret=client_secret,
        redirect_uri=redirect_uri,
        scope=scope
    )

    token_info = sp_oauth.get_access_token(code)

    return jsonify({'token_info' : token_info})

@app.route('/api/user-info', methods = ['GET', 'POST'])
def get_user_info():
    access_token = request.json['params']['access_token']
    
    sp = spotipy.Spotify(auth=access_token)

    try:
        data = sp.current_user_top_tracks(time_range='short_term')
        userInfo = sp.current_user()
    except:
        return('error with retrieving user info')

    return jsonify({'user' : userInfo, 'access_token' : access_token, 'tracks' : data})

@app.route('/api/find-themes', methods=['GET', 'POST'])
def get_user_themes():
    access_token = request.json['params']['access_token']
    
    sp = spotipy.Spotify(auth=access_token)

    try:
        data = sp.current_user_top_tracks(time_range='short_term')
    except:
        return('error with retrieving top track info')

    song_names = []
    # song_ids = []
    artist_names = []
    # popularities = []
    # images = []

    for d in data['items']:
        song_names.append(d['name'])
        # song_ids.append(d['id'])
        artists = list(map(lambda a: a['name'], d['artists']))
        artist_names.append(artists)
        # popularities.append(d['popularity'])
        # images.append(d['album']['images'][0]['url'])

    lyrics_list = []

    for i in range(len(song_names)):
        name = song_names[i]
        first_artist = artist_names[i][0]
        try:
            lyric = muxixmatch.matcher_lyrics_get(name, first_artist)
            lyric = lyric['message']['body']['lyrics']['lyrics_body']
            lyrics_list.append(lyric)
        # except(error):
        #     muxixmatch = musixmatch.Musixmatch(os.getenv('MUSIXMATCH_KEY_2'))
        #     lyric = muxixmatch.matcher_lyrics_get(name, first_artist)
        #     lyric = lyric['message']['body']['lyrics']['lyrics_body']
        #     lyrics_list.append(lyric)
        except:
            lyrics_list.append('None')
    
    cleaned_lyrics = []

    for lyric in lyrics_list:
        if ((lyric=='None') | (lyric=='')):
            cleaned_lyrics.append('None')
            continue
        clean = re.sub(r'\*[^*]*\*', '', lyric)
        cleaned_lyrics.append(clean)

    final = ''

    countLyrics = 0
    for lyric in cleaned_lyrics:
        if countLyrics >= 10:
            break
        final += re.sub(r'\s*\(\d+\)$', '', lyric)
        countLyrics += 1
    
    tokens = 0

    response = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo-0613",
        messages=[
            {'role': 'system', 'content': 'You will extract and rank the eight most significant emotional themes present in the provided song lyrics. Each song is separated by ..., and each theme should be one to three words in length, like "nostalgia", or "inner reflection", or "personal growth". The output should be entirely lowercase, and be listed in decreasing order of significance. Here is example output: nostalgia, unrequited love, passion, sadness, exuberant youthfulness.'},
            {'role': 'user', 'content': final}
        ]   
    )

    tokens += response.usage.total_tokens
    output = response.choices[0].message.content

    # tokens = 0
    # output = ['nostalgia, nostalgia, nostalgia, nostalgia, nostalgia, nostalgia, nostalgia, nostalgia']
    return jsonify({'themes' : output, 'tokens' : tokens})