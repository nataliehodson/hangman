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

    //get the content of text file containing 82095 English words
    const txtFile = new XMLHttpRequest();
    txtFile.open("GET", "./ukenglish.txt", true);
    txtFile.onreadystatechange = function() {
        if (txtFile.readyState === 4) {  //make sure the document is ready to parse
            if (txtFile.status === 200 || txtFile.status == 0) {  //make sure the file is found
                const allText = txtFile.responseText;
                wordList  = txtFile.responseText.split("\n"); //each word is an element in the wordList array

                
                let wordToGuess = wordList[Math.floor(Math.random() * wordList.length)]; //randomly select word from list
                if (wordToGuess.length < 3) { //if word is less than three letters long, choose another
                    wordToGuess = wordList[Math.floor(Math.random() * wordList.length)];
                }
                wordToGuess = wordToGuess.toLowerCase();//make sure it's all lowercase

                let splitWord = wordToGuess.split(''); //split word into seperate letters
                let gaps = [...Array(splitWord.length)].map(x => String.fromCharCode(95)); //create array with underscores for each letter
                gaps = gaps.join(' '); //make underscore array into string with each separated by a space (when it's an array, the elements are all separated by commas)

                word.textContent = gaps; //show correct amount of underscores on screen

                let lives = 10;


                function guessLetter() {
                    if (isNaN(guess.value)) { //make sure that input is a letter
                        guess.focus();
                        guess.value = guess.value.toLowerCase();
                        lettersGuessed.textContent += `${guess.value}, `; //add letter guessed to already guessed

                        if (splitWord.includes(guess.value)) { //guessed correct letter
                            for (let i = 0; i < splitWord.length; i++) { //check if letter is there multiple times
                                let index = splitWord.indexOf(guess.value)
                                gaps = gaps.split(' ') //make string into array
                                gaps[index] = guess.value; //make guessed letter appear in hidden word
                                gaps = gaps.join(' '); //make array into string (to make it pretty)

                                word.textContent = gaps; //show gaps updated on screen (underscores replaced with letters)
                                
                                splitWord[index] = ''; //remove letter from word
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
                            winOrLose.textContent = `Sorry, you lose! The word was ${wordToGuess}`;
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

                    
                    } else { //if input is not NaN
                        goodOrBad.textContent = 'Please enter a letter!';
                        guess.value = '';
                        guess.focus();
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
                    //reset everything to how it was at the start of the game
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
                    if (wordToGuess.length < 3) {
                        wordToGuess = wordList[Math.floor(Math.random() * wordList.length)];
                    }
                    wordToGuess = wordToGuess.toLowerCase();
                    splitWord = wordToGuess.split('');
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

