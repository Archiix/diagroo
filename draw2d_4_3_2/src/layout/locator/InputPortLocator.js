/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.layout.locator.InputPortLocator
 * 
 * Repositions a Figure attached to a Connection when the 
 * Connection is moved. Provides for alignment at the start 
 * (source), middle, or end (target) of the Connection.
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.Locator
 */
draw2d.layout.locator.InputPortLocator = draw2d.layout.locator.PortLocator.extend({
    NAME : "draw2d.layout.locator.InputPortLocator",
     
    /**
     * @constructor
     * Default constructor for a Locator which can layout a port in context of a 
     * {@link grapiti.shape.node.Node}
     * 
     */
    init:function(  ){
      this._super();
    },    
   
   /**
    * @method
    * Controls the location of an I{@link draw2d.Figure} 
    *
    * @param {Number} index port index of the figure
    * @param {draw2d.Figure} figure the figure to control
    * 
    * @template
    **/
    relocate:function(index, figure){
        var node = figure.getParent();
        var dividerFactor = 1;
        var thisNAME = this.NAME;
        var portIndex =1;
        node.getPorts().each(function(i,p){
        	portIndex = (p===figure)?dividerFactor:portIndex;
        	dividerFactor += p.getLocator().NAME === thisNAME?1:0;
        });
        this.applyConsiderRotation( figure, 0, (node.getHeight()/dividerFactor)*portIndex);
    }
    
});



