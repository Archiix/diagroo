/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.analog.VoltageSupplyVertical
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     var figure =  new draw2d.shape.analog.VoltageSupplyVertical();
 *     canvas.addFigure(figure,10,10);
 *     
 *     
 * @extends draw2d.SVGFigure
 */
draw2d.shape.analog.VoltageSupplyVertical = draw2d.SVGFigure.extend({

    NAME:"draw2d.shape.analog.VoltageSupplyVertical",
    
    // custom locator for the special design of the Input area
    MyInputPortLocator : draw2d.layout.locator.PortLocator.extend({
        init:function( ){
          this._super();
        },    
        relocate:function(index, figure){
            var w = figure.getParent().getWidth();
            var h = figure.getParent().getHeight();
            this.applyConsiderRotation(figure,w/2, h);
        }
    }),
    
    // custom locator for the special design of the Output area
    MyOutputPortLocator : draw2d.layout.locator.PortLocator.extend({
        init:function( ){
          this._super();
        },    
        relocate:function(index, figure){
            var w = figure.getParent().getWidth();
            this.applyConsiderRotation(figure,w/2, 0);
        }
    }),

    /**
     * @constructor
     * Create a new instance
     */
    init:function(width, height){
        if(typeof width === "undefined"){
            width = 30;
            height= 50;
        }
        
        this._super(width,height);
        
        this.inputLocator = new this.MyInputPortLocator();
        this.outputLocator = new this.MyOutputPortLocator();

        this.createPort("hybrid", this.inputLocator); // GND
        this.createPort("hybrid", this.outputLocator);// VCC
    },
    

    getSVG: function(){
         return '<svg  xmlns="http://www.w3.org/2000/svg" version="1.1">'+
                '<path d="m19.62398,12.37594l-9.87926,0m-9.74355,8.22145l29.36289,0m-9.74007,8.22469l-9.87927,0m-9.74355,8.22145l29.36289,0" id="path10560" stroke-miterlimit="14.3" stroke="#010101" fill="none"/>'+
                '<path d="m14.63157,9.81646l0,-9.81646m0,47.2328l0,-9.81646" id="path10562" stroke-miterlimit="14.3" stroke-linecap="square" stroke="#010101" fill="none"/>'+
                '</svg>';
    }
});