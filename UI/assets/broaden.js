export function TaoBang(arr) {
    if (arr.length == 0) {
        $('#tb_matrix').empty();
        $('#tr_matrix').empty();
        return;
    }
    var tr_html = `<th></th>`;
    $('#tb_matrix').empty();
    for (let i = 0; i < arr.length; i++) {
        tr_html += `<th>${arr[i]}</th>`;

        var each_tr = `<td class="table-primary">${arr[i]}</td>`;
        for (let j = 0; j < arr.length; j++) {
            if (i == j) {
                each_tr += ` <td><input type="number" value=1 class="form-control text-center rounded-0 bg-warning" id="td_${i}_${j}" readonly></td>`
            } 
            else {
                each_tr += ` <td><input type="number" class="form-control text-center rounded-0 ${i > j ? 'bg-secondary' : ''}" id="td_${i}_${j}" ${i > j ? 'readonly' : ''}
"></td>`
            }
        }
        var full_tr = `<tr>${each_tr}</tr>`;
        $('#tb_matrix').append(full_tr);
    }
    $('#tr_matrix').html(tr_html);
}
