/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.node.End
 * A simple Node which has a InputPort. Mainly used for demo and examples.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var figure =  new draw2d.shape.node.End();
 *     figure.setColor("#3d3d3d");
 *     
 *     canvas.addFigure(figure,50,10);
 *     
 * @extends draw2d.shape.basic.Rectangle
 */
draw2d.shape.node.End = draw2d.shape.basic.Rectangle.extend({

    NAME : "draw2d.shape.node.End",

    DEFAULT_COLOR : new draw2d.util.Color("#4D90FE"),
	
    init : function()
    {
        this._super();

        this.createPort("input");

        this.setDimension(50, 50);
        this.setBackgroundColor(this.DEFAULT_COLOR);
        this.setColor(this.DEFAULT_COLOR.darker());
    }

});
