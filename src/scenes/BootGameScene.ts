import Phaser from 'phaser'
import Player from '../elements/Player'
import ScoreLabel from '../elements/ScoreLabel'
import BombSpawner from '../elements/BombSpawner'
import StarSpawner from '../elements/StarSpawner'

// key identifiers
const SKY_KEY = 'sky'
const PLATFORM_KEY = 'platform'
const STAR_KEY = 'star'
const BOMB_KEY = 'bomb'
const PLAYER_KEY = 'dude'

export default class BootGameScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup // "?" means attribute could be undefined
    private player?: Player
    private scoreLabel?: ScoreLabel
    private starSpawner?: StarSpawner
    private bombSpawner?: BombSpawner

    private gameOver = false

    constructor() {
        super('level1')
    }

    preload() { // load assets: images, audio, etc.
        // static images
        this.load.image(SKY_KEY, 'assets/sky.png')
        this.load.image(PLATFORM_KEY, 'assets/platform.png')
        this.load.image(STAR_KEY, 'assets/star.png')
        this.load.image(BOMB_KEY, 'assets/bomb.png')
        // sprite for animation
        this.load.spritesheet(PLAYER_KEY, 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        })
    }

    create() { // create objects to the scene (init and draw)
        // background
        this.add.image(0, 0, SKY_KEY).setOrigin(0, 0) // reset the drawing position of the image to the top-left        
        this.scoreLabel = new ScoreLabel(this, 0)
        this.player = new Player(this, PLAYER_KEY)
        this.starSpawner = new StarSpawner(this, STAR_KEY)
        this.bombSpawner = new BombSpawner(this, BOMB_KEY)

        this.platforms = this.createPlatforms()
        this.starSpawner.spawnMany()

        this.setupCollisions()
    }

    private createPlatforms() {
        const platforms = this.physics.add.staticGroup()
        const ground = platforms.create(400, 568, PLATFORM_KEY) as Phaser.Physics.Arcade.Image
        ground.setScale(2).refreshBody()
        platforms.create(600, 400, PLATFORM_KEY)
        platforms.create(50, 250, PLATFORM_KEY)
        platforms.create(750, 220, PLATFORM_KEY)
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

    // loop
    update() {
        this.player?.control()

        if (this.gameOver) {
            return
        }
    }
}