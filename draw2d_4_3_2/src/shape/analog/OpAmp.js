/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.analog.OpAmp
 * Hand drawn arrow which points down left
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var figure =  new draw2d.shape.analog.OpAmp();
 *     canvas.addFigure(figure,10,10);
 *     
 *     
 * @extends draw2d.SVGFigure
 */
draw2d.shape.analog.OpAmp = draw2d.SVGFigure.extend({

    NAME:"draw2d.shape.analog.OpAmp",
    
    // custom locator for the special design of the OpAmp Input area
    MyInputPortLocator : draw2d.layout.locator.PortLocator.extend({
        init:function( ){
          this._super();
        },    
        relocate:function(index, port){
        	var parent = port.getParent();
            var calcY = (8+18.5*index)*parent.scaleY;
            this.applyConsiderRotation(port, 1, calcY);
        }
    }),

    /**
     * @constructor
     * Create a new instance
     */
    init:function(width, height){
        this._super(width||50,height||50);
        
        this.inputLocator = new this.MyInputPortLocator();
        
        this.createPort("input", this.inputLocator);
        this.createPort("input", this.inputLocator);
        
        this.createPort("output");
        
        this.setBackgroundColor("#f0f0ff");
    },

    
    getSVG: function(){
         return '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="50"  height="50">'+
                 '<path d="m8.2627,0l0,35.36035l31.23926,-17.76025l-31.23926,-17.60011l0,0l0,0.00001zm2.27832,27.36719l4.08105,0m-2.10449,-2.20703l0,4.27979m2.26367,-21.35938l-4.15918,0"  stroke="#1B1B1B" fill="none"/>'+
                 '<line x1="0.53516"  y1="8"  x2="8.21191"  y2="8"  stroke="#010101"/>'+
                 '<line x1="39.14941" y1="18" x2="45.81055" y2="18" stroke="#010101" />'+
                 '<line x1="0.53516"  y1="27" x2="8.21191"  y2="27" stroke="#010101" />'+
                '</svg>';
    },
    
    /**
     * @method
     * propagate all attributes like color, stroke,... to the shape element
     **/
     repaint : function(attributes)
     {
         if (this.repaintBlocked===true || this.shape === null){
             return;
         }

         if(typeof attributes === "undefined" ){
             attributes = {};
         }

         // redirect the backgroundColor to an internal SVG node.
         // In this case only a small part of the shape are filled with the background color
         // and not the complete rectangle/bounding box
         //
         attributes["fill"] = "none";
         if( this.bgColor!=null){
             this.svgNodes[0].attr({fill: this.bgColor.hash()});
         }
         
         this._super(attributes);
     }

});