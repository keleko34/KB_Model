define([],function(){
    function CreateObservableObject(name,parent,scope)
    {
        var _obj = {},
            _actions = {
                add:[],
                set:[],
                remove:[]
            },
            _onaction = function(arr,type,arguments)
            {
                var e = new eventObject(arr,arguments[0],type,arguments);

                for(var x=0,_curr=_actions[type],len=_curr.length;x!==len;x++)
                {
                    _curr[x](e);
                    if(e._stopPropogration) break;
                }
                return e._preventDefault;
            }

        _obj.onadd = function(){};
        _obj.onremove = function(){};

        function eventObject(arr,key,action,args)
        {
            this.stopPropogation = function(){this._stopPropogration = true;}
            this.local = arr;
            this.key = key;
            this.arguments = args;
            this.type = action;
            this.name = arr.__kbname;
            this.root = arr.__kbref;
            this.scope = arr.__kbscopeString;
        }

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
            _onaction(this,'add',arguments);
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
                _onaction(this,'set',arguments);
            }
            return this;
        }

        function remove(key)
        {
            if(this[key] === undefined)
            {
                console.error('Your attempting to remove the key: ',key,' which does not exist on',this);
                return this;
            }
            Object.defineProperty(this,key,{
                value:undefined,
                writable:false,
                enumerable:false,
                configurable:true
            })
            delete this[key];
            _onaction(this,'remove',arguments);
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

        function addActionListener(action,func)
        {
            if(Object.keys(_actions).indexOf(action) !== -1)
            {
                _actions[action].push(func);
            }
            else
            {
                console.error('There is no action listener by the name: ',action);
            }
            return this;
        }

        function removeActionListener(action,func)
        {
            if(Object.keys(_actions).indexOf(action) !== -1)
            {
                for(var x=0,_curr=_actions[action],len=_curr.length;x!==len;x++)
                {
                    if(_curr[x].toString() === func.toString())
                    {
                        _curr.splice(x,1);
                        return this;
                    }
                }
            }
            else
            {
                console.error('There is no action listener by the name: ',action);
            }
            return this;
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
            __kbdatadeletelisteners:setDescriptor([]),
            addActionListener:setDescriptor(addActionListener),
            removeActionListener:setDescriptor(removeActionListener)
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