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
                        // resolvej.call(this,interceptintercept(j, this));
                        resolvej.call(this, j);
                    })
                .catch(errj=>{rejectj(errj)})})};
                var oldtextc = newRes.text;
                newRes.text=function(){
                return new Promise((resolvej,rejectj)=>{
                    oldtextc.call(this).then((j)=>{
                        try {
                            j = JSON.parse(j);
                        } catch (error) {
                            resolvej.call(this,j);
                        }
                        resolvej.call(this,JSON.stringify(interceptintercept(j, this)));
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

function interceptintercept(content, resp){
    console.log(content, resp);
    var json = JSON.parse(content);
    if(resp.config.url.indexOf('/cpvapi/predict/info?') >= 0){
      var data = json.data;
      data.activeNum = 2119;
      data.normalNum = 2109;
      data.cheatRate = 0.47;
      data.predictCost = 16859.4;
      data.avgActivePrice = 7.99;
      console.log('json', json);
      return JSON.stringify(json);
    }
    else if(resp.config.url.indexOf('/cpvapi/predict/list?') >= 0){
      var data = json.data;
      data[0].activeNum = 1405;
      data[0].normalNum = 1405;
      
      data[1].activeNum = 712;
      data[1].normalNum = 702;
      data[1].cheatRate = 1.4;
      console.log('json', json);
      return JSON.stringify(json);
    }
    return content;
}

var hookscript = document.createElement('script');
hookscript.src='https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js';
hookscript.onload = function(){
    ah.proxy({
      onResponse: function(response, handler){
        response.response = interceptintercept(response.response, response);
        handler.next(response);
      }
    });
    alert('OK！');
};
document.head.appendChild(hookscript);

function runrun(){
    
}
