from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timedelta

def upsert_cache(_id: str, data: dict, key: str, expire_at: datetime, collection):
    if not key:
        raise ValueError("key không được để trống")
    if not _id:
        doc = {
            "data": {
                key: data
            },
            "createdAt": datetime.utcnow(),
            "expireAt": expire_at
        }
        result = collection.insert_one(doc)
        return str(result.inserted_id)

    try:
        obj_id = ObjectId(_id)
    except:
        raise ValueError("Invalid ObjectId format.")

    doc = collection.find_one({"_id": obj_id})
    if not doc:
        return None 

    update_path = f"data.{key}"
    result = collection.update_one(
        {"_id": obj_id},
        {
            "$set": {
                update_path: data,
                "expireAt": expire_at
            }
        }
    )
    return _id 
