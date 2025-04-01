import numpy as np

# Bảng giá trị Random Index (RI) theo số hàng n
RI_TABLE = {
    1: 0.00, 2: 0.00, 3: 0.58, 4: 0.90, 5: 1.12,
    6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49
}

def calculate_CR(matrix):
    n = matrix.shape[0]  # Số hàng/cột của ma trận
    
    # Tính vector trọng số riêng
    eigenvalues, eigenvectors = np.linalg.eig(matrix)
    lambda_max = np.max(eigenvalues.real)  # Giá trị riêng lớn nhất

    # Tính CI
    CI = (lambda_max - n) / (n - 1) if n > 1 else 0

    # Tìm giá trị RI từ bảng
    RI = RI_TABLE.get(n, 1.49)  # Mặc định lấy RI của n=10 nếu không tìm thấy

    # Tính CR
    CR = CI / RI if RI != 0 else 0

    return CR

# Ví dụ: Ma trận so sánh cặp
matrix = np.array([
    [1, 1/2, 3, 1/2, 1/3, 1/3, 1/4],
    [2, 1, 4, 2, 1, 1/2, 1/3],
    [1/3, 1/4, 1, 1/3, 1/3, 1/5, 1/6],
    [2, 1/2, 3, 1, 2, 1, 1/2],
    [3, 1, 3, 1/2, 1, 2,1],
    [3, 2, 5, 1, 1/2, 1, 2],
    [4, 3, 6, 2, 1, 1/2, 1]
])

# Kiểm tra tính nhất quán
CR_value = calculate_CR(matrix)
print(f"CR = {CR_value:.4f}")
if CR_value < 0.1:
    print("Ma trận nhất quán!")
else:
    print("Ma trận không nhất quán, cần điều chỉnh.")
