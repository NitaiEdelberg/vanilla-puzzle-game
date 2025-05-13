 /*                                                                            game logic                                                 */

    const board = document.getElementById('puzzle');
    let selected = null;
    let timer = null;
    // Get CSS variables grid and piece size from :root, convert to numbers
    const GRID = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-size'));
    const PIECE_SIZE = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--piece-size'));
 
    // create puzzle pieces with correct background position
    function createPieces() {
      for (let row = 0; row < GRID; row++) {
        for (let col = 0; col < GRID; col++) {
          const piece = document.createElement('div');
          piece.className = 'piece';

          // sopuse piece size is 100, row is 1 and col is 2,
          // the calculation will be: -200px -100px, means  move the piece 200 pixles left and 100 pixels up.
          const pos = `-${col * PIECE_SIZE}px -${row * PIECE_SIZE}px`; 
          
          piece.style.backgroundPosition = pos;
          piece.dataset.correct = pos;

          piece.addEventListener('click', () => handleClick(piece));
          board.appendChild(piece);
        }
      }
    }

    // Handle piece click and swap
    function handleClick(piece) { 
      if (!selected) {
        selected = piece;
        piece.classList.add('selected'); // Highlight selected piece
        return;
      }

      if (piece === selected) {
        piece.classList.remove('selected'); // remove if the same piece is clicked
        selected = null;
        return;
      }
      
      const temp = piece.style.backgroundPosition;
      piece.style.backgroundPosition = selected.style.backgroundPosition; // Swap positions
      selected.style.backgroundPosition = temp;

      piece.classList.remove('selected');
      selected.classList.remove('selected');
      selected = null;

      checkWin();
    }

    // Shuffle pieces randomly
    function shuffle() {
      const pieces = Array.from(board.children);
      const positions = pieces.map(t => t.style.backgroundPosition);
      positions.sort(() => Math.random() - 0.5);
      pieces.forEach((piece, i) => {
        piece.style.backgroundPosition = positions[i];
      });
      timer = Date.now();
    }

    // Check if the puzzle is solved, all pieces in the correct position
    function checkWin() {
      const pieces = Array.from(board.children);
      const won = pieces.every(piece => {
        // get the position as the browser see it
        // and compare it with the correct position
        const [x1, y1] = getComputedStyle(piece).backgroundPosition
          .replace(/px/g, '')
          .split(' ')
          .map(Number);
        const [x2, y2] = piece.dataset.correct
          .replace(/px/g, '')
          .split(' ')
          .map(Number);
        return x1 === x2 && y1 === y2;
      });
      if (won) {
        const game_time = Math.floor((Date.now() - timer) / 1000); // the time it took in seconds
        setTimeout(() => alert('הצלחת!'), 100);
        setTimeout(() => alert(`הזמן שלך: ${game_time} שניות`), 100);

        timer = null;
      }
    }

    createPieces(); // Init the puzzle pieces