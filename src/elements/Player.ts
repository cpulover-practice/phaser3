import Phaser from 'phaser'

const PLAYER_X: integer = 50
const PLAYER_Y: integer = 450
const PLAYER_BOUNCE: integer = 0.2

// for animations
const ANI_PLAYER_FRONT_KEY = 'playerFront'
const ANI_PLAYER_TO_LEFT_KEY = 'playerToLeft'
const ANI_PLAYER_TO_RIGHT_KEY = 'playerToRight'

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private _scene?: Phaser.Scene
    private _key?: string
    private cursor?: Phaser.Types.Input.Keyboard.CursorKeys

    constructor(scene: Phaser.Scene, key: string = "player") {
        super(scene, PLAYER_X, PLAYER_Y, key)
        this._scene = scene
        this._key = key
        
        scene.add.existing(this)

        // physic
        scene.physics.world.enable(this)
        this.setBounce(PLAYER_BOUNCE)
        this.setCollideWorldBounds(true)
        // control 
        this.cursor = scene.input.keyboard.createCursorKeys()
        // animations
        this.createAnimations(key)
    }

    control() {
        if (this.cursor?.left?.isDown) {
            this.setVelocityX(-160)
            this.anims.play(ANI_PLAYER_TO_LEFT_KEY, true)
        } else if (this.cursor?.right?.isDown) {
            this.setVelocityX(160)
            this.anims.play(ANI_PLAYER_TO_RIGHT_KEY, true)
        } else {
            this.setVelocityX(0)
            this.anims.play(ANI_PLAYER_FRONT_KEY)
        }
        // jump
        if (this.cursor?.up?.isDown && this.body.touching.down) {
            this.setVelocityY(-330)
        }
    }

    createAnimations(key: string) {
        this._scene?.anims.create({
            key: ANI_PLAYER_TO_LEFT_KEY,
            frames: this._scene?.anims.generateFrameNumbers(key, {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1 // loop infinitely
        })

        this._scene?.anims.create({
            key: ANI_PLAYER_FRONT_KEY,
            frames: [{
                key: key,
                frame: 4
            }],
            frameRate: 20
        })

        this._scene?.anims.create({
            key: ANI_PLAYER_TO_RIGHT_KEY,
            frames: this._scene?.anims.generateFrameNumbers(key, {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        })
    }
}