import {SCORE_LABEL} from '../constants/SCORE_LABEL'

import Phaser from 'phaser'

const formatScore = (score: integer) => `Score: ${score}`

export default class ScoreLabel extends Phaser.GameObjects.Text {
    private score: integer = 0
    
    constructor(scene: Phaser.Scene, score: integer) {
        super(scene, SCORE_LABEL.X, SCORE_LABEL.Y, formatScore(score), SCORE_LABEL.STYLE)
        this.score = score

        scene.add.existing(this)
    }

    addScore(score: integer) {
        this.score += score
        this.updateLabel()
    }

    updateLabel() {
        this.setText(formatScore(this.score))
    }
}