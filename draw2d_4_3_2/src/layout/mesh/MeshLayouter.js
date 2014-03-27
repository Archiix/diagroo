/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.mesh.MeshLayouter
 * Layouter for a mesh or grid. 
 *
 * @author Andreas Herz
 */
draw2d.layout.mesh.MeshLayouter = Class.extend({

	/**
	 * @constructor 
	 * Creates a new layouter object.
	 */
    init: function(){
    },
    
    /**
     * @method
     * Return a changes list for an existing mesh/canvas to ensure that the element to insert 
     * did have enough space.
     * 
     * @param {draw2d.Canvas} canvas the canvas to use for the analytic
     * @param {draw2d.Figure} figure The figure to add to the exising canvas
     * 
     * 
     * @return {draw2d.util.ArrayList} a list of changes to apply if the user want to insert he figure.
     */
    add:function( canvas, figure)
    {
    	return new draw2d.util.ArrayList();
    }
});