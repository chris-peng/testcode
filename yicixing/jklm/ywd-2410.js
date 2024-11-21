var detailData = [
  {"channelPackageName": "lechuang_android_lechuang15","month": "2024-10","newUserNum": 26467,"cheatUserNum": 6826,"payUserNum": 19641,"price": 9.76,"amount": 191693},
  {"channelPackageName": "lechuang_android_lechuang12","month": "2024-10","newUserNum": 6471,"cheatUserNum": 2453,"payUserNum": 4018,"price": 14.37,"amount": 57745},
  {"channelPackageName": "lechuang_android_lechuang08","month": "2024-10","newUserNum": 17150,"cheatUserNum": 6451,"payUserNum": 10699,"price": 8.79,"amount": 94045},
  {"channelPackageName": "lechuang_android_lechuang07","month": "2024-10","newUserNum": 495,"cheatUserNum": 117,"payUserNum": 378,"price": 13.34,"amount": 5043},
  {"channelPackageName": "lechuang_android_lechuang06","month": "2024-10","newUserNum": 465,"cheatUserNum": 105,"payUserNum": 360,"price": 9.82,"amount": 3535},
  {"channelPackageName": "lechuang_android_lechuang05","month": "2024-10","newUserNum": 783,"cheatUserNum": 206,"payUserNum": 577,"price": 8.23,"amount": 4749},
  {"channelPackageName": "lechuang_android_lechuang03","month": "2024-10","newUserNum": 536,"cheatUserNum": 115,"payUserNum": 421,"price": 9.67,"amount": 4071},
  {"channelPackageName": "lechuang_android_lechuang02","month": "2024-10","newUserNum": 601,"cheatUserNum": 131,"payUserNum": 470,"price": 8.38,"amount": 3938},
  {"channelPackageName": "jr7983","month": "2024-10","newUserNum": 223,"cheatUserNum": 49,"payUserNum": 174,"price": 9.83,"amount": 1710},
];

var detailDataMap = {};
for(index in detailData){
  detailDataMap[detailData[index].channelPackageName + '_' + detailData[index].month] = detailData[index];
}

function interceptintercept(content, resp){
    console.log(content, resp);
    if(resp.url.indexOf('/cpaorder/queryCpaOrderMonthForAgent') >= 0){
      var json = JSON.parse(content);
      var data = json.resultData.data.rows;
      for(var i = 0; i < data.length; i++){
        var row = data[i];
        var newData = detailDataMap[row.channelPackageName + '_' + row.month];
        if(newData){
          for(field in newData){
            row[field] = newData[field];
          }
        }
      }
      console.log('json', json);
      return JSON.stringify(json);
    }
    return content;
}

var oldfetch = fetch;
fetch = function (url, options={}) {
  return new Promise((resolve, reject) => {
    oldfetch(url, options)
        .then((res)=>{
            var oldjson = res.json;
            res.json=function(){
                return new Promise((resolvej,rejectj)=>{
                    oldjson.call(this).then((j)=>{
                        // resolvej.call(this,interceptintercept(j, this));
                        resolvej.call(this, j);
                    })
                .catch(errj=>{rejectj(errj)})})};
            var oldclone = res.clone;
            res.clone=function(){
                var newRes = oldclone.call(this);
                newRes.clone = this.clone;
                var oldjsonc = newRes.json;
                newRes.json=function(){
                return new Promise((resolvej,rejectj)=>{
                    oldjsonc.call(this).then((j)=>{
                        resolvej.call(this,JSON.parse(interceptintercept(JSON.stringify(j), this)));
                        // resolvej.call(this, j);
                    })
                .catch(errj=>{rejectj(errj)})})};
                var oldtextc = newRes.text;
                newRes.text=function(){
                return new Promise((resolvej,rejectj)=>{
                    oldtextc.call(this).then((j)=>{
                        resolvej.call(this,interceptintercept(j, this));
                    })
                .catch(errj=>{rejectj(errj)})})};
                return newRes;
            };
            resolve(res);
        })
        .catch(err => {
            reject(err)
        });

  });
}

var hookscript = document.createElement('script');
hookscript.src='https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js';
hookscript.onload = function(){
    ah.proxy({
      onResponse: function(response, handler){
        response.url = response.config.url;
        response.response = interceptintercept(response.response, response);
        handler.next(response);
      }
    });
    alert('OK！');
};
document.head.appendChild(hookscript);

function runrun(){
    
}
