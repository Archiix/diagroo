/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.mesh.ProposedMeshChange
 * Change proposal for grid/mesh layout changes.
 *
 * @author Andreas Herz
 */
draw2d.layout.mesh.ProposedMeshChange = Class.extend({

	/**
	 * @constructor 
	 * Creates change object.
	 */
    init: function(figure, x, y){
    	this.figure = figure;
    	this.x = x;
    	this.y = y;
    },
    
    /**
     * @method
     * Return the related figure.
     * 
     * @return {draw2d.Figure} the figure to the related change proposal
     */
    getFigure:function( )
    {
    	return this.figure;
    },
    
    /**
     * @method
     * The proposed x-coordinate.
     * 
     * @return {Number}
     */
    getX: function(){
    	return this.x;
    },
    
    /**
     * @method
     * The proposed y-coordinate
     * 
     * @return {Number}
     */
    getY: function(){
    	return this.y;
    }
    
});