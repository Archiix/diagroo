/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************//**
 * @class draw2d.geo.Rectangle
 * 
 * Util class for geometrie handling.
 * 
 * @inheritable
 * @author Andreas Herz
 * 
 * @extends draw2d.geo.Point
 */
draw2d.geo.Rectangle = draw2d.geo.Point.extend({

    NAME : "draw2d.geo.Rectangle",
    
    /**
     * @constructor 
     * Creates a new Point object with the hands over coordinates.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    init : function( x, y,  w, h)
    {
    	this._super(x,y);
        this.w = w;
        this.h = h;
    },


    /**
     * @method
     * @private
     */
    adjustBoundary:function(){
        if(this.bx===null){
            return;
        }
        this.x = Math.min(Math.max(this.bx, this.x), this.bw-this.w);
        this.y = Math.min(Math.max(this.by, this.y), this.bh-this.h);
        this.w = Math.min(this.w, this.bw);
        this.h = Math.min(this.h, this.bh);
    },
    
	/**
	 * @method
	 * Resizes this Rectangle by the values supplied as input and returns this for 
	 * convenience. This Rectangle's width will become this.width + dw. This 
	 * Rectangle's height will become this.height + dh.
	 * <br>
	 * The method return the object itself. This allows you to do command chaining, where 
	 * you can perform multiple methods on the same elements.
	 *
	 *
	 * @param {Number} dw  Amount by which width is to be resized
	 * @param {Number} dh  Amount by which height is to be resized
	 * 
	 * @return  {draw2d.geo.Rectangle} The method return the object itself
	 **/
	resize:function(/*:int*/ dw, /*:int*/ dh)
	{
	  this.w +=dw;
	  this.h +=dh;
      this.adjustBoundary();
	  return this;
	},
	
    /**
     * @method
     * Scale this Rectangle by the values supplied as input and returns this for 
     * convenience. This Rectangle's width will become this.width + dw. This 
     * Rectangle's height will become this.height + dh. The top left corner moves
     * -dw/2, -dh/2
     * <br>
     * The method return the object itself. This allows you to do command chaining, where 
     * you can perform multiple methods on the same elements.
     *
     *
     * @param {Number} dw  Amount by which width is to be resized
     * @param {Number} dh  Amount by which height is to be resized
     * 
     * @return  {draw2d.geo.Rectangle} The method return the object itself
     **/
    scale:function( dw, dh)
    {
        
      this.w +=(dw);
      this.h +=(dh);
      this.x -=(dw/2);
      this.y -=(dh/2);
      this.adjustBoundary();
      return this;
    },
    
    /**
	 * Sets the parameters of this Rectangle from the Rectangle passed in and
	 * returns this for convenience.<br>
	 * <br>
	 * The method return the object itself. This allows you to do command chaining, where 
	 * you can perform multiple methods on the same elements.
	 *
	 * @param {draw2d.geo.Rectangle} Rectangle providing the bounding values
	 * 
	 * @return  {draw2d.geo.Rectangle} The method return the object itself
	 */
	setBounds:function( rect)
	{
	    this.setPosition(rect.x,rect.y);

	    this.w = rect.w;
	    this.h = rect.h;
	    
  	   return this;
	},
	
	/**
	 * @method
	 * Returns <code>true</code> if this Rectangle's width or height is less than or
	 * equal to 0.
	 * 
	 * @return {Boolean}
	 */
	isEmpty:function()
	{
	  return this.w <= 0 || this.h <= 0;
	},
	
	/**
	 * @method
	 * The width of the dimension element.
	 * 
	 * @return {Number}
	 **/
	getWidth:function()
	{
	  return this.w;
	},
	
	/**
	 * @method
	 * Set the new width of the rectangle.
	 * 
	 * @param {Number} w the new width of the rectangle
	 */
	setWidth: function(w){
      this.w = w;
      this.adjustBoundary();
      return this;
	},
	
	/**
	 * @method
	 * The height of the dimension element.
	 * 
	 * @return {Number}
	 **/
	getHeight:function()
	{
	  return this.h;
	},
    /**
     * @method
     * Set the new height of the rectangle.
     * 
     * @param {Number} h the new height of the rectangle
     */
    setHeight: function(h){
      this.h = h;
      this.adjustBoundary();
      return this;
    },	
    
    /**
     * @method
     * The x coordinate of the left corner.
     * 
     * @return {Number}
     **/
    getLeft:function()
    {
      return this.x;
    },
    
	/**
	 * @method
	 * The x coordinate of the right corner.
	 * 
	 * @return {Number}
	 **/
	getRight:function()
	{
	  return this.x+this.w;
	},
	
    /**
     * @method
     * The y coordinate of the top.
     * 
     *@return {Number}
     **/
    getTop:function()
    {
      return this.y;
    },
    
    /**
	 * @method
	 * The y coordinate of the bottom.
	 * 
	 *@return {Number}
	 **/
	getBottom:function()
	{
	  return this.y+this.h;
	},
	
	/**
	 * @method
	 * The top left corner of the dimension object.
	 * 
	 * @return {draw2d.geo.Point} a new point objects which holds the coordinates
	 **/
	getTopLeft:function()
	{
	  return new draw2d.geo.Point(this.x,this.y);
	},
	
    /**
     * @method
     * The top center coordinate of the dimension object.
     * 
     * @return {draw2d.geo.Point} a new point objects which holds the coordinates
     **/
    getTopCenter:function()
    {
      return new draw2d.geo.Point(this.x+(this.w/2),this.y);
    },

    /**
	 * @method
	 * The top right corner of the dimension object.
	 * 
	 * @return {draw2d.geo.Point} a new point objects which holds the coordinates
	 **/
	getTopRight:function()
	{
	  return new draw2d.geo.Point(this.x+this.w,this.y);
	},
		
	/**
	 * @method
	 * The bottom left corner of the dimension object.
	 * 
	 * @return {draw2d.geo.Point} a new point objects which holds the coordinates
	 **/
	getBottomLeft:function()
	{
	  return new draw2d.geo.Point(this.x,this.y+this.h);
	},
	
	/**
     * @method
     * The bottom center coordinate of the dimension object.
     * 
     * @return {draw2d.geo.Point} a new point objects which holds the coordinates
     **/
    getBottomCenter:function()
    {
      return new draw2d.geo.Point(this.x+(this.w/2),this.y+this.h);
    },
    
	/**
	 * @method
	 * The center of the dimension object
	 * 
	 * @return {draw2d.geo.Point} a new point which holds the center of the object
	 **/
	getCenter:function()
	{
	  return new draw2d.geo.Point(this.x+this.w/2,this.y+this.h/2);
	},
	
	
	/**
	 * @method
	 * Bottom right corner of the object
	 * 
	 * @return {draw2d.geo.Point} a new point which holds the bottom right corner
	 **/
	getBottomRight:function()
	{
	  return new draw2d.geo.Point(this.x+this.w,this.y+this.h);
	},
	
	/**
	 * @method
	 * Return all points of the rectangle as array. Starting at topLeft and the
	 * clockwise.
	 * 
	 * @return {draw2d.util.ArrayList} the points starting at top/left and the clockwise
	 */
	getVertices:function()
	{
	    var result = new draw2d.util.ArrayList();
        result.add(this.getTopLeft());
        result.add(this.getTopRight());
        result.add(this.getBottomRight());
        result.add(this.getBottomLeft());

        return result;
	},
	/* @deprecated */
	getPoints: function(){return this.getVertices();},
	
	/**
	 * @method
	 * Return a new rectangle which fits into this rectangle. <b>ONLY</b> the x/y coordinates
	 * will be changed. Not the dimension of the given rectangle.
	 * 
	 * @param {draw2d.geo.Rectangle} rect the rectangle to adjust
	 * @return the new shifted rectangle
	 */
	moveInside: function(rect){
	    var newRect = new draw2d.geo.Rectangle(rect.x,rect.y,rect.w,rect.h);
	    // shift the coordinate right/down if coordinate not inside the rect
	    //
	    newRect.x= Math.max(newRect.x,this.x);
	    newRect.y= Math.max(newRect.y,this.y);
	    
	    // ensure that the right border is inside this rect (if possible). 
	    //
	    if(newRect.w<this.w){
	        newRect.x = Math.min(newRect.x+newRect.w, this.x+this.w)-newRect.w; 
	    }
	    else{
	        newRect.x = this.x;
	    }
	    
	    // ensure that the bottom is inside this rectangle
	    //
        if(newRect.h<this.h){
            newRect.y = Math.min(newRect.y+newRect.h, this.y+this.h)-newRect.h; 
        }
        else{
            newRect.y = this.y;
        }

        return newRect;
	},
	
	/**
	 * @method
	 * Return the minimum distance of this rectangle to the given {@link draw2d.geo.Point} or 
	 * {link draw2d.geo.Rectangle}.
	 * 
	 * @param {draw2d.geo.Point} pointOrRectangle the reference point/rectangle for the distance calculation
	 */
	getDistance: function (pointOrRectangle){
		var cx = this.x;
		var cy = this.y;
		var cw = this.w;
		var ch = this.h;
		
		var ox = pointOrRectangle.getX();
		var oy = pointOrRectangle.getY();
		var ow = 1;
		var oh = 1;
		
		if(pointOrRectangle instanceof draw2d.geo.Rectangle){
			ow = pointOrRectangle.getWidth();
			oh = pointOrRectangle.getHeight();
		}
		var oct=9;

		// Determin Octant
		//
		// 0 | 1 | 2
		// __|___|__
		// 7 | 9 | 3
		// __|___|__
		// 6 | 5 | 4

		if(cx + cw <= ox){
			if((cy + ch) <= oy){
				oct = 0;
			}
			else if(cy >= (oy + oh)){
				oct = 6;
			}
			else{
				oct = 7;
			}
	    }
		else if(cx >= ox + ow){
			if(cy + ch <= oy){
				oct = 2;
			}
			else if(cy >= oy + oh){
				oct = 4;
			}
			else{
				oct = 3;
			}
		}
		else if(cy + ch <= oy){
			oct = 1;
		}
		else if(cy >= oy + oh){
			oct = 5;
		}
		else{
			return 0;
		}


		// Determin Distance based on Quad
		//
		switch( oct){
			case 0:
				cx = (cx + cw) - ox;
				cy = (cy + ch) - oy;
				return -(cx + cy) ;
			case 1:
				return -((cy + ch) - oy);
			case 2:
				cx = (ox + ow) - cx;
				cy = (cy + ch) - oy;
				return -(cx + cy);
			case 3:
				return -((ox + ow) - cx);
			case 4:
				cx = (ox + ow) - cx;
				cy = (oy + oh) - cy;
				return -(cx + cy);
			case 5:
				return -((oy + oh) - cy);
			case 6:
				cx = (cx + cw) - ox;
				cy = (oy + oh) - cy;
				return -(cx + cy);
			case 7:
				return -((cx + cw) - ox);
		}

		throw "Unknown data type of parameter for distance calculation in draw2d.geo.Rectangle.getDistnace(..)";
	},
	
    
    /**
     * @method
     * Determin Octant
     *
     *    0 | 1 | 2
     *    __|___|__
     *    7 | 8 | 3
     *    __|___|__
     *    6 | 5 | 4
     *
     * @param r1
     * @param r2

     * @returns {Number}
     */
    determineOctant: function( r2){
        
        var HISTERESE= 3; // Tolleranz um diese vermieden wird, dass der Octant "8" zurückgegeben wird
        
        var ox = this.x+HISTERESE;
        var oy = this.y+HISTERESE;
        var ow = this.w-(HISTERESE*2);
        var oh = this.h-(HISTERESE*2);
         
        var cx = r2.x;
        var cy = r2.y;
        var cw = 2;
        var ch = 2;
        if(r2 instanceof draw2d.geo.Rectangle){
            cw = r2.w;
            ch = r2.h;
        }
 
        var oct =0;

        if(cx + cw <= ox){
            if((cy + ch) <= oy){
                oct = 0;
            }
            else if(cy >= (oy + oh)){
                oct = 6;
            }
            else{
                oct = 7;
            }
        }
        else if(cx >= ox + ow){
            if(cy + ch <= oy){
                oct = 2;
            }
            else if(cy >= oy + oh){
                oct = 4;
            }
            else{
                oct = 3;
            }
        }
        else if(cy + ch <= oy){
            oct = 1;
        }
        else if(cy >= oy + oh){
            oct = 5;
        }
        else{
            oct= 8;
        }
        
        return oct;
    },
  
    
    /**
     * @method
     * Returns the direction the point <i>p</i> is in relation to the given rectangle.
     * Util method for inherit router implementations.
     * 
     * <p>
     * Possible values:
     * <ul>
     *   <li>up -&gt; 0</li>
     *   <li>right -&gt; 1</li>
     *   <li>down -&gt; 2</li>
     *   <li>left -&gt; 3</li>
     * </ul>
     * <p>
     * 
     * @param {draw2d.geo.Point} p the point in relation to the given rectangle
     * 
     * @return {Number} the direction from <i>r</i> to <i>p</i>
     */
    getDirection:function(other) 
    {
        var current = this.getTopLeft();
        switch(this.determineOctant(other)){
            case 0:
                if((current.x-other.x)<(current.y-other.y))
                    return draw2d.geo.Rectangle.DIRECTION_UP;
                return draw2d.geo.Rectangle.DIRECTION_LEFT;
            case 1:
                return draw2d.geo.Rectangle.DIRECTION_UP;
            case 2:
                current = this.getTopRight();
                if((other.x-current.x)<(current.y-other.y))
                    return draw2d.geo.Rectangle.DIRECTION_UP;
                return draw2d.geo.Rectangle.DIRECTION_RIGHT;
            case 3:
                return draw2d.geo.Rectangle.DIRECTION_RIGHT;
            case 4:
                current = this.getBottomRight();
                if((other.x-current.x)<(other.y-current.y))
                    return draw2d.geo.Rectangle.DIRECTION_DOWN;
                return draw2d.geo.Rectangle.DIRECTION_RIGHT;
            case 5:
                return draw2d.geo.Rectangle.DIRECTION_DOWN;
            case 6:
                current = this.getBottomLeft();
                if((current.x-other.x)<(other.y-current.y))
                    return draw2d.geo.Rectangle.DIRECTION_DOWN;
                return draw2d.geo.Rectangle.DIRECTION_LEFT;
            case 7:
                return draw2d.geo.Rectangle.DIRECTION_LEFT;
            case 8: 
                if(other.y>this.y){
                    return draw2d.geo.Rectangle.DIRECTION_DOWN;
                }
                return draw2d.geo.Rectangle.DIRECTION_UP;
            
        }
        return draw2d.geo.Rectangle.DIRECTION_UP;
    },
    
    
	/**
	 * @method
	 * Compares two Dimension objects
	 * 
	 * @param {draw2d.geo.Rectangle} o
	 *@return {Boolean}
	 **/
	equals:function( o)
	{
	  return this.x==o.x && this.y==o.y && this.w==o.w && this.h==o.h;
	},
	
    /**
     * @method
     * Detect whenever the hands over coordinate is inside the figure.
     *
     * @param {Number/draw2d.geo.Point} iX
     * @param {Number} iY
     * @returns {Boolean}
     */
    hitTest : function ( iX , iY)
    {
    	if(iX instanceof draw2d.geo.Point){
    		iY = iX.y;
    		iX = iX.x;
    	}
        var iX2 = this.x + this.getWidth();
        var iY2 = this.y + this.getHeight();
        return (iX >= this.x && iX <= iX2 && iY >= this.y && iY <= iY2);
    },
    
    /**
     * @method
     * return true if the this rectangle inside the hand over rectangle
     * 
     *
     * @param {draw2d.geo.Rectangle} rect
     * @returns {Boolean}
     */
    isInside : function ( rect)
    {
       	return    rect.hitTest(this.getTopLeft()) 
    	       && rect.hitTest(this.getTopRight())
    	       && rect.hitTest(this.getBottomLeft()) 
    	       && rect.hitTest(this.getBottomRight());
    },
    
    intersects: function (rect)
    {
        x11 = rect.x,
        y11 = rect.y,
        x12 = rect.x + rect.w,
        y12 = rect.y + rect.h,
        x21 = this.x,
        y21 = this.y,
        x22 = this.x + this.w,
        y22 = this.y + this.h;
  
        x_overlap = Math.max(0, Math.min(x12,x22) - Math.max(x11,x21));
        y_overlap = Math.max(0, Math.min(y12,y22) - Math.max(y11,y21));
 
        return x_overlap*y_overlap!==0;
    },
    
    toJSON : function(){
        return  { 
              width:this.w,
              height:this.h,
              x : this.x,
              y :this.y
          };
      }


});

/**
 * ENUM for Direction
 */
draw2d.geo.Rectangle.DIRECTION_UP    =0;
draw2d.geo.Rectangle.DIRECTION_RIGHT =1;
draw2d.geo.Rectangle.DIRECTION_DOWN  =2;
draw2d.geo.Rectangle.DIRECTION_LEFT  =3;