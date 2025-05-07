import unicodedata

# Chuẩn hóa tên: xóa dấu, lowercase, strip
def normalize(text):
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')  # Remove diacritics
    return text.lower().strip()

# Bước 1: Tạo từ điển ánh xạ ngành chuẩn
def build_mapping_nganh_chung(db):
    nganh_chung = db["major"]
    mapping = {}

    for doc in nganh_chung.find():
        # Map theo name, name_khong_dau và viet_tat nếu có
        for key in ["name", "name_khong_dau", "viet_tat"]:
            if key in doc:
                norm = normalize(doc[key])
                mapping[norm] = doc["id"]
    
    return mapping

# Bước 2: Duyệt tất cả trường, gán id_chung cho ngành nếu tên khớp
def cap_nhat_id_chung_cho_majors(db):
    truong_col = db["List_DH"]
    mapping = build_mapping_nganh_chung(db)

    for truong in truong_col.find():
        updated = False
        majors = truong.get("majors", [])

        for major in majors:
            norm_name = normalize(major.get("name", ""))
            id_chung = mapping.get(norm_name)
            if id_chung:
                major["id_chung"] = id_chung
                updated = True

        if updated:
            truong_col.update_one(
                {"_id": truong["_id"]},
                {"$set": {"majors": majors}}
            )


from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/?directConnection=true")
db = client["APH_DB"]
cap_nhat_id_chung_cho_majors(db)
