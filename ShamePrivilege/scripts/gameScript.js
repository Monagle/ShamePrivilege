var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Chubbo;
(function (Chubbo) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('preloadBar', 'img/loader.png');
        };

        Boot.prototype.create = function () {
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;

            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                //  If you have any desktop specific settings, they can go in here
                this.stage.scale.pageAlignHorizontally = true;
                //this.game.scale.pageAlignHorizontally = true;
            } else {
                //  Same goes for mobile settings.
            }

            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    Chubbo.Boot = Boot;
})(Chubbo || (Chubbo = {}));
var Chubbo;
(function (Chubbo) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            //  Set-up our preloader sprite
            this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            //  Load our actual games assets
            this.load.image('titlepage', 'img/titlepage.jpg');
            this.load.image('logo', 'img/logo.png');
            this.load.image('stars', 'img/stars.png');
            this.load.image('sky', 'img/sky.png');
            this.load.audio('flyingTheme', 'sfx/flyingTheme.m4a', true);

            //this.load.spritesheet('explode', 'img/explode.png', 64, 64, 25)
            this.load.spritesheet('woman', 'img/woman.png', 32, 32);
            this.load.spritesheet('asteroid', 'img/asteroid.png', 30, 30);
            this.load.spritesheet('bird', 'img/bird.png', 32, 24);
            this.load.image('level1', 'img/level1.png');

            //this.load.tilemap('test', 'img/test.json', Phaser.Tilemap.TILED_JSON);
            this.load.text('spritePositions', 'data/sky.txt');
            this.load.text('nugget', 'img/nugget.png');
        };

        Preloader.prototype.create = function () {
            this.loadLevelSprites();
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, true, true);
            tween.onComplete.add(this.startMainMenu, this);
        };

        Preloader.prototype.startMainMenu = function () {
            //this.game.state.start('MainMenu', true, false);
            this.game.state.start('Level1', true, false);
        };

        Preloader.prototype.loadLevelSprites = function () {
            //REPLACE THIS LATER!!!!
            var jsonData = JSON.parse(this.cache.getText('spritePositions').toString());

            var q = new Array();
            var container = jsonData;
            var sortedList = container.layers[0].objects.sort(function (n1, n2) {
                return (n2.height + n2.y) - (n1.height + n1.y);
            });
            container.layers[0].objects = sortedList;
            this.game.jsonData = jsonData;
        };

        Preloader.prototype.update = function () {
            if (this.cache.isSoundDecoded('flyingTheme')) {
                this.startMainMenu();
            }
        };
        return Preloader;
    })(Phaser.State);
    Chubbo.Preloader = Preloader;
})(Chubbo || (Chubbo = {}));
var Chubbo;
(function (Chubbo) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        MainMenu.prototype.create = function () {
            this.background = this.add.sprite(0, 0, 'titlepage');
            this.background.alpha = 0;

            //this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
            //this.logo.anchor.setTo(0.5, 0.5);
            this.add.tween(this.background).to({ alpha: 1 }, 2000, Phaser.Easing.Bounce.InOut, true);

            //this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
            this.input.onDown.addOnce(this.fadeOut, this);
        };

        MainMenu.prototype.fadeOut = function () {
            var tween = this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);

            // = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        };

        MainMenu.prototype.startGame = function () {
            this.game.state.start('Level1', true, false);
        };
        return MainMenu;
    })(Phaser.State);
    Chubbo.MainMenu = MainMenu;
})(Chubbo || (Chubbo = {}));
var Chubbo;
(function (Chubbo) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y) {
            _super.call(this, game, x, y, 'woman', 0);
            this.breakSpeed = 30;
            this.burstSpeed = 200;
            this.holdSpeed = 5;
            this.doubleTapTime = .5;
            this.burstCooldownLength = Phaser.Timer.SECOND * 3;
            this.shame = 0;
            this.privilege = 0;
            this.uiStyle = { 'font': '22px Helvetica', fill: '#D4B457' };

            this.anchor.setTo(0.5, 0.5);

            //this.animations.add('swim', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], 15, true);
            this.animations.add('swim', [1, 0, 2, 3, 2, 1], 5, true);
            this.animations.add('hurt', [0], 1, true);
            this.animations.add('burst', [0], 1, true);
            this.scale.setTo(1.75, 1.75);

            this.body.collideWorldBounds = true;

            this.body.bounce.setTo(0.5, 0.5);

            this.animations.play('swim');

            this.stunned = false;

            this.stunnedAnimation = this.game.add.tween(this).to({ alpha: .10 }, 1000, Phaser.Easing.Linear.None, false, 0, true);

            //KEYS
            this.game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(this.burstUp, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(this.burstDown, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.A).onDown.add(this.burstLeft, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add(this.burstRight, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(this.burstUp, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(this.burstDown, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(this.burstLeft, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(this.burstRight, this);

            this.shameDisplay = this.game.add.text(650, 10, "Shame: ", this.uiStyle);
            this.privilegeDisplay = this.game.add.text(650, 30, "Privilege: ", this.uiStyle);

            game.add.existing(this);
        }
        Player.prototype.update = function () {
            this.shameDisplay.content = "Shame: " + this.shame;
            this.privilegeDisplay.content = "Privilege: " + this.privilege;

            var control = this.game.input.keyboard;

            if (control.isDown(Phaser.Keyboard.UP) || control.isDown(Phaser.Keyboard.W)) {
                this.body.velocity.y -= this.holdSpeed;
            } else if (control.isDown(Phaser.Keyboard.DOWN) || control.isDown(Phaser.Keyboard.S)) {
                this.body.velocity.y += this.holdSpeed;
            }
            if (control.isDown(Phaser.Keyboard.LEFT) || control.isDown(Phaser.Keyboard.A)) {
                this.body.velocity.x -= this.holdSpeed;
            } else if (control.isDown(Phaser.Keyboard.RIGHT) || control.isDown(Phaser.Keyboard.D)) {
                this.body.velocity.x += this.holdSpeed;
            }

            this.orient();
        };

        Player.prototype.isStunned = function () {
            return this.stunned;
        };

        Player.prototype.recieveDamage = function (dmg) {
            this.shame += dmg;
            this.beginStun();
        };

        Player.prototype.gainPrivalege = function (privalege) {
            this.privilege += privalege;
        };

        Player.prototype.burstUp = function () {
            if (this.body.velocity.y >= 0) {
                this.body.velocity.y -= this.breakSpeed;
            } else if (!this.burstCooldown) {
                var sinceLast = this.game.time.elapsedSecondsSince(this.lastUp);
                if (sinceLast < this.doubleTapTime) {
                    this.body.velocity.y -= this.burstSpeed;
                    this.burstCooldown = true;
                    this.animations.play('burst');
                    this.game.time.events.add(this.burstCooldownLength, this.resetBoost, this);
                }
            }
            this.lastUp = this.game.time.now;
            this.lastDown = 0;
            this.lastLeft = 0;
            this.lastRight = 0;
        };

        Player.prototype.burstDown = function () {
            if (this.body.velocity.y <= 0) {
                this.body.velocity.y += this.breakSpeed;
            } else if (!this.burstCooldown) {
                var sinceLast = this.game.time.elapsedSecondsSince(this.lastDown);
                if (sinceLast < this.doubleTapTime) {
                    this.body.velocity.y += this.burstSpeed;
                    this.burstCooldown = true;
                    this.animations.play('burst');
                    this.game.time.events.add(this.burstCooldownLength, this.resetBoost, this);
                }
            }
            this.lastUp = 0;
            this.lastDown = this.game.time.now;
            this.lastLeft = 0;
            this.lastRight = 0;
        };

        Player.prototype.burstLeft = function () {
            if (this.body.velocity.x >= 0) {
                this.body.velocity.x -= this.breakSpeed;
            } else if (!this.burstCooldown) {
                var sinceLast = this.game.time.elapsedSecondsSince(this.lastLeft);
                if (sinceLast < this.doubleTapTime) {
                    this.body.velocity.x -= this.burstSpeed;
                    this.burstCooldown = true;
                    this.animations.play('burst');
                    this.game.time.events.add(this.burstCooldownLength, this.resetBoost, this);
                }
            }
            this.lastUp = 0;
            this.lastDown = 0;
            this.lastLeft = this.game.time.now;
            this.lastRight = 0;
        };

        Player.prototype.burstRight = function () {
            if (this.body.velocity.x <= 0) {
                this.body.velocity.x += this.breakSpeed;
            } else if (!this.burstCooldown) {
                var sinceLast = this.game.time.elapsedSecondsSince(this.lastRight);
                if (sinceLast < this.doubleTapTime) {
                    this.body.velocity.x += this.burstSpeed;
                    this.burstCooldown = true;
                    this.animations.play('burst');
                    this.game.time.events.add(this.burstCooldownLength, this.resetBoost, this);
                }
            }
            this.lastUp = 0;
            this.lastDown = 0;
            this.lastLeft = 0;
            this.lastRight = this.game.time.now;
        };

        Player.prototype.orient = function () {
            var section = this.game.state.getCurrentState().levelSection;
            if (section != 1 /* atmosphere */ && section != 0 /* sky */) {
                var rads = Math.atan2(this.body.velocity.x, -this.body.velocity.y);
                var degrees = rads * 180 / Math.PI;
                this.body.rotation = degrees;
            }
        };

        //private hitWall(thing) {
        //    this.body.velocity.x *= -1;
        //}
        Player.prototype.beginStun = function () {
            //this.alpha = .5;
            this.stunnedAnimation.start(0);
            this.stunned = true;
            this.animations.play('hurt');
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.endStun, this);
        };

        Player.prototype.endStun = function () {
            this.alpha = 1;
            this.animations.play('swim');
            this.stunnedAnimation.stop();
            this.stunned = false;
        };

        Player.prototype.resetBoost = function () {
            this.burstCooldown = false;
            this.animations.play('swim');
        };
        return Player;
    })(Phaser.Sprite);
    Chubbo.Player = Player;
})(Chubbo || (Chubbo = {}));
///<reference path="player.ts"/>
var Chubbo;
(function (Chubbo) {
    (function (LevelSection) {
        LevelSection[LevelSection["sky"] = 0] = "sky";
        LevelSection[LevelSection["atmosphere"] = 1] = "atmosphere";
        LevelSection[LevelSection["stars"] = 2] = "stars";
    })(Chubbo.LevelSection || (Chubbo.LevelSection = {}));
    var LevelSection = Chubbo.LevelSection;

    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
            this.levelSpeed = 5;
        }
        Level1.prototype.create = function () {
            //this.levelSection = Chubbo.LevelSection.sky;
            this.levelSection = 2 /* stars */;
            this.starfield = this.add.tileSprite(0, 0, 1024, 1024, 'stars');
            this.sky = this.add.tileSprite(0, 0, 800, 600, 'sky');

            this.world.setBounds(0, 0, 800, 600);

            this.music = new Chubbo.Music(this.game, 'flyingTheme', 1, false);

            this.game.sound.add(this.music);
            this.spritesExhausted = false;
            this.music.addMarker('gameplayStart', 30, 100, .5); //change middle to 5
            this.music.addMarker('test1', 36, 40, .5);
            this.music.addMarker('earthShows', 41, 256, .5);

            //this.music.play('gameplayStart');
            this.muteKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
            this.muteKey.onDown.add(this.ToggleMusic, this);

            this.debugKey = this.input.keyboard.addKey(Phaser.Keyboard.TILDE);
            this.debugKey.onDown.add(this.ToggleDebugDisplay, this);

            this.obstacles = this.game.add.group();

            var shameDisplay = this.player = new Chubbo.Player(this.game, 130, 284);

            var jsonData = this.game.jsonData;
            var container = jsonData;
            this.spriteQueue = container.layers[0].objects;
            this.mapLocation = container.layers[0].height;
            this.spritesExhausted = false;
            this.prepareNextSprite();
        };

        Level1.prototype.update = function () {
            this.checkSwitchSections();
            if (this.levelSection == 0 /* sky */) {
                this.sky.tilePosition.y += 15;
            } else if (this.levelSection == 1 /* atmosphere */) {
                this.sky.tilePosition.y += 15;
                this.sky.tilePosition.x += .5;
            }
            this.starfield.tilePosition.x += 0;
            this.starfield.tilePosition.y += 9;

            this.mapLocation -= this.levelSpeed;
            this.addSpritesByDistance();
            this.collideSprites();
        };

        Level1.prototype.checkSwitchSections = function () {
            switch (this.levelSection) {
                case 0 /* sky */:
                    if (this.mapLocation < 0) {
                        this.levelSection = 1 /* atmosphere */;
                        var t = this.add.tween(this.sky).to({ alpha: 0 }, 10000, Phaser.Easing.Linear.None, true);
                        t.onComplete.add(this.endSky, this);
                    }
                    break;
                case 2 /* stars */:
                    break;
            }
        };

        Level1.prototype.render = function () {
            if (this.debugToggle) {
                this.game.debug.renderText(this.game.time.fps.toString(), 32, 200);

                this.game.debug.renderPhysicsBody(this.player.body);
                this.game.debug.renderBodyInfo(this.player, 32, 32);
            }
        };

        Level1.prototype.addSpritesByDistance = function () {
            if (this.spritesExhausted)
                return;
            if (this.mapLocation < this.nextSpriteHeight) {
                var next = this.spriteQueue.pop();
                this.generateSprite(next);
                this.prepareNextSprite();
                this.addSpritesByDistance();
            }
        };

        Level1.prototype.prepareNextSprite = function () {
            if (this.spriteQueue.length > 0) {
                var y = this.spriteQueue[0].y;
                this.nextSpriteHeight = y + this.spriteQueue[0].height;
            } else {
                this.spritesExhausted = true;
            }
        };

        Level1.prototype.PlayNextPart = function () {
            this.music.play('earthShows');
        };

        Level1.prototype.ToggleMusic = function () {
            if (this.music.isPlaying) {
                this.music.pause();
            } else {
                this.music.resume();
            }
        };

        Level1.prototype.ToggleDebugDisplay = function () {
            this.debugToggle = !this.debugToggle;
        };

        Level1.prototype.generateSprite = function (s) {
            var yToSet = s.y - this.mapLocation;
            switch (s.name.toLowerCase()) {
                case "asteroid":
                    var a = new Chubbo.Asteroid(this.game, s, yToSet, this.levelSpeed);
                    this.obstacles.add(a);
                    break;
                case "bird":
                    var b = new Chubbo.Bird(this.game, s, yToSet, this.levelSpeed);
                    this.obstacles.add(b);
                    break;
                case "nugget":
                    var n = new Chubbo.Nugget(this.game, s, yToSet, this.levelSpeed);
                    this.obstacles.add(n);
                    break;
            }
        };

        Level1.prototype.collideSprites = function () {
            if (!this.player.isStunned()) {
                this.game.physics.collide(this.obstacles, this.player, this.handleEnemyCollision, null, this);
            }
        };

        Level1.prototype.endSky = function () {
            this.levelSection = 2 /* stars */;
        };

        Level1.prototype.handleEnemyCollision = function (player, enemy) {
            enemy.collide(player);
        };
        return Level1;
    })(Phaser.State);
    Chubbo.Level1 = Level1;
})(Chubbo || (Chubbo = {}));
///<reference path="phaser.d.ts"/>
///<reference path="Boot.ts"/>
///<reference path="Preloader.ts"/>
///<reference path="MainMenu.ts"/>
///<reference path="Level1.ts"/>
var Chubbo;
(function (Chubbo) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.CANVAS, 'gameScreen', null);

            this.state.add('Boot', Chubbo.Boot, false);
            this.state.add('Preloader', Chubbo.Preloader, false);
            this.state.add('MainMenu', Chubbo.MainMenu, false);
            this.state.add('Level1', Chubbo.Level1, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Chubbo.Game = Game;
})(Chubbo || (Chubbo = {}));
///<reference path="game.ts"/>
window.onload = function () {
    var game = new Chubbo.Game();
};
///<reference path="phaser.d.ts"/>
var Chubbo;
(function (Chubbo) {
    var Controls = (function () {
        function Controls() {
        }
        return Controls;
    })();
    Chubbo.Controls = Controls;
})(Chubbo || (Chubbo = {}));
var Chubbo;
(function (Chubbo) {
    var Asteroid = (function (_super) {
        __extends(Asteroid, _super);
        function Asteroid(game, data, y, LevelSpeed) {
            _super.call(this, game, data.x, y, 'asteroid', 0);

            this.game.add.existing(this);
            this.LevelSpeed = LevelSpeed;
        }
        Asteroid.prototype.update = function () {
            this.y += this.LevelSpeed;
        };

        Asteroid.prototype.hitWall = function (thing) {
            this.body.velocity.x *= -1;
        };

        Asteroid.prototype.collide = function (player) {
            player.recieveDamage(15);
        };
        return Asteroid;
    })(Phaser.Sprite);
    Chubbo.Asteroid = Asteroid;
})(Chubbo || (Chubbo = {}));
var Chubbo;
(function (Chubbo) {
    var Bird = (function (_super) {
        __extends(Bird, _super);
        function Bird(game, data, y, LevelSpeed) {
            _super.call(this, game, data.x, y, 'bird', 0);
            this.flightSpeed = 65;

            this.animations.add('bird', [0, 1, 2, 1], 15, true);

            this.animations.play('bird');

            this.game.add.existing(this);
            this.LevelSpeed = LevelSpeed;
            var dir = data.properties.direction;
            if (dir.toLowerCase() == "left") {
                this.flightDirection = -1;
            } else if (dir.toLowerCase() == "right") {
                this.flightDirection = 1;
            }
            this.body.velocity.x = this.flightSpeed * this.flightDirection;
        }
        Bird.prototype.update = function () {
            this.y += this.LevelSpeed;
            if (this.y > this.game.world.height) {
                this.kill();
            }
        };

        Bird.prototype.collide = function (player) {
            player.recieveDamage(5);
        };
        return Bird;
    })(Phaser.Sprite);
    Chubbo.Bird = Bird;
})(Chubbo || (Chubbo = {}));
var Chubbo;
(function (Chubbo) {
    var Music = (function (_super) {
        __extends(Music, _super);
        function Music() {
            _super.apply(this, arguments);
            this.transitionMarkers = true;
        }
        //eh
        Music.prototype.update = function () {
            if (this.pendingPlayback && this.game.cache.isSoundReady(this.key)) {
                _super.prototype.update.call(this);
            }

            //Actual changes below
            if (this.isPlaying) {
                this.currentTime = this.game.time.now - this.startTime;

                if (this.currentTime >= (this.duration * 1000)) {
                    //console.log(this.currentMarker, 'has hit duration');
                    if (this.usingWebAudio) {
                        if (this.loop) {
                            //  won't work with markers, needs to reset the position
                            this.onLoop.dispatch(this);

                            if (this.currentMarker === '') {
                                // console.log('loop2');
                                this.currentTime = 0;
                                this.startTime = this.game.time.now;
                            } else {
                                // console.log('loop3');
                                this.play(this.currentMarker, 0, this.volume, true, true);
                            }
                        } else {
                            // This is for
                            this.endMarker();
                        }
                    } else {
                        if (this.loop) {
                            this.onLoop.dispatch(this);
                            this.play(this.currentMarker, 0, this.volume, true, true);
                        } else {
                            this.endMarker();
                        }
                    }
                }
            }
        };

        Music.prototype.endMarker = function () {
            //var convertedTime = (this.currentTime / 1000)
            //for (var m in this.markers) {
            //    if (m.start <= convertedTime) {
            //        var endtime = m.start + m.duration
            //        if (convertedTime <= endtime) {
            //            this.play(m.name);
            //        }
            //    }
            //}
            //this.stop();
        };
        return Music;
    })(Phaser.Sound);
    Chubbo.Music = Music;
})(Chubbo || (Chubbo = {}));
var Chubbo;
(function (Chubbo) {
    var Nugget = (function (_super) {
        __extends(Nugget, _super);
        function Nugget(game, data, y, LevelSpeed) {
            _super.call(this, game, data.x, y, 'nugget', 0);

            //this.animations.add('nugget', [0], 0, true);
            //this.animations.play('bird');
            this.game.add.existing(this);

            this.LevelSpeed = LevelSpeed;
        }
        Nugget.prototype.update = function () {
            this.y += this.LevelSpeed;
            if (this.y > this.game.world.height) {
                this.kill();
            }
        };

        Nugget.prototype.collide = function (player) {
            player.gainPrivalege(100);
            this.kill();
        };
        return Nugget;
    })(Phaser.Sprite);
    Chubbo.Nugget = Nugget;
})(Chubbo || (Chubbo = {}));
//# sourceMappingURL=gameScript.js.map
