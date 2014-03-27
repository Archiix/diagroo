/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.layout.anchor.ConnectionAnchor
 *  An object to which a {@link draw2d.Connection} will be anchored.
 *  
 * @inheritable
 * @author Andreas Herz
 */
draw2d.layout.anchor.ConnectionAnchor = Class.extend({
    NAME : "draw2d.layout.anchor.ConnectionAnchor",

    /**
     * @constructor
     * 
     * @param {draw2d.Figure} [owner] the figure to use for the anchor calculation 
     */
    init:function(owner){
        this.owner = owner;
    },

    /**
     * @method
     * Returns the location where the Connection should be anchored in absolute coordinates. 
     * The anchor may use the given reference Point to calculate this location.
     * 
     * @param
     * @return {Number} reference The reference Point in absolute coordinates
     */
    getLocation:function(reference)
    {
       // return the center of the owner/port.
       return this.getReferencePoint();
    },
    
    /**
     * @method
     * Returns the Figure that contains this ConnectionAnchor.
     * 
     * @return {draw2d.Figure} The Figure that contains this ConnectionAnchor
     */
    getOwner:function()
    {
       return this.owner;
    },
    
    /**
     * @method
     * Set the owner of the Anchor.
     * 
     * @param {draw2d.Figure} owner the new owner of the anchor locator
     */
    setOwner:function( owner)
    {
    	if(typeof owner ==="undefined"){
    		throw "Missing parameter for 'owner' in ConnectionAnchor.setOwner";
    	}
        this.owner=owner;
    },
    
    /**
     * @method
     * Returns the bounds of this Anchor's owner.  Subclasses can override this method
     * to adjust the box. Maybe you return the box of the port parent (the parent figure)
     *
     * @return {draw2d.geo.Rectangle} The bounds of this Anchor's owner
     */
    getBox:function()
    {
      return this.getOwner().getAbsoluteBounds();
    },
    
    /**
     * @method
     * Returns the reference point for this anchor in absolute coordinates. This might be used
     * by another anchor to determine its own location.
     * 
     * @return {draw2d.geo.Point} The reference Point
     */
    getReferencePoint:function()
    {
       return this.getOwner().getAbsolutePosition();
    }
});