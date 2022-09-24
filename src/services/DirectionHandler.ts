import { Platform } from '../game_elements/Platform'
import { Direction } from '../types/Direction'
import { Ball } from '../game_elements/Ball'
import Rules from '../main/game_config'
import { sound } from '../modules/sound'
import { GameState } from '../types/GameState'

export default class DirectionHandler {
  private ball: Ball
  private gameState: GameState
  private platform: Platform
  private direction: Direction

  constructor(
      ball: Ball,
      gameState: GameState,
      platform: Platform,
      direction: Direction,
  ) {
    this.ball = ball
    this.gameState = gameState
    this.platform = platform
    this.direction = direction
  }

  public control(): void {
    if (this.direction.arrowsState.ArrowLeft) {
      this.platform.move(0)
      /** Если мячик не в полёте - он движется вместе с платформой */
      if (!this.ball.isFlying) {
        this.ball.x = this.platform.x + this.platform.width / 2
      }
      this.direction.platformDirection = 'left'
    }

    if (this.direction.arrowsState.ArrowRight) {
      this.platform.move(1)
      /** Если мячик не в полёте - он движется вместе с платформой */
      if (!this.ball.isFlying) {
        this.ball.x = this.platform.x + this.platform.width / 2
      }
      this.direction.platformDirection = 'right'
    }

    if (this.direction.arrowsState.ArrowUp) {
      if (!this.ball.isFlying) {
        if (this.direction.platformDirection === 'right') {
          this.ball.xVelocity = -4
          this.ball.rotateSpeed = 6
        } else {
          this.ball.xVelocity = 4
          this.ball.rotateSpeed = -6
        }
      }
      this.ball.isFlying = true
      this.ball.fly()
    }
  }

  /** Обработка нажатий на клавиатуру */
  public handleKeyPressed(key: string, status: boolean): void {
    if (key === ' ') {
      this.keyWithDelayPressed(key)
    }

    if (key === 's') {
      this.keyWithDelayPressed(key)
    }

    if (!this.gameState.showStartMenu && !this.gameState.isGameOver) {
      if (key === 'ArrowUp') {
        /** Если шарик в полёте - блокируем стрелку вверх */
        this.direction.arrowsState.ArrowUp = this.ball.isFlying ? false : status
      }

      if (key === 'ArrowLeft') {
        this.direction.arrowsState.ArrowLeft = status
      }

      if (key === 'ArrowRight') {
        this.direction.arrowsState.ArrowRight = status
      }
    }
  }

  public keyWithDelayPressed(key: string): void {
    if (!this.direction.keyDelayStatus.delayInProgress[key] && !this.direction.keyDelayStatus.keyDelay[key]) {
      this.direction.keyDelayStatus.delayInProgress[key] = true
      setTimeout(() => {
        this.direction.keyDelayStatus.delayInProgress[key] = false
        this.direction.keyDelayStatus.keyDelay[key] = false
      }, 400)
    }

    if (!this.direction.keyDelayStatus.keyDelay[key]) {
      switch (key) {
        case ('s'):
          Rules.systemInfo = !Rules.systemInfo;
          break
        case (' '):
          this.spacePressed();
          break
      }
      this.direction.keyDelayStatus.keyDelay[key] = true
    }
  }

  public spacePressed(): void {
    if (this.gameState.showStartMenu) {
      sound.track1.stop()
      this.gameState.isMusicOn = false
      this.gameState.showStartMenu = false
    }

    if (this.gameState.isGameOver) {
      this.ball.lives = this.gameState.lives
      this.gameState.isMusicOn = false
      this.gameState.showStartMenu = true
      this.gameState.isGameOver = false
      this.gameState.showLevel = true
      this.gameState.isRestart = true
    }
  }
}