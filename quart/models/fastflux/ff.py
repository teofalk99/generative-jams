import asyncio
import httpx
from keys import ff_key


async def fast_flux_single(client, prompt):
    """
    Generate a single image using Runware's FastFlux model based on the provided prompt.

    Args:
        client: httpx client.
        prompt (str): The text description for the image to be generated.

    Returns:
        str: URL of the generated image.
    """

    api_key = ff_key
 
    url = "https://api.runware.ai/v1"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = [
        {
            "taskType": "imageInference",
            "taskUUID": "39d7207a-87ef-4c93-8082-1431f9c1dc97",
            "positivePrompt": f"{prompt}",
            "negativePrompt": "text, nudity, naked, breasts, sex, genitals, cleavage, underwear, lingerie",
            "width": 512,
            "height": 512,
            "modelId": "civitai:25694@143906",
            "numberResults": 1,
            "checkNSFW": True
        }
    ]

    #nsfw content check
    nsfw = True
    tries = 0

    while tries < 3 and nsfw:
        try:
            response = await client.post(url, headers=headers, json=data)
            #nsfw check
            if response.json()['data'][0]['NSFWContent']:
                print("nsfw result, retrying")
                continue
            else:
                nsfw = False

        except Exception as e:
            tries += 1
            print(f"Failed {tries} times.")
            if tries >= 4:
                raise Exception("fastflux fail")            


    return response.json()['data'][0]['imageURL']


async def fast_flux_multi(lineDescriptions, songDescription):
    """
    Generate images concurrently for a list of prompts using httpx.

    Args:
        line_descriptions (list[LineDescription]): List of prompts for image generation each referring to one segment of the lyrics
        song_description (str): words describing overall theme of song

    Returns:
        list: List of results with image URLs
    """

    prompts = [f'{line.words}, {songDescription}' for line in lineDescriptions]

    async with httpx.AsyncClient() as client:

        calls = [fast_flux_single(client, prompt) for prompt in prompts]
        results = await asyncio.gather(*calls)

    return results