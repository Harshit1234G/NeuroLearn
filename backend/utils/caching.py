import os
import json

from backend.config import CACHE_DIR


def save_state(state: dict, student: str) -> None:
    """Save the langgraph state for a given student."""
    os.makedirs(CACHE_DIR, exist_ok= True)
    
    base_name = sanitize_filename(student)
    filename = os.path.join(CACHE_DIR, f'{base_name}.json')

    # If file exists, generate a new name with (n)
    if os.path.exists(filename):
        counter = 2

        while True:
            alt_filename = os.path.join(CACHE_DIR, f'{base_name} ({counter}).json')

            if not os.path.exists(alt_filename):
                filename = alt_filename
                break

            counter += 1

    with open(filename, 'w', encoding= 'utf-8') as f:
        json.dump(state, f, indent= 2, ensure_ascii= False)


def load_state(file_name: str) -> dict | None:
    """Load the langgraph state for a given student if it exists. Input exact name of the file."""
    filename = os.path.join(CACHE_DIR, file_name)

    if os.path.exists(filename):
        with open(filename, 'r', encoding= 'utf-8') as f:
            state = json.load(f)

        return state
    
    return None


def sanitize_filename(name: str) -> str:
    """Make sure student names are safe for filenames."""
    return ''.join(c if c.isalnum() or c in ('-', '_') else '' for c in name).lower()
