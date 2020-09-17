import Phaser from 'phaser'

const formatScore = (score: integer) => `Score: ${score}`
const LABEL_X: integer = 16
const LABEL_Y: integer = 16
const LABEL_STYLE = { fontSize: '30px', color: '#000' }

export default class ScoreLabel extends Phaser.GameObjects.Text {
    private score: integer = 0
    constructor(scene: Phaser.Scene, score: integer) {
        super(scene, LABEL_X, LABEL_Y, formatScore(score), LABEL_STYLE)
        this.score = score
    }

    addScore(score: integer) {
        this.score += score
        this.updateLabel()
    }

    updateLabel() {
        this.setText(formatScore(this.score))
    }
}