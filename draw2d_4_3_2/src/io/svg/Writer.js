/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/

/**
 * @class draw2d.io.svg.Writer
 * 
 * Serialize the canvas document into a SVG document.
 * 
 *      // Create a SVG writer and convert the canvas into a SVG document.
 *      //
 *      var writer = new draw2d.io.svg.Writer();
 *      writer.marshal(canvas, function(svg){
 *          // insert the svg string into a DIV for preview or post
 *          // it via ajax to the server....
 *          $("#svg").text(svg);
 *      });
 *      
 *
 * 
 * @author Andreas Herz
 * @extends draw2d.io.Writer
 */
draw2d.io.svg.Writer = draw2d.io.Writer.extend({
    
    init:function(){
        this._super();
    },
    
    /**
     * @method
     * Export the content of the canvas into SVG. The SVG document can be loaded with Inkscape or any other SVG Editor.
     * <br>
     * <br>
     * 
     * Method signature has been changed from version 2.10.1 to version 3.0.0.<br>
     * The parameter <b>resultCallback</b> is required and new. The method calls
     * the callback instead of return the result.
     * 
    * 
     * @param {draw2d.Canvas} canvas
     * @param {Function} resultCallback the method to call on success. The first argument is the SVG document
     */
    marshal: function(canvas, resultCallback){
        // I change the API signature from version 2.10.1 to 3.0.0. Throw an exception
        // if any application not care about this changes.
        if(typeof resultCallback === "undefined"){
            throw "Writer.marshal method signature has been change from version 2.10.1 to version 3.0.0. Please consult the API documentation about this issue.";
        }
        
        var s =canvas.getCurrentSelection();
        canvas.setCurrentSelection(null);
        var svg = canvas.getHtmlContainer().html()
                     .replace(/>\s+/g, ">")
                     .replace(/\s+</g, "<");
        svg = this.formatXml(svg);
        svg = svg.replace(/<desc>.*<\/desc>/g,"<desc>Create with draw2d JS graph library and RaphaelJS</desc>");
        
        canvas.setCurrentSelection(s);
 
    	var base64Content = draw2d.util.Base64.encode(svg);
    	resultCallback( svg, base64Content);
    }
});