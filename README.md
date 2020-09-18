- Install node modules: ```npm install```
- Run local server: ```npm run start```
- Static resource in ```/public/assets```
- Declare optional-undefined attribute (attribute can be undefined) with ```?```: ```private player?: Phaser.Physics.Arcade.Sprite```
- Check object availability before access its optional-undefined attributes
  ```
  if (this.player) {
      doSomething(this.player.x)
  }
  ```
- Scene structure:
  - ```preload()```: load assets: images, audio, etc.
  - ```create()```: add game objects to the scene (init + draw + collision)
  - ```update()```: loop (events, control, animations, game over)