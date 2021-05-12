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

        var yBtn = 3*size.height/5;

        var btnDragonbones = gv.commonButton(200, 64, cc.winSize.width/2, yBtn,"Game Start");
        this.addChild(btnDragonbones);
        btnDragonbones.addClickEventListener(this.onSelectStart.bind(this));

    },
    onEnter:function(){
        this._super();
    },
    onSelectStart:function(sender)
    {
        fr.view(ScreenNetwork);
    },

});