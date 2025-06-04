const url = "http://localhost:8000/";
var _import = 0;
function genRange(i, j) {
    let myArray = ['1/9', '1/8', '1/7', '1/6', '1/5', '1/4', '1/3', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var valueRange = $(`#range_${i}_${j}`).val();
    $(`#value_${i}_${j}`).html(myArray[valueRange]);
    $(`#td_${i}_${j}`).val(myArray[valueRange]);
    $(`#td_${j}_${i}`).val(invertFraction(myArray[valueRange]));
    if (validateMatrix(GomMatrix())) {
        console.log("call api");
        var tieuchis = $('#multiSelect').select2('data').map(({ id, text }) => ({ id, text }));
        sendMatrix(GomMatrix(), tieuchis);
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

// Gửi ma trận tiêu chí
function sendMatrix(matrix, tieuchis) {
    $.ajax({
        url: url + "validate-matrix",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ cap: getTieuChi(), matrix: matrix, id: $("#session").val(), type: 'tc' }),
        success: function (response) {

            if (response.cr > 0 && response.cr < 0.1) {
                $('#value_cr').closest('div').removeClass('bg-danger').addClass('bg-success');
                $('#c_choose').addClass('visible');
                capNhatTienTrinh(20);
                document.getElementById('c_choose').scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (_import == 1) {
                    capNhatTienTrinh(80);
                    $('#section_pas').removeClass('d-none');
                    document.getElementById('section_pas').scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                $('#value_cr').closest('div').removeClass('bg-success').addClass('bg-danger');
                $('#c_choose').removeClass('visible');
                capNhatTienTrinh(0);
            }
            $('#value_cr').html('CR = ' + response.cr);
            $('#lamda').html('&lambda;<sub>max</sub> = ' + response.lamda);
            $('#value_ci').html('CI = ' + response.CI);

            genDanhGia(response.criteria_weights, response.consistency_vector, response.sumweight, tieuchis);
            $("#session").val(response._id);
        },
        error: function (err) {
            console.log("Lỗi:", err);
        }
    });
}

function genDanhGia(arr_cw, arr_cv, arr_sw, tieuchis) {
    const merged = arr_cw.map((_, i) => ({
        id: tieuchis[i].id,
        text: tieuchis[i].text,
        cw: arr_cw[i],
        cv: arr_cv[i],
        sw: arr_sw[i]
    }));
    var sorted = merged.sort((a, b) => b.cw - a.cw);
    console.log(sorted);
    console.log("gen danh gia-----")

    // var genlist = mergeObjectsAndSort(tieuchis, arr_cw);
    DoiDG(sorted);
    genPieChartv2(sorted);
    genBarChart(sorted);
}
function DoiDG(arr) {
    $('#tb_rank').empty();
    arr.forEach(function (item, index) {
        var html = `<tr><td style="padding: 7.2px;">${item.text}</td>
                        <td style="padding: 7.2px;" data-cw= "${item.cw}" id="cw_${item.id}">${item.cw.toFixed(4)}</td>
                        <td style="padding: 7.2px;" data-cv= "${item.cv}" id="cv_${item.id}">${item.cw.toFixed(4)}</td>
                        <td style="padding: 7.2px;" data-sw= "${item.sw}" id="sw_${item.id}">${item.cw.toFixed(4)}</td>
                        <td style="padding: 7.2px;">${index + 1}</td>
                        </tr>`;
        $('#tb_rank').append(html);
    });
}

let barChartInstance = null;

function genBarChart(arr) {
    const labels = arr.map(item => item.text);

    const cvValues = arr.map(item => Number(item.cv.toFixed(3)));
    const swValues = arr.map(item => Number(item.sw.toFixed(3)));

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'cv',
                data: cvValues,
                backgroundColor: '#36A2EB',
                borderColor: '#2680C0',
                borderWidth: 1
            },
            {
                label: 'sw',
                data: swValues,
                backgroundColor: '#FF6384',
                borderColor: '#C02E54',
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    color: '#FFFFFF'
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {

                    callback: function (value) {
                        return value.toFixed(2);
                    },
                    color: '#FFFFFF'
                },
                grid: {
                    color: 'rgba(255,255,255,0.2)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#FFFFFF'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {

                        let label = context.dataset.label || '';
                        let value = context.raw || 0;
                        return `${label}: ${value.toFixed(2)}`;
                    }
                }
            },
            datalabels: {

                anchor: 'end',
                align: 'end',
                color: '#FFFFFF',
                font: {
                    weight: 'bold',
                    size: 12
                },
                formatter: (value) => {
                    return value.toFixed(2);
                }
            }
        }
    };

    const ctx = document.getElementById('myBarChart').getContext('2d');
    if (barChartInstance) {

        barChartInstance.data = data;
        barChartInstance.options = options;
        barChartInstance.update();
    } else {

        barChartInstance = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options,
            plugins: [ChartDataLabels]
        });
    }
}


