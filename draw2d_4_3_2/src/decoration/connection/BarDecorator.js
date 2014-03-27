/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.decoration.connection.BarDecorator
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     // create and add two nodes which contains Ports (In and OUT)
 *     //
 *     var start = new draw2d.shape.node.Start();
 *     var end   = new draw2d.shape.node.End();
        
 *     // ...add it to the canvas 
 *     canvas.addFigure( start, 50,50);
 *     canvas.addFigure( end, 230,80);
 *          
 *     // Create a Connection and connect the Start and End node
 *     //
 *     var c = new draw2d.Connection();
 *     
 *     // toggle from ManhattenRouter to DirectRouter to show the rotation of decorations
 *     c.setRouter(new draw2d.layout.connection.DirectRouter());
 *      
 *     // Set the endpoint decorations for the connection
 *     //
 *     c.setSourceDecorator(new draw2d.decoration.connection.BarDecorator());
 *     c.setTargetDecorator(new draw2d.decoration.connection.BarDecorator());   
 *     // Connect the endpoints with the start and end port
 *     //
 *     c.setSource(start.getOutputPort(0));
 *     c.setTarget(end.getInputPort(0));
 *           
 *     // and finally add the connection to the canvas
 *     canvas.addFigure(c);
 * 
 * @inheritable
 * @author Andreas Herz
 * @extend draw2d.decoration.connection.Decorator
 */
draw2d.decoration.connection.BarDecorator = draw2d.decoration.connection.Decorator.extend({

	NAME : "draw2d.decoration.connection.BarDecorator",

	/**
	 * @constructor 
	 * 
	 * @param {Number} [width] the width of the bar
	 * @param {Number} [height] the height of the bar
	 */
	init : function(width, height)
	{	
        this._super( width, height);
	},

	/**
	 * @method
	 * Draw a bar decoration.
	 * 
	 * 
	 * @param {Raphael} paper the raphael paper object for the paint operation 
	 **/
	paint:function(paper)
	{
		var st = paper.set();
		var path = ["M", this.width/2," " , -this.height/2];  // Go to the top center..
		path.push(  "L", this.width/2, " ", this.height/2);   // ...bottom center...
	
		st.push(
	        paper.path(path.join(""))
		);
		st.attr({fill:this.backgroundColor.hash(),stroke:this.color.hash()});
		return st;
	}
	
});

