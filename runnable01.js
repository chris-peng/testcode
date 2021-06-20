var activeIndex = 4;
var normaAclIndex = 5;
var fakeAcIndex = 6;
var fackPercentIndex = 7;
var effActiveIndex = 8;
var effPercentIndex = 9;
var feeIndex = 10;
var priceIndex = 11;

var activeCountLimit = 100;

function runrun(){

    var table = docuemnt.querySelector('.ivu-table-body table');
    if(!table){
        alert('未检测到数据表格，请联系...');
        return;
    }

    var percent = prompt('输入扣除百分比:', '10');
    if(percent == null){
        return;
    }
    percent = parseFloat(percent) / 100;

    var rows = table.querySelectorAll('tr');
    for(var i = 0; i < rows.length; i++){
        var row = rows[i];
        var columns = row.querySelectorAll('td span');

        var active = parseFloat(columns[activeIndex].innerText);

        if(active < activeCountLimit){
            continue;
        }

        var normalAc = parseFloat(columns[normaAclIndex].innerText);
        var fakeAc = parseFloat(columns[fakeAcIndex].innerText);
        var fackPercent = parseFloat(columns[fackPercentIndex].innerText);
        var effActive = parseFloat(columns[effActiveIndex].innerText);
        var effPercent = parseFloat(columns[effPercentIndex].innerText);
        var fee = parseFloat(columns[feeIndex].innerText);
        var price = parseFloat(columns[priceIndex].innerText);

        var realPrice = fee / normalAc;
        active = Math.floor(active * percent);
        normalAc = active - fakeAc;
        fackPercent = Math.round((fakeAc / active) * 10000) / 100;
        if(normalAc == 0){
            effPercent = 0.00;
        } else {
            effPercent = Math.round((effActive / normalAc) * 10000) / 100;
        }
        fee = Math.round(realPrice * normalAc * 100) / 100;

        columns[activeIndex].innerText = active;
        columns[normaAclIndex].innerText = normalAc;
        columns[fackPercentIndex].innerText = fackPercent + '%';
        columns[effPercentIndex].innerText = effPercent + '%';
        columns[feeIndex].innerText = fee;
    }
}
