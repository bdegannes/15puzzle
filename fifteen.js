'use strict'
class Fifteen {
  constructor() {
    this.count = 1
    this.rowSize = 4;
    this.tileCount = 16;
    this.winState = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,""]].toString();
    this.tiles = document.getElementsByTagName("li");
  }

  // helper for itereating on NodeLists
  forEach (array, cb, scope) {
    for (let i = 0; i < array.length; i++) {
      cb.call(scope, array[i], i);
    }
  }

  getElementIndex (node) {
    var i = 0;
    while (node = node.previousElementSibling) { i +=1 }
    return i;
  }

  shuffle(array) {
    let m = array.length;
    let t;
    let i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  // method to shuffle tiles
  shuffleTiles () {
    let tiles = [];
    for(let i = 1; i < this.tileCount; i++ ) {
      tiles.push(i);
    }
    return this.shuffle(tiles);
  }

  // set up 15 puzzle board
  initBoard () {
    const board = document.getElementsByClassName('board');
    // shuffle board tiles
    let tiles = this.shuffleTiles();
    // create game board
    for (let j = 0; j < this.rowSize; j++) {
      // create ul to wrap each row on the board
      const ul = document.createElement("ul");

      for(let i = 1; i <= this.rowSize; i++) {
        const li = document.createElement("li");
        // grab a tile and set an id to its value
        let tileNumber = tiles.pop();
        li.setAttribute("id", tileNumber);

        if (this.count === this.tileCount) {
          // set a blank tile with an id 'empty'
          li.innerHTML = ""
          li.setAttribute("id", 'empty')
        } else {
          // set tile text value
          li.innerHTML = tileNumber
        };
        // append li to current row
        ul.appendChild(li);
        this.count += 1;
      }
      // add rows board
      board[0].appendChild(ul)
    }
  }

  shift (evt) {
    const blank = document.getElementById('empty')
    // get blank space current offset position
    const { blankLeft, blankTop } = this.emptyTilePosition();

    // get target offset positions
    const target = evt.target;
    const targetTop = evt.srcElement.offsetTop;
    const targetLeft = evt.srcElement.offsetLeft;

    // get parent elements for individual tile
    const targetParent = target.parentNode;
    const blankParent = blank.parentNode;

    // rows top offset
    const row = (targetTop === blankTop);
    // column left offset
    const column = (targetLeft === blankLeft);

    if (row) {
      // swap elements in the DOM
      if (blankLeft > targetLeft) {
        targetParent.insertBefore(blank, evt.target)
      } else {
        targetParent.insertBefore(blank, target.nextSibling);
      }
    } else if (column) {
        this.columnShift(target, blank)
    }
  }

  columnShift (target, blank) {
    // use array to hold elements in column that needs to shift
    let tilesToShift = [target];
    // grab all parent elements
    const ul = document.querySelectorAll('ul');
    // get index for parents and target
    const targetIdx = this.getElementIndex(target);
    const blankParentIdx = this.getElementIndex(blank.parentNode);
    let targetParentIdx = this.getElementIndex(target.parentNode);

    // add tiles to the tilesToShift
    while (targetParentIdx !== (blankParentIdx)) {
      // increment or decrement based on tile position
      if (targetParentIdx < blankParentIdx) {
        targetParentIdx += 1
      }  else {
        targetParentIdx -=1
      }

      // get next tile to shift and add to tilesToShift
      let nextParent = ul[targetParentIdx];
      let nextTarget = nextParent.childNodes[targetIdx]
      tilesToShift.push(nextTarget)
    }

    // remove blank element from array
    tilesToShift.pop()

    // iterate through array and shift
    for (let i = tilesToShift.length-1; i >= 0; i--){
      const space = document.getElementById('empty')

      const holderParent = tilesToShift[i].parentNode;
      const spaceParent = space.parentNode;
      const nextSpaceSib = space.nextElementSibling
      const nextTargetSib = tilesToShift[i].nextElementSibling

      spaceParent.insertBefore(tilesToShift[i], nextSpaceSib)
      holderParent.insertBefore(space, nextTargetSib)
    }
  }

  emptyTilePosition () {
    // get empty tile position
    const blank = document.getElementById('empty').getBoundingClientRect();
    const { left, top } = blank;

    const blankLeft = Math.ceil(left);
    const blankTop = Math.ceil(top);

    return { blankLeft, blankTop };
  }

  // check for winner on each turn
  checkIfSolved () {
    // get the currentState of our board
    let currentState = [];
    this.forEach(this.tiles, el => currentState.push(el.innerHTML))

    // compare with winState to see if solved
    if (this.winState === currentState.toString()) {
      const winnerBlock = document.querySelector('.win-message')
      winnerBlock.style.display = "block"
    }
  }

  init () {
    this.initBoard()

    // add event listeners
    this.forEach(this.tiles, (elem) => {
      if(elem.getAttribute("id") !== "empty"){
        elem.addEventListener("mousedown", (evt) => {
          this.shift(evt);
          this.checkIfSolved()
        }, false);
      }
    })
  }
}

window.onload = () => {
  const game = new Fifteen()
  game.init()
}
