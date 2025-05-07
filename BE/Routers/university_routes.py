from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from connection import get_database
from Services.queryUniversity import search_in_mongodb, search_major
from Services.SearchMajor import tim_kiem_chuyen_nganh, tim_kiem_thanh_pho, search_truong

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

@router.post("/tim_nganh")
async def tim_nganh(data: KeywordRequest):
    results = tim_kiem_chuyen_nganh(db, data.keyword)
    return JSONResponse(content=results)

class TimTP(BaseModel):
    region: int
    keyword: str
@router.post("/tim_tp")
async def tim_nganh(data: TimTP):
    results = tim_kiem_thanh_pho(db, data.keyword, data.region)
    return JSONResponse(content=results)


class TimTruong(BaseModel):
    region: int
    id_nganh: int
    keyword: str
@router.post("/tim_truong")
async def tim_nganh(data: TimTruong):
    results = search_truong(db, data.keyword, data.region, data.id_nganh)
    for r in results:
        r["_id"] = str(r["_id"])
    return JSONResponse(content=results)