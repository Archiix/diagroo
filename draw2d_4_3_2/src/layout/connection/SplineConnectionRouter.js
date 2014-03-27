/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.layout.connection.SplineConnectionRouter 
 * 
 * A MannhattanConnectionRouter with an spline interpolation between the bend points.
 * 
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.layout.connection.ManhattanConnectionRouter
 */
draw2d.layout.connection.SplineConnectionRouter = draw2d.layout.connection.ManhattanConnectionRouter.extend({

	NAME : "draw2d.layout.connection.SplineConnectionRouter",

    /**
     * @constructor Creates a new Router object
     */
    init : function()
    {
        this._super();

//        this.spline = new draw2d.util.spline.CatmullRomSpline();
        this.spline = new draw2d.util.spline.CubicSpline();
//        this.spline = new draw2d.util.spline.BezierSpline();
        
        this.MINDIST = 50,
        this.cheapRouter = null;
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
	 * Layout the hands over connection with the cubic spline calculation and manhattan routing
	 * 
	 * @param {draw2d.Connection} conn
     * @param {draw2d.util.ArrayList} oldVertices old/existing vertices of the Connection
	 */
    route : function(conn, oldVertices)
    {
    	var i=0;
		var fromPt  = conn.getStartPoint();
		var fromDir = conn.getSource().getConnectionDirection(conn, conn.getTarget());

		var toPt  = conn.getEndPoint();
		var toDir = conn.getTarget().getConnectionDirection(conn, conn.getSource());

		// calculate the manhatten bend points between start/end.
		//
		this._route(conn, toPt, toDir, fromPt, fromDir);

        var ps = conn.getVertices();

        conn.oldPoint=null;
        conn.lineSegments = new draw2d.util.ArrayList();
        conn.vertices     = new draw2d.util.ArrayList();
 
        var splinePoints = this.spline.generate(ps,8);
        splinePoints.each(function(i,e){
            conn.addPoint(e);
        });
        
        // calculate the path string for the SVG rendering
        //
        var ps = conn.getVertices();
        length = ps.getSize();
        var p = ps.get(0);
        var path = ["M",p.x," ",p.y];
        for( i=1;i<length;i++){
              p = ps.get(i);
              path.push("L", p.x, " ", p.y);
        }
        conn.svgPathString = path.join("");
    }
});