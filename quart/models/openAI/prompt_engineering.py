from openai import OpenAI
from pydantic import BaseModel

class SplitLyrics(BaseModel):
    parts : list[str]


class LineDescription(BaseModel):
    words : str


class ProcessedSong(BaseModel):
    song_description: str
    line_descriptions: list[LineDescription]


def openAI_split_lyrics(lyrics, n, model="gpt-4o-mini", max_tokens=1000, api_key=None):
    """
    Returns a list of n parts of song lyrics

    Parameters:
    lyrics : string
    n : int

    Returns:
    list[string]
    """

    client = OpenAI(
        api_key=api_key
    )
    

    chat_completion = client.beta.chat.completions.parse(
    messages=[
        
            {"role": "system", "content" : f"You are a helpful assistant. Given some song lyrics, split the ENTIRE lyrics into exactly {n} similarly sized parts. Each part needs to be at least three lines long. Ignore any bracketed text or advertisements."},
            {"role": "user", "content": lyrics}
        ],
    model=model,
    max_tokens=max_tokens,
    response_format=SplitLyrics
    )

    # Extract and return the assistant's reply
    return (chat_completion.choices[0].message.parsed.parts)


def openAI_prompt_engineer(lyrics, model="gpt-4o-mini", max_tokens=150, api_key=None, num_words=3):
    """Returns a json object containing n sets of words describing each verse/line of song lyrics

    Parameters:
        dict - {
        images : int
        lyrics : string
        artist : string
        }
    
    Returns:
        json object
        {
        songTheme : string (overall theme/vibe of song)
        verseThemes : list[string] (theme of each part of song)
        }
    
    """

    client = OpenAI(
        api_key=api_key
    )

    

    chat_completion = client.beta.chat.completions.parse(
    messages=[
        
            {"role": "system", "content" : f"""
                                            You are a helpful assistant. Given a list of strings which are song lyrics split into several parts,
                                            generate two things:
                                            1. an overall song description, two words describing the overall themes of the song
                                            2. for each part of the song in the provided list, provide exactly {num_words} words describing the theme of that part. One of the words
                                            must be a concrete noun. Please avoid any sexual adjectives"""},
            {"role": "user", "content": lyrics}
        ],
    model=model,
    max_tokens=max_tokens,
    response_format=ProcessedSong
    )

    return chat_completion.choices[0].message.parsed