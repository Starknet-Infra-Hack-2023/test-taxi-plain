import Phaser from 'phaser';
import Taxi from './characters/Taxi';
import Passenger from './characters/Passenger';
import Destination from './characters/Destination';
import { createAnims } from './animations/CreateAnims';

class GameScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    ground!: Phaser.Tilemaps.TilemapLayer
    player1!: Phaser.GameObjects.Sprite
    passenger!: Phaser.GameObjects.Sprite
    desintation!: Phaser.GameObjects.Sprite
    tile_width = 32
    tile_height = 32
    scalefactor = 3

    constructor() {
        super('GameScene');
    }
    preload() {
        this.load.image('roads', 'tiles/taixbgbig.png');
        this.load.tilemapTiledJSON('roadtilemap', 'maps/GreyGround.json');
        this.load.atlas('customer1', 'characters/taxi.png', 'characters/taxi.json')
        this.load.atlas('hotel1', 'characters/taxi.png', 'characters/taxi.json')

        this.load.spritesheet("taxi1", "characters/taxispritesheet.png", {
            frameWidth: 40,
            frameHeight: 40,
        });
        this.cursors = this?.input.keyboard.createCursorKeys()
    }
    create() {
        

        const map = this.make.tilemap({ key: 'roadtilemap' });
        const tileset = map.addTilesetImage('taixbgbig', 'roads');
        
        this.ground = map.createLayer('ground', "taixbgbig", 0, 0);
        const level2 = map.createLayer('level2', "taixbgbig", 0, 0)
        const level3 = map.createLayer('level3', "taixbgbig", 0, 0);
        this.ground.scale = this.scalefactor;
        level2.scale = this.scalefactor;
        level3.scale = this.scalefactor;


        this.desintation = this.add.sprite(80, 80, "hotel1");
        this.desintation.setFrame("hotel.png")
        this.desintation.scale = this.scalefactor;
        this.desintation.depth = 10;

        this.passenger = this.add.sprite(80, 80, "customer1");
        this.passenger.setFrame("passenger.png")
        this.passenger.scale = this.scalefactor;
        this.passenger.depth = 20;

        this.player1 = this.add.sprite(80, 80, "taxi1");
        this.player1.scale = this.scalefactor * 0.8; // 0.8 is the scale of the spritesheet
        this.player1.depth = 30;

        

        


        const gridEngineConfig = {
            characters: [
                {
                    id: "customer1",
                    sprite: this.passenger,
                    startPosition: {x:4, y:4},
                    charLayer: 'level2',
                    collides: {
                        collisionGroups: []
                    }
                },
                {
                    id: "hotel1",
                    sprite: this.desintation,
                    startPosition: { x:4, y:4},
                    charLayer: 'ground',
                    collides: {
                        collisionGroups: []
                    }
                },
                
                {
                    id: "taxi1",
                    sprite: this.player1,
                    walkingAnimationMapping: 0,
                    startPosition: { x: 4, y: 2 },
                    //charLayer: 'ground',
                    collides: {
                        collisionGroups: []
                    }
                },
                
            ],
        };
    
        this.gridEngine.create(map, gridEngineConfig);

        this.gridEngine.movementStopped().subscribe(() => {
            // const pos = this.player1.getCenter();
            // const tileXY = this.ground.getTileAtWorldXY(pos.x, pos.y);
            // console.log(tileXY);
        });

        // this.input.on('pointerdown', () => {

        //     const pos = this.player1.getCenter();
        //     const tileXY = this.ground.getTileAtWorldXY(pos.x, pos.y);
        //     console.log(tileXY);

        // });

    }

    update(t: number, dt: number) {
        if (this.cursors.left.isDown) {
            this.gridEngine.move("taxi1", "left");
        } else if (this.cursors.right.isDown) {
            this.gridEngine.move("taxi1", "right");
        } else if (this.cursors.up.isDown) {
            this.gridEngine.move("taxi1", "up");
        } else if (this.cursors.down.isDown) {
            this.gridEngine.move("taxi1", "down");
        }
    }
}

export default GameScene;