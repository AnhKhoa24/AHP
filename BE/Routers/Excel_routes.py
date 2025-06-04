from fastapi import APIRouter,File, UploadFile
from pydantic import BaseModel
from typing import List
from Services.dang import ahpExcel
import numpy as np
from fastapi.responses import FileResponse, JSONResponse
from Services.ScanExcelFile import extract_sheet1_from_wb, extract_sheet2_from_wb
from Services.checkExcel import check_ahp_table_from_wb
from io import BytesIO
from fastapi import HTTPException
import openpyxl
import io
from Models.ExcelRequest import FullExcel
from fractions import Fraction

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
    filename = file.filename.lower()
    if not filename.endswith((".xlsx", ".xlsm", ".xltx", ".xltm")):
        raise HTTPException(status_code=400, detail="Vui lòng upload file Excel (.xlsx, .xlsm, ...).")

    try:
        contents = await file.read()
        wb_file = io.BytesIO(contents)

        wb = openpyxl.load_workbook(wb_file, data_only=True)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Không thể đọc file Excel: {exc}")

    try:
        sheet1_data = extract_sheet1_from_wb(wb)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Lỗi khi trích xuất Sheet1: {exc}")

    try:
        sheet2_data = extract_sheet2_from_wb(wb)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Lỗi khi trích xuất Sheet2: {exc}")
    
    try:
        check = check_ahp_table_from_wb(wb)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Lỗi khi trích xuất Sheet2: {exc}")

    result = {
        "sheet1": sheet1_data,
        "sheet2": sheet2_data,
        "check": check
    }
    return JSONResponse(content=result, status_code=200)


@router.post("/full_excel", response_model=FullExcel)
async def receive_full_excel(payload: FullExcel):
    print("Received tieuchis =", payload.tieuchis)
    print("Received matrantieuchi =", payload.matrantieuchi)
    print("Received phuongans =", payload.phuongans)
    print("Received matranphuongan =", payload.matranphuongan)



    # Nếu muốn trả lại chính payload, FastAPI sẽ tự chuyển thành JSON
    return payload


@router.post("/full_excel_v2", response_model=FullExcel)
async def receive_full_excel(payload: FullExcel):
    arr = payload.tieuchis  # e.g. ["Địa điểm", "Điểm đầu vào", ...]

    matran_tieuchi = np.array([
        [float(Fraction(cell)) for cell in row]
        for row in payload.matrantieuchi
    ])

    arr_truongNganh = [
        {
            "ten": pa.ten,
            "nganh": pa.nganh,
            "kihieu": pa.kihieu
        }
        for pa in payload.phuongans
    ]
    print(arr_truongNganh)

    list_matrices_phuongs = []
    for mat_str in payload.matranphuongan:
        np_mat = np.array([
            [float(Fraction(cell)) for cell in row]
            for row in mat_str
        ])
        list_matrices_phuongs.append(np_mat)

    filename = ahpExcel(arr, matran_tieuchi, list_matrices_phuongs, arr_truongNganh)
    return FileResponse(
        path=filename,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=filename
    )
