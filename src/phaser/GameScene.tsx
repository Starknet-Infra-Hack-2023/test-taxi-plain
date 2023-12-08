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
    passengerInTaxi: boolean = false
    // destinationLocation: number = 0
    // locationMapping = {
    //     0: {x:0, y:0},
    //     1: {x:4, y:0},
    //     2: {x:0, y:4},
    //     3: {x:4, y:4},
    // }
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
                    startPosition: {x:0, y:0},
                    //charLayer: 'level2',
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
                    startPosition: { x: 3, y: 3 },
                    //charLayer: 'ground',
                    collides: {
                        collisionGroups: []
                    }
                },
                
            ],
        };

        this.gridEngine.create(map, gridEngineConfig);

        this.gridEngine.movementStopped().subscribe(() => {
            const taxiPos = this.player1.getCenter();
            const tileXY = this.ground.getTileAtWorldXY(taxiPos.x, taxiPos.y);
            //console.log("taxi position: ",tileXY.x, ",", tileXY.y);

            const passengerPos = this.passenger.getCenter();
            const tileXY2 = this.ground.getTileAtWorldXY(passengerPos.x, passengerPos.y);
            //console.log("passenger position: ",tileXY2.x, ",", tileXY2.y);
            //console.log("passenger code: ", this.getPassengerCode(tileXY2));

            const destinationPos = this.desintation.getCenter();
            const tileXY3 = this.ground.getTileAtWorldXY(destinationPos.x, destinationPos.y);
            //console.log("destination position: ",tileXY3.x, ",", tileXY3.y);
            //console.log("destination code: ", this.getDestinationCode(tileXY3));

            console.log("configcode: ", tileXY.y, tileXY.x, this.getPassengerCode(tileXY2), this.getDestinationCode(tileXY3));
        });

        //this.input.on('pointerdown', () => {
        this.input.keyboard.on('keydown-A', () => {
            // const pos = this.player1.getCenter();
            // const tileXY = this.ground.getTileAtWorldXY(pos.x, pos.y);
            // console.log(tileXY);
            this.pickupPassenger();

        });

        this.input.keyboard.on('keydown-D', () => {
            console.log("D pressed");
            this.dropOffPassenger();
        });

    }

    getPassengerCode(tileXY: Phaser.Tilemaps.Tile) {
        if(this.passengerInTaxi){
            return 4;
        }else if(tileXY.x == 0 && tileXY.y == 0) {
            return 0;
        }else if(tileXY.x == 4 && tileXY.y == 0) {
            return 1;
        }else if(tileXY.x == 0 && tileXY.y == 4) {
            return 2;
        }else if(tileXY.x == 4 && tileXY.y == 4) {
            return 3;
        }else{
            console.log("Passenger not picked up!")
            return 4;
        }
    }
    getDestinationCode(tileXY: Phaser.Tilemaps.Tile) {
        if(tileXY.x == 0 && tileXY.y == 0) {
            return 0;
        }else if(tileXY.x == 4 && tileXY.y == 0) {
            return 1;
        }else if(tileXY.x == 0 && tileXY.y == 4) {
            return 2;
        }else {
            return 3;
        }
    }

    pickupPassenger() {
        const taxiPos = this.player1.getCenter();
        const tileXY = this.ground.getTileAtWorldXY(taxiPos.x, taxiPos.y);

        const passengerPos = this.passenger.getCenter();
        const tileXY2 = this.ground.getTileAtWorldXY(passengerPos.x, passengerPos.y);

        if(tileXY.x == tileXY2.x && tileXY.y == tileXY2.y) {
            this.passengerInTaxi = true;
            //this.passenger.setActive(false);
            //this.passenger.setPosition(500,500);
            this.passenger.setVisible(false);
            //this.gridEngine.removeCharacter("customer1");
            console.log("passenger picked up!");
        }
    }

    dropOffPassenger() {
        const taxiPos = this.player1.getCenter();
        const tileXY = this.ground.getTileAtWorldXY(taxiPos.x, taxiPos.y);

        const destinationPos = this.desintation.getCenter();
        const tileXY3 = this.ground.getTileAtWorldXY(destinationPos.x, destinationPos.y);

        if(this.passengerInTaxi && tileXY.x == tileXY3.x && tileXY.y == tileXY3.y) {
            this.passengerInTaxi = false;
            console.log("passenger dropped off!");

            // here resets game
            console.log("game resetting...")

            return true;
        } else if (!this.passengerInTaxi) {
            console.log("No passenger in taxi!");
            return false;
        } else {
            console.log("Dropped off at wrong destination!");
            return false;
        }
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