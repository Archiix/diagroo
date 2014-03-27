/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.figure.VertexSelectionFeedbackPolicy
 * 
 * Called by the framework if the user edit the position of a figure with a drag drop operation.
 * Sub class like SelectionEditPolicy or RegionEditPolicy cam adjust th e position of the figure or the selections handles.
 * 
 * @author  Andreas Herz
 * @extends draw2d.policy.figure.SelectionFeedbackPolicy
 */
draw2d.policy.figure.VertexSelectionFeedbackPolicy = draw2d.policy.figure.SelectionFeedbackPolicy.extend({

    NAME : "draw2d.policy.figure.VertexSelectionFeedbackPolicy",

    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
    },
    

    /**
     * @method
     * 
     * @template
     * @param {draw2d.Connection} connection the selected figure
     * @param {boolean} isPrimarySelection
     */
    onSelect: function(canvas, connection, isPrimarySelection){
//    	this._super(canvas, connection, isPrimarySelection);
    	
    	var points = connection.getVertices();
    	for(var i=0 ; i<points.getSize(); i++){
    		var handle = new draw2d.shape.basic.VertexResizeHandle(connection, i);
            connection.selectionHandles.add( handle);         
            handle.setDraggable(connection.isResizeable());
            handle.show(canvas);

            if(i!==0){
        		var handle = new draw2d.shape.basic.GhostVertexResizeHandle(connection, i-1);
                connection.selectionHandles.add( handle);         
                handle.setDraggable(connection.isResizeable());
                handle.show(canvas);
            }
        }
 
        this.moved(canvas, connection);
    },
    
    /**
     * @method
     * Callback method if the figure has been moved.
     * 
     * @template
     */
    moved: function(canvas,figure){
        figure.selectionHandles.each(function(i,e){
            e.relocate();
        });
    }
    

});