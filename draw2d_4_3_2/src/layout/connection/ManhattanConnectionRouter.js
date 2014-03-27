/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.connection.ManhattanConnectionRouter
 * Provides a {@link draw2d.Connection} with an orthogonal route between the Connection's source 
 * and target anchors.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     // Override the default connection type. This is used during drag&drop operations of ports.
 *     //
 *     draw2d.Connection.createConnection=function(sourcePort, targetPort){
 *        // return my special kind of connection
 *        var con = new draw2d.Connection();
 *        con.setRouter(new draw2d.layout.connection.ManhattanConnectionRouter());
 *        return con;
 *     };
 *     
 *     // create and add two nodes which contains Ports (In and OUT)
 *     //
 *     var start = new draw2d.shape.node.Start();
 *     var end   = new draw2d.shape.node.End();
        
 *     // ...add it to the canvas 
 *     canvas.addFigure( start, 50,50);
 *     canvas.addFigure( end, 230,80);
 *          
 *     // first Connection
 *     //
 *     var c = draw2d.Connection.createConnection();
 *     c.setSource(start.getOutputPort(0));
 *     c.setTarget(end.getInputPort(0));
 *     canvas.addFigure(c);
 * 
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends  draw2d.layout.connection.ConnectionRouter
 */
draw2d.layout.connection.ManhattanConnectionRouter = draw2d.layout.connection.ConnectionRouter.extend({
    NAME : "draw2d.layout.connection.ManhattanConnectionRouter",

	MINDIST : 20,
	TOL     : 0.1,
	TOLxTOL : 0.01,
    TOGGLE_DIST : 5,
    
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
	 * @param {draw2d.Connection} conn
     * @param {draw2d.util.ArrayList} oldVertices old/existing vertices of the Connection
	 */
	route:function( conn, oldVertices)
	{
	   var fromPt  = conn.getStartPoint();
	   var fromDir = conn.getSource().getConnectionDirection(conn, conn.getTarget());

       var toPt    = conn.getEndPoint();
	   var toDir   = conn.getTarget().getConnectionDirection(conn, conn.getSource());
	
	   // calculate the lines between the two points.
	   //
	   this._route(conn,toPt, toDir, fromPt, fromDir);
	   this._paint(conn);
	},
	
	/**
	 * @method
	 * Internal routing algorithm.
	 * 
	 * @private
	 * @param {draw2d.Connection} conn
	 * @param {draw2d.geo.Point} fromPt
	 * @param {Number} fromDir
	 * @param {draw2d.geo.Point} toPt
	 * @param {Number} toDir
	 */
	_route:function( conn, fromPt, fromDir, toPt, toDir)
	{
	   // fromPt is an x,y to start from.  
	   // fromDir is an angle that the first link must 
	   //
	   var UP   = draw2d.geo.Rectangle.DIRECTION_UP;
	   var RIGHT= draw2d.geo.Rectangle.DIRECTION_RIGHT;
	   var DOWN = draw2d.geo.Rectangle.DIRECTION_DOWN;
	   var LEFT = draw2d.geo.Rectangle.DIRECTION_LEFT;
	
	   var xDiff = fromPt.x - toPt.x;
	   var yDiff = fromPt.y - toPt.y;
	   var point;
	   var dir;
	
	   if (((xDiff * xDiff) < (this.TOLxTOL)) && ((yDiff * yDiff) < (this.TOLxTOL))) 
	   {
	      conn.addPoint(new draw2d.geo.Point(toPt.x, toPt.y));
	      return;
	   }
	
	   if (fromDir === LEFT) 
	   {
	      if ((xDiff > 0) && ((yDiff * yDiff) < this.TOL) && (toDir === RIGHT))
	      {
	         point = toPt;
	         dir = toDir;
	      } 
	      else 
	      {
	         if (xDiff < 0) 
	         {
	            point = new draw2d.geo.Point(fromPt.x - this.MINDIST, fromPt.y);
	         }
	         else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) 
	         {
	            point = new draw2d.geo.Point(toPt.x, fromPt.y);
	         }
	         else if (fromDir == toDir)
	         {
	            var pos = Math.min(fromPt.x, toPt.x) - this.MINDIST;
	            point = new draw2d.geo.Point(pos, fromPt.y);
	         }
	         else
	         {
	            point = new draw2d.geo.Point(fromPt.x - (xDiff / 2), fromPt.y);
	         }
	
	         if (yDiff > 0) 
	         {
	            dir = UP;
	         }
	         else
	         {
	            dir = DOWN;
	         }
	      }
	   }
	   else if (fromDir === RIGHT) 
	   {
	      if ((xDiff < 0) && ((yDiff * yDiff) < this.TOL)&& (toDir === LEFT)) 
	      {
	         point = toPt;
	         dir = toDir;
	      } 
	      else 
	      {
	         if (xDiff > 0) 
	         {
	           point = new draw2d.geo.Point(fromPt.x + this.MINDIST, fromPt.y);
	         } 
	         else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) 
	         {
	            point = new draw2d.geo.Point(toPt.x, fromPt.y);
	         } 
	         else if (fromDir === toDir) 
	         {
	            var pos = Math.max(fromPt.x, toPt.x) + this.MINDIST;
	            point = new draw2d.geo.Point(pos, fromPt.y);
	         } 
	         else 
	         {
	               point = new draw2d.geo.Point(fromPt.x - (xDiff / 2), fromPt.y);
	         }
	
	         if (yDiff > 0)
	         {
	            dir = UP;
	         }
	         else
	         {
	            dir = DOWN;
	         }
	      }
	   } 
	   else if (fromDir === DOWN) 
	   {
	      if (((xDiff * xDiff) < this.TOL) && (yDiff < 0)&& (toDir === UP)) 
	      {
	         point = toPt;
	         dir = toDir;
	      } 
	      else 
	      {
	         if (yDiff > 0) 
	         {
	            point = new draw2d.geo.Point(fromPt.x, fromPt.y + this.MINDIST);
	         } 
	         else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) 
	         {
	           point = new draw2d.geo.Point(fromPt.x, toPt.y);
	         } 
	         else if (fromDir === toDir) 
	         {
	            var pos = Math.max(fromPt.y, toPt.y) + this.MINDIST;
	            point = new draw2d.geo.Point(fromPt.x, pos);
	         } 
	         else 
	         {
	            point = new draw2d.geo.Point(fromPt.x, fromPt.y - (yDiff / 2));
	         }
	
	         if (xDiff > 0) 
	         {
	            dir = LEFT;
	         }
	         else 
	         {
	            dir = RIGHT;
	         }
	      }
	   } 
	   else if (fromDir === UP) 
	   {
	      if (((xDiff * xDiff) < this.TOL) && (yDiff > 0) && (toDir === DOWN))
	      {
	         point = toPt;
	         dir = toDir;
	      } 
	      else 
	      {
	         if (yDiff < 0) 
	         {
	            point = new draw2d.geo.Point(fromPt.x, fromPt.y - this.MINDIST);
	         } 
	         else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) 
	         {
	            point = new draw2d.geo.Point(fromPt.x, toPt.y);
	         } 
	         else if (fromDir === toDir) 
	         {
	            var pos = Math.min(fromPt.y, toPt.y) - this.MINDIST;
	            point = new draw2d.geo.Point(fromPt.x, pos);
	         } 
	         else 
	         {
	            point = new draw2d.geo.Point(fromPt.x, fromPt.y - (yDiff / 2));
	         }
	
	         if (xDiff > 0)
	         {
	            dir = LEFT;
	         }
	         else
	         {
	            dir = RIGHT;
	         }
	      }
	   }
	   this._route(conn,point, dir, toPt, toDir);
	   conn.addPoint(fromPt);
	}

});