from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from AHP import calculate_CR 
import uvicorn
from connection import get_database
from queryUniversity import search_in_mongodb
from queryUniversity import search_major
from fastapi import Query
from fastapi.responses import JSONResponse


db = get_database()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

def convert_matrix_to_numbers(matrix):
    def to_decimal(val):
        if '/' in val:
            num, denom = val.split('/')
            return float(num) / float(denom)
        return float(val)
    
    return np.array([[to_decimal(item) for item in row] for row in matrix])

class MatrixInput(BaseModel):
    matrix: List[List[str]]  

@app.post("/validate-matrix")
async def check_matrix(data: MatrixInput):
    # print("\nMa trận nhận được:")
    # for row in convert_matrix_to_numbers(data.matrix):
    #     print(row)
    
    numeric_matrix = convert_matrix_to_numbers(data.matrix)
    gt, PA = calculate_CR(numeric_matrix)
    print("CR:", gt)
    print("Criteria Weights (arr_avg):", PA)

    if(gt < 0.1):
        document = {
        "matrix": numeric_matrix.tolist(),  
        "cr": gt
        }
        collection = db["matrices"]
        collection.insert_one(document)  
    
    return {
        "cr": round(gt, 4),
        "criteria_weights": PA
    }

class KeywordRequest(BaseModel):
    keyword: str

@app.post("/getUni")
async def get_universities(data: KeywordRequest):
    results = search_in_mongodb(db, data.keyword)
    for r in results:
        r["_id"] = str(r["_id"])
    return JSONResponse(content=results)

class TimNganh(BaseModel):
    matruong: str
    keyword: str
@app.post("/getMajor")
async def get_universities(data: TimNganh):
    results = search_major(db, data.matruong, data.keyword)
    return JSONResponse(content=results)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("API:app", host="0.0.0.0", port=8000, reload=True)

