import tweepy
import json
import requests
import os
import re
import io
from PIL import Image

consumer_key="CHANGE_ME"
consumer_secret="CHANGE_ME"

access_token="CHANGE_ME"
access_token_secret="CHANGE_ME"

# Twitter authorization
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

# Initialize tweepy
api = tweepy.API(auth)

# Print welcome ASCII art
print(r"""
################################################
######       Tweet to After Effects       ######
##                                            ##
##     Converts tweets to JSON files and      ##
##     user avatars to JPG files for use      ##
##     in After Effects.                      ##
##     Accepted input:                        ##
##       - Full tweet URL                     ##
##       - Tweet ID                           ## 
##       - 'Exit' to close the program        ##
##     Directory 'Tweets' will be created     ##
##     with one subdirectory per tweet.       ##
##                                            ##
################################################
################################################
 """)

while True:

    # User inputs tweet URL
    id_unstripped = input("Tweet ID or URL: ")

    # Input has non-numeric characters?
    digit_check = re.search('\D', id_unstripped)

    # Exit condition
    if id_unstripped.lower() in ('exit'):
        print ('Shutting down...')
        break

    # Check for Twitter domain or non-numeric characters in input
    if "twitter.com" not in id_unstripped and digit_check is not None:
        print('Invalid URL. Are you sure this is a tweet?')
        continue

    # Split to get ID from URL
    id = id_unstripped.rsplit("/")[-1]

    # Cleaning possible URL parameters after ID 
    if "?" in id:
        id = id.split("?", 1)[0]

    # Get tweet status
    # If that fails, go back to the start
    try:
        tweet = api.get_status(id, tweet_mode='extended')
    except:
        print('Invalid URL: API error. Please check for typos and try again.')
        continue

    # Turn it into JSON
    json_str = json.dumps(tweet._json)
    j = json.loads(json_str)

    # Delete last URL from tweet status text (e.g. link to a news article) 
    sep_url = "https://t.co"

    if sep_url in j['full_text']:
        j['full_text'] = j['full_text'].rsplit(sep_url, 1)[0]

    # Cleaning URL to get big avatar size
    avatar_small = j['user']['profile_image_url']
    avatar_big = avatar_small.replace("_normal", "")

    # Setting up paths to save avatar and JSON
    dir = os.path.dirname(__file__)
    filename = os.path.join(dir, 'tweets', id, '')

    # Creating directory 'Tweets' and subdirectory id   
    try:
        os.makedirs(filename)
    except:
        print('Problema al crear directorio. ¿Está repetido?')
        continue

    # Downloading avatar
    r = requests.get(avatar_big, stream=True)
    image_file = id + '.jpg'
    if r.status_code == 200:

        # Open image
        i = Image.open(io.BytesIO(r.content))

        # Check aspect ratio
        width, height = i.size
        ratio = str(width/height)
        newsize = 500, 500

        # Crop if ratio is not 1
        if '1.0' != ratio:
            small = min(width, height)
            big = max(width, height)
            extra = int((big-small)/2)

            if height > width:
                area = (0, extra, width, height-extra)
                i = i.crop(area)
            else:
                area = (extra, 0, width-extra, height)
                i = i.crop(area)
        
        # Resize after crop and save to disk
        i = i.resize((newsize), Image.ANTIALIAS)
        i = i.convert("RGB")
        i.save(os.path.join(filename, image_file), quality=85)
    else:
        print('Error downloading image')

    # Writing JSON file to disk
    with open(filename+id+'.json', 'w', encoding='utf-8') as f:
        json.dump(j, f, ensure_ascii=False, indent=4)

    print('Success. Folder created.')