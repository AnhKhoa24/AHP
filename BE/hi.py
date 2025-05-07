from connection import get_database
from Services.upsert_cache import upsert_cache
from datetime import datetime, timedelta, timezone

db = get_database()
collection = db["session_cache"]
collection.create_index("expireAt", expireAfterSeconds=0)

_id = upsert_cache(
    _id="",
    data={"name": "OnlyName"},
    key="listsv",
    expire_at=datetime.now(timezone.utc) + timedelta(minutes=30),
    collection=collection
)

print("Inserted ID:", _id)