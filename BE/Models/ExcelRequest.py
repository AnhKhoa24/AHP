from pydantic import BaseModel
from typing import List

class PhuongAn(BaseModel):
    ten: str
    kihieu: str
    nganh: str

class FullExcel(BaseModel):
    tieuchis: List[str]
    matrantieuchi: List[List[str]]
    phuongans: List[PhuongAn]
    matranphuongan: List[List[List[str]]]
