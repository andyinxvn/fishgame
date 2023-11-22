
cc.Class({
    extends: cc.Component,
    init(obj){
        this.RedT = obj;
    },
    onLoad () {
        this.ttOffset = null;
        this.open = false;
    },
    onEnable: function () {
        this.node.on(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
        this.node.on(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
        this.node.on(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
    },
    onDisable: function () {
        this.node.off(cc.Node.EventType.TOUCH_START,  this.eventStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,   this.eventMove,  this);
        this.node.off(cc.Node.EventType.TOUCH_END,    this.eventEnd,   this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd,   this);
        this.node.off(cc.Node.EventType.MOUSE_ENTER,  this.setTop,     this);
    },
    eventStart: function(e){
        this.setTop();
        this.open = false;
        this.ttOffset  = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
    },
    eventMove: function(e){
        this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
        if( (this.node.position.x >= 150 || this.node.position.x <= -150 || this.node.position.x>=200 || this.node.position.x<=-200) && this.open == false  ){
            this.RedT.results();
            this.open = true;
            this.active = false;
        }
    },
    eventEnd: function(){

    },
    setTop: function(){
        this.RedT.setTop();
    },
});
