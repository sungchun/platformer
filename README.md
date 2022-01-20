# Circle Destroyer 2022

## Deployment:

This game has been deployed via GitHub Pages and is available to play here.

## How to download:

To download the game files you can either clone the repository or download them as a ZIP file here.

If you want to clone the repository:
Click the button labeled ‘Code’.
On the dropdown menu select HTTPS and copy the link provided.
Using the terminal, navigate to where you want to clone the repository and execute the command: “git clone (copied HTTPS link)”
If you want to download the ZIP file:
Click the button labeled ‘Code’
Click the ‘Download ZIP’ button on the dropdown menu.

## Goal and Timeframe:

The objective of this project was to create a fully playable browser game within 7 days.

## Project Overview:

This project was the first project I did during my Software Engineering Immersive course at General Assembly. This project began after my cohort and I had learned about JavaScript, HTML and CSS. 

My project is a game that is hosted on a website where all of the mechanics and visuals are created using JavaScript, HTML and CSS.

## Technology used:

HTML5
HTML Canvas
CSS3
JavaScript
Git

## Gameplay:

Circle Destroyer 2022 is a game where the player plays as a rectangle and tries to achieve the highest score possible. The rectangle can run and jump around an arena and fire bullets that eliminate enemies.

The player increases their score by eliminating enemies, their score also increases periodically if they stay alive.

## Process

### Planning
The first step for this project was to come up with an idea. My aim was to make a game that I would enjoy playing, and I eventually came up with the idea for a survival-platformer. I created a wire-frame for how I wanted the final game to look.

### Shooting

The first thing that I did was create the shooting mechanics. 
I created a ‘Projectile’ class that houses the size, position, and speed of the bullets.
An object that holds key value pairs of key names and booleans tracks whether buttons have been pressed or released.
I set a maximum shooting speed by only allowing the player to shoot in 300ms intervals.
‘bulletArray’ is an array that holds all the instances of the ‘Projectile’ class.
When the player fires a bullet, the corresponding Projectile in ‘bulletArray’ is pushed to the ‘shotBulletArray’.
The game animates all the bullets in the ‘shotBulletArray’ so they are seen flying across the screen.
The game takes the coordinate of where the player clicked and calculates the x and y velocities so the bullet will hit said coordinate.
The bullet is also set to originate from the player’s position.









### Movement
Next, I created the movement mechanics.
The rectangle that the player controls is an instance of the ‘Entity’ class.
The method ‘WhereTo’ of the Entity class changes the velocity of the rectangle according to which button is pressed.



























The ‘stop’ method checks to see when the player stops pressing the key and resets the rectangle’s movement. 








In order for the player to be able to jump, I had to create a gravity mechanic.
Gravity constantly pulls the player downwards at a set velocity.
The ‘isOnPlatform’ method checks all the platforms in the game and finds the one closest to the player. 
If the player is standing on that platform then gravity will stop pulling them down.

### Enemies

The enemies in this game needed to be able to follow the player wherever they went and avoid obstacles.
In order for the enemies to find a path to the player, I needed to create a graph of nodes on top of the game canvas.
‘pathfinder’ is a method on the ‘Enemy’ class that creates a path of nodes from the enemy to the player using the Breadth First Search algorithm.
This method links all the nodes on the path together.






















‘makeThePath’ is a method of the ‘Enemy’ class that turns the aforementioned path into an array of node coordinates that the enemy will follow to reach the player.
























The next method of the ‘Enemy’ class is ‘movementLoop’.
This method uses the function ‘velocityHypot’  to give the enemy an x and y velocity based on its position relative to the player. 
It repeats this continuously as the enemy iterates through the path of nodes.
If the enemy has not reached the end of the path it calls itself to repeat the process. Otherwise, it stops chasing the player.
The ‘movementLoop’ is set to be a 400ms timeout so the enemy only changes direction every 400ms. 
Without the 400ms delay the game would lag.

To register when the enemies successfully hit the player, I used the ‘touchedHero’ method.
This function calculates the length of the hypotenuse of the triangle created by the difference in x and y between the enemy and the player. If the distance is less than the radius of the enemy it registers a hit by reducing the player’s health.

## Bugs
The major known bugs are as follows:
Collision detection between enemies and the player is inconsistent. Sometimes it only registers if the center of the enemy touches the player.
Enemies become ‘confused’ for a moment if they are at the corner of a platform.
When enemies get close to the player they slow down significantly.    

## Wins
### Enemy AI
The biggest thing that I’m proud of was the enemy AI. I had no idea how to create a pathfinding algorithm before the project and it took me a full day to research the topic. 
I then had to create the algorithm and implement it into the game. The implementation of the algorithm to the enemy AI was the most difficult challenge during this project.The logic behind making the enemies use the algorithm and follow it was very complicated. Managing to overcome these challenges and have the AI working was something I am very proud of.
Overall Gameplay
Apart from the Enemy AI, the other aspects of the game (movement, platforming and shooting) all work quite smoothly and the player experience is quite smooth. Each of these mechanics were their own challenge and the fact that they all work together smoothly is a great achievement for me. 
In addition, I believe that the gameplay of this game is quite enjoyable. The game is not perfect but the core gameplay is fun to play and ultimately that was my number one goal for this project.

## Challenges

The biggest challenges I faced while making this project were:
Breadth First Search pathfinding algorithm (learning and implementing it in a short time frame).
Enemy movement (logic involved with having the enemies follow the path to the player).



## Takeaways

This project helped me to solidify my ability to use HTML, CSS and JavaScript to create a webpage. It also pushed me to be creative and intelligent about overcoming the problems I faced. My key takeaways are:
How to make a pathfinding algorithm.
A lot of experience in debugging and problem solving.
Experience in using HTML5 Canvas.
Great increase in JavaScript skill.
Using object-oriented programming to make the code more efficient.

## Future Improvements
    Features I would add if I were to improve the game include:
Different weapons/power ups that can be picked up.
An inventory so the player can choose which weapons to use.
Different kinds of enemies.

