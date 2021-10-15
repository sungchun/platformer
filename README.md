# platformer
A game, where you platform, and shoot things.
created movement by giving player dx properties, changing them based on keys pressed, and adding them to x and y values
created jumping by adding dy and gravity
created gravity by constantly reducing dy in animate loop except when on top of a platform
made an array of platforms
used array.find to find the closest platform and checking to see if player was standing on it
if player was standing on it turn off gravity
created a way so players can drop through platforms if they press "s"
implemented shooting where player clicks
made it so bullets originate from player model
