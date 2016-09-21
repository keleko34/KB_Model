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

    function getScopeString(str,prop)
    {
        if()
    }


});