let pieChartInstancev1 = null;

function genPieChartv2(arr) {
    const COLOR_PALETTE = [
        '#FF6384', // đỏ hồng
        '#36A2EB', // xanh dương
        '#FFCE56', // vàng
        '#4BC0C0', // xanh ngọc
        '#9966FF', // tím
        '#FF9F40', // cam
        '#E7E9ED', // xám nhạt
        '#8AFF33', // xanh lá chanh
        '#FF33E3', // hồng neon
        '#33FFF2'  // xanh ngọc sáng
    ];

    const labels = arr.map(item => item.text);
    const values = arr.map(item => Number(item.cw.toFixed(2)));
    const colors = COLOR_PALETTE.slice(0, arr.length);

    const data = {
        labels: labels,
        datasets: [{
            data: values,
            backgroundColor: colors,
            borderWidth: 2
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#FFFFFF'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value.toFixed(2)} %`;
                    }
                }
            },
            datalabels: {
                color: '#000',
                font: {
                    weight: 'bold',
                    size: 14
                },
                formatter: (value, ctx) => {
                    return ctx.chart.data.labels[ctx.dataIndex];
                }
            }
        }
    };

    const ctx = document.getElementById('myPieChartv1').getContext('2d');

    if (pieChartInstancev1) {
        pieChartInstancev1.data = data;
        pieChartInstancev1.options = options;
        pieChartInstancev1.update();
    } else {
        // Chưa có thì khởi tạo lần đầu
        pieChartInstancev1 = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: options,
            plugins: [ChartDataLabels]
        });
    }
}

