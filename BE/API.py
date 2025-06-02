from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routers import matrix_routes, university_routes, ranking_routes, IdealMatrix, Excel_routes

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(matrix_routes.router)
app.include_router(university_routes.router)
app.include_router(ranking_routes.router)
app.include_router(IdealMatrix.router)
app.include_router(Excel_routes.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("API:app", host="0.0.0.0", port=8000, reload=True)
