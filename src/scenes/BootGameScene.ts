import Phaser from 'phaser'

// KEY IDENTIFIERS
// for scene
const LEVEL1_KEY = 'level1'
// for assets
const SKY_KEY = 'sky'
const PLATFORM_KEY = 'platform'
const STAR_KEY = 'star'
const BOMB_KEY = 'bomb'
// for animations
const ANI_PLAYER_FRONT_KEY = 'playerFront'
const ANI_PLAYER_TO_LEFT_KEY = 'playerToLeft'
const ANI_PLAYER_TO_RIGHT_KEY = 'playerToRight'

export default class BootGameScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup // "?" means attribute could be undefined
    private player?: Phaser.Physics.Arcade.Sprite
    private cursor?: Phaser.Types.Input.Keyboard.CursorKeys
    private stars?: Phaser.Physics.Arcade.Group
    private score: integer = 0
    private scoreText?: Phaser.GameObjects.Text
    private bombs?: Phaser.Physics.Arcade.Group

    constructor() {
        super(LEVEL1_KEY)
    }

    preload() { // load assets: images, audio, etc.
        // static images
        this.load.image(SKY_KEY, 'assets/sky.png')
        this.load.image(PLATFORM_KEY, 'assets/platform.png')
        this.load.image(STAR_KEY, 'assets/star.png')
        this.load.image(BOMB_KEY, 'assets/bomb.png')
        // sprite for animation
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        })
    }

    create() { // create objects to the scene (init and draw)
        this.createCommonComponents()
        this.platforms = this.createPlatforms()
        this.player = this.createPlayer()
        this.stars = this.createStars()
        this.bombs = this.createBombs()

        this.setupCollisions()
    }

    private createCommonComponents() {
        // background
        this.add.image(0, 0, SKY_KEY).setOrigin(0, 0) // reset the drawing position of the image to the top-left        
        // score text
        this.scoreText = this.add.text(16, 16, "Score: 0", { fontSize: '32px', fill: 'black' })
        // player key controls
        this.cursor = this.input.keyboard.createCursorKeys()
    }

    private createStars() {
        const stars = this.physics.add.group({
            key: STAR_KEY,
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        })

        stars.children.iterate(child => {
            // cast type
            const star = child as Phaser.Physics.Arcade.Image
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        }
        )
        return stars
    }

    private setupPlayerAnimations() {
        this.anims.create({
            key: ANI_PLAYER_TO_LEFT_KEY,
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1 // loop infinitely
        })

        this.anims.create({
            key: ANI_PLAYER_FRONT_KEY,
            frames: [{
                key: 'dude',
                frame: 4
            }],
            frameRate: 20
        })

        this.anims.create({
            key: ANI_PLAYER_TO_RIGHT_KEY,
            frames: this.anims.generateFrameNumbers('dude', {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        })
    }

    private createBombs() {
        const bombs = this.physics.add.group()
        return bombs
    }

    private createPlayer() {
        const player = this.physics.add.sprite(100, 450, 'dude')
        player.setBounce(0.3)
        player.setCollideWorldBounds(true)
        this.setupPlayerAnimations()
        return player
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

    // OVERLAPING-COLLISION
    private setupCollisions() {
        if (this.player && this.platforms && this.bombs && this.stars) {
            this.physics.add.collider(this.player, this.platforms)
            this.physics.add.collider(this.stars, this.platforms)
            this.physics.add.overlap(this.stars, this.player, this.collectStar, undefined, this)
            this.physics.add.collider(this.platforms, this.bombs)
            this.physics.add.collider(this.bombs, this.bombs) // add collider between bombs
            this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this)
        }
    }

    // OVERLAPPING-COLLISION HANDLES
    private collectStar(thePlayer: Phaser.GameObjects.GameObject, theStar: Phaser.GameObjects.GameObject) {
        // cast type
        const star = theStar as Phaser.Physics.Arcade.Image
        // hide the collected star
        star.disableBody(true, true)
        // update score
        this.score += 10
        this.scoreText?.setText(`Score: ${this.score}`)

        // count number of active stars (not collected)
        if (this.stars?.countActive(true) === 0) {
            // re-active all the stars
            this.stars.children.iterate(child => {
                // cast type
                const star = child as Phaser.Physics.Arcade.Image
                star.enableBody(true, star.x, 0, true, true)
            })

            if (this.player) { // check optinal attribute object availability before access its attributes (player.x, player.y,...)
                // set bom X-position away from player X-position
                const bombX = (this.player.x > 400)
                    ? Phaser.Math.Between(0, 300)
                    : Phaser.Math.Between(500, 800)

                // generate new bomb
                const bomb: Phaser.Physics.Arcade.Image = this.bombs?.create(bombX, 0, BOMB_KEY)
                bomb.setCollideWorldBounds(true)
                bomb.setBounce(1)
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
            }
        }
    }

    private hitBomb(thePlayer: Phaser.GameObjects.GameObject, theBomb: Phaser.GameObjects.GameObject) {
        this.physics.pause()
        this.player?.setTint(0xff0000)
        this.player?.anims.play(ANI_PLAYER_FRONT_KEY)
    }

    // loop
    update() {
        // events
        if (this.cursor?.left?.isDown) {
            this.player?.setVelocityX(-160)
            this.player?.anims.play(ANI_PLAYER_TO_LEFT_KEY, true)
        } else if (this.cursor?.right?.isDown) {
            this.player?.setVelocityX(160)
            this.player?.anims.play(ANI_PLAYER_TO_RIGHT_KEY, true)
        } else {
            this.player?.setVelocityX(0)
            this.player?.anims.play(ANI_PLAYER_FRONT_KEY)
        }
        // jump
        if (this.cursor?.up?.isDown && this.player?.body.touching.down) {
            this.player.setVelocityY(-330)
        }
    }
}