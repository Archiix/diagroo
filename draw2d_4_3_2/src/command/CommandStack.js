/*****************************************
 *   Library is under GPL License (GPL)
 *   Copyright (c) 2012 Andreas Herz
 ****************************************/
/**
 * @class draw2d.command.CommandStack
 * Stack for undo/redo operations
 */
draw2d.command.CommandStack = Class.extend({
    NAME : "draw2d.command.CommandStack", 


    /**
     * @constructor
     * Create a new CommandStack objects which can be execute via the CommandStack.
     * 
     */
    init : function( ) {
       this.undostack = [];
       this.redostack = [];
       this.maxundo = 50;
       this.transactionCommand = null;
       this.eventListeners = new draw2d.util.ArrayList();
       
       window.onpopstate = $.proxy(function(event) {
    	   if( event.state === null){
    		   return;
    	   }
    	   
    	   /*
    	   var stackLegth = event.state.length;
    	   console.log(stackLegth +"<="+ this.undostack.length );
    	   if(stackLegth <= this.undostack.length ){
    		   console.log("Back");
    		   this.undo();
    	   }
    	   else{
    		   console.log("Forward");
    		   this.redo();
    	   }
    	   console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
    	   */
       },this);
    },
    
 
    /**
     * @method
     * Set the maximal undo stack size. Entries will be remove if the max. stack 
     * size has been reached.
     *
     * @param {Number} count The maximal undo stack size.
     * 
     **/
    setUndoLimit:function( count)
    {
      this.maxundo = count;
    },
    
    /**
     * @method
     * Remove the undo / redo history. This is useful if the user has been save the 
     * document.
     *
     **/
    markSaveLocation:function()
    {
       this.undostack = [];
       this.redostack = [];

       // fire an empty command to inform all listener that the stack has been changed
       this.notifyListeners(new draw2d.command.Command(), draw2d.command.CommandStack.POST_EXECUTE);
    },
    
    /**
     * @method
     * 
     * Executes the specified Command if possible. Prior to executing the command, a
     * draw2d.command.CommandStackEvent for {@link #PRE_EXECUTE} will be fired to event listeners. 
     * Similarly, after attempting to execute the command, an event for {@link #POST_EXECUTE}
     * will be fired.
     *
     * @param {draw2d.command.Command} command The command to execute.
     * 
     **/
    execute:function(command)
    {
        if(typeof command === "undefined")
            throw "Missing parameter [command] for method call CommandStack.execute";
        
       // nothing to do
       if(command===null)
          return; //silently
    
       // return if the command can't execute or it doesn't change the model
       // => Empty command
       if(command.canExecute()===false)
          return;
    
       // A command stack transaction is open.
       // The execution will be postpone until the transaction will commit
       //
       if(this.transactionCommand!==null){
           this.transactionCommand.add(command);
           return;
       }
       
       this.notifyListeners(command, draw2d.command.CommandStack.PRE_EXECUTE);
    
       this.undostack.push(command);
       command.execute();
    
       // cleanup the redo stack if the user execute a new command.
       // I think this will create a "clean" behaviour of the unde/redo mechanism.
       //
       this.redostack = [];
    
       // monitor the max. undo stack size
       //
       if(this.undostack.length > this.maxundo)
       {
          this.undostack = this.undostack.slice(this.undostack.length-this.maxundo);
       }
       this.notifyListeners(command, draw2d.command.CommandStack.POST_EXECUTE);
       
//       window.history.pushState({length: this.undostack.length}, "title 1", "?undo="+this.undostack.length);
    },
    
    /**
     * @method
     * Opens a transaction for further multiple commands. If you execute a command all
     * {@ #execute} calls will be ignored until you commit the current transaction.
     * 
     * @param {String} commandLabel the label to show for the undo/redo operation
     * 
     * @since 4.0.0
     */
    startTransaction: function(commandLabel){
        this.transactionCommand = new draw2d.command.CommandCollection(commandLabel);
    },
    
    /**
     * @method
     * Commit the running transaction. All commands between the start/end of a transaction
     * can be undo/redo in a single step.
     * 
     * @since 4.0.0
     */
    commitTransaction: function(){
        if(this.transactionCommand===null){
            return;//silently
        }
        
        var cmd = this.transactionCommand;
        this.transactionCommand =null;
        this.execute(cmd);
    },
    
    /**
     * @method
     * Undo on command from the stack and store them on the redo command stack.
     *
     **/
    undo:function()
    {
       var command = this.undostack.pop();
       if(command)
       {
          this.notifyListeners(command, draw2d.command.CommandStack.PRE_UNDO);
          this.redostack.push(command);
          command.undo();
          this.notifyListeners(command, draw2d.command.CommandStack.POST_UNDO);
       }
    },
    
    /** 
     * @method
     * Redo a command after the user has undo a command
     *
     **/
    redo:function()
    {
       var command = this.redostack.pop();
    
       if(command)
       {
          this.notifyListeners(command, draw2d.command.CommandStack.PRE_REDO);
          this.undostack.push(command);
          command.redo();
          this.notifyListeners(command, draw2d.command.CommandStack.POST_REDO);
       }
    },
    
    /**
     * @method
     * Return the label of the next REDO command.
     *
     * @return {String}
    **/
    getRedoLabel:function()
    {
       if(this.redostack.length===0)
         return "";
         
       var command = this.redostack[this.redostack.length-1];
    
       if(command)
       {
          return command.getLabel();
       }
       return "";
    },
    
    
    /**
     * @method
     * Return the label of the next UNDO command.
     *
     * @return {String}
     **/
    getUndoLabel:function()
    {
       if(this.undostack.length===0)
         return "";
         
       var command = this.undostack[this.undostack.length-1];
    
       if(command)
       {
          return command.getLabel();
       }
       return "";
    },
    
    
    /**
     * @method
     * Indicates whenever a REDO is possible.
     * 
     * @return boolean <code>true</code> if it is appropriate to call {@link #redo()}.
     */
    canRedo:function()
    {
       return this.redostack.length>0;
    },
    
    /**
     * @method 
     * indicator whenever a undo is possible.
     * 
     * @return {boolean} <code>true</code> if {@link #undo()} can be called
     **/ 
    canUndo:function()
    {
       return this.undostack.length>0;
    },
    
    /**
     * @method
     * Adds a listener to the command stack, which will be notified whenever a command has been processed on the stack.
     * 
     * @param {draw2d.command.CommandStackEventListener} listener the listener to add.
     */
    addEventListener:function( listener)
    {
        if(listener instanceof draw2d.command.CommandStackEventListener){
          this.eventListeners.add(listener);
        }
        else if(typeof listener.stackChanged ==="function"){
          this.eventListeners.add(listener);
        }
        else if(typeof listener === "function"){
          this.eventListeners.add( {  stackChanged : listener });
        }
        else{
          throw "Object doesn't implement required callback interface [draw2d.command.CommandStackListener]";
        }
    },
    
    /**
     * @method
     * Removes a listener from the command stack.
     * 
     * @param {draw2d.command.CommandStackEventListener} listener the listener to remove.
     */
    removeEventListener:function(listener)
    {
        for (var i = 0; i < size; i++){
            var entry = this.eventListeners.get(i);
            if(entry ===listener || entry.stackChanged === listener){
                this.eventListeners.remove(entry);
                return;
            }
         }
    },
        
    /**
     * @method
     * Notifies command stack event listeners that the command stack has changed to the
     * specified state.
     * 
     * @param {draw2d.command.Command} command the command
     * @param {Number} state the current stack state
     *
     **/
    notifyListeners:function(command,  state)
    {
      var event = new draw2d.command.CommandStackEvent(this, command, state);
      var size = this.eventListeners.getSize();
      for (var i = 0; i < size; i++)
         this.eventListeners.get(i).stackChanged(event);
    }
});


