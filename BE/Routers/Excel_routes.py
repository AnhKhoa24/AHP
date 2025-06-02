from fastapi import APIRouter,File, UploadFile
from pydantic import BaseModel
from typing import List
from Services.AHP_Excel import ahpExcel
import numpy as np
from fastapi.responses import FileResponse
from Services.ScanFile import extract_ahp_matrix_by_marker_safe, float_to_fraction_str
from io import BytesIO
from fastapi import HTTPException


router = APIRouter()

class MatrixInput(BaseModel):
    matrix: List[List[str]]
    criteria: List[str]

def convert_matrix_to_numbers(matrix):
    def to_decimal(val):
        if '/' in val:
            num, denom = val.split('/')
            return float(num) / float(denom)
        return float(val)
    return np.array([[to_decimal(item) for item in row] for row in matrix])

@router.post("/Excel")
async def excel_file(data: MatrixInput):
    numeric_matrix = convert_matrix_to_numbers(data.matrix)
    print("Numeric Matrix:", numeric_matrix)  
    filepath = ahpExcel(data.criteria, numeric_matrix)  # <- truyền ma trận numpy
    return FileResponse(
        path=filepath,
        filename="AHP_Result.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@router.post("/ImportExcel")
async def upload_ahp_excel(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        criteria, matrix = extract_ahp_matrix_by_marker_safe(contents)
        matrix_fraction = [[float_to_fraction_str(cell) for cell in row] for row in matrix]
        
        def to_abbreviation(text):
            return ''.join(word[0].lower() for word in text.split() if word)

        full = [{"id": to_abbreviation(c), "text": c} for c in criteria]
        return {"criteria": criteria, "matrix": matrix_fraction, "full": full}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Lỗi xử lý file: {str(e)}")