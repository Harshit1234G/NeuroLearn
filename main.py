import os
import sys
import getpass
from dotenv import load_dotenv
from backend.agents import NeuroLearn
from backend.utils import get_logger


def banner() -> None:
    print('\n' + '=' * 65)
    print(' ' * 22 + '* NeuroLearn *')
    print('=' * 65 + '\n')


def usage() -> None:
    print('📘 How to use:\n')
    print('1. Enter your name.')
    print('2. Enter the topic you want to study (default: "Percentages").')
    print('3. Assessment will start for the chosen topic.')
    print('4. Enter your answer from the given options.')
    print('5. Reports will be saved in the `reports` folder.')
    print('   Tutor Notes will be saved in the `notes` folder.\n')

    print('⚠️  Things to keep in mind:')
    print('   - Take as much time as you need for solving the assessment.')
    print('   - Requires valid OpenAI + LangSmith credentials.')
    print('   - Missing keys will be requested securely.')
    print('   - Cancel anytime with Ctrl+C.')
    print('\n' + '=' * 65 + '\n')


def load_env(logger):
    if load_dotenv():
        logger.info('.env loaded successfully.')

    else:
        logger.warning('.env not found. You will be prompted for missing keys.')

    os.environ['LANGSMITH_TRACING'] = 'true'
    os.environ['LANGSMITH_ENDPOINT'] = 'https://api.smith.langchain.com'

    required_vars = ['OPENAI_API_KEY', 'LANGSMITH_API_KEY', 'LANGSMITH_PROJECT']
    for var in required_vars:
        if not os.environ.get(var):
            logger.warning(f'"{var}" not found. Requesting input...')

            try:
                os.environ[var] = getpass.getpass(f'Enter your {var} (hidden): ')

            except KeyboardInterrupt:
                print('\n❌ Input cancelled. Exiting...')
                sys.exit(1)


def main():
    logger = get_logger('NeuroLearn-CLI')

    banner()
    usage()

    load_env(logger)
    logger.info('All required environment variables available. Proceeding...')

    try:
        student = input('\n👤 Enter your name: ').strip()

        if not student:
            logger.error('No student name provided. Exiting...')
            sys.exit(1)

        tags = input('📚 Enter topic to study [default: Percentages]: ').strip() or 'Percentages'

        nl = NeuroLearn()
        result = nl.run(student, tags)

        print('\n✅ Assessment completed successfully!')
        print('📂 Reports saved in `reports/` and notes in `notes/`.\n')

    except KeyboardInterrupt:
        print('\n\n❌ Interrupted by user. Exiting...')
        sys.exit(1)
        
    except Exception as e:
        logger.exception('Unexpected error occurred.')
        print(f'\n⚠️  Error: {e}')
        sys.exit(1)


if __name__ == '__main__':
    main()