function NhapOTrucTiep(i, j) {
    let myArray = ['1/9', '1/8', '1/7', '1/6', '1/5', '1/4', '1/3', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let idx = myArray.indexOf($(`#td_${i}_${j}`).val());
    if (idx != -1) {
        $(`#range_${i}_${j}`).val(idx);
        $(`#value_${i}_${j}`).text($(`#td_${i}_${j}`).val());
        GotoSlide(`slide_${i}_${j}`);
        $(`#td_${i}_${j}`).removeClass("bg-warning bg-info bg-danger");
        nhapmatranv1("td", i, j);
    } else {
        $(`#td_${i}_${j}`).addClass("bg-danger")
    }
    console.log(idx)
}

function nhapmatranv1(id, i, j) {
    var value = $(`#${id}_${i}_${j}`).val();
    $(`#${id}_${j}_${i}`).val(invertFraction(value));
    $(`#${id}_${j}_${i}`).removeClass("bg-warning bg-info bg-danger").addClass("bg-info");
    if (validateMatrix(GomMatrix())) {
        console.log("call api");
        var tieuchis = $('#multiSelect').select2('data').map(({ id, text }) => ({ id, text }));
        sendMatrix(GomMatrix(), tieuchis);
    }
}

function GotoSlide(id) {
    let $target = $(`#${id}`);
    let slideIndex = $target.index();
    $("#ls_slides").carousel(slideIndex);
}

function BoLuaChon(button) {
    // Xóa dòng tr chứa nút được click
    $(button).closest('tr').remove();
}

function nhapmatran(id, i, j) {
    var value = $(`#${id}_${i}_${j}`).val();
    $(`#${id}_${j}_${i}`).val(invertFraction(value));
    let danhSach = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    let matrix = GetMatrix(danhSach.length, id);
    if (validateMatrix(matrix)) {
        console.log(matrix);
        sendEach(matrix, `${id}`);
    }
}
function trickger() {
    let arr = $('#multiSelect').val()
    arr.forEach(function (value) {
        trickgernhap(value)
    })
}

function trickgernhap(id) {
    let danhSach = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    let matrix = GetMatrix(danhSach.length, id);
    if (validateMatrix(matrix)) {
        console.log(matrix);
        sendEach(matrix, `${id}`);
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

// Gửi ma trận các phương án
function sendEach(matrix, id_name) {
    $.ajax({
        url: url + "validate-matrix",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ cap: getBangPhuongAn(), matrix: matrix, id: $("#session").val(), type: id_name }),
        success: function (response) {
            if (response.cr > 0 && response.cr < 0.1) {
                $(`#cr_${id_name}`).html(`${response.cr}`);
                $(`#cr_${id_name}`).closest("tr").find("td").removeClass('bg-danger').addClass('bg-success');
            } else {
                $(`#cr_${id_name}`).html(`${response.cr}`);
                $(`#cr_${id_name}`).closest("tr").find("td").removeClass('bg-success').addClass('bg-danger');
            }
            SaveBangAo(id_name, response.criteria_weights);
        },
        error: function (err) {
            console.log("Lỗi:", err);
        }
    });
}

function SaveBangAo(id_name, arr) {
    console.log(arr);
    arr.forEach(function (item, index) {
        $(`#cw_${id_name}_${index}`).html(item);
        console.log(`#cw_${id_name}_${index}`);
    });
    if (checkCRPA()) {
        RankingFinal()
    } else {
        $("#final_result").addClass("d-none")
    }
}

function TakeCWTC() {
    var listTC = $('#multiSelect').val();
    var listCWTC = [];
    listTC.forEach(function (item, index) {
        listCWTC.push({
            id: item,
            cw: $(`#cw_${item}`).data('cw')
        });
    });
    return listCWTC;
}

function TakeCWPA() {
    let danhSach = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    var listTC = $('#multiSelect').val();
    var listCWPA = [];
    listTC.forEach(function (item, index) {
        let tempArr = [];
        danhSach.forEach(function (item2, index2) {
            tempArr.push({
                id: item2,
                cw: $(`#cw_${item}_${index2}`).html()
            });
        });
        listCWPA.push({
            id: item,
            cw: tempArr
        });
    });
    return listCWPA;
}

function RankingFinal() {
    let dataGui = {
        cw_tc: TakeCWTC(),
        cw_pa: TakeCWPA()
    };

    $.ajax({
        url: url + "ranking_final",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(dataGui),
        success: function (response) {
            hi = final(response, GetTablePA())
            $("#final_result").removeClass("d-none")
            genBangKQ(hi);
            document.getElementById('final_result').scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
        error: function (xhr, status, error) {
            console.error("Lỗi:", error);
        }
    });
}

function GetTablePA() {
    let kihieus = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    let truongs = $('.truong').map((i, el) => $(el).text().trim()).get();
    let nganhs = $('.nganh').map((i, el) => $(el).text().trim()).get();
    let resultObj = kihieus.map((_, i) => ({
        kihieu: kihieus[i],
        truong: truongs[i],
        nganh: nganhs[i]
    }));
    return resultObj;
}

function final(response_API, get_Tb_PA) {
    const result = Object.keys(response_API).map(kihieu => {
        const item = get_Tb_PA.find(d => d.kihieu === kihieu);
        return {
            ...item,
            cw: response_API[kihieu]
        };
    });
    return result
}


function genBangKQ(arr) {
    console.log(arr);
    $("#final_rs").empty();
    arr.forEach(function (item, index) {
        let bgColor = index === 0 ? 'style="background-color: #2fb344; padding: 7.2px;"' : 'style="padding: 7.2px;"';
        var html = `<tr> 
                        <td ${bgColor}>${item.truong}</td>
                        <td ${bgColor}>${item.nganh}</td>
                        <td ${bgColor}>${item.kihieu}</td>
                        <td ${bgColor}>${item.cw.toFixed(4)}</td>
                        <td ${bgColor}>${index + 1}</td>
                    </tr>`;
        $("#final_rs").append(html);
    });
    genPieChart(arr)
    capNhatTienTrinh(100);
}


function checkCRPA() {
    var arr = $('.cr_phuongan').map((i, el) => $(el).text().trim()).get();
    if (arr.length < 1) {
        return false
    }
    const isValid = arr.every(item => {
        const num = parseFloat(item);
        return !isNaN(num) && num > 0 && num < 0.1 && item.trim() !== '';
    });
    return isValid
}

function capNhatTienTrinh(phanTram) {
    phanTram = Math.max(0, Math.min(phanTram, 100));

    const $bar = $('#tientrinh');

    $bar.animate({ width: phanTram + '%' }, 300, function () {
        if (phanTram === 100) {
            $bar.removeClass('bg-primary').addClass('bg-success');
        } else {
            $bar.removeClass('bg-success').addClass('bg-primary');
        }
    });
}


////các hàm get data save

function getTieuChi() {
    return $('#multiSelect').select2('data').map(({ id, text }) => ({ id, text }));
}
function getMaTranTieuChi() {
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
function getTableRankingTC() {
    var listTC = $('#multiSelect').select2('data').map(({ id, text }) => ({ id, text }));
    var listCWTC = [];
    listTC.forEach(function (item, index) {
        listCWTC.push({
            id: item.id,
            name: item.text,
            cw: $(`#cw_${item.id}`).data('cw')
        });
    });
    return listCWTC.sort((a, b) => b.cw - a.cw);
}
function getBangPhuongAn() {
    let kihieus = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    let truongs = $('.truong').map((i, el) => $(el).text().trim()).get();
    let nganhs = $('.nganh').map((i, el) => $(el).text().trim()).get();
    let resultObj = kihieus.map((_, i) => ({
        kihieu: kihieus[i],
        truong: truongs[i],
        nganh: nganhs[i]
    }));
    return resultObj;
}
function getListMatranPhuongAn() {
    let kihieus = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    var ListMT = [];
    $('#multiSelect').val().forEach(function (item, index) {
        var matrix = new Array(matrixLegth);
        for (let i = 0; i < kihieus.length; i++) {
            matrix[i] = new Array(matrixLegth);
            for (let j = 0; j < kihieus.length; j++) {
                matrix[i][j] = $(`#${item}_${i}_${j}`).val();
            }
        }
        ListMT.push({
            name: item,
            matrix: matrix
        });
    });
    return ListMT;
}
// Hàm tạo bảng biểu đồ tròn
let pieChartInstance = null; // giữ biểu đồ hiện tại

function genPieChart(arr) {
    const COLOR_PALETTE = [
        '#FF6384', // đỏ hồng
        '#36A2EB', // xanh dương
        '#FFCE56', // vàng
        '#4BC0C0', // xanh ngọc
        '#9966FF', // tím
        '#FF9F40', // cam
        '#E7E9ED', // xám nhạt
        '#8AFF33', // xanh lá chanh
        '#FF33E3', // hồng neon
        '#33FFF2'  // xanh ngọc sáng
    ];
    const labels = arr.map(item => item.kihieu);
    const values = arr.map(item => Number(item.cw.toFixed(4)));
    const colors = COLOR_PALETTE.slice(0, arr.length);
    const data = {
        labels: labels,
        datasets: [{
            data: values,
            backgroundColor: colors,
            borderWidth: 2
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#FFFFFF'
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value.toFixed(2)} %`;
                    }
                }
            },
            datalabels: {
                color: '#000',
                font: {
                    weight: 'bold',
                    size: 14
                },
                formatter: (value, ctx) => {
                    return ctx.chart.data.labels[ctx.dataIndex];
                }
            }
        }
    };

    const ctx = document.getElementById('myPieChart').getContext('2d');

    // Nếu đã tồn tại biểu đồ → update
    if (pieChartInstance) {
        pieChartInstance.data = data;
        pieChartInstance.options = options;
        pieChartInstance.update();
    } else {
        // Chưa có thì khởi tạo lần đầu
        pieChartInstance = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: options,
            plugins: [ChartDataLabels]
        });
    }
}

function submitNewCriterion() {
    var tc = $("#newCriterion").val();
    $("#multiSelect").append(new Option(tc, tc));
    // Đóng modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("staticBackdrop"));
    modal.hide();

    // Reset form
    document.getElementById("addCriterionForm").reset();
}

function genCacMaTranPhuongAn(arr) {
    var tcs = $("#multiSelect").val();
    let kihieus = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    for (let i = 0; i < tcs.length; i++) {
        for (let a = 0; a < kihieus.length; a++) {
            for (let b = 0; b < kihieus.length; b++) {
                $(`#${tcs[i]}_${a}_${b}`).val(arr[i].matran[a][b]);
            }
        }
    }
}

function getCacMaTranPhuongAn() {
    var tcs = $("#multiSelect").val();
    let kihieus = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    var ketqua = []
    for (let i = 0; i < tcs.length; i++) {
        let matran = []
        for (let a = 0; a < kihieus.length; a++) {
            let row = []
            for (let b = 0; b < kihieus.length; b++) {
                row.push($(`#${tcs[i]}_${a}_${b}`).val());
            }
            matran.push(row)
        }
        ketqua.push(matran)
    }
    return ketqua
}

function getLablemuti() {
    let kihieus = $('.kihieu').map((i, el) => $(el).text().trim()).get();
    let truongs = $('.truong').map((i, el) => $(el).text().trim()).get();
    let nganhs = $('.nganh').map((i, el) => $(el).text().trim()).get();
    let arr = []
    for (let i = 0; i < kihieus.length; i++) {
        arr.push({ ten: truongs[i], kihieu: kihieus[i], nganh: nganhs[i] })
    }
    return arr
}

function getFullExcel() {
    return {
        tieuchis: $('#multiSelect').select2('data').map(item => item.text),
        matrantieuchi: GomMatrix(),
        phuongans: getLablemuti(),
        matranphuongan: getCacMaTranPhuongAn()
    }
}

function FixDuongCheoChinh(el) {
    const currentValue = el.value;

    const $el = $(el);
    if (currentValue == 1) {
        if ($el.hasClass("bg-danger")) {
            $el
                .removeClass("bg-danger")
                .addClass("bg-warning");
        }
        if (!$el.is("[readonly]")) {
            $el.attr("readonly", true);
        }
    }
}
