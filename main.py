import os
import getpass
from dotenv import load_dotenv
from backend.agents import NeuroLearn
from backend.utils import get_logger


if __name__ == '__main__':
    logger = get_logger('main')

    print('\n=======================* NeuroLearn *=======================\n')
    print('Guidelines:\n')
    print('1. Enter your name and topic to study.')
    print('2. ')
