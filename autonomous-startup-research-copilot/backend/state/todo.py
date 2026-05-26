from typing import Literal
from typing_extensions import TypedDict



class TODO(TypedDict):
    
    content: str
    status: Literal['pending', 'done']