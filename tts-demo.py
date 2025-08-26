from pathlib import Path
import openai
import os

def main():
    # Set up OpenAI client - requires OPENAI_API_KEY environment variable
    client = openai.OpenAI()

    # Configuration
    tts_model = "tts-1"
    tts_voice = "alloy"
    #tts_speed = 1.0
    text_to_speak = "Hello, this is a test of the emergency broadcast system."
    output_filename = "output.mp3"
    speech_file_path = Path(__file__).parent / output_filename

    print(f"    Attempting to generate speech for: {text_to_speak}")
    print(f"    Model: {tts_model}")
    print(f"    Voice: {tts_voice}")
    print(f"    Output file: {output_filename}")
    print(f"    Output file path: {speech_file_path}")

    try:
        # Generate speech and save to file
        with client.audio.speech.with_streaming_response.create(
            voice=tts_voice,
            input=text_to_speak,
            model=tts_model,
            instructions="Speek like a friendly story teller telling a sleepy bedtime story",
        ) as response:
            response.stream_to_file(speech_file_path)

        print(f"    ✓ Speech generated successfully: {speech_file_path}")

    except Exception as e:
        print(f"    ✗ Error generating speech: {e}")

if __name__ == "__main__":
    main()



"""
For streaming

import asyncio 
from openai import AsyncOpenAI
from openai.helper import LocalAudioPlayer
from dotenv import load_dotenv

load_dotenv()
client = AsyncOpenAI()



async with client.audio.speeh.with_streaming_response.create(
  voice=tts_voice,
  input=text_to_speak,
  speed=tts_speed,
  model=tts-model,
  instructions="Speek like a friendly story teller telling a sleepy bedtime story",
  response_format="pcm",
) as response:
await LocalAudioPlayer().play(response)

if __name__ == "__main__":
  asyncio.run(main())
"""