define([],function(){

    function CreateObservableArray(name,parent,scope)
    {
        var _arr = [],
        _actions = {
                splice:[],
                push:[],
                pop:[],
                shift:[],
                unshift:[],
                fill:[],
                reverse:[],
                sort:[],
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
            },
            _subscribers = {};

        _arr.add = function(){};
        _arr.onremove = function(){};
        _arr.onset = function(){};
        _arr.onupdate = function(){};

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
            this.parent = arr.___kbImmediateParent;
        }

        function isArray()
        {
            return (typeof v === 'object' && !!v && v.constructor.toString() === Array.toString());
        }

        function splice(index,remove,insert)
        {
            var _ret = [],
                _isInsertArray = isArray(insert),
                _insertLen = (insert !== undefined ? (_isInsertArray ? insert.length : 1) : 0);
            
            /* removes necessary indexes and resets values to appropriate keys  */
            if(remove !== 0 && this[(index+remove)] !== undefined)
            {
                for(var x=index,len=(index+remove);x<len;x++)
                {
                    if(this.onremove(this,(index+x),this[(index+x)]) === false)
                    {
                        remove -= 1;
                    }
                }

                if(remove !== 0)
                {
                    for(var x=index,len=(this.length-remove);x<len;x++)
                    {
                        if(x < (index+remove)) _ret.push(this[x]);
                        
                        this[x] = this[(x+remove)];
                    }
                    this.length = (this.length-remove);
                }
            }

            if(_insertLen !== 0)
            {
                if((this.length-1)+_insertLen > (index+_insertLen))
                {
                    for(var x=((this.length-1)+_insertLen),len=(index+_insertLen);x>len;x--)
                    {
                        this[x] = this[(x-_insertLen)];
                    }
                }
                if(_isInsertArray)
                {
                    for(var x=0,len=_insertLen;x<len;x++)
                    {
                        if(this[(index+x)] === undefined)
                        {
                            if(this.onadd(this,(index+x),insert[x]) !== false)
                            {
                                Object.defineProperty(this,(index+x),setBindDescriptor(insert[x],(index+x)));
                            }
                        }
                        else
                        {
                            this[(index+x)] = insert[x];
                        }
                    }
                }
                else
                {
                    if(this[index] === undefined)
                    {
                        if(this.onadd(this,index,insert) !== false)
                        {
                            Object.defineProperty(this,index,setBindDescriptor(insert,index));
                        }
                    }
                    else
                    {
                        this[index] = insert;
                    }
                    this[index] = insert;
                }
            }
            _onaction(this,'splice',arguments);
            return _ret;
        }

        function push(v)
        {
            if(this.onadd(this,(this.length),v) !== false)
            {
                Object.defineProperty(this,this.length,setBindDescriptor(v,this.length));
                _onaction(this,'push',arguments);
            }
            return this.length;
        }

        function pop()
        {
            var _ret = this[(this.length-1)];
            if(this.onremove(this,(this.length-1),_ret) !== false)
            {
                this.length = (this.length-1);
                _onaction(this,'pop',arguments);
                return _ret;
            }
            return null;
        }

        function shift()
        {
            var _ret = this[0];
            if(this.onremove(this,0,_ret) !== false)
            {
                for(var x=0,len=(this.length-1);x<len;x++)
                {
                    this[x] = this[(x+1)];
                }
                this.length = (this.length-1);

                _onaction(this,'shift',arguments);
                return _ret;
            }
            return null;
        }

        function unshift()
        {
            var args = Array.prototype.slice.call(arguments);
            for(var x=0,len=args.length;x<len;x++)
            {
                if(this.onadd(this,x,args[x]) === false)
                {
                    args.splice(x,1);
                }
            }
            if(args.length !== 0)
            {
                for(var x=((this.length-1)+args.length),len=args.length;x !== -1;x--)
                {
                    if(x < len)
                    {
                        this[x] = args[x];
                    }
                    else
                    {
                        if(!isObservable(this,x))
                        {
                            Object.defineProperty(this,x,setBindDescriptor(this[(x-args.length)],x));
                        }
                        else
                        {
                            this[x] = this[(x-args.length)];
                        }
                    }
                }
            }
            _onaction(this,'unshift',arguments);
            return this.length;
        }

        function fill(value,start,end)
        {
            var _start = (start !== undefined ? Math.max(0,start) : 0),
                _end = ((end !== undefined && end <= this.length) ? Math.min(this.length,Math.max(0,end)) : this.length);

                for(var x=_start;x<_end;x++)
                {
                    this[x] = value;
                }
            _onaction(this,'fill',arguments);
            return this;
        }

        function reverse()
        {
            var _rev = this.slice().reverse();
            for(var x=0,len=this.length;x<len;x++)
            {
                this[x] = _rev[x];
            }
            _onaction(this,'reverse',arguments);
            return this;
        }

        function sort()
        {
            var _sort = this.slice();
            _sort = _sort.sort.apply(_sort,arguments);
            for(var x=0,len=this.length;x<len;x++)
            {
                this[x] = _sort[x];
            }
            _onaction(this,'sort',arguments);
            return this;
        }

        function add(value,index)
        {
            if(index === undefined)
            {
                this.push(value);
            }
            else
            {
                if(this[index] === undefined)
                {
                    if(this.onadd(this,index,value) !== false)
                    {
                        Object.defineProperty(this,index,setBindDescriptor(value,index));
                    }
                }
                else
                {
                    console.error('Your attempting to add the index: ',index,' that already exists on',this,'try using set or direct set instead');
                    return this;
                }
            }
            _onaction(this,'add',arguments);
            return this;
        }

        function addPointer(objArr,prop)
        {
            if(this[key] !== undefined)
            {
                console.error('Your attempting to add the key: '+key+' that already exists on',this,' use .set() or direct set instead');
                return this;
            }

            if(_obj.onadd(this,key,value) !== false)
            {
                var desc = Object.getOwnPropertyDescriptor(objArr,prop);
                Object.defineProperty(this,prop,setPointer(objArr,prop,desc));
            }
            _onaction(this,'add',arguments);
            return this;
        }

        function set(index,value)
        {
            if(this[index] === undefined)
            {
                this.add(value,index);
            }
            else
            {
                if(isObservable(this,index))
                {
                    Object.getOwnPropertyDescriptor(this,key).set(value,stopChange);
                }
                else
                {
                    Object.defineProperty(this,index,setBindDescriptor(value,index));
                }
            }
            _onaction(this,'set',arguments);
            return this;
        }

        function remove(index,remove)
        {
            if(this[index] === undefined)
            {
                console.error('Your attempting to remove the index: ',index,' that does not exist on ',this);
                return this;
            }
            this.splice(index,remove);
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

        function setPointer(obj,prop,desc)
        {
            return {
                get:function(){
                    return obj[prop];
                },
                set:function(v){
                    obj[prop] = v;
                },
                enumerable:desc.enumerable,
                configurable:desc.configurable
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

        function setBindDescriptor(value,index)
        {
            var _value = value,
                _prop = index,
                _set = this.onset,
                _update = this.onupdate;
            return {
                get:function(){
                    return _value;
                },
                set:function(v,stopChange)
                {
                    if(_set(this,_prop,_value) !== false)
                    {
                        _value = v;
                        _update(this,_prop,_value);
                        if(!stopChange) this.callSubscribers(_prop);
                    }
                },
                configurable:true,
                enumerable:true
            }
        }

        function subscribe(prop,func)
        {
            if(_subscribers[prop] === undefined) _subscribers[prop] = [];
            _subscribers[prop].push(func);
            return this;
        }

        function callSubscribers(prop)
        {
            if(_subscribers[prop] !== undefined)
            {
                var e = new eventObject(this,prop,'subscriber');
                for(var x=0,len=_subscribers[prop].length;x<len;x++)
                {
                    _subscribers[prop][x](e);
                    if(e._stopPropogration) break;
                }
            }
            return this;
        }

        Object.defineProperties(_arr,{
            __kbname:setDescriptor((name || ""),true),
            __kbref:setDescriptor((parent || null),true),
            __kbscopeString:setDescriptor((scope || ""),true),
            __kbImmediateParent:setDescriptor((parent || null),true),
            splice:setDescriptor(splice),
            push:setDescriptor(push),
            pop:setDescriptor(pop),
            shift:setDescriptor(shift),
            unshift:setDescriptor(unshift),
            fill:setDescriptor(fill),
            reverse:setDescriptor(reverse),
            sort:setDescriptor(sort),
            add:setDescriptor(add),
            addPointer:setDescriptor(addPointer),
            set:setDescriptor(set),
            remove:setDescriptor(remove),
            stringify:setDescriptor(stringify),
            callSubscribers:setDescriptor(callSubscribers),
            subscribe:setDescriptor(subscribe),
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

        return _arr;
    }
    return CreateObservableArray;
});