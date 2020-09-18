import Phaser from 'phaser'
import { ANIM } from '../constants/KEY'
import { PLAYER } from '../constants/ELEMENT'

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private _scene?: Phaser.Scene
    private _texture?: string
    private cursor?: Phaser.Types.Input.Keyboard.CursorKeys

    constructor(scene: Phaser.Scene, texture: string = "player") {
        super(scene, PLAYER.START_X, PLAYER.START_Y, texture)
        this._scene = scene
        this._texture = texture

        scene.add.existing(this)

        // physic
        scene.physics.world.enable(this)
        this.setBounce(PLAYER.BOUNCE)
        this.setCollideWorldBounds(true)
        // control 
        this.cursor = scene.input.keyboard.createCursorKeys()
        // animations
        this.createAnimations(texture)
    }

    control() {
        if (this.cursor?.left?.isDown) {
            this.setVelocityX(-PLAYER.SPEED_X)
            this.anims.play(ANIM.PLAYER_TO_LEFT, true)
        } else if (this.cursor?.right?.isDown) {
            this.setVelocityX(PLAYER.SPEED_X)
            this.anims.play(ANIM.PLAYER_TO_RIGHT, true)
        } else {
            this.setVelocityX(0)
            this.anims.play(ANIM.PLAYER_FRONT)
        }
        // jump
        if (this.cursor?.up?.isDown && this.body.touching.down) {
            this.setVelocityY(-PLAYER.SPEED_Y)
        }
    }

    createAnimations(playerTexture: string) {
        this._scene?.anims.create({
            key: ANIM.PLAYER_TO_LEFT,
            frames: this._scene?.anims.generateFrameNumbers(playerTexture, {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1 // loop infinitely
        })

        this._scene?.anims.create({
            key: ANIM.PLAYER_FRONT,
            frames: [{
                key: playerTexture,
                frame: 4
            }],
            frameRate: 20
        })

        this._scene?.anims.create({
            key: ANIM.PLAYER_TO_RIGHT,
            frames: this._scene?.anims.generateFrameNumbers(playerTexture, {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        })
    }
}