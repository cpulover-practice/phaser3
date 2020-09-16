import Phaser from 'phaser'

export default class BootGameScene extends Phaser.Scene {
    constructor() {
        super('boot-game')
    }

    // load assets: images, audio, etc.
    preload() {
        // static images
        this.load.image('sky', 'assets/sky.png')
        this.load.image('platform', 'assets/platform.png')
        this.load.image('star', 'assets/star.png')
        this.load.image('bomb', 'assets/bomb.png')
        // sprite image for animation
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        })
    }

    // add objects to the scene
    create() {}

    // loop
    update() {}
}