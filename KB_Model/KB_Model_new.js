define([],function(){

    /* Model holds key viewmodels that are refrenced for the purpose of holding a single location for important data */
    var _model = {},

    /* The library is a list of createable viewmodels */
        _library = {},
    
    /* viewmodels is a list of all created viewmodels, based on named arrays */
        _viewmodels = {},

    /* globalized listeners */
        _dataListeners = {},
        _dataUpdateListeners = {},
        _dataCreateListeners = {},
        _dataRemoveListeners = {},

    /* The all properties listener character */
        _all = '*',

    /* The default methods ran on key actions */
        _set = function(local,key,value,oldValue)
        {
            var e = new changeEvent(local,key,value,oldValue,local.__kbname,local.__kbref,getScopeString(local.__kbScopeString,key));
        },
        _update = function(local,key,value,oldValue)
        {
            var e = new changeEvent(local,key,value,oldValue,local.__kbname,local.__kbref,getScopeString(local.__kbScopeString,key));
        },
        _create = function(local,key,value,oldValue)
        {
            var e = new changeEvent(local,key,value,oldValue,local.__kbname,local.__kbref,getScopeString(local.__kbScopeString,key));
        },
        _remove = function(local,key,value,oldValue)
        {
            var e = new changeEvent(local,key,value,oldValue,local.__kbname,local.__kbref,getScopeString(local.__kbScopeString,key));
        };
    
    /* The event object */
    function changeEvent(local,key,value,oldValue,name,obj,scopeString)
    {
        this.stopPropagation = function(){this._stopPropogation = true;};
        this.preventDefault = function(){this._preventDefault = true;};
        this.instance = viewmodel;
        this.viewmodel = name;
        this.scope = obj;
        this.localScope = local;
        this.value = value;
        this.oldValue = oldValue;
        this.scopeString = scopeString;
        this.key = key;
    }

    function isArray(v)
    {
        return (typeof v === 'object' && !!v && v.constructor.toString() === Array.toString());
    }

    function isObject(v)
    {
        return (typeof v === 'object' && !!v && v.constructor.toString() !== Array.toString());
    }

    /* A typical property has a descriptor with a value while observable properties have get, set descriptors */
    function isObservable(obj,prop)
    {
        var desc = Object.getOwnPropertyDescriptor(obj,prop);
        return (Object.keys(desc).indexOf('value') === -1);
    }

    /* this returns a new readable scope string based on the current property and new key */
    function getScopeString(str,prop)
    {
        var scope = ((typeof str === 'object') ? str.___kbscopeString : str);
        return ((isArray(str) || !isNaN(parseInt(prop,10))) ? scope+"["+prop+"]" : (scope.length !== 0 ? scope+"."+ prop : prop));
    }

    /* This returns an array of all propertys so it can be looped to fetch the proper property in the main object */
    function splitScopeString(str)
    {
        return str.split(/[\[\]\.]/g).filter(function(v){
            return (v.length !== 0);
        });
    }

    /* This is the main getter setter method for all observables */
    function setNormal(val,key,set,update)
    {
        var _val = val,
            _key = key,
            _set = set,
            _update = update,
            _oldValue;

        return {
            get:function(){return _val;},
            set:function(v)
            {
                _oldValue = _val;
                /* if we are attempting to set the value to the same that it already is don't allow set or update to run' */
                if(JSON.stringify(_oldValue) === JSON.stringify(v))
                {
                    return;
                }
                if(_set(this,_key,v,_oldValue,this.__kbname,this.__kbref,getScopeString(this,_key)))
                {
                    _val = v;
                    if(v !== undefined && typeof v === 'object' && v.__kbname === undefined)
                    {
                        _val = model.createObservable(this.__kbname,this,_key);
                    }
                }
                _update(this,_key,v,_oldValue,this.__kbname,this.__kbref,getScopeString(this,_key));
            },
            enumerable:true,
            configurable:true
        }
    }

    function observableArray()
    {
        var _arr = [];
    }

    function observableObject()
    {

    }

    function model()
    {

    }

    model.isArray = isArray;


    
});