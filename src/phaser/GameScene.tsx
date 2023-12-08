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
        this.load.image('roads', 'tiles/taxi_background.png');
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
        const tileset = map.addTilesetImage('taxi_background', 'roads');
        
        this.ground = map.createLayer('ground', "taxi_background", 0, 0);
        this.ground.scale = this.scalefactor

        this.player1 = this.add.sprite(80, 80, "taxi1");
        this.player1.scale = this.scalefactor * 0.8; // 0.8 is the scale of the spritesheet

        const gridEngineConfig = {
            characters: [
                {
                id: "taxi1",
                sprite: this.player1,
                walkingAnimationMapping: 0,
                startPosition: { x: 0, y: 0 },
                },
            ],
        };
    
        this.gridEngine.create(map, gridEngineConfig);

        this.gridEngine.movementStopped().subscribe(() => {
            const pos = this.player1.getCenter();
            const tileXY = this.ground.getTileAtWorldXY(pos.x, pos.y);
            console.log(tileXY);
        });

        this.input.on('pointerdown', () => {

            const pos = this.player1.getCenter();
            const tileXY = this.ground.getTileAtWorldXY(pos.x, pos.y);
            console.log(tileXY);

        });

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