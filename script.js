function playHangman() {
    const guess = document.querySelector('.letterGuess');
    const word = document.querySelector('.word');
    const guesses = document.querySelector('.guesses');
    const lettersGuessed = document.querySelector('.lettersGuessed');
    const submit = document.querySelector('.submit');
    const goodOrBad = document.querySelector('.goodOrBad');
    const winOrLose = document.querySelector('.winOrLose');
    const restart = document.querySelector('.restart');

    guess.focus();
    let wordList;

    const txtFile = new XMLHttpRequest();
    txtFile.open("GET", "./ukenglish.txt", true);
    txtFile.onreadystatechange = function() {
        if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
            if (txtFile.status === 200 || txtFile.status == 0) {  // Makes sure it's found the file.
                const allText = txtFile.responseText;
                wordList  = txtFile.responseText.split("\n"); // Will separate each line into an array

                //randomly select word from list
                let wordToGuess = wordList[Math.floor(Math.random() * wordList.length)];
                wordToGuess = wordToGuess.toLowerCase();

                //split word into seperate letters
                let splitWord = wordToGuess.split('');
                //create array with underscores for each letter
                let gaps = [...Array(splitWord.length)].map(x => String.fromCharCode(95));
                gaps = gaps.join(' ');


                word.textContent = gaps;

                let lives = 10;


                function guessLetter() {

                    //make sure that input is a letter
                    if (isNaN(guess.value)) {
                        guess.focus();
                        //add letter guessed to already guessed
                        lettersGuessed.textContent += `${guess.value}, `;

                        //guessed correct letter
                        if (splitWord.includes(guess.value)) {

                            //check if letter is there multiple times
                            for (let i = 0; i < splitWord.length; i++) {
                                let index = splitWord.indexOf(guess.value)
                                //make guessed letter appear in hidden word
                                gaps = gaps.split(' ') //make string into array
                                gaps[index] = guess.value;
                                gaps = gaps.join(' '); //make array into string (to make it pretty)

                                word.textContent = gaps;
                                //remove letter from word
                                splitWord[index] = '';
                                restart.style.display = 'none';

                            }
                            goodOrBad.textContent = 'Good guess!';

                        //check if word contains guessed letter
                        } else if (!splitWord.includes(guess.value)) {
                            goodOrBad.textContent = 'Wrong!';
                            lives--;
                            restart.style.display = 'none';
                        }

                        //if you run out of lives
                        if (lives === 0){ 
                            winOrLose.textContent = `Sorry, you lose! \nThe word was ${wordToGuess}`;
                            endGame();
                        }

                        //if you win
                        if (!gaps.includes('_')) {
                            winOrLose.textContent = 'Well done, you win!!'
                            endGame();
                        }

                        //empty input field
                        guess.value = '';

                        guesses.textContent = lives;

                    
                    } else { //if input is number
                        goodOrBad.textContent = 'Please enter a letter!';
                        guess.value = '';
                    }

                }

                function endGame(){
                    //disable input and guess button
                    guess.disabled = true;
                    submit.disabled = true;
                    submit.style.cursor = 'default';
                    //show restart button
                    restart.style.display = 'block';
                    restart.addEventListener('click', restartGame);
                }

                submit.addEventListener('click', guessLetter);

                function restartGame () {
                    const resetGame = document.querySelectorAll('.game-container p');
                    for (const reset of resetGame){
                        reset.textContent = ''
                    }
                    guesses.textContent = '10';
                    guess.disabled = false;
                    submit.disabled = false;
                    lives = 10;

                    submit.style.cursor = 'pointer';


                    //random new word
                    wordToGuess = wordList[Math.floor(Math.random() * wordList.length)];
                    wordToGuess = wordToGuess.toLowerCase();
                    //split word into seperate letters
                    splitWord = wordToGuess.split('');
                    //create array with underscores for each letter
                    gaps = [...Array(splitWord.length)].map(x => String.fromCharCode(95));
                    word.textContent = gaps;
                    restart.style.display = 'none';
                    gaps = gaps.join(' ');
                    word.textContent = gaps;
                    guess.focus();
                    }

                }
            }
    }

    txtFile.send(null);
}

