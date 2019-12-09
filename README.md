![Tweet Effects](https://i.imgur.com/cPA6Ez1.png "Tweet Effects")
# Tweet Effects
The aim of this project is to download tweet data for bulk processing in After Effects, auto generating and populating compositions. It is divided in two parts:
* **tweet_effects.py**: Python program that prompts the user to input the URL of a tweet. It then downloads its data to a JSON file, as well as the avatar of the user that posted the tweet to a JPEG file. Both files are downloaded. 
* **tweet_effects.jsx**: After Effects script that fetches the downloaded files, imports them all into the project, generates appropiate folder structure and matching compositions based on the template composition in the included After Effects project.
* **tweet_ae.aep**: After Effects project that serves as a template. Before running the script you should edit the composition named "template" to fit your needs. Layers "username" and "tweet text" have been prepopulated with the necessary code, so you just need to run the Python and JSX scripts and new compositions will be created.

Please note this is a work in progress project still in it's early stages.

# Setup
TBD
# Config
TBD
# FAQ
TBD
