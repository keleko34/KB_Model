define([],function(){
    function CreateObservableObject(name,parent,scope)
    {
        var _obj = {};

        _obj.onadd = function(){};
        _obj.onremove = function(){};

        _obj.onaction = function(){};

        function add(key,value)
        {
            if(this[key] !== undefined)
            {
                console.error('Your attempting to add the key: '+key+' that already exists on',this,' use .set() or direct set instead');
                return this;
            }

            if(_obj.onadd(this,key,value) !== false)
            {
                this[key] = value;
            }
            this.onaction(this,'add',arguments);
            return this;
        }

        function set(key,value)
        {
            if(this[key] === undefined)
            {
                this.add(key,value);
            }
            else
            {
                this[key] = value;
            }
            return this;
        }

        function remove(key)
        {
            if(this[key] === undefined)
            {
                console.error('Your attempting to remove the key: ',key,' which does not exist on',this)
            }
            Object.defineProperty(this,key,{
                value:undefined,
                writable:false,
                enumerable:false,
                configurable:true
            })
            delete this[key];
            return this;
        }

        function stringify()
        {
            return JSON.stringify(this);
        }

        function addListener(type)
        {
            var _listeners = this[type];
            return function(prop,func)
            {
                _listeners[prop] = func;
                return this;
            }
        }

        function removeListener(type)
        {
            var _listeners = this[type];
            return function(prop,func)
            {
                if(func !== undefined) _listeners = _listeners[prop];

                for(var x=0,len=_listeners.length;x<len;x++)
                {
                    if(_listeners[x].toString() === func.toString())
                    {
                        _listeners.splice(x,1);
                        return this;
                    }
                }
                return this;
            }
        }

        function setDescriptor(value,writable)
        {
            return {
                value:value,
                writable:!!writable,
                enumerable:false,
                configurable:false
            }
        }

        Object.defineProperties(_obj,{
            __kbname:setDescriptor((name || ""),true),
            __kbref:setDescriptor((parent || null),true),
            __kbscopeString:setDescriptor((scope || ""),true),
            add:setDescriptor(add),
            set:setDescriptor(set),
            remove:setDescriptor(remove),
            stringify:setDescriptor(stringify),
            __kblisteners:setDescriptor({}),
            __kbupdatelisteners:setDescriptor({}),
            __kbparentlisteners:setDescriptor({}),
            __kbparentupdatelisteners:setDescriptor({}),
            __kbdatacreatelisteners:setDescriptor([]),
            __kbdatadeletelisteners:setDescriptor([])
        });

        Object.defineProperties(_arr,{
            addDataListener:setDescriptor(addListener('__kblisteners')),
            removeDataListener:setDescriptor(removeListener('__kblisteners')),
            addDataUpdateListener:setDescriptor(addListener('__kbupdatelisteners')),
            removeDataUpdateListener:setDescriptor(removeListener('__kbupdatelisteners')),
            addDataCreateListener:setDescriptor(addListener('__kbdatacreatelisteners')),
            removeDataCreateListener:setDescriptor(removeListener('__kbdatacreatelisteners')),
            addDataRemoveListener:setDescriptor(addListener('__kbdatadeletelisteners')),
            removeDataRemoveListener:setDescriptor(removeListener('__kbdatadeletelisteners'))
        });
    }
    return CreateObservableObject;
})