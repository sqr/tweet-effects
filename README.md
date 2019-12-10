![Tweet Effects](https://i.imgur.com/cPA6Ez1.png "Tweet Effects")
# Tweet Effects
The aim of this project is to download tweet data for bulk processing in After Effects, auto generating and populating compositions. It is divided in two parts:
* **tweet_effects.py**: Python program that prompts the user to input the URL of a tweet. It then downloads its data to a JSON file, as well as the avatar of the user that posted the tweet to a JPEG file. Both files are downloaded. 
* **tweet_effects.jsx**: After Effects script that fetches the downloaded files, imports them all into the project, generates appropiate folder structure and matching compositions based on the template composition in the included After Effects project.
* **tweet_ae.aep**: After Effects project that serves as a template. Before running the script you should edit the composition named "template" to fit your needs. Layers "username" and "tweet text" have been prepopulated with the necessary code, so you just need to run the Python and JSX scripts and new compositions will be created.

Please note this is a work in progress project still in it's early stages.

# Setup
* Download the files tweet_effects.py, tweet_effects.jsx and tweet_ae.aep, put them all in the same directory.
* Edit tweet_effects.py, adding your Twitter API credentials (lines 9 to 13).
* Run tweet_effects.py, you will be greeted by a menu that explains how the program works. You can then proceed to enter tweets, in the form of the full URL or ID (e.g. "https://twitter.com/JacobWolf/status/1204151919071113219" or "1204151919071113219").
* This will create a folder called "tweets" in your working directory, with a subfolder named as the tweet ID. Inside it you will find a JSON file and the .JPG avatar of the user that posted the tweet.
* Repeat last step as many times as you want!

* Open tweet_ae.aep with After Effects 2020 and and run the script tweet_effects.jsx. If you need a downgraded version of the after effects project let me know.
* The script will look for a folder called "tweets" in the same directory as tweet_ae.aep, import the JSON files, pictures and folder structure, as well as creating a new composition for each tweet. These compositions should be populated with the correct tweet status text, username and user profile picture. 

# Config
* You can edit the "template" composition in tweet_ae.aep before running tweet_effects.jsx, so the final result matches your required visual style.

# FAQ
Feel free to ask any questions and they will be added to the FAQ. Thanks!
