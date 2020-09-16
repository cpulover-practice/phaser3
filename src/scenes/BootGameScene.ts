import Phaser from 'phaser'

export default class BootGameScene extends Phaser.Scene {
    private platforms?: Phaser.Physics.Arcade.StaticGroup // "?" means attribute could be undefined
    private player?: Phaser.Physics.Arcade.Sprite
    private cursor?: Phaser.Types.Input.Keyboard.CursorKeys
    private stars?: Phaser.Physics.Arcade.Group

    constructor() {
        super('boot-game')
    }

    // load assets: images, audio, etc.
    preload() {
        // static images
        this.load.image('sky', 'assets/sky.png')
        this.load.image('platform', 'assets/platform.png')
        this.load.image('star', 'assets/star.png')
        this.load.image('bomb', 'assets/bomb.png')
        // sprite for animation
        this.load.spritesheet('dude', 'assets/dude.png', {
            frameWidth: 32,
            frameHeight: 48
        })
    }

    // add objects to the scene (init and draw)
    create() {
        this.add.image(0, 0, 'sky').setOrigin(0, 0) // reset the drawing position of the image to the top-left        

        // platforms
        this.platforms = this.physics.add.staticGroup()
        const ground = this.platforms.create(400, 568, 'platform') as Phaser.Physics.Arcade.Image
        ground.setScale(2).refreshBody()
        this.platforms.create(600, 400, 'platform')
        this.platforms.create(50, 250, 'platform')
        this.platforms.create(750, 220, 'platform')

        // player
        this.player = this.physics.add.sprite(100, 450, 'dude')
        this.player.setBounce(0.3)
        this.player.setCollideWorldBounds(true)
        this.physics.add.collider(this.player, this.platforms)

        // player key controls
        this.cursor = this.input.keyboard.createCursorKeys()

        // player animations
        this.anims.create({
            key: 'playerTurnLeft',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1 // loop infinitely
        })

        this.anims.create({
            key: 'playerTurn',
            frames: [{
                key: 'dude',
                frame: 4
            }],
            frameRate: 20
        })

        this.anims.create({
            key: 'playerTurnRight',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        })

        // stars
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        })

        this.physics.add.collider(this.stars, this.platforms)
        this.stars.children.iterate(child => {
            // cast type
            const star = child as Phaser.Physics.Arcade.Image
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        }

        )

    }

    // loop
    update() {
        // events
        if (this.cursor?.left?.isDown) {
            this.player?.setVelocityX(-160)
            this.player?.anims.play('playerTurnLeft', true)
        } else if (this.cursor?.right?.isDown) {
            this.player?.setVelocityX(160)
            this.player?.anims.play('playerTurnRight', true)
        } else {
            this.player?.setVelocityX(0)
            this.player?.anims.play('playerTurn')
        }
        // jump
        if (this.cursor?.up?.isDown && this.player?.body.touching.down) {
            this.player.setVelocityY(-330)
        }
    }
}