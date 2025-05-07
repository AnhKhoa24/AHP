from pymongo import MongoClient
from unidecode import unidecode

def add_normalized_name_field(uri, db_name, collection_name):
    # Kết nối tới MongoDB
    client = MongoClient(uri)
    db = client[db_name]
    collection = db[collection_name]

    # Duyệt và cập nhật từng document
    for doc in collection.find():
        name = doc.get("name", "")
        name_khong_dau = unidecode(name)
        collection.update_one(
            {"_id": doc["_id"]},
            {"$set": {"name_khong_dau": name_khong_dau}}
        )

    print("Đã thêm trường 'name_khong_dau' cho tất cả document.")

def tao_viet_tat(name: str) -> str:
    name_khong_dau = unidecode(name)
    chu_cai_dau = [tu[0].upper() for tu in name_khong_dau.split() if tu]
    return ''.join(chu_cai_dau)

def them_truong_moi(uri, db_name, collection_name):
    client = MongoClient(uri)
    db = client[db_name]
    collection = db[collection_name]

    for doc in collection.find():
        name = doc.get("name", "")
        name_khong_dau = unidecode(name)
        viet_tat = tao_viet_tat(name)

        collection.update_one(
            {"_id": doc["_id"]},
            {"$set": {
                "name_khong_dau": name_khong_dau,
                "viet_tat": viet_tat
            }}
        )

    print("Đã thêm cả hai trường 'name_khong_dau' và 'viet_tat'.")

# Gọi hàm
them_truong_moi(
    uri="mongodb://localhost:27017/?directConnection=true",
    db_name="APH_DB",
    collection_name="thanhpho"
)
# Ví dụ sử dụng
# add_normalized_name_field(
#     uri="mongodb://localhost:27017/?directConnection=true",
#     db_name="APH_DB",
#     collection_name="thanhpho"
# )
