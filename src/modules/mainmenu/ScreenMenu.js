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

        var background = new cc.Sprite('res/snake_pass.jpg');
        background.anchorX = 0;
        background.anchorY = 0;
        this.addChild(background);

        var btnStart = new ccui.Button('res/startbtn.png','res/startbtnclicked.png','res/startbtn.png');
        btnStart.x = cc.winSize.width / 2;
        btnStart.y = 0.75 * cc.winSize.height / 2;
        btnStart.setScale(0.2);
        this.addChild(btnStart);
        btnStart.addClickEventListener(this.onSelectStart.bind(this));

        var title = new cc.Sprite('res/title.png');
        title.x = cc.winSize.width / 2;
        title.y = 3.5 * cc.winSize.height / 5;
        title.setScale(1.5);
        this.addChild(title);

        // var titleText = gv.customText("SNAKE GAME", cc.winSize.width/2, 3.5*size.height/5, 60);
        // this.addChild(titleText);


    },

    onEnter:function(){
        this._super();
    },
    onSelectStart:function(sender)
    {
        fr.view(ScreenGame);
    },

});