var UndoManager = (function(){
    /**
     * SimpleUndo is a very basic javascript undo/redo stack for managing histories of basically anything.
     *
     * options are: {
 * 	* `provider` : required. a function to call on `save`, which should provide the current state of the historized object through the given "done" callback
 * 	* `maxLength` : the maximum number of items in history
 * 	* `opUpdate` : a function to call to notify of changes in history. Will be called on `save`, `undo`, `redo` and `clear`
 * }
     *
     */
    var SimpleUndo = function(options) {

        var settings = options ? options : {};
        var defaultOptions = {
            provider: function() {
                throw new Error("No provider!");
            },
            maxLength: 30,
            onUpdate: function() {}
        };

        this.provider = (typeof settings.provider != 'undefined') ? settings.provider : defaultOptions.provider;
        this.maxLength = (typeof settings.maxLength != 'undefined') ? settings.maxLength : defaultOptions.maxLength;
        this.onUpdate = (typeof settings.onUpdate != 'undefined') ? settings.onUpdate : defaultOptions.onUpdate;

        this.initialItem = null;
        this.clear();
    };

    function truncate (stack, limit) {
        while (stack.length > limit) {
            stack.shift();
        }
    }

    function isEqual (o1, o2) {
        return JSON.stringify(o1) == JSON.stringify(o2);
    }

    SimpleUndo.prototype.initialize = function(initialItem) {
        this.stack[0] = initialItem;
        this.initialItem = initialItem;
    };


    SimpleUndo.prototype.clear = function() {
        this.stack = [this.initialItem];
        this.position = 0;
        this.onUpdate();
    };

    SimpleUndo.prototype.save = function() {
        this.provider(function(current) {
            var isEqualToTop = isEqual(current, this.stack[this.stack.length - 1]);
            if( isEqualToTop || isEqual(current, this.stack[this.position])){
                isEqualToTop && (this.position = Math.min(this.position + 1, this.stack.length - 1));
                this.onUpdate();
                return;
            }
            truncate(this.stack, this.maxLength);
            this.position = Math.min(this.position,this.stack.length - 1);

            this.stack = this.stack.slice(0, this.position + 1);
            this.stack.push(current);
            this.position++;
            this.onUpdate();
        }.bind(this));
    };

    SimpleUndo.prototype.undo = function(callback) {
        if (this.canUndo()) {
            var item =  this.stack[--this.position];
            this.onUpdate();

            if (callback) {
                callback(item);
            }
        }
    };

    SimpleUndo.prototype.redo = function(callback) {
        if (this.canRedo()) {
            var item = this.stack[++this.position];
            this.onUpdate();

            if (callback) {
                callback(item);
            }
        }
    };

    SimpleUndo.prototype.reset = function(callback) {
        if (callback) {
            callback(this.initialItem);
        }
        this.save();
    };

    SimpleUndo.prototype.canUndo = function() {
        return this.position > 0;
    };

    SimpleUndo.prototype.canRedo = function() {
        return this.position < this.count();
    };

    SimpleUndo.prototype.count = function() {
        return this.stack.length - 1; // -1 because of initial item
    };
    
    SimpleUndo.prototype.setData = function(stackData){
        var data = $.extend(true, {}, stackData);
        this.stack = data.dataArr || [this.initialItem];
        this.position = data.position || 0;
        this.onUpdate();
    };
    SimpleUndo.prototype.getData = function(){
        return {
            dataArr: $.extend(true, [], this.stack),
            position: this.position
        }
    }

    /**
     * UndoManager
     */
    var UndoManager = function() {
        this.undoStacks = [];
    };
    UndoManager.prototype = {

        createUndoStack: function(index, options) {
            return this.undoStacks[index] = new SimpleUndo(options);
        },

        getUndoStack: function(index) {
            return this.undoStacks[index];
        },

        hasUndoStack: function(index) {
            return !!this.undoStacks[index];
        }
    };

    return UndoManager
})();
