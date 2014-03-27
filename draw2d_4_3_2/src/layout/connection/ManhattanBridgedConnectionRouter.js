/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.connection.ManhattanBridgedConnectionRouter
 * Provides a {@link draw2d.Connection} with an orthogonal route between the Connection's source 
 * and target anchors.
 * 
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends  draw2d.layout.connection.ManhattanConnectionRouter
 */
draw2d.layout.connection.ManhattanBridgedConnectionRouter = draw2d.layout.connection.ManhattanConnectionRouter.extend({
    NAME : "draw2d.layout.connection.ManhattanBridgedConnectionRouter",

	BRIDGE_HORIZONTAL_LR : " r 0 0 3 -4 7 -4 10 0 13 0 ", // Left to right
    BRIDGE_HORIZONTAL_RL : " r 0 0 -3 -4 -7 -4 -10 0 -13 0 ", // right to left
 
	/**
	 * @constructor 
	 * Creates a new Router object.
	 * 
	 */
    init: function(){
        this._super();
    },
    
    
    /**
     * @method
     * Callback method if the router has been assigned to a connection.
     * 
     * @param {draw2d.Connection} connection The assigned connection
     * @template
     * @since 2.7.2
     */
    onInstall: function(connection){
        connection.installEditPolicy(new draw2d.policy.line.LineSelectionFeedbackPolicy());
       
    },
 
	/**
	 * @method
	 * Layout the hands over connection in a manhattan like layout
	 * 
	 * @param {draw2d.Connection} conn the connection to layout
     * @param {draw2d.util.ArrayList} oldVertices old/existing vertices of the Connection
	 */
	route : function(conn, oldVertices) {
		var fromPt  = conn.getStartPoint();
		var fromDir = conn.getSource().getConnectionDirection(conn, conn.getTarget());

		var toPt  = conn.getEndPoint();
		var toDir = conn.getTarget().getConnectionDirection(conn, conn.getSource());

		// calculate the lines between the two points.
		//
		this._route(conn, toPt, toDir, fromPt, fromDir);

		// calculate the path string for the SVG rendering
		//
        var intersectionsASC = conn.getCanvas().getIntersection(conn).sort("x");
        var intersectionsDESC= intersectionsASC.clone().reverse();
        
        var intersectionForCalc = intersectionsASC;
		var i = 0;

		// ATTENTION: we cast all x/y coordinates to int and add 0.5 to avoid subpixel rendering of
		//            the connection. The 1px or 2px lines look much clearer than before.
		//
		var ps = conn.getVertices();
		var p = ps.get(0);
		var path = [ "M", (p.x|0)+0.5, " ", (p.y|0)+0.5 ];
		var oldP = p;
		for (i = 1; i < ps.getSize(); i++) {
			p = ps.get(i);
       
			// check for intersection and paint a bridge if required
			// line goes from left to right
			//
			var bridgeWidth = 5;
			var bridgeCode = this.BRIDGE_HORIZONTAL_LR;

			// line goes from right->left. Inverse the bridge and the bridgeWidth
			//
			if (oldP.x > p.x) {
				intersectionForCalc=intersectionsDESC;
				bridgeCode = this.BRIDGE_HORIZONTAL_RL;
				bridgeWidth = -bridgeWidth;
			}

			intersectionForCalc.each(function(ii, interP) {
				if (interP.justTouching ==false && draw2d.shape.basic.Line.hit(1, oldP.x, oldP.y, p.x, p.y, interP.x, interP.y) === true) {
					// we draw only horizontal bridges. Just a design decision
					//
					if (p.y === interP.y) {
						path.push(" L", ((interP.x - bridgeWidth)|0)+0.5, " ", (interP.y|0)+0.5);
						path.push(bridgeCode);
					}
				}

			});

			path.push(" L", (p.x|0)+0.5, " ", (p.y|0)+0.5);
			oldP = p;
		}
		conn.svgPathString = path.join("");
	}

});