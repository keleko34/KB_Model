define([],function(){

    function CreateObservableArray(name,parent,scope)
    {
        var _arr = [];

        _arr.onadd = function(){};
        _arr.onremove = function(){};

        _arr.onaction = function(){};

        function splice(index,remove,insert)
        {
            var _ret = [],
                _insertLen = (insert !== undefined ? (isArray(insert) ? insert.length : 1) : 0);
            
            /* removes necessary indexes and resets values to appropriate keys  */
            if(remove !== 0)
            {
                for(var x=index,len=(this.length-remove);x<len;x++)
                {
                    if(x < (index+remove)) _ret.push(this[x]);
                    
                    this[x] = this[(x+remove)];
                }
                this.length = (this.length-remove);
            }

            if(_insertLen !== 0)
            {
                for(var x=((this.length-1)+_insertLen),len=(index+_insertLen);x>len;x--)
                {
                    this[x] = this[(x-_insertLen)];
                }
                for(var x=0,len=_insertLen;x<len;x++)
                {
                    this[(index+x)] = insert[x];
                }
            }

            if(_ret.length !== 0)
            {
                for(var x=0,len=_ret.length;x<len;x++)
                {
                    if(this.onremove(this,(index+x),_ret[x]) === false)
                    {
                        this.slice(index,0,_ret[x]);
                    }
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

        function add()
        {
            var args = Array.prototype.slice.call(arguments);
            for(var x=0,len=args.length;x<len;x++)
            {
                this.push(args[x]);
            }
            this.onaction(this,'add',arguments);
            return this;
        }

        function remove(index,remove)
        {
            this.slice(index,remove);
            this.onaction(this,'remove',arguments);
            return this;
        }

        function stringify()
        {
            return JSON.stringify(this);
        }

        function toJSON(val)
        {
            return this.slice();
        }

        function setDescriptor(value)
        {
            return {
                value:value,
                writable:false,
                enumerable:false,
                configurable:false
            }
        }

        Object.defineProperties(_arr,{
            __kbname:setDescriptor((name || "")),
            __kbref:setDescriptor((parent || null)),
            __kbscopeString:setDescriptor((scope || "")),
            splice:setDescriptor(splice),
            push:setDescriptor(push),
            pop:setDescriptor(pop),
            shift:setDescriptor(shift),
            unshift:setDescriptor(unshift),
            fill:setDescriptor(fill),
            reverse:setDescriptor(reverse),
            sort:setDescriptor(sort),
            add:setDescriptor(add),
            remove:setDescriptor(remove),
            stringify:setDescriptor(stringify),
            toJSON:setDescriptor(toJSON),
            __kblisteners:setDescriptor({}),
            __kbupdatelisteners:setDescriptor({}),
            __kbparentlisteners:setDescriptor({}),
            __kbparentupdatelisteners:setDescriptor({}),
            __kbdatacreatelisteners:setDescriptor([]),
            __kbdatadeletelisteners:setDescriptor([])
        });

        return _arr;
    }
    return CreateObservableArray;
});