class MovableObject extends DrawableObject {
  speed;
  otherDirection = false;
  currentImageIndices = {
    walking: 0,
    idle: 0,
    idleLong: 0,
    chickenWalking: 0,
    chickenSmallWalking: 0,
    jump: 0,
    hurt: 0,
    die: 0,
    bottleRotation: 0,
    bottleSplash: 0,
    alert: 0,
    attack: 0,
    fly: 0,
  };
  speedY = 0;
  speedX = 0;
  acceleration = 2;
  health = 100;
  intervalIdsMovableObjects = [];
  isFyling = false;
  individualIntervalIds = {};

  /**
   * This function moves any object to the left side. For the look there is an acceleration at the beginning of the movement because this feels more natural.
   */
  moveLeft() {
    if (this.speed > this.speedX) {
      this.x -= this.speedX;
      this.speedX += this.acceleration;
    } else {
      this.x -= this.speed;
    }
  }

  /**
   * This function moves any object to the right side. For the look there is an acceleration at the beginning of the movement because this feels more natural.
   */
  moveRight() {
    if (this.speed > this.speedX) {
      this.x += this.speedX;
      this.speedX += this.acceleration;
    } else {
      this.x += this.speed;
    }
  }

  /**
   * This function executes all kind of animations that run continuously, for example walking animations.
   *
   * @param {array} imagesAnimation -  Array that contains the paths of the images that are needed to find them in the image cache.
   * @param {string} animationType - This string is needed to finde the corresponding number in the currentImagesIndices object.
   */
  playContinuousAnimation(imagesAnimation, animationType) {
    let currentImageIndex = this.currentImageIndices[animationType];
    currentImageIndex = (currentImageIndex + 1) % imagesAnimation.length;
    this.currentImageIndices[animationType] = currentImageIndex;
    const imagePath = imagesAnimation[currentImageIndex];
    this.img = this.imageCache[imagePath];
  }

  /**
   * This function executes all kind of animations that run just a single time, for example the jump animation of the character.
   *
   * @param {array} imagesAnimation -  Array that contains the paths of the images that are needed to find them in the image cache.
   * @param {string} animationType - This string is needed to finde the corresponding number in the currentImagesIndices object.
   */
  playSingleRunAnimation(imagesAnimation, animationType) {
    let currentImageIndex = this.currentImageIndices[animationType];

    if (currentImageIndex < imagesAnimation.length) {
      const imagePath = imagesAnimation[currentImageIndex];
      this.img = this.imageCache[imagePath];
      this.currentImageIndices[animationType]++;
    }
  }

  /**
   * This function simulates the gravity of any object. If the object is above ground it subtracts the acceleration from its speedY until it is back on the ground.
   */
  applyGravity() {
    if (this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    }
  }

  /**
   * This function checks if an object is above ground which is in this case 250 pixels.
   *
   * @returns boolean
   */
  isAboveGround() {
    return this.y + this.height - this.adjustmentSprite < 440;
  }

  /**
   * This function replaces the image of the enemy.
   */
  enemyDiesAnimation() {
    let imgPath = this.imageDead[0];
    this.img = this.imageCache[imgPath];
  }

  /**
   * This function removes the enemy from the array "world.level.enemies". This happens after 1s so the dying animation stays for this time and then the enemy vanishes.
   */
  deleteEnemy() {
    const index = world.level.enemies.indexOf(this);
    if (index !== -1) {
      world.level.enemies.splice(index, 1);
    }
  }

  /**
   * This function sets stoppable intervals. It pushes the IDs into an array. If the interval should be stopped individually a key an be given as a string. In this case it is stored in the object "individualIntervalIds".
   *
   * @param {function} func - This is the function inside the interval.
   * @param {number} time - The time for the interval.
   * @param {string} key - Used to store an individual interval into the object "individualIntervalIds".
   */
  setStoppableInterval(func, time, key) {
    let id = setInterval(() => func.apply(this), time);
    this.intervalIdsMovableObjects.push(id);

    if (key) {
      if (!this.individualIntervalIds[key]) {
        this.individualIntervalIds[key] = [];
      }
      this.individualIntervalIds[key].push(id);
    }
  }

  /**
   * This function stops all the intervals of this movable object. The id's are stored in the movableObject class.
   */
  stopIntervalsMovableObjects() {
    this.intervalIdsMovableObjects.forEach(clearInterval);
  }

  /**
   * This funciton checks if an enemy is killed by the character.
   * 
   * @returns - boolean
   */
  checkKilledByCharacter() {
    return this.health === 0;
  }
}
