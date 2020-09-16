var config = {
    width: 500,
    height: 500,
    backgroundColor: 0x000000,
    scene: [BootGameScene, PlayGameScene] 
}

window.onload=function(){
    var game=new Phaser.Game(config);
}