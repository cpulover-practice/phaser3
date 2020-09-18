import PlayGameScene from './scenes/PlayGameScene';

export default class Collision {
    // private static _scene?: PlayGameScene

    static setup(scene: PlayGameScene) {
        // this._scene = scene
        if (scene.player && scene.platforms && scene.bombSpawner?.group && scene.starSpawner?.group) {
            scene.physics.add.collider(scene.player, scene.platforms)
            scene.physics.add.collider(scene.starSpawner.group, scene.platforms)
            scene.physics.add.collider(scene.platforms, scene.bombSpawner.group)
            scene.physics.add.collider(scene.bombSpawner.group, scene.bombSpawner.group) // add collider between bombs

            scene.physics.add.overlap(scene.player, scene.starSpawner.group,
                // wrap another function inside callback to pass scene param 
                function (thePlayer: Phaser.GameObjects.GameObject, theStar: Phaser.GameObjects.GameObject) {
                    Collision.playerCollectsStar(thePlayer, theStar, scene)
                }, undefined, scene)

            scene.physics.add.collider(scene.player, scene.bombSpawner.group,
                function (thePlayer: Phaser.GameObjects.GameObject, theBomb: Phaser.GameObjects.GameObject) {
                    Collision.playerHitsBomb(thePlayer, theBomb, scene)
                }, undefined, scene)
        }
    }

    static playerCollectsStar(thePlayer: Phaser.GameObjects.GameObject, theStar: Phaser.GameObjects.GameObject, scene: PlayGameScene) {
        // cast type
        const star = theStar as Phaser.Physics.Arcade.Image
        // hide the collected star
        star.disableBody(true, true)
        // update score
        scene.scoreLabel?.addScore(1)

        // count number of active stars (not collected)
        if (scene.starSpawner?.group?.countActive(true) === 0) {
            // re-active all the stars
            scene?.starSpawner?.group?.children.iterate(child => {
                // cast type
                const star = child as Phaser.Physics.Arcade.Image
                star.enableBody(true, star.x, 0, true, true)
            })
            // generate new bomb
            scene?.bombSpawner?.spawn(scene?.player?.x)
        }
    }

    static playerHitsBomb(thePlayer: Phaser.GameObjects.GameObject, theBomb: Phaser.GameObjects.GameObject, scene: PlayGameScene) {
        scene.physics.pause()
        scene.player?.setTint(0xff0000)
        // this.player?.anims.play(ANI_PLAYER_FRONT_KEY)
        scene.gameOver = true
    }
}