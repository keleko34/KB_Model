define(['KObservableData'],function(KData){
    function CreateKB_Model()
    {
        var _model = {},
            _viewmodels = {},
            _ignoreList = ['id','filters','class','sessionStorage','localStorage','store','component'];

        function loopSet()
        {

        }

        function KB_Model()
        {

        }

        KB_Model.createViewModel = function(name,params,pre,post)
        {
            if(KB_Model.isRegistered(name))
            {
                var obsv = KData(name);
                obsv.__proto__ = _viewmodels[name].prototype;

                if(pre)
                {
                    for(var x=0,keys=Object.keys(pre),len=keys.length;x<len;x++)
                    {
                        if(obvs.isObservable(post,keys[x]))
                        {
                            obsv.addPointer(post,keys[x]);
                        }
                        else
                        {
                            obsv.add(keys[x],post[keys[x]]);
                        }
                    }
                }



                _viewmodels[name].apply(obsv,params);
                for(var x=0,keys=Object.keys(obsv),len=keys.length;x<len;x++)
                {
                    if(!obsv.isObservable(obsv,keys[x]))
                    {
                        if(obsv.isObject(obsv[keys[x]]) || obsv.isArray(obsv[keys[x]]))
                        {
                            obsv.set(keys[x],obsv[keys[x]])
                            .parseData(obsv[keys[x]],obsv[keys[x]]);
                        }
                        else
                        {
                            obsv.set(keys[x],obsv[keys[x]]);
                        }
                    }
                }

                if(post)
                {
                    for(var x=0,keys=Object.keys(post),len=keys.length;x<len;x++)
                    {
                        if(obvs.isObservable(post,keys[x]))
                        {
                            if(obsv[keys[x]] !== undefined) obsv.remove(keys[x]);
                            obsv.addPointer(post,keys[x]);
                        }
                        else
                        {
                            if(obsv.isObject(post[keys[x]]) || obsv.isArray(post[keys[x]]))
                            {
                                obsv.set(keys[x],post[keys[x]])
                                .parseData(post[keys[x]],obsv[keys[x]]);
                            }
                            else
                            {
                                obsv.set(keys[x],post[keys[x]]);
                            }
                        }
                    }
                }

                if(obsv.sessionStorage)
                {
                    var storage = sessionStorage.getItem((obsv.id || name));
                    if(storage)
                    {
                        storage = JSON.parse(storage);
                        for(var x=0,keys=Object.keys(storage),len=keys.length;x<len;x++)
                        {
                            if(obsv.isObject(storage[keys[x]]) || obsv.isArray(storage[keys[x]]))
                            {
                                obsv.set(keys[x],storage[keys[x]])
                                .parseData(storage[keys[x]],obsv[keys[x]]);
                            }
                            else
                            {
                                obsv.set(keys[x],storage[keys[x]]);
                            }
                        }
                    }
                    else
                    {
                        sessionStorage.setItem((obsv.id || name),obsv.stringify());
                    }
                    obsv.addChildDataUpdateListener('*',function(){
                        sessionStorage.setItem((obsv.id || name),obsv.stringify());
                    });
                }

                if(obsv.localStorage)
                {
                    var storage = localStorage.getItem((obsv.id || name));
                    if(storage)
                    {
                        storage = JSON.parse(storage);
                        for(var x=0,keys=Object.keys(storage),len=keys.length;x<len;x++)
                        {
                            if(obsv.isObject(storage[keys[x]]) || obsv.isArray(storage[keys[x]]))
                            {
                                obsv.set(keys[x],storage[keys[x]])
                                .parseData(storage[keys[x]],obsv[keys[x]]);
                            }
                            else
                            {
                                obsv.set(keys[x],storage[keys[x]]);
                            }
                        }
                    }
                    else
                    {
                        localStorage.setItem((obsv.id || name),obsv.stringify());
                    }
                    obsv.addChildDataUpdateListener('*',function(){
                        localStorage.setItem((obsv.id || name),obsv.stringify());
                    });
                }

                if(obvs.store)
                {
                    var _submodel = _model[(obsv.id || name)];
                    if(_submodel)
                    {
                        for(var x=0,keys=Object.keys(_submodel),len=keys.length;x<len;x++)
                        {
                            if(obsv[keys[x]] !== undefined) obsv.remove(keys[x]);
                            obsv.addPointer(_submodel,keys[x]);
                        }
                    }
                    else
                    {
                        _submodel[(obsv.id || name)] = KData((obsv.id || name));
                        for(var x=0,keys=Object.keys(obsv).filter(function(i){return (_ignoreList.indexOf(i) === -1);}),len=keys.length;x<len;x++)
                        {
                            if(obsv.isObject(obsv[keys[x]]) || obsv.isArray(obsv[keys[x]]))
                            {
                                obsv.set(keys[x],obsv[keys[x]])
                                .parseData(obsv[keys[x]],obsv[keys[x]]);
                            }
                            else
                            {
                                obsv.set(keys[x],obsv[keys[x]]);
                            }
                            obsv.remove(keys[x]).addPointer(_submodel,keys[x]);
                        }
                    }
                }
                return obsv;
            }
            else
            {
                console.error("There is no viewmodel by the name %o",name);
            }
            return null;
        }

        KB_Model.isRegistered = function(name)
        {
            return (_viewmodels[name] !== undefined);
        }

        KB_Model.register = function(name,vm)
        {
            _viewmodels[name] = vm;
        }



        return KB_Model;
    }
    return CreateKB_Model;
});
