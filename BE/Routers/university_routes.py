from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from connection import get_database
from Services.queryUniversity import search_in_mongodb, search_major

db = get_database()
router = APIRouter()

class KeywordRequest(BaseModel):
    keyword: str

@router.post("/getUni")
async def get_universities(data: KeywordRequest):
    results = search_in_mongodb(db, data.keyword)
    for r in results:
        r["_id"] = str(r["_id"])
    return JSONResponse(content=results)

class TimNganh(BaseModel):
    matruong: str
    keyword: str

@router.post("/getMajor")
async def get_majors(data: TimNganh):
    results = search_major(db, data.matruong, data.keyword)
    return JSONResponse(content=results)
