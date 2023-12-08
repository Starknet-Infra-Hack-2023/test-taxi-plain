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
        this.load.atlas('taxi1', 'characters/taxi.png', 'characters/taxi.json')
        this.load.atlas('customer1', 'characters/taxi.png', 'characters/taxi.json')
        this.load.atlas('hotel1', 'characters/taxi.png', 'characters/taxi.json')
        this.cursors = this?.input.keyboard.createCursorKeys()
    }
    create() {


        const map = this.make.tilemap({ key: 'roadtilemap' });
        const tileset = map.addTilesetImage('taxi_background', 'roads');

        this.ground = map.createLayer('ground', tileset as  Phaser.Tilemaps.Tileset);
        this.ground.scale = this.scalefactor

        createAnims(this.anims)
        
        this.desintation = new Destination(this, 
            ((this.tile_width*5)-this.tile_width/2)*this.scalefactor, 
            50, 'hotel1', 'hotel.png')
        this.passenger = new Passenger(this, 50, 50, 'customer1', 'passenger.png')
        this.player1 = new Taxi(this, 100, 100, 'taxi1', 'cab_front.png')
        
        this.add.existing(this.desintation)
        this.add.existing(this.passenger)
        this.add.existing(this.player1)
        this.physics.add.existing(this.player1)
        this.player1.scale = this.scalefactor
        this.passenger.scale = this.scalefactor
        this.desintation.scale = this.scalefactor
    }

    update(t: number, dt: number)
	{
		if (this.player1)
		{
			this.player1.update(this.cursors)
		}
	}
}

export default GameScene;