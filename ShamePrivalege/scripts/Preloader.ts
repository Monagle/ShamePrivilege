module Chubbo {

    export class Preloader extends Phaser.State {

        preloadBar: Phaser.Sprite;

        preload() {

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
        }

        create() {
            this.loadLevelSprites();
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true,0,true,true);
            tween.onComplete.add(this.startMainMenu, this);

        }

        startMainMenu() {

            //this.game.state.start('MainMenu', true, false);
            this.game.state.start('Level1', true, false);
        }

        loadLevelSprites() {
            //REPLACE THIS LATER!!!!
            var jsonData = JSON.parse(this.cache.getText('spritePositions').toString());         
                
            var q = new Array<Chubbo.jsonSprite>();
            var container = <Chubbo.jsonContainer>jsonData;
            var sortedList = container.layers[0].objects.sort((n1, n2) =>  (n2.height + n2.y) -(n1.height + n1.y));
            container.layers[0].objects = sortedList;
            (<Chubbo.Game>this.game).jsonData = jsonData;

        }

        update() {
            if (this.cache.isSoundDecoded('flyingTheme')) {
                this.startMainMenu();
            }
        }



    }
}