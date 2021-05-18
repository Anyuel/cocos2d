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

        this.btnStart = new ccui.Button('res/startbtn.png','res/startbtnclicked.png','res/startbtn.png');
        this.btnStart.x = cc.winSize.width / 2;
        this.btnStart.y = 0.75 * cc.winSize.height / 2;
        this.btnStart.setScale(0.2);
        this.addChild(this.btnStart);
        this.btnStart.addClickEventListener(this.onSelectStart.bind(this));

        this.btnEasy = new ccui.Button('res/easybtn.png','res/easybtnclicked.png','res/easybtn.png');
        this.btnEasy.x = cc.winSize.width / 2 - 150;
        this.btnEasy.y = 0.75 * cc.winSize.height / 2;
        this.btnEasy.setScale(0.5);
        this.btnEasy.setVisible(false);
        this.addChild(this.btnEasy);
        this.btnEasy.addClickEventListener(this.onSelectEasy.bind(this));

        this.btnHard = new ccui.Button('res/hardbtn.png','res/hardbtnclicked.png','res/hardbtn.png');
        this.btnHard.x = cc.winSize.width / 2 + 150;
        this.btnHard.y = 0.75 * cc.winSize.height / 2;
        this.btnHard.setScale(0.5);
        this.btnHard.setVisible(false);
        this.addChild(this.btnHard);
        this.btnHard.addClickEventListener(this.onSelectHard.bind(this));

        var title = new cc.Sprite('res/title.png');
        title.x = cc.winSize.width / 2;
        title.y = 3.5 * cc.winSize.height / 5;
        title.setScale(1.5);
        this.addChild(title);
    },

    onEnter:function(){
        this._super();
    },
    onSelectStart:function()
    {
        this.btnStart.setVisible(false);
        this.btnEasy.setVisible(true);
        this.btnHard.setVisible(true);
    },
    onSelectEasy:function () {
        fr.view(ScreenGame, true);
    },
    onSelectHard: function () {
        fr.view(ScreenGame, false);
    }

});