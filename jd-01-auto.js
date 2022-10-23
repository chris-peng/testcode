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
                        resolvej.call(this,interceptintercept(j, this));
                        // resolvej.call(this, j);
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

function interceptintercept(json, resp){
    console.log(json, resp);
    if(resp.url.indexOf('/cpvapi/predict/info?') >= 0){
      var data = json.data;
      data.activeNum = 7342;
      data.normalNum = 6759;
      data.cheatRate = 7.94;
      data.predictCost = 54072;
      data.avgActivePrice = 8;
      console.log('json', json);
    }
    else if(resp.url.indexOf('/cpvapi/predict/list?') >= 0){
      var data = json.data.result;
      data[0].activeNum = 602;
      data[0].normalNum = 602;
      
      data[1].activeNum = 1731;
      data[1].normalNum = 1676;
      data[1].cheatNum = 55;
      data[1].cheatRate = 3.18;
      
      data[2].activeNum = 1525;
      data[2].normalNum = 1269;
      data[2].cheatNum = 256;
      data[2].cheatRate = 16.79;
      
      data[3].activeNum = 1367;
      data[3].normalNum = 1134;
      data[3].cheatNum = 233;
      data[3].cheatRate = 17.04;
      
      data[4].activeNum = 1405;
      data[4].normalNum = 1376;
      data[4].cheatNum = 29;
      data[4].cheatRate = 2.06;
      
      data[5].activeNum = 712;
      data[5].normalNum = 702;
      data[5].cheatNum = 10;
      data[5].cheatRate = 1.4;
      console.log('json', json);
    }
    return json;
}

function runrun(){
    alert('Ok!');
}
