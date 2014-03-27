/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.shape.node.Between
 * A simple Node which has a  InputPort and OutputPort. Mainly used for demo and examples.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var figure =  new draw2d.shape.node.Between();
 *     figure.setColor("#3d3d3d");
 *     
 *     canvas.addFigure(figure,50,10);
 *     
 * @extends draw2d.shape.basic.Rectangle
 */
draw2d.shape.node.Between = draw2d.shape.basic.Rectangle.extend({

    NAME : "draw2d.shape.node.Between",

    DEFAULT_COLOR : new draw2d.util.Color("#4D90FE"),

	init : function()
    {
        this._super();
        
        this.setDimension(50, 50);
        this.setBackgroundColor(this.DEFAULT_COLOR);
        this.setColor(this.DEFAULT_COLOR.darker());

        this.createPort("output");
        this.createPort("input");
    }
});
