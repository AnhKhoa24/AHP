def tim_kiem_chuyen_nganh(db, tu_khoa):
    collection = db["major"]
    regex_query = {'$regex': tu_khoa, '$options': 'i'}
    ket_qua = collection.find({
        '$or': [
            {'name': regex_query},
            {'name_khong_dau': regex_query},
            {'viet_tat': regex_query}
        ]
    })

    # Chuyển ObjectId thành str
    ket_qua_list = []
    for doc in ket_qua:
        doc['_id'] = str(doc['_id'])  # Convert ObjectId to string
        ket_qua_list.append(doc)

    return ket_qua_list

def tim_kiem_thanh_pho(db, tu_khoa, id_kv):
    collection = db["thanhpho"]
    regex_query = {'$regex': tu_khoa, '$options': 'i'}

    query = {
        '$or': [
            {'name': regex_query},
            {'name_khong_dau': regex_query},
            {'viet_tat': regex_query}
        ]
    }

    if id_kv != 0:
        query = {
            '$and': [
                query,
                {'region': id_kv}
            ]
        }

    ket_qua = collection.find(query)

    ket_qua_list = []
    for doc in ket_qua:
        doc['_id'] = str(doc['_id']) 
        ket_qua_list.append(doc)

    return ket_qua_list

def search_truong(db, keyword, region, id_chung):
    collection = db["List_DH"]
    
    base_filter = {
        "$or": [
            {"name": {"$regex": keyword, "$options": "i"}},
            {"id": {"$regex": f"^{keyword}$", "$options": "i"}}
        ]
    }
    and_conditions = [base_filter]

    if region != 0:
        and_conditions.append({"city": region})

    if id_chung != 0:
        and_conditions.append({
            "majors": {
                "$elemMatch": {
                    "id_chung": id_chung
                }
            }
        })
    query = {"$and": and_conditions} if len(and_conditions) > 1 else base_filter

    return list(collection.find(query))


