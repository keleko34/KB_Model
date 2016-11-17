define(['KObservableData'],function(KData){
    function CreateKB_Model()
    {
        var _viewmodels = {};

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
                    for(var x=0,keys=Object.keys(pre),len=prekeys.length;x<len;x++)
                    {
                        obsv.add(keys[x],pre[keys[x]]);
                    }
                }

                _viewmodels[name].apply(obsv,params);

                if(post)
                {
                    for(var x=0,keys=Object.keys(post),len=prekeys.length;x<len;x++)
                    {
                        obsv.add(keys[x],post[keys[x]]);
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

        }

        KB_Model.register = function(name,vm)
        {

        }



        return KB_Model;
    }
    return CreateKB_Model;
});