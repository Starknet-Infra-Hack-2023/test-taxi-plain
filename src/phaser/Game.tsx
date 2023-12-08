import React from 'react';
import { usePhaserGame } from '../hooks/usePhaserGame';
import GameScene from './GameScene';


const Game = () => {
    
    const gameConfig = {
        type: Phaser.AUTO,
        parent: "taxi-game",
        backgroundColor: '#34222E',
        render: {
            antialias: false,
        },
        scale:{
            width: 750,
            height: 650,
            //mode:  Phaser.Scale.FIT,
            //mode:  Phaser.Scale.RESIZE,
            //autoCenter: Phaser.Scale.Center.CENTER_BOTH,
            // width: '100%',
            // height: '100%'
        },
        physics:{
            default: 'arcade',
            arcade:{ gravity: { y: 0 } }
        },
        scene: [GameScene]
    }
    const game = usePhaserGame(gameConfig);
    return (
        <div id="taxi-game"></div>
    )
}

export default Game