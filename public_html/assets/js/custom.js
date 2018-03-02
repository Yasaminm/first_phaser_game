(function () {

    var platforms;
    var smallGround;
    var player;
    var dog1;
    var dog2;
    var dog3;
    var cursors;
    var jumpBtn;
    var stars;
    var diamonds;
    var score = 0;
    var scoreText;
    var fx;
////console.log(Phaser);
//first we make a new Phaser Game object and we need three main functions to make a game run(Preload, Create, Update).
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });

//in preload we load the needed images
    function preload() {
        //Bild laden    (Bezeichnung, Bildpfad)
        game.load.image('sky', 'assets/images/sky.png');
        game.load.image('ground', 'assets/images/platform.png');
        game.load.image('ground_small', 'assets/images/platform-small.png');
        game.load.image('star', 'assets/images/star.png');
        game.load.image('diamond', 'assets/images/diamond.png');
        //to load a sprit sheet we nee other method,
        //                    (Beyeichnung,Bildpfad     FrameBreit, FrameHÃ¶he)
        game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
        game.load.spritesheet('baddie', 'assets/images/baddie.png', 32, 32);

        //audio sound 
        game.load.audio('sfx', ['assets/soundsEffects/fx_mixdown.mp3', 'assets/soundsEffects/fx_mixdown.ogg']);

    }
    ;
//in create we define the elements positions.
    function create() {
        //Einschalten von physikalischen Eigenschaften eines Arcade Spiels
        game.physics.startSystem(Phaser.Physics.ARCADE);
        //hinyufÃ¼gen eines Elements auf dem canvas
        game.add.sprite(0, 0, 'sky');
//    smallGround = game.add.sprite(200, 150, 'ground_small');
        //Erstellen einer Platform
        platforms = game.add.group();
        smallGround = game.add.group();
        //Physics der Gruppe platforms Ã¼bergeben
        platforms.enableBody = true;
        smallGround.enableBody = true;
        //Platyieren eines Plattform Elements (x,y, 'name des Bildes')
        var g1 = platforms.create(0, game.world.height - 64, 'ground');
        //Element skalieren
        g1.scale.setTo(2, 2);
        // 2 weitere Platform Elemente installieren
        var g2 = platforms.create(-100, 400, 'ground');
        var g3 = platforms.create(500, 300, 'ground');
        var g4 = smallGround.create(200, 150, 'ground_small');
        g1.body.immovable = true;
        g2.body.immovable = true;
        g3.body.immovable = true;
        g4.body.immovable = true;

        //Sterne Gruppe stars anlegen
        stars = game.add.group();
        stars.enableBody = true;
        for (var i = 0; i < 10; i++) {
            var star = stars.create(i * 80, Math.random() * 400, 'star');
//       star.body.gravity.y = 100;
            star.body.bounce.y = Math.random() * 0.2 + 0.5;
        }
        ;

        //Diamonde Gruppe diamond anlegen
        diamonds = game.add.group();
        diamonds.enableBody = true;
        for (var i = 0; i < 3; i++) {
            var diamond = diamonds.create(i * 200, Math.random() * 600, 'diamond');
//       diamond.body.gravity.y = 100;
            diamond.body.bounce.y = Math.random() * 0.2 + 0.5;
        }
        ;


        //Player einbouen dude
        player = game.add.sprite(200, 50, 'dude');
        dog1 = game.add.sprite(790, 250, 'baddie');
        dog2 = game.add.sprite(700, 250, 'baddie');
        dog3 = game.add.sprite(0, 100, 'baddie');
        //Physics an player Ã¼bergeben
        game.physics.arcade.enable(player);
        game.physics.arcade.enable(dog1);
        game.physics.arcade.enable(dog2);
        game.physics.arcade.enable(dog3);
        //physikalische Eigenschaften festlegen
        player.body.gravity.y = 400;
        dog1.body.gravity.y = 300;
        dog2.body.gravity.y = 300;
        dog3.body.gravity.y = 300;
        //bounce
        player.body.bounce.y = 0.2;
        dog1.body.bounce.y = 0.1;
        dog2.body.bounce.y = 0.1;
        dog3.body.bounce.y = 0.1;
        //Kollision setzen
        player.body.collideWorldBounds = true;
        dog1.body.collideWorldBounds = true;
        dog2.body.collideWorldBounds = true;
        dog3.body.collideWorldBounds = true;
        //Player Animation
        //                   (name, Array Frames Index, Frames pro Sekunde,loop)
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        dog1.animations.add('left', [0, 1], 10, true);
        dog1.animations.add('right', [2, 3], 10, true);
        dog2.animations.add('left', [0, 1], 10, true);
        dog2.animations.add('right', [2, 3], 10, true);
        dog3.animations.add('left', [0, 1], 10, true);
        dog3.animations.add('right', [2, 3], 10, true);

        //Steuerung mit Tastatur erlauben
        cursors = game.input.keyboard.createCursorKeys();
//     console.log(cursors);
        //Leertaste
        jumpBtn = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //Text platyieren
        scoreText = game.add.text(20, 20, 'Score: ' + score, {
            fontSize: '30px',
            fill: '#fff'
        });
        
        //audio 
        fx = game.add.audio('sfx');
        fx.allowMultiple = true;
        fx.addMarker('ping', 10, 1.0);
    }
    ;
    var direction1 = -1;
    var direction2 = -1;
    var direction3 = -1;

