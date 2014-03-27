/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.CommandResize
 * Resize command for figures. Can be execute/undo/redo via a CommandStack.
 *
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.command.Command
 */
draw2d.command.CommandResize = draw2d.command.Command.extend({
    NAME : "draw2d.command.CommandResize", 

    /**
     * @constructor
     * Create a new resize Command objects which can be execute via the CommandStack.
     *
     * @param {draw2d.Figure} figure the figure to resize
     * @param {Number} [width] the current width
     * @param {Number} [height] the current height
     */
    init : function(figure, width, height)
    {
        this._super(draw2d.Configuration.i18n.command.resizeShape);
        this.figure = figure;
        
        if (typeof width === "undefined")
        {
            this.oldWidth = figure.getWidth();
            this.oldHeight = figure.getHeight();
        }
        else
        {
            this.oldWidth = width;
            this.oldHeight = height;
        }
    },
  
    /**
     * @method
     * Set the new dimension of the element.
     *
     * @param {Number} width the new width.
     * @param {Number} height the new height of the element.
     **/
    setDimension:function( width, height)
    {
       this.newWidth  = width|0;
       this.newHeight = height|0;
    },

    /**
     * @method
     * Returns [true] if the command can be execute and the execution of the
     * command modify the model. A CommandMove with [startX,startX] == [endX,endY] should
     * return false. <br>
     * the execution of the Command doesn't modify the model.
     *
     * @return {boolean}
     **/
    canExecute:function()
    {
      // return false if we doesn't modify the model => NOP Command
      return this.newWidth!=this.oldWidth || this.newHeight!=this.oldHeight;
    },
    
    /**
     * @method
     * Execute the command the first time
     * 
     **/
    execute:function()
    {
       this.redo();
    },
    
    /**
     * @method
     * Undo the command
     *
     **/
    undo:function()
    {
       this.figure.setDimension(this.oldWidth, this.oldHeight);
    },
    
    /**
     * @method
     * Redo the command after the user has undo this command
     *
     **/
    redo:function()
    {
       this.figure.setDimension(this.newWidth, this.newHeight);
    }
});