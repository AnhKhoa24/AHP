from pydantic import BaseModel
from typing import List, Union

class CWTCItem(BaseModel):
    id: Union[str, int]
    cw: Union[str, int, float]

class CWPAItemDetail(BaseModel):
    id: Union[str, int]
    cw: Union[str, int, float]
class CWPATCItem(BaseModel):
    id: Union[str, int]
    cw: List[CWPAItemDetail]

class DuLieuGui(BaseModel):
    cw_tc: List[CWTCItem]
    cw_pa: List[CWPATCItem]
