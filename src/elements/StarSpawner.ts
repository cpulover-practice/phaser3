import {STAR} from '../constants/STAR'

export default class StarSpawner {
    private _scene?: Phaser.Scene
    private _group?: Phaser.Physics.Arcade.Group // for moving elements
    private _texture?: string 

    constructor(scence: Phaser.Scene, texture: string = 'star') { // assign defaut value in case undefined param
        this._scene = scence
        this._texture = texture
        this._group = scence.physics.add.group()
    }

    get scene(){
        return this._scene
    }

    get group() {
        return this._group
    }

    get texture(){
        return this._texture
    }

    spawnMany() {
        this.group?.createFromConfig({
            key: this.texture,
            repeat: STAR.COUNT,
            setXY: { x: STAR.START_X, y: STAR.START_Y, stepX: STAR.STEP_X }
        })

        this.group?.children.iterate(child => {
            // cast type
            const star = child as Phaser.Physics.Arcade.Image
            star.setBounceY(Phaser.Math.FloatBetween(STAR.BOUNCE_Y_MIN, STAR.BOUNCE_Y_MAX))
        }
        )
    }
}