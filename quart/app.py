from quart import Quart, request, jsonify
from models.fastflux.ff import fast_flux_multi
from models.openAI.dalle import dall_e_multi
from models.openAI.prompt_engineering import openAI_split_lyrics, openAI_prompt_engineer
from shazamio import Shazam
from quart_cors import cors
from keys import openAI_key, genius_key, db_config
from lyricsgenius import Genius
import os
import time
import random
import aiomysql


app = Quart(__name__)

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Enable CORS for local hosting
app = cors(app, allow_origin="http://localhost:3000")


async def get_connection():
    return await aiomysql.connect(**db_config)


@app.route('/') 
def home():
    return "Hello, Quart!"


@app.route('/generateImage', methods=['GET'])
async def generate_image():
    """
    Endpoint to generate image URLs based on song lyrics. Accepts a GET request containing song lyrics and other optional query parameters, processes 
    the lyrics to generate image prompts, and returns a list of image URLs alongside 
    metadata.

    Request Structure:
    {
    - artistName: str
    - songLyrics: str
    - songTitle: str
    - model: str
    }

    Responses:
    - 200: {
        "urls": list[str],
        "artist": str,
        "lyrics": str,
        "title": str,
        "splitLyrics": list[str],
        "lineDescriptions": list[str],
        "songDescription": str,
        "model": str,
        "exec_time": str,
        "prompt_num_words": int
        }
    - 400: {"error": "<error_message>"}

    """

    models = {
        "fastflux" : fast_flux_multi,
        "dall-e" : dall_e_multi,
    }

    #num_images set to 5 temporarily due to limit of 5 requests/min for OpenAI
    # num_images = random.randint(5,12)
    num_images = 5
    artist = request.args.get('artistName', default='Unknown Artist')
    lyrics = request.args.get('songLyrics')

    split_lyrics = openAI_split_lyrics(lyrics, int(num_images), api_key=openAI_key)

    num_words = random.randint(2,7)
    converted_lyrics = openAI_prompt_engineer(str(split_lyrics), api_key=openAI_key, num_words=num_words)

    #select model
    model_selection = models[request.args.get('model')]

    start_time = time.time()
    urls = await model_selection(converted_lyrics.line_descriptions, converted_lyrics.song_description)
    end_time = time.time()

    #filter
    res = []
    for url in urls:
        if type(url) == str:
            res.append(url)
    
    #ultimately return list of n image urls
    return jsonify(
                       {
                            'urls' : res,
                            'artist' : artist,
                            'lyrics' : lyrics,
                            'title' : request.args.get("songTitle", default="title error"),
                            'splitLyrics' : split_lyrics,
                            'lineDescriptions' : [line.words for line in converted_lyrics.line_descriptions],
                            'songDescription' : converted_lyrics.song_description,
                            'model': request.args.get('model', default="model selection error"),
                            'exec_time': f"{end_time - start_time:.2f}",
                            'prompt_num_words': num_words

                        }, 200)


@app.route('/shazamAPI', methods=['POST'])
async def shazamAPI():
    """
    Endpoint to that takes an audio file containing music audio as input, and returns the song title, artist, and lyrics. Accepts a POST request containing a webm file.

    Request Structure:
    request.files = {
        "file"
    }

    Responses:
    - 200: {"content": {
                'title' : str
                'artist': str
                'lyrics': str
    }}
        - On sucessful DB commit
    - 500: {"message": "error"}
        - Error

    """

    if 'file' not in (await request.files):
        return jsonify({"error": "Missing file in the request"}), 400

    file = (await request.files)['file']

    # Save file
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    await file.save(save_path)

    shazam = Shazam()
    out = await shazam.recognize("./uploads/audioRecording.webm")
    if out['matches']: 
        data = out['track']

        genius = Genius(genius_key)
        song = genius.search_song(data['title'], data['subtitle'])
        return jsonify(
            {
                'content': {
                    'title' : data['title'],
                    'artist' : data['subtitle'],
                    'lyrics': song.lyrics
                },
                'status': "ok"
            }), 200

    return jsonify({'message: error'}), 500


@app.route('/DBstore', methods=['POST'])
async def db_store():
    """
    Endpoint to store user feedback data in the database. Accepts a POST request containing JSON data.

    Request Structure:
    {
        "params": {
            "exec_time": str,
            "img_quality": int,
            "img_relevance": int,
            "model": str,
            "num_images": int,
            "num_words": int
        }
    }

    Responses:
    - 201: {"message": "Data stored"}
        - On sucessful DB commit
    - 500: {"error": "<error_message>"}
        - Error

    """

    data = await request.json
    data = data['params']

    conn = await get_connection()
    async with conn.cursor() as cursor:
        try:
            await cursor.execute(
                "INSERT INTO results (exec_time, img_quality, img_relevance, model, num_images, num_words) VALUES (%s, %s, %s, %s, %s, %s)", (data.get("exec_time"),
                                                                                                                                              data.get("img_quality"),
                                                                                                                                              data.get("img_relevance"),
                                                                                                                                              data.get("model"),
                                                                                                                                              data.get("num_images"),
                                                                                                                                              data.get("num_words")
                                                                                                                                              )
            )
            await conn.commit()
            return jsonify({"message": "Data stored"}), 201
        except Exception as e:
            await conn.rollback()
            return jsonify({"error": str(e)}), 500
        finally:
            conn.close()


if __name__ == '__main__':
    app.run(debug=True, port=3001)