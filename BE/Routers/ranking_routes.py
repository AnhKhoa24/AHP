from fastapi import APIRouter
from schemas import DuLieuGui
from Services.FinalRanking import FinalRanking

router = APIRouter()

@router.post("/ranking_final")
async def nhan_du_lieu(data: DuLieuGui):
    return FinalRanking(data)
