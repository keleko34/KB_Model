define(['./observableArray','./observableObject'],function(CreateObservableArray,CreateObservableObject){

    function CreateObservableViewmodel(name,method)
    {
        var _name = name,
            _method = method,
            _viewmodel = CreateObservableObject(name);
        
        function isArray(v)
        {
            return (typeof v === 'object' && !!v && v.constructor.toString() === Array.toString());
        }

        function isObject(v)
        {
            return (typeof v === 'object' && !!v && v.constructor.toString() !== Array.toString());
        }

        function isObservable(obj,prop)
        {
            var desc = Object.getOwnPropertyDescriptor(obj,prop);
            return (Object.keys(desc).indexOf('value') === -1);
        }

        function loopBind(objArr)
        {
            if(isObject(objArr))
            {

            }
            else if(isArray(objArr))
            {

            }
            else
            {
                return objArr;
            }
        }

        function viewmodel(params,pre,post)
        {
            _viewmodel.__proto__ = _method.prototype;
            _viewmodel.__kbref = _viewmodel;

            if(pre !== undefined && isObject(pre))
            {
                var exts = Object.keys(pre);
                for(var x=0,len=exts.length;x<len;x++)
                {
                    if(_viewmodel[exts[x]] !== undefined) _viewmodel.remove(exts[x]);
                    
                    _viewmodel.add(exts[x],loopBind(pre[exts[x]]));
                }
            }

            _viewmodel.apply(_viewmodel,params);



            return viewmodel;
        }

        viewmodel.createPointer = function()
        {

        }

        viewmodel.subscribe = function(scope,func)
        {

        }

        viewmodel.connect = function(connection)
        {

        }

        viewmodel.createConnection = function(scope)
        {

        }

        return viewmodel;
    }
    return CreateObservableViewmodel;
});