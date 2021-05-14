function InitGameState() {
    this.direction = 0;
    this.snake_dots = [];
    this.len = 2;
    this.prey = null;
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
            grid: [40, 40]
        };
        this.screen.width = this.screen.border.top_left.x - this.screen.border.bottom_right.x;
        this.screen.height = this.screen.border.top_left.y - this.screen.border.bottom_right.y;
        this.screen.block = {
            x: this.screen.width/this.screen.grid[0],
            y: this.screen.height/this.screen.grid[1],
        }

        this.state.snake_dots.push(cc.p(this.screen.grid[0] / 2, this.screen.grid[1] / 2));

        this.generatePrey();
        this.init();
    },

    init: function() {
        this._super();
        var size = cc.winSize;

        // show score
        this.score = new cc.LabelTTF('', 'Arial', 20);
        this.score.x = size.width / 2;
        this.score.y = size.height;
        this.score.anchorY = 1;
        this.addChild(this.score);

        // Game over
        this.gameOverText = gv.customText(fr.Localization.text("GAME OVER!!"), size.width/2, 3*size.height/5, 60);
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
                        self.restart();
                    }

                    switch (key) {
                        case cc.KEY['up']:
                            self.state.dir = 0;
                            break;
                        case cc.KEY['right']:
                            self.state.dir = 1;
                            break;
                        case cc.KEY['down']:
                            self.state.dir = 2;
                            break;
                        case cc.KEY['left']:
                            self.state.dir = 3;
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
        var dotSize = 5;

        if (this.snake) {
            this.removeChild(this.snake);
        }

        if (this.prey) {
            this.removeChild(this.prey);
        }

        // score
        this.score.setString('Score: ' + this.state.score);

        // snake
        this.snake = new cc.DrawNode();
        this.addChild(this.snake);

        for (var i = 0, len = this.state.snake_dots.length; i < len; ++i) {
            this.snake.drawDot(this.absolutePos(this.state.snake_dots[i]),
                dotSize, cc.color(0,255,0));
        }

        this.prey = new cc.DrawNode();
        this.addChild(this.prey);

        this.snake.drawDot(this.absolutePos(this.state.prey),
            dotSize, cc.color(255,0,0));
    },
    generatePrey: function() {
        this.state.prey = cc.p(
            Math.floor(Math.random() * this.screen.grid[0]),
            Math.floor(Math.random() * this.screen.grid[1])
        )
    },
    showGameOver: function() {
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
                head.y += 1;
                break;
            case 1:
                head.x += 1;
                break;
            case 2:
                head.y -= 1;
                break;
            case 3:
                head.x -= 1;
                break;
        }

        // check bounds
        var g = this.screen.grid;
        if (head.x < 0 || head.y < 0 || head.x >= g[0] || head.y >= g[1]) {
            this.showGameOver();
        } else {
            dots.push(head);
        }

        // check collision with itself
        for (var i = 0, len = dots.length - 1; i < len; ++i) {
            if (head.x === dots[i].x && head.y === dots[i].y) {
                this.showGameOver();
                break;
            }
        }

        // adjust queue len
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

