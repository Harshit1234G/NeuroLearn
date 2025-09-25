import os
import json

from backend.config import CACHE_DIR


def save_state(state: dict, student: str) -> None:
    """Save the langgraph state for a given student."""
    os.makedirs(CACHE_DIR, exist_ok= True)
    filename = os.path.join(CACHE_DIR, f'{sanitize_filename(student)}.json')

    with open(filename, 'w', encoding= 'utf-8') as f:
        json.dump(
            state, 
            f, 
            indent= 2, 
            ensure_ascii= False
        )


def load_state(student: str) -> dict | None:
    """Load the langgraph state for a given student if it exists."""
    filename = os.path.join(CACHE_DIR, f'{sanitize_filename(student)}.json')

    if os.path.exists(filename):
        with open(filename, 'r', encoding= 'utf-8') as f:
            state = json.load(f)

        return state
    
    return None


def sanitize_filename(name: str) -> str:
    """Make sure student names are safe for filenames."""
    return ''.join(c if c.isalnum() or c in ('-', '_') else '' for c in name).lower()
