from schemas import DuLieuGui
import numpy as np
def FinalRanking(data: DuLieuGui):
    matrix = np.zeros((len(data.cw_pa[0].cw), len(data.cw_tc)))
    hi = []
    for index, item in enumerate(data.cw_pa):
        cw = float(data.cw_tc[index].cw)
        for index1, item1 in enumerate(item.cw):  
            cw1 = cw * float(item1.cw)
            hi.append(item1.id)
            matrix[index1][index] = cw1
    sum_by_column = np.sum(matrix, axis=1)
    result_dict = dict(zip(hi, sum_by_column))
    sorted_result = dict(sorted(result_dict.items(), key=lambda item: item[1], reverse=True))
    print(matrix)
    print("--------------------")
    print(sum_by_column)
    print("--------------------")
    print(sorted_result)
    print("--------------------")
    return sorted_result







        


