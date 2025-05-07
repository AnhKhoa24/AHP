def search_in_mongodb(db, keyword):
    collection = db["List_DH"]
    query = {
        "$or": [
            {"name": {"$regex": keyword, "$options": "i"}},  # LIKE cho name
            {"id": {"$regex": f"^{keyword}$", "$options": "i"}}  # exact match (không phân biệt hoa thường) cho id
        ]
    }
    return list(collection.find(query))

def search_major(db, matruong, keyword):
    collection = db["List_DH"]
    document = collection.find_one({"id": matruong})
    if not document:
        return []
    keyword_lower = keyword.lower()
    matched_majors = [
        major for major in document.get("majors", [])
        if keyword_lower in major.get("name", "").lower()
    ]
    return matched_majors
