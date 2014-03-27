/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.shape.pert.Activity
 * 
 * NOT FOR PRODUCTIVE
 * 
 * Checkout [Wikipedia PERT][1] for more information.
 * 
 * Double click on the Task name or the top middle number to change the value.
 * 
 * See the example:
 *
 *     @example preview small frame
 *     
 *     canvas.addFigure( new draw2d.shape.pert.Activity,10,10);
 *     canvas.addFigure( new draw2d.shape.pert.Activity,80,130);
 *     canvas.addFigure( new draw2d.shape.pert.Activity,180,50);
 *     
 * [1] http://en.wikipedia.org/wiki/Program_Evaluation_and_Review_Technique
 * 
 * @extends draw2d.shape.layout.VerticalLayout
 */
draw2d.shape.pert.Activity = draw2d.shape.layout.VerticalLayout.extend({

	NAME: "draw2d.shape.pert.Activity",
	
    init : function()
    {
        this._super();
        
        // shortcut for some callback methods to avoid $.proxy wrapper
        var _this = this;

        // persistence values for the activity
        // will be stored/read in the JSON
        this.mementoValues= {
                duration:null
        };
        
        // just some color attributes for the rendering/gradient
        this.lighterBgColor =null;
        this.darkerBgColor = null;
        this.setBackgroundColor("#f3f3f3");
        
        // UI representation
        this.setStroke(2);
        this.setColor(this.darkerBgColor);
        this.setRadius(5);
        
        
        // Compose the top row of the shape
        //
        var top = new draw2d.shape.layout.HorizontalLayout();
        top.setStroke(0);

        this.earlyStartLabel = this.createLabel("Early Start").setStroke(0);
        
        this.durationLabel =  new draw2d.shape.basic.Label("Duration");
        this.durationLabel.setStroke(1);
        this.durationLabel.setColor(this.darkerBgColor);
        this.durationLabel.setRadius(0);
        this.durationLabel.setBackgroundColor(null);
        this.durationLabel.setPadding(5);
        this.durationLabel.setColor(this.bgColor.darker(0.2));
        // duration label has a inplaceEditor for the value
        this.durationLabel.installEditor(new draw2d.ui.LabelEditor({
            onCommit: function(value){
                _this.setDuration(parseFloat(value));
            }
        }));
        
        this.earlyEndLabel = this.createLabel("Early End").setStroke(0);
        
        top.addFigure( this.earlyStartLabel);
        top.addFigure( this.durationLabel);
        top.addFigure( this.earlyEndLabel);
        
        
        // the middle part of the shape
        // This part contains the ports for the connection
        //
        this.activityLabel =  new draw2d.shape.basic.Label("Activity Name");
        this.activityLabel.setRadius(0);
        this.activityLabel.setPadding(10);
        this.activityLabel.setColor(this.darkerBgColor);
        this.activityLabel.setBackgroundColor(null);
        // direct editor for the label
        this.activityLabel.installEditor(new draw2d.ui.LabelInplaceEditor());
        
        this.inputPort  = this.activityLabel.createPort("input");
        this.inputPort.getActivity = function(){return _this;};
        this.inputPort.onConnect = function(){ _this.setDuration(_this.mementoValues.duration);};
        this.inputPort.onDisconnect = function(){ _this.setDuration(_this.mementoValues.duration);};
        this.inputPort.setValue=function(anyValue){ _this.setDuration(_this.mementoValues.duration);};
        
        this.outputPort = this.activityLabel.createPort("output");
        this.outputPort.getActivity = function(){return _this;};
        this.outputPort.onConnect = function(){ _this.setDuration(_this.mementoValues.duration);};
        this.outputPort.onDisconnect = function(){ _this.setDuration(_this.mementoValues.duration);};
       
        
        // the bottom of the activity shape
        //
        var bottom = new draw2d.shape.layout.HorizontalLayout();
        bottom.setStroke(0);
        
        this.lateStartLabel = this.createLabel("Late Start").setStroke(0);
        this.stackLabel     = this.createLabel("Stack");
        this.lateEndLabel   = this.createLabel("Late End").setStroke(0);
        
        bottom.addFigure( this.lateStartLabel);
        bottom.addFigure( this.stackLabel);
        bottom.addFigure( this.lateEndLabel);

        // finally compose the shape with top/middle/bottom in VerticalLayout
        //
        this.addFigure(top);
        this.addFigure(this.activityLabel);
        this.addFigure(bottom);
        

        // set some good default value for the activity
        //
        this.setDuration(1);
     },
     
     /**
      * @method
      * Set the duration for the activity. This triggers a complete recalculation of the complete
      * diagram. No further calls are required
      *  
      * @param {Number} duration the new Duration for the activity
      */
     setDuration:function(duration){
         
         if(this.mementoValues.duration !== duration){
             // store the new value
             this.mementoValues.duration = duration;
             
             // update the labels for duration
             this.durationLabel.setText(this.mementoValues.duration);
         }
         
         // calculate the earlyStart and latestEnd and set the labels
         //
         var start = this.getEarlyStart();
         
         this.earlyStartLabel.setText(start);
         this.earlyEndLabel.setText(start+this.mementoValues.duration);
         
         // notify all children that a parent value has been changed
         // Just knock on the inputPort...
         //
         var connections = this.outputPort.getConnections();
         connections.each($.proxy(function(i, conn){
             var targetPort = conn.getTarget();
             targetPort.setValue();
         },this));

         // propagate the lateFinish up to all parent nodes if we are a leaf
         //
         if(connections.getSize()===0){
             var lateFinish = parseFloat(this.earlyEndLabel.getText());
             this.setLateFinish(lateFinish);
         }
     },

     getEarlyEnd: function(){
         return this.getEarlyStart()+ this.mementoValues.duration;
     },
     
     getEarlyStart: function(){
         var latestEarlyEnd = 0;
         
         // retrieve the greatest "earlyStart" from all parent activities
         this.inputPort.getConnections().each(function(i,conn){
             var parentActivity = conn.getSource().getActivity();
             latestEarlyEnd = Math.max(latestEarlyEnd,parentActivity.getEarlyEnd());
         });
         
         return latestEarlyEnd;
     },

     setLateFinish: function(value){
         var lateStart = value-this.mementoValues.duration;
         
         this.lateEndLabel.setText(value);
         this.lateStartLabel.setText(lateStart);
         this.stackLabel.setText(lateStart-parseFloat(this.earlyStartLabel.getText()));
         
         var connections = this.inputPort.getConnections();
         connections.each($.proxy(function(i, conn){
             var sourcePort = conn.getSource();
             sourcePort.getActivity().setLateFinish(lateStart);
         },this));
         
     },
     
     /**
      * @method
      * help method to create some labels
      * 
      * @param {String} txt the label to display
      * @returns {draw2d.shape.basic.Label}
      */
     createLabel: function(txt){
    	 var label =new draw2d.shape.basic.Label(txt);
    	 label.setStroke(1);
    	 label.setColor(this.darkerBgColor);
    	 label.setRadius(0);
    	 label.setBackgroundColor(null);
    	 label.setPadding(5);
    	 label.setColor(this.bgColor.darker(0.2));
    	 label.onDoubleClick=function(angle){/* ignore them for the layout elements*/};
    	    
    	 return label;
     },
     
     /**
      * @method
      * Set the new background color of the figure. It is possible to hands over
      * <code>null</code> to set the background transparent.
      *
      * @param {draw2d.util.Color} color The new background color of the figure
      **/
      setBackgroundColor : function(color)
      {
         this._super(color);
         
         // calculate the new lighter and draker colors for the gradient
         //
         this.lighterBgColor=this.bgColor.lighter(0.2).hash();;
         this.darkerBgColor=this.bgColor.darker(0.2).hash();;
      },

     repaint : function(attributes)
     {

         // repaint can be blocked during deserialization and if the shape
         // not part of any canvas.
         //
         if (this.repaintBlocked === true || this.shape === null) {
             return;
         }

         
         if (typeof attributes === "undefined") {
             attributes = {};
         }

         if(this.getAlpha()<0.9){
             attributes.fill=this.bgColor.hash();
         }
         else{
             attributes.fill = ["90",this.bgColor.hash(),this.lighterBgColor].join("-");
         }

         
         this._super(attributes);
     }
});
