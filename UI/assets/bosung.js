
function genRange(i, j) {
    let myArray = ['1/9', '1/8', '1/7', '1/6', '1/5', '1/4', '1/3', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var valueRange = $(`#range_${i}_${j}`).val();
    $(`#value_${i}_${j}`).html(myArray[valueRange]);
    $(`#td_${i}_${j}`).val(myArray[valueRange]);
    $(`#td_${j}_${i}`).val(nghichdao(myArray[valueRange]));
    if (validateMatrix(GomMatrix())) {
        console.log("call api");
        sendMatrix(GomMatrix());
    }
}
function nghichdao(text) {
    // Kiểm tra nếu input có dấu "/"
    if (text == '1') {
        return '1';
    }
    if (text.includes('/')) {
        let parts = text.split('/'); // Tách phần tử tử số và mẫu số
        let numerator = parts[0];   // Tử số
        let denominator = parts[1]; // Mẫu số

        // Kiểm tra nếu cả tử số và mẫu số đều là số và mẫu số khác 0
        if (!isNaN(numerator) && !isNaN(denominator) && denominator != 0) {
            // Nghịch đảo tử số và mẫu số
            return parseFloat(denominator / numerator); // Trả về nghịch đảo của phân số
        } else {
            return 'none';
        }
    } else if (!isNaN(text) && text != 0) {
        // Nếu không phải là phân số mà là một số nguyên, chuyển nó thành 1/x
        return `1/${text}`;
    } else {
        return 'none';
    }
}
function GomMatrix() {
    matrixLegth = $('#phap_su_trung_hoa').val();
    var matrix = new Array(matrixLegth);
    for (let i = 0; i < matrixLegth; i++) {
        matrix[i] = new Array(matrixLegth);
        for (let j = 0; j < matrixLegth; j++) {
            matrix[i][j] = $(`#td_${i}_${j}`).val();
        }
    }
    return matrix;
}
function validateMatrix(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            let value = matrix[i][j].trim();
            if (value === "") {
                return false;
            }
        }
    }
    return true;
}
function sendMatrix(matrix) {
    $.ajax({
        url: "http://127.0.0.1:8000/validate-matrix/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ matrix: matrix }),
        success: function (response) {
            console.log("Kết quả:", response);
            $('#value_cr').html('CR = ' + response);
        },
        error: function (err) {
            console.log("Lỗi:", err);
        }
    });
}



// $('.carousel-control-prev').on('click', function () {
//     setTimeout(() => {
//         let activeId = $('#ls_slides').find('.carousel-item.active').attr('id');
//         console.log('Slide hiện tại có ID:', activeId);
//     }, 600); // chờ hiệu ứng chạy xong
// });
// $('.carousel-control-next').on('click', function () {
//     setTimeout(() => {
//         let activeId = $('#ls_slides').find('.carousel-item.active').attr('id');
//         console.log('Slide hiện tại có ID:', activeId);
//     }, 600);
// });
