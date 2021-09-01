var activeIndex = 5;
var normaAclIndex = 6;
var fakeAcIndex = 7;
var fackPercentIndex = 8;

var activeCountLimit = 10;

function runrun(){

    var table = document.querySelectorAll('.ant-table-tbody')[0];
    if(!table){
        alert('未检测到数据表格，请联系...');
        return;
    }

    var percent = prompt('输入扣除百分比:', '10');
    if(percent == null || percent == ''){
        return;
    }
    percent = parseFloat(percent) / 100;

    var rows = table.querySelectorAll('tr');
    for(var i = 0; i < rows.length; i++){
        var row = rows[i];
        var columns = row.querySelectorAll('td');

        var active = parseFloat(columns[activeIndex].innerText);

        if(active < activeCountLimit){
            continue;
        }

        var normalAc = parseFloat(columns[normaAclIndex].innerText);
        var fakeAc = parseFloat(columns[fakeAcIndex].innerText);
        var fackPercent = parseFloat(columns[fackPercentIndex].innerText);

        active = active - Math.floor(active * percent);
        normalAc = active - fakeAc;
        if(fakeAc != 0){
          fackPercent = Math.round((fakeAc / active) * 10000) / 100;
        }
        
        if(active <= fakeAc){
            continue;
        }

        columns[activeIndex].innerText = active;
        columns[normaAclIndex].innerText = normalAc;
        if(fakeAc != 0){
            columns[fackPercentIndex].innerText = fackPercent.toFixed(2) + '%';
        }
    }
}
