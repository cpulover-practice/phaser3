import Phaser from 'phaser'
import Player from '../elements/Player'
import ScoreLabel from '../elements/ScoreLabel'
import BombSpawner from '../elements/BombSpawner'
import StarSpawner from '../elements/StarSpawner'

import { TEXTURE } from '../constants/TEXTURE'
import { SCENE } from '../constants/SCENE'

export default class PlayGameScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup // "?" means attribute could be undefined
    private player?: Player
    private scoreLabel?: ScoreLabel
    private starSpawner?: StarSpawner
    private bombSpawner?: BombSpawner

    private gameOver = false

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
        this.scoreLabel = new ScoreLabel(this, 0)
        this.player = new Player(this, TEXTURE.PLAYER)
        this.starSpawner = new StarSpawner(this, TEXTURE.STAR)
        this.bombSpawner = new BombSpawner(this, TEXTURE.BOMB)

        this.platforms = this.createPlatforms()
        this.starSpawner.spawnMany()

        this.setupCollisions()
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

    /* OVERLAPING-COLLISION */
    private setupCollisions() {
        if (this.player && this.platforms && this.bombSpawner?.group && this.starSpawner?.group) {
            this.physics.add.collider(this.player, this.platforms)
            this.physics.add.collider(this.starSpawner.group, this.platforms)
            this.physics.add.overlap(this.starSpawner.group, this.player, this.collectStar, undefined, this)
            this.physics.add.collider(this.platforms, this.bombSpawner.group)
            this.physics.add.collider(this.bombSpawner.group, this.bombSpawner.group) // add collider between bombs
            this.physics.add.collider(this.player, this.bombSpawner.group, this.hitBomb, undefined, this)
        }
    }

    private collectStar(thePlayer: Phaser.GameObjects.GameObject, theStar: Phaser.GameObjects.GameObject) {
        // cast type
        const star = theStar as Phaser.Physics.Arcade.Image
        // hide the collected star
        star.disableBody(true, true)
        // update score
        if (this.scoreLabel) {
            this.scoreLabel.addScore(1)
        }

        // count number of active stars (not collected)
        if (this.starSpawner?.group) {
            if (this.starSpawner.group.countActive(true) === 0) {
                // re-active all the stars
                this.starSpawner.group.children.iterate(child => {
                    // cast type
                    const star = child as Phaser.Physics.Arcade.Image
                    star.enableBody(true, star.x, 0, true, true)
                })
                // generate new bomb
                this.bombSpawner?.spawn(this.player?.x)
            }
        }
    }

    private hitBomb(thePlayer: Phaser.GameObjects.GameObject, theBomb: Phaser.GameObjects.GameObject) {
        this.physics.pause()
        this.player?.setTint(0xff0000)
        // this.player?.anims.play(ANI_PLAYER_FRONT_KEY)
        this.gameOver = true
    }
    /* END OF OVERLAPING-COLLISION */

    update() {
        this.player?.control()

        if (this.gameOver) {
            return
        }
    }
}