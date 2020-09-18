import Phaser from 'phaser'
import Player from '../elements/Player'
import ScoreLabel from '../elements/ScoreLabel'
import BombSpawner from '../elements/BombSpawner'
import StarSpawner from '../elements/StarSpawner'

import { TEXTURE } from '../constants/TEXTURE'
import { SCENE } from '../constants/SCENE'
import Collision from '~/Collision'

export default class PlayGameScene extends Phaser.Scene {
    private _platforms?: Phaser.Physics.Arcade.StaticGroup // "?" means attribute could be undefined
    private _player?: Player
    private _scoreLabel?: ScoreLabel
    private _starSpawner?: StarSpawner
    private _bombSpawner?: BombSpawner

    private _gameOver = false

    constructor() {
        super(SCENE.LEVEL1)
    }

    preload() {
        // static images
        this.load.image(TEXTURE.SKY, 'assets/sky.png')
        this.load.image(TEXTURE.PLATFORM, 'assets/platform.png')
        this.load.image(TEXTURE.STAR, 'assets/star.png')
        this.load.image(TEXTURE.BOMB, 'assets/bomb.png')
        // sprite for animation
        this.load.spritesheet(TEXTURE.PLAYER, 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        })
    }

    create() {
        // background
        this.add.image(0, 0, TEXTURE.SKY).setOrigin(0, 0) // reset the drawing position of the image to the top-left        
        this._scoreLabel = new ScoreLabel(this, 0)
        this._player = new Player(this, TEXTURE.PLAYER)
        this._starSpawner = new StarSpawner(this, TEXTURE.STAR)
        this._bombSpawner = new BombSpawner(this, TEXTURE.BOMB)

        this._platforms = this.createPlatforms()
        this._starSpawner.spawnMany()

        Collision.setup(this)
    }

    private createPlatforms() {
        const platforms = this.physics.add.staticGroup()
        const ground = platforms.create(400, 568, TEXTURE.PLATFORM) as Phaser.Physics.Arcade.Image
        ground.setScale(2).refreshBody()
        platforms.create(600, 400, TEXTURE.PLATFORM)
        platforms.create(50, 250, TEXTURE.PLATFORM)
        platforms.create(750, 220, TEXTURE.PLATFORM)
        return platforms
    }

    update() {
        this.player?.control()

        if (this.gameOver) {
            return
        }
    }

    /* GETTERS - SETTERS */
    get player() {
        return this._player
    }
    get platforms() {
        return this._platforms
    }
    get bombSpawner() {
        return this._bombSpawner
    }
    get starSpawner() {
        return this._starSpawner
    }
    get scoreLabel() {
        return this._scoreLabel
    }
    get gameOver() {
        return this._gameOver
    }
    set gameOver(state: boolean) {
        this._gameOver = state
    }
}