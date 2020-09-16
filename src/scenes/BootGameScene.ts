import Phaser from 'phaser'

export default class BootGameScene extends Phaser.Scene {
    constructor() {
        super('boot-game')
    }

    // load assets: images, audio, etc.
    preload() {
    }

    // add objects to the scene
    create() {
        this.add.text(0, 0, "Loading game...")
    }

    // loop
    update() {
    }
}