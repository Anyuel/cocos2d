/**
 * Created by GSN on 7/6/2015.
 */

var ScreenMenu = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();

        var btnStart = gv.commonButton(200, 64, cc.winSize.width/2, 1*size.height/2,"Game Start");
        this.addChild(btnStart);
        btnStart.addClickEventListener(this.onSelectStart.bind(this));

        var titleText = gv.customText("SNAKE GAME", cc.winSize.width/2, 3.5*size.height/5, 60);
        this.addChild(titleText);


    },

    onEnter:function(){
        this._super();
    },
    onSelectStart:function(sender)
    {
        fr.view(ScreenGame);
    },

});