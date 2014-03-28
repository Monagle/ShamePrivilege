module Chubbo {

 

    export interface jsonContainer {
        layers: Array<jsonLayer>;
    }

    export interface jsonLayer {
        height: number;
        objects: Array<jsonSprite>;
    }

    export interface jsonSprite {
        height: number;
        name: string;
        width: number;
        x: number;
        y: number;
        properties: Object;
        type: string;
        visible: boolean;              
    }

    export interface jsonBirdProperties{
        direction: string;
    }

    export interface Enemy {
        collide(player: Chubbo.Player);
    }
}