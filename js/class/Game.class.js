



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

		// Navigation
		this.move = {
			moving: false,
			direction: null,
			started: null,
		};

		// Ride
		this.ride = null;

		// Time
		this.time = {
			current: null,
			started: null,
		};

		// Ride
		this.ride = [];

	};


	// Init
	
	Game.prototype.init = function (callback)
	{

		// Create ride
		this.ride = this.createRide();
		
		// Positions
		this.map.daredevil.move(parseInt(this.map.dimensions.width/2), 0);
		this.map.vilain.move(parseInt(this.map.dimensions.width/2), this.map.config.characters.kidnapper.advance);
		this.map.audio.context.listener.setPosition(this.map.dimensions.width/2, 0, 0);

		
		// Callback
		callback();

	};


	// Ride
	
	Game.prototype.createRide = function ()
	{

		// Path
		var path = new Array(this.map.dimensions.length);

		// Start
		path[0] = parseInt(this.map.dimensions.width/2);

		// Generate
		for(var i=0; i<this.map.dimensions.length; i++)
		{
			if(path[i] == null)
			{
				// Previous
				var previous = path[i-1];

				// Trajectory
				var models = ["right", "ahead", "left"];
				if(previous<=0){ models = ["ahead", "left"]; }
				if(previous>=this.map.dimensions.width-1){ models = ["right", "ahead"]; }
				var trajectory = models[Math.floor(Math.random()*(models.length))];

				// Length
				var trajectory_length = Math.floor(Math.random()*this.map.config.map.ride.trajectory_max_length) + this.map.config.map.ride.trajectory_min_length;

				// Create path
				for(var j=0; j<trajectory_length; j++)
				{
					// Previous
					var trajectory_previous = path[(i+j)-1];

					// Add path
					if(trajectory == "right"){
						if(trajectory_previous-1 < 0){ path[i+j] = trajectory_previous; break; }
						else{ path[i+j] = trajectory_previous-1; }
					}
					if(trajectory == "left"){
						if(trajectory_previous+1 >= this.map.dimensions.width){ path[i+j] = trajectory_previous; break; }
						else{ path[i+j] = trajectory_previous+1; }
					}
					if(trajectory == "ahead"){ path[i+j] = trajectory_previous; }
				}

			}
		}

		// Return
		return path;

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
			self.move.started = self.time.started;

			// Update loop
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
		
		// Length
		var distance = (elapsed/1000)*this.map.config.characters.speed;

		// Dardevil
		var move_distance = 0;
		if(this.move.moving)
		{
			if(this.time.current > this.move.started + this.map.config.characters.daredevil.moves.duration)
			{
				this.move.moving = false;
				this.move.direction = null;
				this.move.started = null;
			}
			else
			{
				move_distance = ((this.time.current - this.move.started)/this.map.config.characters.daredevil.moves.duration)*this.map.config.characters.daredevil.moves.distance;
				if(this.move.direction == "left"){ move_distance = -move_distance; }
				// console.log(move_distance);
			}
		}

		// Positions
		this.map.daredevil.move(this.map.daredevil.position.x + move_distance, distance);
		this.map.audio.context.listener.setPosition(this.map.daredevil.position.x + move_distance, distance, 0);
		this.map.vilain.move(this.map.vilain.position.x, distance + this.kidnapperAdvance);

		// District
		// console.log(this.map.sounds.districts[0].volume.gain.value);
		if(this.properties.district < this.map.sounds.districts.length-1)
		{
			if(distance/this.map.config.map.points.height > this.map.sounds.districts[this.properties.district+1].distance)
			{
				console.log('ca change');
				// Fades
				this.map.sounds.districts[this.properties.district].fadeOut(10000);
				this.map.sounds.districts[this.properties.district+1].fadeIn(10000);

				// Store
				this.properties.district++;
			}
		}
		console.log(parseInt(elapsed/1000));

		// Loop
		window.requestAnimationFrame(function (){ self.update(); });

	};


	// Navigation
	
	Game.prototype.setMoveDirection = function (move)
	{

		if(!this.move.moving)
		{
			this.move.moving = true;
			this.move.direction = move;
			this.move.started = new Date().getTime();
		}

	};
	



















