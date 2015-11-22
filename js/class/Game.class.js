



	/**
	*
	*	Game.class.js
	*	------------------
	*	DESC | Manage a game with players, map and results
	*
	*/






	/*----------  DEFINITION  ----------*/



	// Object
	
	var Game = function (map)
	{

		// Map
		this.map = map;

		// Properties
		this.properties = {
			clues: 0,
			district: 0,
			cell: 0,
			advancing: 0,
		};

		// Shorcuts
		this.kidnapperAdvance = this.map.config.characters.kidnapper.advance;

		// Time
		this.time = {
			started: null,
			current: null,
		};

		// Ride
		this.ride = [];

	};


	// Init
	
	Game.prototype.init = function (callback)
	{

		// Create ride
		// ...
		
		// Positions
		this.map.daredevil.move(parseInt(this.map.dimensions.width/2), 0);
		this.map.vilain.move(parseInt(this.map.dimensions.width/2), this.map.config.characters.kidnapper.advance);
		this.map.audio.context.listener.setPosition(this.map.dimensions.width/2, 0, 0);

		
		// Callback
		callback();

	};













	/*----------  METHODS  ----------*/




	// Start
	
	Game.prototype.start = function ()
	{

		// Self
		var self = this;

		// Map sound
		this.map.fadeIn(3000, function ()
		{
			
			// Characters sounds
			this.map.daredevil.fadeIn(1000);
			this.map.vilain.fadeIn(1200);

			// Time
			self.time.started = new Date().getTime();

			// Update loop
			console.log(self.map);
			self.update();

		});		

	};


	// Update
	
	Game.prototype.update = function ()
	{

		// Self
		var self = this;

		// Time
		this.time.current = new Date().getTime();
		var elapsed = this.time.current - this.time.started;
		
		// 
		var distance = (elapsed/1000)*this.map.config.characters.speed;
		this.map.daredevil.move(this.map.daredevil.position.x, distance);
		this.map.vilain.move(this.map.daredevil.position.x, distance + this.kidnapperAdvance);
		this.map.audio.context.listener.setPosition(this.map.daredevil.position.x, distance, 0);
		console.log(parseInt(elapsed/1000));

		// Loop
		window.requestAnimationFrame(function (){ self.update(); });

	};
	



















