import { GAME } from '../constants/GAME'
import { BOMB } from '../constants/BOMB'

export default class BombSpawner {
    private _scene?: Phaser.Scene
    private _group?: Phaser.Physics.Arcade.Group // for moving elements
    private _texture?: string 

    constructor(scence: Phaser.Scene, texture: string = 'bomb') { // assign defaut value in case undefined param
        this._scene = scence
        this._texture = texture
        this._group = scence.physics.add.group()
    }

    get group() {
        return this._group
    }

    get texture() {
        return this._texture
    }

    spawn(playerX: integer = 0) {
        // set bom X-position away from player X-position
        const bombX = (playerX > GAME.WIDTH / 2)
            ? Phaser.Math.Between(0, GAME.WIDTH / 2)
            : Phaser.Math.Between(GAME.WIDTH / 2, GAME.WIDTH / 2)

        const bomb: Phaser.Physics.Arcade.Image = this.group?.create(bombX, 0, this.texture)
        bomb.setCollideWorldBounds(true)
        bomb.setBounce(BOMB.BOUNCE)
        bomb.setVelocity(Phaser.Math.Between(-BOMB.SPEED_X_BOUND, BOMB.SPEED_X_BOUND), BOMB.SPEED_Y)
        return bomb
    }
}