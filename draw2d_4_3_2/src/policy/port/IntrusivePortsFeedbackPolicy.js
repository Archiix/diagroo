/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.port.IntrusivePortsFeedbackPolicy
 * 
 * A draw2d.policy.SelectionFeedbackPolicy that is sensitive to the canvas selection. Subclasses will typically 
 * decorate the {@link draw2d.Figure figure} with things like selection handles and/or focus feedback.
 * <br>
 * If you want to change the handle visibility for a figure, then you should use SelectionFeedbackPolicy to do that.
 * 
 * @author Andreas Herz
 * @extends draw2d.policy.figure.DragDropEditPolicy
 */
draw2d.policy.port.IntrusivePortsFeedbackPolicy = draw2d.policy.port.PortFeedbackPolicy.extend({

    NAME : "draw2d.policy.port.IntrusivePortsFeedbackPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
        this.connectionLine = null;
        this.tweenable = null;
    },
    
    /**
     * @method
     * Called by the framework if the related shape has init a drag&drop
     * operation
     * 
     * @param {draw2d.Canvas} canvas The host canvas
     * @param {draw2d.Figure} figure The related figure
     * @template
     */
    onDragStart: function(canvas, figure){
        var start = 0;
    	figure.getDropTargets().each(function(i, element){
	        element.__beforeInflate = element.getWidth();
	        start = element.__beforeInflate;
    	});

    	// animate the resize of the ports
    	//
    	var portsToGrow = figure.getDropTargets();
    	portsToGrow.grep(function(p){
    	    return (p.NAME != figure.NAME && p.parent!==figure.parent) || (p instanceof draw2d.HybridPort) || (figure instanceof draw2d.HybridPort);
    	});
        this.tweenable = new Tweenable();
        this.tweenable.tween({
          from:     { 'size': start/2  },
          to:       { 'size': start },
          duration: 200,
          easing : "easeOutSine",
          step: function (params) {
              portsToGrow.each(function(i, element){
                  // IMPORTANT shortcut to avoid rendering errors!!
                  // performance shortcut to avoid a lot of fireMoveEvent and recalculate/routing of all related connections
                  // for each setDimension call. Additional the connection is following a port during Drag&Drop operation
                  element.shape.attr({rx : params.size, ry :params.size});
                  element.width = element.height = params.size*2;
                  //element.setDimension(params.size, params.size);
              });
          }
        });
    	
        this.connectionLine = new draw2d.shape.basic.Line();
        this.connectionLine.setCanvas(canvas);
        this.connectionLine.getShapeElement();
        this.connectionLine.setDashArray("- ");
        this.connectionLine.setColor("#30c48a");
       
        this.onDrag(canvas, figure);
    },
    
    
    /**
     * @method
     * Called by the framework during drag a figure.
     * 
     * @param {draw2d.Canvas} canvas The host canvas
     * @param {draw2d.Figure} figure The related figure
     * @template
     */
    onDrag: function(canvas, figure){
        var x1 = figure.ox+figure.getParent().getAbsoluteX();
        var y1 = figure.oy+figure.getParent().getAbsoluteY();
        
        this.connectionLine.setStartPoint(x1,y1);
        this.connectionLine.setEndPoint(figure.getAbsoluteX(),figure.getAbsoluteY());
    },
    
    /**
     * @method
     * Called by the framework if the drag drop operation ends.
     * 
     * @param {draw2d.Canvas} canvas The host canvas
     * @param {draw2d.Figure} figure The related figure
     * @template
     */
    onDragEnd: function(canvas, figure){
        this.tweenable.stop(false);
        this.tweenable = null;
    	figure.getDropTargets().each(function(i, element){
            // IMPORTANT shortcut to avoid rendering errors!!
            // performance shortcut to avoid a lot of fireMoveEvent and recalculate/routing of all related connections
    	    // for each setDimension call. Additional the connection is following a port during Drag&Drop operation
    	    element.shape.attr({rx : element.__beforeInflate/2, ry :element.__beforeInflate/2});
            element.width = element.height = element.__beforeInflate;
    		//element.setDimension(element.__beforeInflate, element.__beforeInflate);
    	});
        this.connectionLine.setCanvas(null);
        this.connectionLine = null;
    },
    
    onHoverEnter: function(canvas, draggedFigure, hoverFiger){
    	this.connectionLine.setGlow(true);
    	hoverFiger.setGlow(true);
    },
    
    onHoverLeave: function(canvas, draggedFigure, hoverFiger){
    	hoverFiger.setGlow(false);
    	this.connectionLine.setGlow(false);
    }

        
});
