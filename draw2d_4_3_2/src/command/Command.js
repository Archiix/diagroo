/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.Command
 * 
 * Commands are passed around throughout editing. They are used to encapsulate and combine 
 * changes to the application's model. An application has a single command stack. Commands must
 * be executed using the command stack rather than directly calling execute.
 * <br> 
 * This is requried for a deneric support for the undo/redo concept within draw2d.<br>
 * 
 * @inheritable
 * @author Andreas Herz
 */
draw2d.command.Command = Class.extend({

    NAME : "draw2d.command.Command", 

    /**
     * @constructor
     * Create a new Command objects which can be execute via the CommandStack.
     * 
     * @param {String} label
     */
    init: function( label) {
        this.label = label;
    },
    
    
    /**
     * @method
     * Returns a label of the Command. e.g. "move figure".
     *
     * @return {String} the label for this command
     **/
    getLabel:function()
    {
       return this.label;
    },
    
    
    /**
     * @method
     * Returns [true] if the command can be execute and the execution of the
     * command modifies the model. e.g.: a CommandMove with [startX,startX] == [endX,endY] should
     * return false. The execution of this Command doesn't modify the model.
     *
     * @return {boolean} return try if the command modify the model or make any relevant changes
     **/
    canExecute:function()
    {
      return true;
    },
    
    /**
     * @method
     * Execute the command the first time.
     * Sup-classes must implement this method.
     *
     * @template
     **/
    execute:function()
    {
    },
    
    /**
     * @method
     * Will be called if the user cancel the operation.
     *
     * @template
     **/
    cancel:function()
    {
    },
    
    /**
     * @method
     * Undo the command.
     * Sup-classes must implement this method.
     *
     * @template
     **/
    undo:function()
    {
    },
    
    /** 
     * @method
     * Redo the command after the user has undo this command.
     * Sup-classes must implement this method.
     *
     * @template
     **/
    redo:function()
    {
    }
});
