
module Chubbo {

    export class Asteroid extends Phaser.Sprite implements Chubbo.Enemy{

        private LevelSpeed: number;
        constructor(game: Phaser.Game, data: Chubbo.jsonSprite, y: number, LevelSpeed: number) {

            super(game, data.x, y, 'asteroid', 0);

            this.game.add.existing(this);
            this.LevelSpeed = LevelSpeed;

        }

        update() {
            this.y += this.LevelSpeed;
        }

        private hitWall(thing) {
            this.body.velocity.x *= -1;
        }

        public collide(player: Chubbo.Player) {
            player.recieveDamage(15);
            
        }
    }

}