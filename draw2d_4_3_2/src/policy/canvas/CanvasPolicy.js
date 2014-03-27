/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.policy.canvas.CanvasPolicy
 * 
 *
 * @author Andreas Herz
 * @extends draw2d.policy.EditPolicy
 */
draw2d.policy.canvas.CanvasPolicy = draw2d.policy.EditPolicy.extend({

    NAME : "draw2d.policy.canvas.CanvasPolicy",
    
    /**
     * @constructor 
     * Creates a new Router object
     */
    init: function(){
        this._super();
    },
    
    onInstall: function(canvas){
    },
    
    onUninstall: function(canvas){
    },
    
    /**
     * @method
     * Called by the canvas if the user click on a figure.
     * 
     * @param {draw2d.Figure} the figure under the click event. Can be null
     * @param {Number} mouseX the x coordinate of the mouse during the click event
     * @param {Number} mouseY the y coordinate of the mouse during the click event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * 
     * @since 3.0.0
     * 
     * @template
     */
    onClick: function(figure, mouseX, mouseY, shiftKey, ctrlKey){
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse event
     * @param {Number} y the y-coordinate of the mouse event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @template
     */
    onMouseMove:function(canvas, x, y, shiftKey, ctrlKey){
    },
    
    /**
     * @method
     * Called by the canvas if the user double click on a figure.
     * 
     * @param {draw2d.Figure} the figure under the double click event. Can be null
     * @param {Number} mouseX the x coordinate of the mouse during the click event
     * @param {Number} mouseY the y coordinate of the mouse during the click event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * 
     * @since 4.1.0
     * 
     * @template
     */
    onDoubleClick: function(figure, mouseX, mouseY, shiftKey, ctrlKey){
    },
    
    
    /**
     * @method
     * Adjust the coordinates to the given constraint.
     * 
     * @param figure
     * @param {draw2d.geo.Point} clientPos
     * @returns {draw2d.geo.Point} the contraint position of th efigure
     */
    snap: function(canvas, figure, clientPos){
        return clientPos;
    },

    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse down event
     * @param {Number} y the y-coordinate of the mouse down event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     */
    onMouseDown:function(canvas, x, y, shiftKey, ctrlKey){
        
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} dx The x diff between start of dragging and this event
     * @param {Number} dy The y diff between start of dragging and this event
     * @param {Number} dx2 The x diff since the last call of this dragging operation
     * @param {Number} dy2 The y diff since the last call of this dragging operation
     * @template
     */
    onMouseDrag:function(canvas, dx, dy, dx2, dy2){
        
    },
    
    /**
     * @method
     * 
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse down event
     * @param {Number} y the y-coordinate of the mouse down event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @template
     */
    onMouseUp: function(figure, x, y, shiftKey, ctrlKey){
        
    },
    
    
    /**
     * @method
     * Helper method to make an monochrome GIF image WxH pixels big, first create a properly sized array: var pixels = new Array(W*H);. 
     * Then, for each pixel X,Y that should be opaque, store a 1 at the proper location: pixels[X+Y*W] = 1;. 
     * Finally, create the image: var my_glif = createGif(W, H, pixels, color);
     * "0" pixels are transparent.
     * The <b>color</b> defines the foreground color.
     * 
     * Now, you can specify this image as the SRC attribute of an IMG tag: document.write("<IMG SRC=\"" + my_glif + "\">"); 
     * or for the canvas as background-image css attribute.
     *  
     * 
     * @param w
     * @param h
     * @param d
     * @param color
     * @returns {String}
     */
    createMonochromGif: function(w,h,d,color) {
        var r = String.fromCharCode(w%256) + String.fromCharCode(w/256) + String.fromCharCode(h%256) + String.fromCharCode(h/256) ;
        var gif = "GIF89a" + r + "\xf0\0\0\xff\xff\xff" + String.fromCharCode(color.red) + String.fromCharCode(color.green) + String.fromCharCode(color.blue) + "\x21\xf9\4\1\0\0\0\0,\0\0\0\0" + r + "\0\2";

        // help method to generate uncompressed in memory GIF data structur without the usage of a canvas or any other
        // heavy weight stuff.
        var b = { 
                bit: 1,
                byte_: 0,
                data : "",
    
            writeBit: function(b) {
                if(b) this.byte_ |= this.bit;
                this.bit <<= 1;
                if(this.bit == 256) {
                    this.bit = 1;
                    this.data += String.fromCharCode(this.byte_);
                    this.byte_ = 0;
                }
            },
            
            get:function() {
                var result = "";
                var data = this.data;
                if(this.bit != 1) { data += String.fromCharCode(this.byte_); }
                for(var i=0; i<data.length + 1; i+=255) {
                    chunklen = data.length - i; if(chunklen < 0) chunklen = 0;
                    if(chunklen > 255) chunklen=255;
                    result += String.fromCharCode(chunklen) + data.substring(i,i+255);
                }
                return result + "\0";
            }
        };
        
        for(var y=0; y<h; y++) {
            for(var x=0; x<w; x++) {
                b.writeBit(d[x+w*y]); b.writeBit(0); b.writeBit(0);
                b.writeBit(0); b.writeBit(0); b.writeBit(1);
            }
        }
        gif += b.get() + ";" ;

        return "data:image/gif;base64," + draw2d.util.Base64.encode(gif);
    }
    
});
