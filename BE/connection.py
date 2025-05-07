import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load biến môi trường từ file .env
load_dotenv()

# Lấy chuỗi kết nối từ biến môi trường
MONGO_URI = os.getenv("MONGO_URI")

def get_database(db_name="APH_DB"):
    """Kết nối và trả về database MongoDB"""
    client = MongoClient(MONGO_URI)
    return client[db_name]
