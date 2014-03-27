/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.decoration.connection.ArrowDecorator
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
 *     c.setSourceDecorator(new draw2d.decoration.connection.ArrowDecorator());
 *     c.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());   
 *     // Connect the endpoints with the start and end port
 *     //
 *     c.setSource(start.getOutputPort(0));
 *     c.setTarget(end.getInputPort(0));
 *           
 *     // and finally add the connection to the canvas
 *     canvas.addFigure(c);
 *     
 * 
 * @inheritable
 * @author Andreas Herz
 * @extend draw2d.decoration.connection.Decorator
 */
draw2d.decoration.connection.ArrowDecorator = draw2d.decoration.connection.Decorator.extend({

	NAME : "draw2d.decoration.connection.ArrowDecorator",

	/**
	 * @constructor 
	 * 
	 * @param {Number} [width] the width of the arrow
	 * @param {Number} [height] the height of the arrow
	 */
    init : function(width, height)
    {   
        this._super( width, height);
    },

	/**
	 * Draw a filled arrow decoration.
	 * It's not your work to rotate the arrow. The draw2d do this job for you.
	 * 
	 * <pre>
	 *                        ---+ [length , width/2]
	 *                 -------   |
	 * [3,0]   --------          |
	 *     +---                  |==========================
	 *         --------          |
	 *                 -------   |
	 *                        ---+ [lenght ,-width/2]
	 * 
	 *</pre>
	 * @param {Raphael} paper the raphael paper object for the paint operation 
	 **/
	paint:function(paper)
	{
		var st = paper.set();
		
		st.push(paper.path(["M0 0" ,
		                    "L", this.width, " ", -this.height/2,
		                    "L", this.width, " ",  this.height/2, 
		                    "L0 0"].join("")));
		
	    st.attr({fill:this.backgroundColor.hash(),stroke:this.color.hash()});

	    return st;
	}
});

