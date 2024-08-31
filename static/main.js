let word = '';
        let score = 0;
        let wordCount = 0;

        const confettiCanvas = document.getElementById('confettiCanvas');
        const ctx = confettiCanvas.getContext('2d');

        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        const stars = [];

        function createStar(x, y, spikes, outerRadius, innerRadius) {
            let rot = Math.PI / 2 * 3;
            let cx = x;
            let cy = y;
            let step = Math.PI / spikes;
            let path = new Path2D();
            path.moveTo(cx, cy - outerRadius);
            for (let i = 0; i < spikes; i++) {
                cx = x + Math.cos(rot) * outerRadius;
                cy = y - Math.sin(rot) * outerRadius;
                path.lineTo(cx, cy);
                rot += step;

                cx = x + Math.cos(rot) * innerRadius;
                cy = y - Math.sin(rot) * innerRadius;
                path.lineTo(cx, cy);
                rot += step;
            }
            path.lineTo(x, y - outerRadius);
            path.closePath();
            return path;
        }

        function randomColor() {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            return `rgb(${r},${g},${b})`;
        }

        function initConfetti() {
            for (let i = 0; i < 200; i++) {
                stars.push({
                    x: Math.random() * confettiCanvas.width,
                    y: Math.random() * confettiCanvas.height,
                    speedX: (Math.random() - 0.5) * 2,
                    speedY: Math.random() * 3 + 1,
                    size: Math.random() * 20 + 10,
                    color: randomColor(),
                    rotation: Math.random() * 360
                });
            }
        }

        function updateConfetti() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];

                ctx.save();
                ctx.translate(star.x, star.y);
                ctx.rotate((star.rotation * Math.PI) / 180);
                ctx.fillStyle = star.color;
                ctx.fill(createStar(0, 0, 5, star.size, star.size / 2));
                ctx.restore();

                star.y += star.speedY;
                star.x += star.speedX;
                star.rotation += star.speedY;

                if (star.y > confettiCanvas.height) {
                    star.y = -star.size;
                    star.x = Math.random() * confettiCanvas.width;
                }
            }

            requestAnimationFrame(updateConfetti);
        }

        function triggerConfetti() {
            confettiCanvas.style.display = 'block';
            initConfetti();
            updateConfetti();
            setTimeout(() => {
                confettiCanvas.style.display = 'none';
                stars.length = 0; // Clear stars array
            }, 3000); // Confetti duration
        }

        function startGame() {
            const username = document.getElementById('username').value;
            if (username) {
                document.querySelector('.greeting-container').style.display = 'none';
                document.getElementById('game-container').style.display = 'block';
                document.getElementById('game').style.display = 'block';
                document.getElementById('hello-message').innerText = 'Hello ' + username + '!';
                nextWord();
            } else {
                showPopup('Please enter your name to start the game.');
            }
        }
        
        function showPopup(message, isCorrect) {
            const popupContent = document.querySelector('#popup .popup-content p');
            const correctGif = document.getElementById('correct-gif');
            const incorrectGif = document.getElementById('incorrect-png');
        
            // Set the message
            popupContent.innerText = message;
        
            // Conditionally display the GIFs based on the message
            if (message.includes('Correct!') || message.includes('Incorrect.')) {
                if (isCorrect) {
                    correctGif.style.display = 'block';
                    incorrectGif.style.display = 'none';
                } else {
                    correctGif.style.display = 'none';
                    incorrectGif.style.display = 'block';
                }
            } else {
                correctGif.style.display = 'none';
                incorrectGif.style.display = 'none';
            }
        
            // Show the popup
            document.getElementById('popup').style.display = 'flex';
        }
        
        function closePopup() {
            document.getElementById('popup').style.display = 'none';
            document.getElementById('correct-gif').style.display = 'none';
            document.getElementById('incorrect-png').style.display = 'none';
        }
        
        
        function nextWord() {
            fetch('/scramble', { method: 'POST' })
                .then(response => response.json())
                .then(data => {
                    word = data.word;
                    document.getElementById('scrambled').innerText = data.scrambled_word;
                    document.getElementById('guess').value = '';
                    document.querySelector('input[value="Submit Guess"]').style.display = 'inline-block';
                    document.querySelector('input[value="Next Word"]').style.display = 'none';
                    wordCount++;
                    document.getElementById('word-count').innerText = 'Words Played: ' + wordCount;
                });
        }

        function submitGuess() {
            const guess = document.getElementById('guess').value;
            if (!guess) {
                showPopup('Please enter your guess.');
                return;
            }
            fetch('/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ guess, word })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'correct') {
                    score++;
                    showPopup('Correct! Great Job!!', true);
        
                    // Trigger confetti on specific scores
                    if (score % 10 === 0 && score <= 250) {
                        triggerConfetti();
                    }
        
                } else if (data.result == 'incorrect') {
                    showPopup('Incorrect. The word was ' + data.word, false);
                } else {
                    showPopup('An unexpected error occurred.');
                }
                document.getElementById('score').innerText = 'Score: ' + score;
                document.querySelector('input[value="Submit Guess"]').style.display = 'none';
                document.querySelector('input[value="Next Word"]').style.display = 'inline-block';
            });
        }

        function exitGame() {
            const username = document.getElementById('username').value;
            if (username) {
                showPopup(`Thanks for playing WordRang, ${username}!`);
            } else {
                showPopup('Thanks for playing WordRang!');
            }
            setTimeout(() => {
                location.reload();
            }, 2000); 
        }
        window.onload = function() {
            const text = "Welcome to WordRang!";
            const container = document.getElementById('welcome-text');
        
            container.innerHTML = '';  // Clear existing text
        
            text.split('').forEach((char, i) => {
                const span = document.createElement('span');
                span.textContent = char;
                container.appendChild(span);
                
                setTimeout(() => {
                    span.classList.add('visible');
                }, i * 100);  
            });
        };
        function pronounceWord() {
            const synth = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(word);
            synth.speak(utterance);
        }
        // Show the instructions modal when the page loads
        window.onload = function() {
            document.getElementById('instructions-modal').style.display = 'block';
        };

        // Close the instructions modal when OK is clicked
        function closeInstructions() {
            document.getElementById('instructions-modal').style.display = 'none';
        }

        // Adjust canvas size on window resize
        window.addEventListener('resize', () => {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        });