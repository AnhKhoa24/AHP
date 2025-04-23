from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import numpy as np
from Services.AHP import calculate_CR
from connection import get_database

router = APIRouter()
db = get_database()

class MatrixInput(BaseModel):
    matrix: List[List[str]]

def convert_matrix_to_numbers(matrix):
    def to_decimal(val):
        if '/' in val:
            num, denom = val.split('/')
            return float(num) / float(denom)
        return float(val)
    return np.array([[to_decimal(item) for item in row] for row in matrix])

@router.post("/validate-matrix")
async def check_matrix(data: MatrixInput):
    numeric_matrix = convert_matrix_to_numbers(data.matrix)
    gt, PA = calculate_CR(numeric_matrix)
    if gt < 0.1:
        db["matrices"].insert_one({
            "matrix": numeric_matrix.tolist(),
            "cr": gt
        })
    return {
        "cr": round(gt, 4),
        "criteria_weights": PA
    }
