import Phaser from 'phaser'

import BootGameScene from './scenes/BootGameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [BootGameScene]
}

export default new Phaser.Game(config)


