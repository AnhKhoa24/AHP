import numpy as np
import pandas as pd

def ahp_consistency_analysis(A):
    n = A.shape[0]
    # Bước 1: Tính trọng số bằng trung bình hình học
    geometric_means = np.prod(A, axis=1)**(1/n)
    weights = geometric_means / np.sum(geometric_means)
    # Bước 2: Tạo lại ma trận lý tưởng từ weights
    A_ideal = np.array([[weights[i] / weights[j] for j in range(n)] for i in range(n)])
    # Bước 3: Tính sai số log tuyệt đối
    error_matrix = np.abs(np.log(A) - np.log(A_ideal))

    # Bước 4: Tính CR
    # lambda_max = np.sum(np.dot(A, weights) / weights) / n
    # CI = (lambda_max - n) / (n - 1) if n > 1 else 0
    # RI_dict = {1: 0.0, 2: 0.0, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24,
    #            7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49}
    # RI = RI_dict.get(n, 1.49)  # default max
    # CR = CI / RI if RI != 0 else 0
    # if CR < 0.1:
    #     return f"CR = {CR:.4f} < 0.1 → Ma trận đã nhất quán, không cần chỉnh sửa."

    # Bước 5: Chuyển về bảng lỗi từng cặp (i, j)
    errors = []
    for i in range(n):
        for j in range(i+1, n):
            errors.append({
                "i": i,
                "j": j,
                "original": A[i][j],
                "ideal": A_ideal[i][j],
                "abs_log_error": error_matrix[i][j]
            })
    errors_sorted = sorted(errors, key=lambda x: -x["abs_log_error"])
    df_errors = pd.DataFrame(errors_sorted)

    return df_errors

# # Test với ví dụ
# A = np.array([
#     [1,   3,   2],
#     [1/3, 1,   2],
#     [1/2, 1/2, 1]
# ])

# result = ahp_consistency_analysis(A)
# print(result)
