
module Chubbo {

    export class Bird extends Phaser.Sprite implements Chubbo.Enemy {

        private LevelSpeed: number;
        private flightDirection: number;
        private flightSpeed = 65;

        constructor(game: Phaser.Game, data: Chubbo.jsonSprite, y: number, LevelSpeed: number) {

            super(game, data.x, y, 'bird', 0);
            
            this.animations.add('bird', [0, 1, 2, 1], 15, true);

            this.animations.play('bird');

            this.game.add.existing(this);
            this.LevelSpeed = LevelSpeed;
            var dir = (<Chubbo.jsonBirdProperties>data.properties).direction;
            if (dir.toLowerCase() == "left") {
                this.flightDirection = -1;
            }
            else if (dir.toLowerCase() == "right") {
                this.flightDirection = 1;
            }         
            this.body.velocity.x = this.flightSpeed * this.flightDirection;
            
        }



        update() {
            this.y += this.LevelSpeed ;
            if (this.y > this.game.world.height) {
                this.kill();
            }
            
        }

        collide(player: Chubbo.Player) {
            player.recieveDamage(5);
            
        }

    }

}