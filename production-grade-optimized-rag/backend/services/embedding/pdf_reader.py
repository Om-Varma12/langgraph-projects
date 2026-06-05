from pathlib import Path
from pypdf import PdfReader


current_file = Path(__file__)
main_folder = current_file.parent.parent.parent.parent
sharing_folder = main_folder / 'sharing'


def readPDF(name: str):
    print('pdf reader started')

    file_location = sharing_folder / name
    
    content = ''
    reader = PdfReader(file_location)
    for page in reader.pages:
        content += page.extract_text() + '\n'
    
        
    print('pdf reader ended')

    return content