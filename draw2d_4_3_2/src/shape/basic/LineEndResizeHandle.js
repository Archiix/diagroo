/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.basic.LineEndResizeHandle
 * Selection handle for connections and normal lines.
 * 
 * TODO: Split the LineEndResizeHandle to ConnectionEndResizeHandle and LineEndResizeHandle!!!!
 *
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.shape.basic.LineResizeHandle 
 */
draw2d.shape.basic.LineEndResizeHandle = draw2d.shape.basic.LineResizeHandle.extend({
    NAME : "draw2d.shape.basic.LineEndResizeHandle",

    init: function( figure) {
        this._super(figure);
    },

    
    /**
     * @method
     * Return the Port below the ResizeHandle
     * 
     * @return {draw2d.Port}
     */
    getRelatedPort:function()
    {
    	if(this.owner instanceof draw2d.Connection){
         return this.owner.getTarget();
    	}
    	
    	return null;
    },
    
    /**
     * @method
     * Return the Port on the opposite side of the ResizeHandle
     * 
     * @returns
     */
    getOppositePort:function()
    {
    	if(this.owner instanceof draw2d.Connection) {
         return this.owner.getSource();
    	}
    	
    	return null;
    },
    
 
    /**
     * @method
     * Called from the framework during a drag&drop operation
     * 
     * @param {Number} dx the x difference between the start of the drag drop operation and now
     * @param {Number} dy the y difference between the start of the drag drop operation and now
     * @param {Number} dx2 The x diff since the last call of this dragging operation
     * @param {Number} dy2 The y diff since the last call of this dragging operation
     * @return {boolean}
     **/
    onDrag:function( dx, dy, dx2, dy2)
    {
      this._super(dx,dy, dx2, dy2);
    
      var objPos = this.owner.end.clone();//getEndPoint();
     // objPos.translate(dx2,dy2);
      
      this.owner.setEndPoint(objPos.x+dx2, objPos.y+dy2);
      
      this.owner.isMoving = true;
    
      return true;
    },
    
    /**
     * Resizehandle has been drop on a InputPort/OutputPort.
     * @private
     **/
    onDrop:function( dropTarget)
    {
    	this.owner.isMoving=false;
      
      if(this.owner instanceof draw2d.Connection && this.command !==null){
         this.command.setNewPorts(this.owner.getSource(),dropTarget);
         this.getCanvas().getCommandStack().execute(this.command);
      }
      this.command = null;
    },
    
    /**
     * @method
     * Controls the location of the resize handle 
     *
     * @template
     **/
    relocate:function(){

        var resizeWidthHalf = this.getWidth()/2;
        var resizeHeightHalf= this.getHeight()/2;
        
        var anchor   = this.owner.getEndPoint();
        
        this.setPosition(anchor.x-resizeWidthHalf,anchor.y-resizeHeightHalf);
    }    
});