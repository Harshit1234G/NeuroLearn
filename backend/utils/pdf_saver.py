import pypandoc


def create_pdf(markdown_text: str, output_file: str) -> None:
    pypandoc.convert_text(
        markdown_text,
        to= 'pdf',
        format= 'md',
        outputfile= output_file,
        extra_args= [
            '--pdf-engine=xelatex',
            '-V', 'mainfont=Segoe UI Emoji',
            '-V', 'monofont=Courier New',
            '-V', 'fontsize=12pt',
            '-V', 'geometry:margin=1in'
        ]
    )
