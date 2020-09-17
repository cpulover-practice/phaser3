export default class BombSpawner {
    private _scene?: Phaser.Scene
    private _group?: Phaser.Physics.Arcade.Group // for moving elements
    private _key?: string // identify key for asset

    constructor(scence: Phaser.Scene, key: string = 'bomb') { // assign defaut value in case undefined param
        this._scene = scence
        this._key = key
        this._group = scence.physics.add.group()
    }

    get group() {
        return this._group
    }

    get key(){
        return this._key
    }

    spawn(playerX: integer = 0) {
        // set bom X-position away from player X-position
        const bombX = (playerX > 400)
            ? Phaser.Math.Between(0, 300)
            : Phaser.Math.Between(500, 800)

        const bomb: Phaser.Physics.Arcade.Image = this.group?.create(bombX, 0, this.key)
        bomb.setCollideWorldBounds(true)
        bomb.setBounce(1)
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
        return bomb
    }
}