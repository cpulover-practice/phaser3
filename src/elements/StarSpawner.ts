export default class StarSpawner {
    private _scene?: Phaser.Scene
    private _group?: Phaser.Physics.Arcade.Group // for moving elements
    private _key?: string // identify key for asset

    constructor(scence: Phaser.Scene, key: string = 'star') { // assign defaut value in case undefined param
        this._scene = scence
        this._key = key
        this._group = scence.physics.add.group()
    }

    get scene(){
        return this._scene
    }

    get group() {
        return this._group
    }

    get key(){
        return this._key
    }

    spawnMany() {
        this.group?.createFromConfig({
            key: this.key,
            repeat: 1,
            setXY: { x: 12, y: 0, stepX: 400 }
        })

        this.group?.children.iterate(child => {
            // cast type
            const star = child as Phaser.Physics.Arcade.Image
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        }
        )
    }
}