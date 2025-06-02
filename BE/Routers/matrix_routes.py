from fastapi import APIRouter
from pydantic import BaseModel
from typing import List,Any
import numpy as np
from Services.AHP import calculate_CR
from connection import get_database
from Services.upsert_cache import upsert_cache
from datetime import datetime, timedelta, timezone
from Services.Ajust import ahp_consistency_analysis
router = APIRouter()
db = get_database()

class MatrixInput(BaseModel):
    cap: Any
    matrix: List[List[str]]
    id: str
    type: str

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
    gt, PA, CI, lamdamax, cv, sw = calculate_CR(numeric_matrix)

    ###Thu thập data dưới 0.1
    if 0< gt < 0.1:
        db["matrices"].insert_one({
            "matrix": numeric_matrix.tolist(),
            "cr": gt
        })
    
    ### create session
    collection = db["session_cache"]
    collection.create_index("expireAt", expireAfterSeconds=0)
    _id = data.id
    if(data.type == "tc"):
        _id = upsert_cache(
            _id= data.id,
            data = {
                "sscap": data.cap,
                "matrix": data.matrix,
                "cr": gt,
                "pa": PA
            },
            key= "matrantieuchi",
            expire_at=datetime.now(timezone.utc) + timedelta(minutes=30),
            collection=collection
        )
    else:
        _id = upsert_cache(
            _id= data.id,
            data = {
                "sscap": data.cap,
                "matrix": data.matrix,
                "cr": gt,
                "pa": PA
            },
            key= data.type,
            expire_at=datetime.now(timezone.utc) + timedelta(minutes=30),
            collection=collection
        )
    recomment = ahp_consistency_analysis(numeric_matrix)
    print(recomment)

    return {
        "cr": round(gt, 4),
        "criteria_weights": PA,
        "consistency_vector": cv,
        "sumweight": sw,
        "CI": round(CI,4),
        "lamda": round(lamdamax,4),
        "_id":_id,
        "rcm": recomment.to_dict(orient="records")
    }