/** Constant indicating notification prior to executing a command (value is 1).*/
draw2d.command.CommandStack.PRE_EXECUTE=1;
/** Constant indicating notification prior to redoing a command (value is 2).*/
draw2d.command.CommandStack.PRE_REDO=2;
/** Constant indicating notification prior to undoing a command (value is 4).*/
draw2d.command.CommandStack.PRE_UNDO=4;
/**  Constant indicating notification after a command has been executed (value is 8).*/
draw2d.command.CommandStack.POST_EXECUTE=8;
/** Constant indicating notification after a command has been redone (value is 16).*/
draw2d.command.CommandStack.POST_REDO=16;
/** Constant indicating notification after a command has been undone (value is 32).*/
draw2d.command.CommandStack.POST_UNDO=32;
/** Constant indicating notification after the stack has been (re)init (value is 64).*/
draw2d.command.CommandStack.POST_INIT=64;

draw2d.command.CommandStack.POST_MASK = draw2d.command.CommandStack.POST_EXECUTE | draw2d.command.CommandStack.POST_UNDO | draw2d.command.CommandStack.POST_REDO;
draw2d.command.CommandStack.PRE_MASK  = draw2d.command.CommandStack.PRE_EXECUTE  | draw2d.command.CommandStack.PRE_UNDO  |draw2d.command.CommandStack.PRE_REDO;


