import Phaser from 'phaser'

import BootGameScene from './scenes/BootGameScene'

export const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [BootGameScene],
	physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    }
}

export default new Phaser.Game(config)


