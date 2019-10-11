const utils = {
    proxyHelper (o,opts)
    {
       return new Proxy(o,utils.handler(opts))
    },
    handler:function (opts)
    {
        return {
            set: this.set,
            get: this.get,
            deleteProperty:this.deleteProperty
        }
    },
    set:function (t, prop, value)
    {
        utils.propsSetMap[prop] = value
        t[prop] = value
        return true
    },
    get: function (t,prop,receiver)
    {
       // return eventsMap.allFn(t[prop],arguments)
        return eventsMap[prop]?eventsMap[prop](t[prop],arguments):t[prop]
    },
    deleteProperty: function (t)
    {
        console.log(t)
    },
    propsSetMap:{},
}
const eventsMap = {
    request:function (fn,argus) {
        return function () {
            let argus = arguments[0];
                console.log('截获原生方法【request】'+'请求参数:',argus)
            let succ = argus.success;
            argus.success = function (res) {
                console.log('截获原生方法【request】'+'返回值:',res)
                succ.apply(null,arguments)
            }
            return fn.apply(this, arguments)
        }
    },
    $http:function (fn,argus) {
        return function () {
            let name = argus[1];
          //  console.log('截获自定义方法【'+name+'】'+'请求参数:',arguments[0])
            return fn.apply(this, arguments)
        }
    },
    allFn (fn,argus) {
        return function () {
            let name = argus[1];
            if (utils.propsSetMap[name]) {
             //   console.log('截获自定义方法【'+name+'】'+'请求参数:',arguments[0])
            } else {
              //  console.log('截获原生方法【'+name+'】'+'请求参数:',arguments[0])
            }
            let ret = fn.apply(this, arguments)
            return fn.apply(this, arguments)
        }
    }
}
function request (opts) {
    let opt = opts;
    wx = utils.proxyHelper(wx,{
        set:function () {

        },
        get:function () {

        }
    });
}
module.exports = request;
