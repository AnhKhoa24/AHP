from fastapi import APIRouter
from pydantic import BaseModel
from LLMGenMatrix import genMatrix
router = APIRouter()


class MatrixInput(BaseModel):
    sizematrix: int

@router.post("/goiymatran")
async def check_matrix(data: MatrixInput):
    matrix = genMatrix(data.sizematrix)
    return {"matrix": matrix}