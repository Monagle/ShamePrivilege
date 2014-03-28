
///<reference path="player.ts"/>
module Chubbo {

    export enum LevelSection {
        sky,
        atmosphere,
        stars
    }


    export class Level1 extends Phaser.State {

        //skyEnd: number = -3000;


        starfield: Phaser.TileSprite;
        sky: Phaser.TileSprite;
        backgroundAngle: number;
        music: Chubbo.Music;
        player: Chubbo.Player;
        debugToggle: boolean;
        mapLocation: number;
        levelSpeed = 5;
        muteKey: Phaser.Key;
        debugKey: Phaser.Key;
        spriteQueue: Array<Chubbo.jsonSprite>;
        nextSpriteHeight: number;
        spritesExhausted: boolean;
        levelSection: Chubbo.LevelSection;
        enemies: Phaser.Group;



        create() {
            this.levelSection = Chubbo.LevelSection.sky;
            this.starfield = this.add.tileSprite(0, 0, 1024, 1024, 'stars');
            this.sky = this.add.tileSprite(0, 0, 800, 600, 'sky')

            this.world.setBounds(0, 0, 800, 600);

            this.music = new Chubbo.Music(this.game, 'flyingTheme', 1, false);

            this.game.sound.add(this.music);
            this.spritesExhausted = false;
            this.music.addMarker('gameplayStart', 30, 100, .5);  //change middle to 5
            this.music.addMarker('test1', 36, 40, .5);
            this.music.addMarker('earthShows', 41, 256, .5);
            this.music.play('gameplayStart');

            this.muteKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
            this.muteKey.onDown.add(this.ToggleMusic, this);

            this.debugKey = this.input.keyboard.addKey(Phaser.Keyboard.TILDE);
            this.debugKey.onDown.add(this.ToggleDebugDisplay, this);

            this.enemies = this.game.add.group();

            var shameDisplay =
                this.player = new Player(this.game, 130, 284);


            var jsonData = (<Chubbo.Game>this.game).jsonData;
            var container = <Chubbo.jsonContainer>jsonData;
            this.spriteQueue = container.layers[0].objects;
            this.mapLocation = container.layers[0].height;
            this.spritesExhausted = false;
            this.prepareNextSprite();

        }

        update() {
            this.checkSwitchSections();
            if (this.levelSection == Chubbo.LevelSection.sky) {
                this.sky.tilePosition.y += 15;
            }
             else if( this.levelSection == Chubbo.LevelSection.atmosphere) {
                 this.sky.tilePosition.y += 15;
                 this.sky.tilePosition.x += .5;
            }
            this.starfield.tilePosition.x += 0;
            this.starfield.tilePosition.y += 9;

            this.mapLocation -= this.levelSpeed;
            this.addSpritesByDistance();
            this.collideSprites();
        }

        checkSwitchSections() {
            switch (this.levelSection) {
                case Chubbo.LevelSection.sky:
                    if (this.mapLocation < 0) {
                        this.levelSection = Chubbo.LevelSection.atmosphere;
                        var t = this.add.tween(this.sky).to({ alpha: 0 }, 10000, Phaser.Easing.Linear.None, true);
                        t.onComplete.add(this.endSky,this);
                    }
                    break;
                case Chubbo.LevelSection.stars:
                    break;
            }
        }

        render() {

            if (this.debugToggle) {
                this.game.debug.renderText(this.game.time.fps.toString(), 32, 200);

                this.game.debug.renderPhysicsBody(this.player.body);
                this.game.debug.renderBodyInfo(this.player, 32, 32);
            }
        }

        addSpritesByDistance() {
            if (this.spritesExhausted) return;
            if (this.mapLocation < this.nextSpriteHeight) {
                var next = this.spriteQueue.pop();
                this.generateSprite(next);
                this.prepareNextSprite();
                this.addSpritesByDistance();
            }
        }

        prepareNextSprite() {
            if (this.spriteQueue.length > 0) {
                var y = this.spriteQueue[0].y;
                this.nextSpriteHeight = y + this.spriteQueue[0].height;
            }
            else {
                this.spritesExhausted = true;
            }
        }

        PlayNextPart() {
            this.music.play('earthShows');
        }

        ToggleMusic() {

            if (this.music.isPlaying) {
                this.music.pause();
            }
            else {
                this.music.resume();
            }

        }

        ToggleDebugDisplay() {
            this.debugToggle = !this.debugToggle;
        }

        generateSprite(s: Chubbo.jsonSprite) {
            var yToSet = s.y - this.mapLocation;
            switch (s.name.toLowerCase()) {
                case "asteroid":
                    var a = new Asteroid(this.game, s, yToSet, this.levelSpeed);
                    this.enemies.add(a);
                    break;
                case "bird":
                    var b = new Bird(this.game, s, yToSet, this.levelSpeed);
                    this.enemies.add(b);
                    break;
            }
        }

        collideSprites() {
            if (!this.player.isStunned()) {

            this.game.physics.collide(this.enemies, this.player, this.handleEnemyCollision, null, this);
            }
        }

        endSky() { this.levelSection = Chubbo.LevelSection.stars; }

        handleEnemyCollision(player, enemy) {
            (<Chubbo.Enemy>enemy).collide(player);
        }
    }

} 