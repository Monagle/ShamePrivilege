
module Chubbo {

    export class Nugget extends Phaser.Sprite implements Chubbo.Obstacle {

        private LevelSpeed: number;

        constructor(game: Phaser.Game, data: Chubbo.jsonSprite, y: number, LevelSpeed: number) {

            super(game, data.x, y, 'nugget', 0);

            //this.animations.add('nugget', [0], 0, true);

            //this.animations.play('bird');

            this.game.add.existing(this);

            this.LevelSpeed = LevelSpeed;
                       

        }



        update() {
            this.y += this.LevelSpeed;
            if (this.y > this.game.world.height) {
                this.kill();
            }

        }

        collide(player: Chubbo.Player) {
            player.gainPrivalege(100);
            this.kill();

        }

    }

} 