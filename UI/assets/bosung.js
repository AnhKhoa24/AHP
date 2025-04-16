
function genRange(i, j) {
    let myArray = ['1/9', '1/8', '1/7', '1/6', '1/5', '1/4', '1/3', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var valueRange = $(`#range_${i}_${j}`).val();
    $(`#value_${i}_${j}`).html(myArray[valueRange]);
    $(`#td_${i}_${j}`).val(myArray[valueRange]);
    $(`#td_${j}_${i}`).val(invertFraction(myArray[valueRange]));
    if (validateMatrix(GomMatrix())) {
        console.log("call api");
        sendMatrix(GomMatrix());
    }
}
// function nghichdao(text) {
//     // Kiểm tra nếu input có dấu "/"
//     if (text == '1') {
//         return '1';
//     }
//     if (text.includes('/')) {
//         let parts = text.split('/'); // Tách phần tử tử số và mẫu số
//         let numerator = parts[0];   // Tử số
//         let denominator = parts[1]; // Mẫu số

//         // Kiểm tra nếu cả tử số và mẫu số đều là số và mẫu số khác 0
//         if (!isNaN(numerator) && !isNaN(denominator) && denominator != 0) {
//             // Nghịch đảo tử số và mẫu số
//             return parseFloat(denominator / numerator); // Trả về nghịch đảo của phân số
//         } else {
//             return 'none';
//         }
//     } else if (!isNaN(text) && text != 0) {
//         // Nếu không phải là phân số mà là một số nguyên, chuyển nó thành 1/x
//         return `1/${text}`;
//     } else {
//         return 'none';
//     }
// }
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
        url: "http://127.0.0.1:8000/validate-matrix",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ matrix: matrix }),
        success: function (response) {
            // console.log("Kết quả:", response);
            if(response.cr > 0 && response.cr < 0.1)
            {
                $('#value_cr').closest('div').removeClass('bg-danger').addClass('bg-success');
                $('.c_choose').removeClass('d-none');
            }else
            {
                $('#value_cr').closest('div').removeClass('bg-success').addClass('bg-danger');
                $('.c_choose').addClass('d-none');
            }
            $('#value_cr').html('CR = ' + response.cr);
            genDanhGia(response.criteria_weights);
        },
        error: function (err) {
            console.log("Lỗi:", err);
        }
    });
}
function genDanhGia(arr_cw) {
    var tieuchis = $('#multiSelect').select2('data').map(({ id, text }) => ({ id, text }));
    var genlist = mergeObjectsAndSort(tieuchis, arr_cw);
    DoiDG(genlist);
}
function DoiDG(arr) {
    $('#tb_rank').empty();
    arr.forEach(function (item, index)
    {
        var html = `<tr><td style="padding: 7.2px;">${item.text}</td>
                        <td style="padding: 7.2px;" data-cw_${item.id} = "${item.cw}">${item.cw.toFixed(4)}</td>
                        <td style="padding: 7.2px;">${index+1}</td>
                        </tr>`;
        $('#tb_rank').append(html);
    });
}
function mergeObjectsAndSort(keys, values) {
    const merged = keys.map((item, index) => ({
        ...item,
        cw: values[index]
    }));
    merged.sort((a, b) => b.cw - a.cw);
    return merged;
}


function BoLuaChon(button) {
    // Xóa dòng tr chứa nút được click
    $(button).closest('tr').remove();
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

function nhapmatran(id, i, j) {
    var value = $(`#${id}_${i}_${j}`).val();
    $(`#${id}_${j}_${i}`).val(invertFraction(value));
    let danhSach = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    let matrix = GetMatrix(danhSach.length, id);
    if (validateMatrix(matrix)) {
        console.log(matrix);
        sendEach(matrix, `cr_${id}`);
    }
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function invertFraction(input) {
    if (input === "0" || input === 0) return "0";
    let numerator, denominator;
    if (input.toString().includes("/")) {
        [numerator, denominator] = input.toString().split("/").map(Number);
    } else {
        numerator = Number(input);
        denominator = 1;
    }
    let newNumerator = denominator;
    let newDenominator = numerator;
    if (newDenominator === 0) return "0";
    let ucln = gcd(Math.abs(newNumerator), Math.abs(newDenominator));
    newNumerator /= ucln;
    newDenominator /= ucln;
    if (newDenominator === 1) return `${newNumerator}`;
    else return `${newNumerator}/${newDenominator}`;
}

function GetMatrix(matrixLegth, nametd) {
    var matrix = new Array(matrixLegth);
    for (let i = 0; i < matrixLegth; i++) {
        matrix[i] = new Array(matrixLegth);
        for (let j = 0; j < matrixLegth; j++) {
            matrix[i][j] = $(`#${nametd}_${i}_${j}`).val();
        }
    }
    return matrix;
}

function sendEach(matrix, id_name) {
    $.ajax({
        url: "http://127.0.0.1:8000/validate-matrix",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ matrix: matrix }),
        success: function (response) {
            if(response.cr > 0 && response.cr < 0.1){
                $(`#${id_name}`).html(`${response.cr}`);
                $(`#${id_name}`).closest("tr").find("td").removeClass('bg-warning');
                $(`#${id_name}`).closest("tr").find("td").toggleClass('bg-success');
            }else{
                $(`#${id_name}`).html(`${response.cr}`);
                $(`#${id_name}`).closest("tr").find("td").removeClass('bg-success');
                $(`#${id_name}`).closest("tr").find("td").toggleClass('bg-warning');
            }
        },
        error: function (err) {
            console.log("Lỗi:", err);
        }
    });
}