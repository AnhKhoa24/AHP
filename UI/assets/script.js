import { TaoBang } from './broaden.js';
import { TaoCauHoi } from './broaden.js';
import { genChoices } from './broaden.js';
import { TaoBangPhuongAn } from './broaden.js';


$(document).ready(function () {
    $('#multiSelect').select2({
        width: '100%',
        placeholder: "Chọn các tiêu chí",
        allowClear: true
    });
    $('#select_school').select2({
        placeholder: "Chọn trường",
        allowClear: true,
        ajax: {
            url: "http://localhost:8000/getUni",  // đường dẫn đến API
            dataType: 'json',
            contentType: "application/json",
            type: "POST",
            delay: 250,
            data: function (params) {
                return JSON.stringify({
                    keyword: params.term ?? '' // Gửi đúng JSON format
                });
            },
            processResults: function (data) {
                return {
                    results: data.map(function (item) {
                        return {
                            id: item.id,
                            text: item.name
                        };
                    })
                };
            },
            cache: true
        },
    });
    $('#select_major').select2({
        width: '100%',
        placeholder: "Chọn ngành",
        allowClear: true,
        ajax: {
            url: "http://localhost:8000/getMajor",
            dataType: 'json',
            contentType: "application/json",
            type: "POST",
            delay: 250,
            data: function (params) {
                return JSON.stringify({
                    matruong: $('#select_school').val(),
                    keyword: params.term ?? ''
                });
            },
            processResults: function (data) {
                return {
                    results: data.map(function (item) {
                        return {
                            id: item.id,
                            text: item.name
                        };
                    })
                };
            },
            cache: true
        },
    });

    // Khi chọn trường
    $('#select_school').on('select2:select', function (e) {
        $('#select_major').val(null).trigger('change');
    });

    // Khi xóa lựa chọn trường
    $('#select_school').on('select2:clear', function (e) {
        $('#select_major').val(null).trigger('change');
    });

    ///Bắt sự kiện thêm phương án
    $("#themphuonganbtn").on('click', function () {
        genChoices();
    });
});


$('#multiSelect').on('select2:select', function (e) {
    var selectedTexts = $('#multiSelect').select2('data').map(item => item.text);
    TaoBang(selectedTexts);
    TaoCauHoi(selectedTexts);
});


$('#multiSelect').on('select2:unselect ', function (e) {
    var selectedTexts = $('#multiSelect').select2('data').map(item => item.text);
    TaoBang(selectedTexts);
    TaoCauHoi(selectedTexts);
});

$("#tao_mt_phuongan").on('click', function () {
    TaoBangPhuongAn();
});

// $('#ls_slides').find('.carousel-item.active');


