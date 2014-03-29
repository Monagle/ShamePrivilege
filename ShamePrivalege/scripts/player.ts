
module Chubbo {

    export class Player extends Phaser.Sprite {

        private breakSpeed = 30;
        private burstSpeed = 200;
        private holdSpeed = 5;
        private doubleTapTime = .5;
        private burstCooldownLength= Phaser.Timer.SECOND * 3;

        private shameDisplay: Phaser.Text;
        private privilegeDisplay: Phaser.Text;
        private stunnedAnimation: Phaser.Tween;
        private stunned: boolean;

        private lastUp: number;
        private lastDown: number;
        private lastLeft: number;
        private lastRight: number;
        private burstCooldown: boolean;

        private shame = 0;
        private privilege = 0;

        uiStyle = { 'font': '22px Helvetica', fill: '#D4B457' };

        constructor(game: Phaser.Game, x: number, y: number) {

            super(game, x, y, 'woman', 0);

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
            this.privilegeDisplay = this.game.add.text(650, 20, "Privilege: ", this.uiStyle);

            game.add.existing(this);

        }

        update() {
            this.shameDisplay.content = "Shame: " + this.shame;
            this.privilegeDisplay.content = "Pri


            var control = this.game.input.keyboard;


            if (control.isDown(Phaser.Keyboard.UP) || control.isDown(Phaser.Keyboard.W)) {
                this.body.velocity.y -= this.holdSpeed;
            }
            else if (control.isDown(Phaser.Keyboard.DOWN) || control.isDown(Phaser.Keyboard.S)) {
                this.body.velocity.y += this.holdSpeed;
            }
            if (control.isDown(Phaser.Keyboard.LEFT) || control.isDown(Phaser.Keyboard.A)) {
                this.body.velocity.x -= this.holdSpeed;
            }
            else if (control.isDown(Phaser.Keyboard.RIGHT) || control.isDown(Phaser.Keyboard.D)) {
                this.body.velocity.x += this.holdSpeed;
            }

            this.orient();
        }

        public isStunned(): boolean {
            return this.stunned;
        }

        public recieveDamage(dmg: number) {
            this.shame += dmg;
            this.beginStun();
        }

        public gainPrivalege(privalege: number) {
            this.privilege += privalege;
        }

        private burstUp() {


            if (this.body.velocity.y >= 0) {
                this.body.velocity.y -= this.breakSpeed;
            }
            else if (!this.burstCooldown) {
                var sinceLast =  this.game.time.elapsedSecondsSince(this.lastUp)
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
        }

        private burstDown() {
            if (this.body.velocity.y <= 0) {
                this.body.velocity.y += this.breakSpeed;
            }
            else if (!this.burstCooldown) {
                var sinceLast = this.game.time.elapsedSecondsSince(this.lastDown)
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
        }

        private burstLeft() {
            if (this.body.velocity.x >= 0) {
                this.body.velocity.x -= this.breakSpeed;
            }
            else if (!this.burstCooldown) {
                var sinceLast = this.game.time.elapsedSecondsSince(this.lastLeft)
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
        }

        private burstRight() {
            if (this.body.velocity.x <= 0) {
                this.body.velocity.x += this.breakSpeed;
            }
            else if (!this.burstCooldown) {
                var sinceLast = this.game.time.elapsedSecondsSince(this.lastRight)
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
        }


        private orient() {
            var section = (<Chubbo.Level1>this.game.state.getCurrentState()).levelSection;
            if (section != Chubbo.LevelSection.atmosphere && section != Chubbo.LevelSection.sky) {
                var rads = Math.atan2(this.body.velocity.x, -this.body.velocity.y);
                var degrees = rads * 180 / Math.PI;
                this.body.rotation = degrees;
            }
        }

        //private hitWall(thing) {
        //    this.body.velocity.x *= -1;
        //}


        private beginStun() {
            //this.alpha = .5;
            this.stunnedAnimation.start(0);
            this.stunned = true;
            this.animations.play('hurt');
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.endStun, this);
        }

        private endStun() {
            this.alpha = 1;
            this.animations.play('swim');
            this.stunnedAnimation.stop();
            this.stunned = false;
        }

        public resetBoost() {
            this.burstCooldown = false;
            this.animations.play('swim');
        }



    }

}