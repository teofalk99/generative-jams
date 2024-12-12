import asyncio
from keys import openAI_key
from openai import AsyncOpenAI

async def dall_e_single(prompt, api_key=None):
    """
    Generate a single image using OpenAI's DALL-E model based on the provided prompt.

    Args:
        prompt (str): The text description for the image to be generated.
        api_key: api key of the OpenAI account being used.

    Returns:
        str: URL of the generated image.
    """


    ai_client = AsyncOpenAI(api_key=openAI_key)

    tries = 0
    while tries < 3:
        try:
            response = await ai_client.images.generate(
            model="dall-e-3",
            prompt=f"{prompt}",
            size="1024x1024",
            quality="standard",
            n=1,
            )
            break
        except Exception as e:
            tries += 1
            print(f"Failed {tries} times.")
            if tries >= 4:
                raise Exception("Dall-E fail")

    image_url = response.data[0].url

    return image_url


async def dall_e_multi(line_descriptions, song_description, api_key=None):
    """
    Generate images concurrently for a list of prompts using asyncio.

    Args:
        line_descriptions (list[LineDescription]): List of prompts for image generation each referring to one segment of the lyrics
        song_description (str): words describing overall theme of song

    Returns:
        list: List of results with image URLs
    """

    prompts = [f'{line.words}, {song_description}' for line in line_descriptions]

    results = []

    #multithreaded api calls
    tasks = [dall_e_single(prompt, api_key=api_key) for prompt in prompts]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return results