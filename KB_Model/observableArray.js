define([],function(){

    function CreateObservableArray(name,parent,scope)
    {
        var _arr = [];

        _arr.onadd = function(){};
        _arr.onremove = function(){};

        _arr.onaction = function(){};

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
                                this[(index+x)] = insert[x];
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
                            this[index] = insert;
                        }
                    }
                    else
                    {
                        this[index] = insert;
                    }
                    this[index] = insert;
                }
            }
            this.onaction(this,'splice',arguments);
            return _ret;
        }

        function push(v)
        {
            if(this.onadd(this,(this.length),v) !== false)
            {
                this[this.length] = v;
                this.onaction(this,'push',arguments);
            }
            return this.length;
        }

        function pop()
        {
            var _ret = this[(this.length-1)];
            if(this.onremove(this,(this.length-1),_ret) !== false)
            {
                this.length = (this.length-1);
                this.onaction(this,'pop',arguments);
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

                this.onaction(this,'shift',arguments);
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
                        this[x] = this[(x-args.length)];
                    }
                }
            }
            this.onaction(this,'unshift',arguments);
            return this.length;
        }

        function fill(value,start,end)
        {
            var _start = (start !== undefined ? start : 0),
                _end = ((end !== undefined && end <= this.length) ? end : this.length);

                for(var x=_start;x<_end;x++)
                {
                    this[x] = value;
                }
            this.onaction(this,'fill',arguments);
            return this;
        }

        function reverse()
        {
            var _rev = this.slice().reverse();
            for(var x=0,len=this.length;x<len;x++)
            {
                this[x] = _rev[x];
            }
            this.onaction(this,'reverse',arguments);
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
            this.onaction(this,'sort',arguments);
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
                        this[index] = value;
                    }
                }
                else
                {
                    console.error('Your attempting to add the index: ',index,' that already exists on',this,'try using set or direct set instead');
                    return this;
                }
            }
            this.onaction(this,'add',arguments);
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
                this[index] = value;
            }
            this.onaction(this,'set',arguments);
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
            this.onaction(this,'remove',arguments);
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

        Object.defineProperties(_arr,{
            __kbname:setDescriptor((name || ""),true),
            __kbref:setDescriptor((parent || null),true),
            __kbscopeString:setDescriptor((scope || ""),true),
            splice:setDescriptor(splice),
            push:setDescriptor(push),
            pop:setDescriptor(pop),
            shift:setDescriptor(shift),
            unshift:setDescriptor(unshift),
            fill:setDescriptor(fill),
            reverse:setDescriptor(reverse),
            sort:setDescriptor(sort),
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

        return _arr;
    }
    return CreateObservableArray;
});