# from groq import Groq
# import time
# client = Groq(api_key="")
# models = [
#     "deepseek-r1-distill-llama-70b",
#     "llama3-70b-8192",
#     "llama-3.3-70b-versatile",
# ]

# def try_models(models, messages):
#     for model in models:
#         try:
#             print(f"Đang thử model: {model}")
#             response = client.chat.completions.create(
#                 model=model,
#                 messages=messages
#             )
#             return response.choices[0].message.content
        
#         except Exception as e:
#             print(f"Model {model} lỗi: {e}")
#             time.sleep(1) 
#     raise RuntimeError("Không model nào hoạt động.")

# # result = try_models(models, messages)
# # print("\n Kết quả cuối cùng:\n", result)

# def generate_prompt(n):
#     return f"""You are a JSON generator that creates pairwise comparison matrices for the Analytic Hierarchy Process (AHP).

# Your task is to randomly generate a {n}x{n} AHP matrix with valid values, such that the Consistency Ratio (CR) is strictly less than 0.1.

# Each matrix element a_ij must be a string selected from the set:
# ["1/9", "1/8", "1/7", "1/6", "1/5", "1/4", "1/3", "1/2", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

# The matrix must be:
# - Consistent enough to satisfy CR < 0.1
# - Reciprocal: a_ji = inverse of a_ij (e.g., if a_12 = "5" then a_21 = "1/5")

# ⚠️ Output only the raw JSON array (a list of lists of strings), no explanation, no markdown, no comments.
# ⚠️ Randomize the matrix as long as CR < 0.1 is satisfied.

# Return only JSON, for example:
# [
#   ["1", "3", "4"],
#   ["1/3", "1", "2"],
#   ["1/4", "1/2", "1"]
# ]
# """
# def prompt(n):
#     return [
#     {
#         "role": "user",
#         "content": generate_prompt(n)
#     }
# ]
# def extract_json_array(text):
#     start = text.find('[')
#     end = text.rfind(']')
#     if start == -1 or end == -1 or end < start:
#         raise ValueError("Không tìm thấy đoạn JSON hợp lệ.")
#     return text[start:end + 1]

# def generate_matrix(n):
#     result = try_models(models, prompt(n))
#     return extract_json_array(result)

# print(generate_matrix(3))