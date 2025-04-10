from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from AHP import calculate_CR 
import uvicorn
from connection import get_database

db = get_database()
collection = db["matrices"]


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

@app.post("/validate-matrix/")
async def check_matrix(data: MatrixInput):
    print("\n📌 Ma trận nhận được:")
    for row in convert_matrix_to_numbers(data.matrix):
        print(row)
    
    numeric_matrix = convert_matrix_to_numbers(data.matrix)
    gt = calculate_CR(numeric_matrix)

    if(gt < 0.1):
        document = {
        "matrix": numeric_matrix.tolist(),  
        "cr": gt
        }
        collection.insert_one(document)  
    
    return round(gt, 4)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("API:app", host="0.0.0.0", port=8000, reload=True)

