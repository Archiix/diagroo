/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.io.png.Writer
 * Convert the canvas document into a PNG Image.
 * 
 *     // example how to create a PNG image and set an 
 *     // image src attribute.
 *     //
 *     var writer = new draw2d.io.png.Writer();
 *     writer.marshal(canvas, function(png){
 *         $("#preview").attr("src",png);
 *     });
 *
 * @author Andreas Herz
 * @extends draw2d.io.Writer
 */
draw2d.io.png.Writer = draw2d.io.Writer.extend({
    
    init:function(){
        this._super();
    },
    
    /**
     * @method
     * Export the content to the implemented data format. Inherit class implements
     * content specific writer.
     * <br>
     * <br>
     * 
     * Method signature has been changed from version 2.10.1 to version 3.0.0.<br>
     * The parameter <b>resultCallback</b> is required and new. The method calls
     * the callback instead of return the result.
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Function} resultCallback the method to call on success. The first argument is the dataUrl, the second is the base64 formated png image
     * @param {draw2d.geo.Rectangle} cropBoundingBox optional cropping/clipping bounding box 
     */
    marshal: function(canvas, resultCallback, cropBoundingBox){
        // I change the API signature from version 2.10.1 to 3.0.0. Throw an exception
        // if any application not care about this changes.
        if(typeof resultCallback === "undefined"){
            throw "Writer.marshal method signature has been change from version 2.10.1 to version 3.0.0. Please consult the API documentation about this issue.";
        }

        canvas.hideDecoration();

        var svg = canvas.getHtmlContainer().html().replace(/>\s+/g, ">").replace(/\s+</g, "<");
       
        // add missing namespace for images in SVG
        //
        svg = svg.replace("<svg ", "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" ");
        
        canvasDomNode= $('<canvas id="canvas_png_export_for_draw2d" style="display:none"></canvas>');
        $('body').append(canvasDomNode);
        fullSizeCanvas = $("#canvas_png_export_for_draw2d")[0];
        fullSizeCanvas.width = canvas.initialWidth;
        fullSizeCanvas.height = canvas.initialHeight;
          
        canvg("canvas_png_export_for_draw2d", svg, { 
            ignoreMouse: true, 
            ignoreAnimation: true,
            renderCallback : function(){
                try{
                   canvas.showDecoration();
    
                    if(typeof cropBoundingBox!=="undefined"){
                          var sourceX = cropBoundingBox.x;
                          var sourceY = cropBoundingBox.y;
                          var sourceWidth = cropBoundingBox.w;
                          var sourceHeight = cropBoundingBox.h;
                          
                          croppedCanvas = document.createElement('canvas');
                          croppedCanvas.width = sourceWidth;
                          croppedCanvas.height = sourceHeight;
                          
                          croppedCanvas.getContext("2d").drawImage(fullSizeCanvas, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0,sourceWidth, sourceHeight);

                          var dataUrl = croppedCanvas.toDataURL("image/png");
                          var base64Image = dataUrl.replace("data:image/png;base64,","");
                          resultCallback(dataUrl, base64Image);
                    }
                    else{
                        var img = fullSizeCanvas.toDataURL("image/png");
                        resultCallback(img,img.replace("data:image/png;base64,",""));
                    }
                }
                finally{
                    canvasDomNode.remove();
                }
           }
        }) ;   
    }
});