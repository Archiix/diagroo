/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.io.Writer
 * Serialize the canvas to an external format. This is only a template/interface class.
 * Inherit classes must implement the export format.
 * 
 * @author Andreas Herz
 */
draw2d.io.Writer = Class.extend({
    
    /**
     * @constructor
     * @private
     */
    init:function(){
        
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
     * @template
     * @since 2.10.1
     * @param {draw2d.Canvas} canvas
     * @param {Function} resultCallback the method to call on success. The first argument is the result object, the second the base64 content of a corresponding file
     * @returns {Object}
     * 
     */
    marshal: function(canvas, resultCallback){
        // I change the API signature from version 2.10.1 to 3.0.0. Throw an exception
        // if any application not care about this changes.
        if(typeof resultCallback === "undefined"){
            throw "Writer.marshal method signature has been change from version 2.10.1 to version 3.0.0. Please consult the API documentation about this issue.";
        }
        
        
        resultCallback("", "");
    },
    
    /**
     * @method
     * utility method to format a given XML string.
     *
     * @param xml
     * @returns {String}
     */
    formatXml: function(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function(index, node) {
            var indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }
});