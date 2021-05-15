function InitGameState() {
    this.direction = 0;
    this.snake_dots = [];
    this.len = 2;
    this.apple = null;
    this.score = 0;
    this.speed = 2;
    this.time = 0;
    this.alive = 1;
}

var ScreenGame = cc.Layer.extend({
    ctor: function () {
        this._super();

        var size = cc.winSize;
        var margin = 10;
        var marginTop = 30;

        // init vars
        this.state = new InitGameState();
        this.screen = {
            border: {
                bottom_right: {
                    x: margin,
                    y: margin
                },
                top_left: {
                    x: size.width-margin,
                    y: size.height-marginTop
                }
            },
            grid: [30, 30]
        };
        this.screen.width = this.screen.border.top_left.x - this.screen.border.bottom_right.x;
        this.screen.height = this.screen.border.top_left.y - this.screen.border.bottom_right.y;
        this.screen.block = {
            x: this.screen.width/this.screen.grid[0],
            y: this.screen.height/this.screen.grid[1],
        }

        this.state.snake_dots.push(cc.p(this.screen.grid[0] / 2, this.screen.grid[1] / 2));
        this.snake_body = [];
        this.snake_Hbody = [];

        this.generatePrey();
        this.init();
    },

    init: function() {
        this._super();
        var size = cc.winSize;

        this.snake_pic = new cc.Sprite('res/snakepic.png', cc.rect(64*3,0, 64, 64));
        this.snake_pic.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.absolutePos(this.state.snake_dots[0]).x,
            y: this.absolutePos(this.state.snake_dots[0]).y
        })
        this.snake_pic.setScale(0.5);
        this.addChild(this.snake_pic);

        // show score
        this.score = new cc.LabelTTF('', 'Arial', 20);
        this.score.x = size.width / 2;
        this.score.y = size.height;
        this.score.anchorY = 1;
        this.addChild(this.score);

        // Game over
        this.gameOverText = gv.customText("GAME OVER!!", size.width/2, 3*size.height/5, 60);
        this.gameOverText.setVisible(false);
        this.addChild(this.gameOverText);

        // Return to menu
        this.menuBtn = gv.commonButton(200, 64, size.width/2, 2.3*size.height/5, "Go to Menu");
        this.addChild(this.menuBtn);
        this.menuBtn.setVisible(false);
        this.menuBtn.addClickEventListener(this.onMenuBtnClick.bind(this));

        this.drawBorder();
        this.updateDisplay();

        var self = this;
        if ('keyboard' in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    if (!self.state.alive) {
                        self.gameOver();
                    }
                    switch (key) {
                        case cc.KEY['up']:
                            if (self.state.direction === 2)
                                break;
                            else if (self.state.direction === 1)
                                self.snake_pic.runAction(cc.RotateBy(0,-90));
                            else if (self.state.direction === 3)
                                self.snake_pic.runAction(cc.RotateBy(0,90));
                            self.state.direction = 0;
                            break;
                        case cc.KEY['right']:
                            if (self.state.direction === 3)
                                break;
                            else if (self.state.direction === 0)
                                self.snake_pic.runAction(cc.RotateBy(0,90));
                            else if (self.state.direction === 2)
                                self.snake_pic.runAction(cc.RotateBy(0,-90));
                            self.state.direction = 1;
                            break;
                        case cc.KEY['down']:
                            if (self.state.direction === 0)
                                break;
                            else if (self.state.direction === 1)
                                self.snake_pic.runAction(cc.RotateBy(0,90));
                            else if (self.state.direction === 3)
                                self.snake_pic.runAction(cc.RotateBy(0,-90));
                            self.state.direction = 2;
                            break;
                        case cc.KEY['left']:
                            if (self.state.direction === 0)
                                self.snake_pic.runAction(cc.RotateBy(0,-90));
                            else if (self.state.direction === 2)
                                self.snake_pic.runAction(cc.RotateBy(0,90));
                            else if (self.state.direction === 1)
                                break;
                            self.state.direction = 3;
                            break;
                        default:
                            break;
                    }
                },
                onKeyReleased: function (key, event) {}
            }, this);
        }

        this.scheduleUpdate();
    },

    drawBorder: function() {
        var bdr = new cc.DrawNode();
        this.addChild(bdr);
        bdr.drawRect(this.screen.border.top_left, this.screen.border.bottom_right,null,2);
    },

    absolutePos: function(p) {
        return cc.p(
            p.x * this.screen.block.x + this.screen.border.bottom_right.x + this.screen.block.x/2,
            p.y * this.screen.block.y + this.screen.border.bottom_right.y + this.screen.block.y/2
        );
    },

    onMenuBtnClick: function () {
        fr.view(ScreenMenu);
    },

    updateDisplay: function() {
        // var dotSize = 5;

        // if (this.snake) {
        //     this.removeChild(this.snake);
        // }

        if (this.apple) {
            this.removeChild(this.apple);
        }

        // score
        this.score.setString('Score: ' + this.state.score);

        // snake
        // this.snake = new cc.DrawNode();
        // this.addChild(this.snake);

        if (this.snake_body.length < this.state.len) {
            var snake_tail = new cc.Sprite('res/snakepic.png', cc.rect(64*2,64, 64, 64))
            snake_tail.attr({
                anchorX: 0.5,
                anchorY: 0.5,
            })
            snake_tail.setScale(0.5);
            snake_tail.setVisible(false);
            this.addChild(snake_tail);
            this.snake_body.push(snake_tail);
        }

        if (this.snake_Hbody.length < this.state.len) {
            var snake_htail = new cc.Sprite('res/snakepic.png', cc.rect(64,0, 64, 64))
            snake_htail.attr({
                anchorX: 0.5,
                anchorY: 0.5,
            })
            snake_htail.setScale(0.5);
            snake_htail.setVisible(false);
            this.addChild(snake_htail);
            this.snake_Hbody.push(snake_htail);
        }


        for (var i = 0, len = this.state.snake_dots.length; i < len; ++i) {
            // this.snake.drawDot(this.absolutePos(this.state.snake_dots[i]),
            //     dotSize, cc.color(0,255,0));
            if (i < this.state.snake_dots.length - 1) {
                if (this.state.direction === 0 || this.state.direction === 2) {
                    this.snake_body[i].setVisible(true);
                    this.snake_Hbody[i].setVisible(false);
                    this.snake_body[i].setPosition(this.absolutePos(this.state.snake_dots[i]));
                }
                else {
                    this.snake_Hbody[i].setVisible(true);
                    this.snake_body[i].setVisible(false);
                    this.snake_Hbody[i].setPosition(this.absolutePos(this.state.snake_dots[i]));
                }
            }
        }

        this.apple = new cc.Sprite('res/snakepic.png', cc.rect(0,64*3,64,64));
        this.apple.attr({
            anchorX: 0.5,
            anchorY: 0.5,
            x: this.absolutePos(this.state.apple).x,
            y: this.absolutePos(this.state.apple).y
        })
        this.apple.setScale(0.5);
        this.addChild(this.apple);

    },
    generatePrey: function() {
        this.state.apple = cc.p(
            Math.floor(Math.random() * this.screen.grid[0]),
            Math.floor(Math.random() * this.screen.grid[1])
        )
    },
    gameOver: function() {
        this.state.alive = 0;
        this.gameOverText.setVisible(true);
        this.menuBtn.setVisible(true);
    },
    moveSnake: function() {
        var dots = this.state.snake_dots;
        var head = dots[dots.length - 1];
        head = cc.p(head.x, head.y);

        switch (this.state.direction) {
            case 0:
                this.snake_pic.runAction(cc.moveBy(0,cc.p(0,this.screen.block.y)));
                head.y += 1;
                break;
            case 1:
                this.snake_pic.runAction(cc.moveBy(0,cc.p(this.screen.block.x,0)));
                head.x += 1;
                break;
            case 2:
                this.snake_pic.runAction(cc.moveBy(0,cc.p(0,-this.screen.block.y)));
                head.y -= 1;
                break;
            case 3:
                this.snake_pic.runAction(cc.moveBy(0,cc.p(-this.screen.block.x,0)));
                head.x -= 1;
                break;
        }

        if (head.x < 0 || head.y < 0 || head.x >= this.screen.grid[0] || head.y >= this.screen.grid[1]) {
            this.gameOver();
        } else {
            dots.push(head);
        }

        for (var i = 0, len = dots.length - 1; i < len; ++i) {
            if (head.x === dots[i].x && head.y === dots[i].y) {
                this.gameOver();
                break;
            }
        }

        // Eating prey
        if (head.x === this.state.apple.x && head.y === this.state.apple.y) {
            this.state.score += 1;
            this.state.len += 1;
            this.state.speed += 0.1;
            this.generatePrey();
        }

        if (dots.length > this.state.len) {
            dots.shift();
        }
    },
    update: function(dt) {
        if (!this.state.alive) {
            return;
        }

        // move ref time in ms
        var baseTime = 0.35;

        this.state.time += dt;
        var inc = baseTime / this.state.speed;

        if (this.state.time >= inc) {
            this.state.time -= inc;
            this.moveSnake();
            this.updateDisplay();
        }
    }
});