//Update function contains the collisions because this function will be called in loop,
    function update() {
        //Kollision zwischen 2 objekten
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(dog1, platforms);
        game.physics.arcade.collide(dog2, platforms);
        game.physics.arcade.collide(dog3, platforms);
        game.physics.arcade.collide(player, smallGround);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.collide(diamonds, platforms);

        //Ãœberlappung zweier objeckte
        game.physics.arcade.overlap(player, stars, collectStar, null, this);
        game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
        game.physics.arcade.overlap(player, dog1, playerKilled, null, this);
        game.physics.arcade.overlap(player, dog2, playerKilled, null, this);
        game.physics.arcade.overlap(player, dog3, playerKilled, null, this);
        //Geschwindigkeit des Players in x Richtung px/sekunde.
        player.body.velocity.x = 0;
//     player.body.velocity.y = '';
        if (cursors.left.isDown) {
            player.body.velocity.x = -150; //150 pixels pro seconds.
            player.animations.play('left'); //Animation left abspielen
        } else if (cursors.right.isDown) {
            player.body.velocity.x = +150;
            player.animations.play('right');
        } else {
            player.animations.stop(); //Animation stoppen
            player.frame = 4; //Anzeige des Frames Index 4
        }
        ;
        if ((jumpBtn.isDown || cursors.up.isDown) && player.body.touching.down) {
            player.body.velocity.y = -380;
//        player.animations.play('right'); 
        }


        dog1.body.velocity.x = -150 * direction1;
        if (dog1.x <= 0) {
            direction1 = -1;
            dog1.animations.play('right');
        }
        ;
        if (dog1.x >= game.world.width - 32) {
            direction1 = 1;
            dog1.animations.play('left');
        }

        dog2.body.velocity.x = -50 * direction2;
        if (dog2.x <= 500) {
            direction2 = -1;
            dog2.animations.play('right');
        }
        ;
        if (dog2.x >= game.world.width - 32) {
            direction2 = 1;
            dog2.animations.play('left');
        }

        dog3.body.velocity.x = -50 * direction3;
        if (dog3.x <= 0) {
            direction3 = -1;
            dog3.animations.play('right');
        }
        ;
        if (dog3.x >= 250) {
            direction3 = 1;
            dog3.animations.play('left');
        }


        function collectStar(player, o) {
            console.log(o.key);// 'star
            fx.play('ping');
            o.kill();
            //if 'star'.....
            score++;
            scoreText.text = 'Score: ' + score;
        }
        ;

        function collectDiamond(player, o) {
            o.kill();
            score += 5;
            scoreText.text = 'Score: ' + score;
        }
        ;

        function playerKilled(player, dog) {
            player.kill();
        }
        ;

    }
    ;
})();