



	/**
	*
	*	Map.class.js
	*	------------------
	*	DESC | Manage the map width different districts/objects sounds
	*
	*/






	/*----------  DEFINITION  ----------*/



	// Object
	
	var Map = function (config)
	{

		// Config
		this.config = config;

		// Properties
		this.name,
		this.dimensions,
		this.sources,
		this.objects,
		this.districts = null;

		// Audio
		this.audio = {};

		// Sounds
		this.buffers = null;
		this.sounds = { objects: [], districts: [] };

		// Characters
		this.daredevil,
		this.vilain = null;

	};


	// Init
	
	Map.prototype.init = function (success, error)
	{

		// Uniform	
		window.AudioContext = (
	 		window.AudioContext ||
	  		window.webkitAudioContext ||
	  		null
		);
		if(!AudioContext){ error("AudioContext not supported"); return false; }
		
		// Audio
		this.audio.context = new AudioContext();
		this.audio.volume = this.audio.context.createGain();
		this.audio.mixer = this.audio.context.createGain();
		this.audio.flatGain = this.audio.context.createGain();
		this.audio.mixer.connect(this.audio.flatGain);
		this.audio.flatGain.connect(this.audio.volume);
		this.audio.volume.connect(this.audio.context.destination);

		// Disable sound
		this.audio.volume.gain.value = 0;

		// Data
		this.loadData(success, error);

	};

	Map.prototype.loadData = function (success, error)
	{

		// Reference
		var that = this;

		// Request
		$.getJSON(this.config.paths.maps + this.config.map.model + '.map')
		.success(function (data)
			{
				// Store
				that.name = data.name;
				that.dimensions = data.dimensions;
				that.sources = data.sounds;
				that.objects = data.objects;
				that.districts = data.districts;

				// Dimensions
				that.dimensions.total = that.dimensions.width*that.dimensions.length;
				that.dimensions.totalIndexs = that.dimensions.total - that.dimensions.width;

				// Callback
				that.createDistricts(0, success, error);
			})
		.error(function (err){ error("Failed to load data"); });

	};

	Map.prototype.createDistricts = function (i, success, error)
	{

		// Reference
		var that = this;

		// No more districts ?
		if(i >= this.districts.length){ this.createObjects(0, 0, success, error); return; }

		// Manage district
		if(this.districts[i])
		{
			// Audio object
			var district = {};
			district.source = this.audio.context.createBufferSource();
			district.source.loop = true;
			district.volume = this.audio.context.createGain();
			district.source.connect(district.volume);
			district.volume.connect(this.audio.volume);

			// No sound
			district.volume.gain.value = 0;

			// Bufferize
			this.loadBuffer(this.config.paths.sounds + this.sources[this.districts[i].sound],
			function (buffer)
			{
				// Update audio
				district.buffer = buffer;
				district.source.buffer = district.buffer;
				district.source.start(0);

				// Store
				that.districts[i].audio = district;
				that.sounds.districts.push(district);

				// Next
				that.createDistricts(i+1, success, error);
			},
			error);
		}
		else{ this.createDistricts(i+1, success, error); }

	};

	Map.prototype.createObjects = function (x, y, success, error)
	{

		// Reference
		var that = this;

		// No more cells
		if(x*y >= this.dimensions.totalIndexs){ this.createCharacters(success, error); return; }

		// Manage cell
		if(this.objects[y][x])
		{
			// Tmp
			var tmp = this.objects[y][x];

			// Audio object
			var object = {};
			object.source = this.audio.context.createBufferSource();
			object.source.loop = true;
			object.panner = this.audio.context.createPanner();
			object.volume = this.audio.context.createGain();
			object.source.connect(object.volume);
			object.volume.connect(object.panner);
			object.panner.connect(this.audio.mixer);

			// Position
			object.panner.setPosition(tmp.position.x, tmp.position.y, tmp.position.z);

			// Volume
			object.volume.gain.value = this.config.map.objects.volume * tmp.volume;
			// object.volume.gain.value = 0;

			// Bufferize
			this.loadBuffer(this.config.paths.sounds + this.sources[this.objects[y][x].sound],
			function (buffer)
			{
				// Update audio
				object.buffer = buffer;
				object.source.buffer = object.buffer;
				object.source.start(0);

				// Store
				that.objects[y][x].audio = object;
				that.sounds.objects.push(object);

				// Next
				if(x < that.dimensions.width){ that.createObjects(x+1, y, success, error); }
				else{ that.createObjects(0, y+1, success, error); }
			},
			error);
		}
		else
		{
			if(x < this.dimensions.width){ this.createObjects(x+1, y, success, error); }
			else{ this.createObjects(0, y+1, success, error); }
		}

	};

	Map.prototype.createCharacters = function (success, error)
	{

		// Reference
		var that = this;

		// Daredevil
		this.daredevil = new Character();
		this.daredevil.init(this.config.paths.sounds + this.config.characters.daredevil.sound.file, this.audio,
			function ()
			{
				// Vilain
				that.vilain = new Character();
				that.vilain.init(that.config.paths.sounds + that.config.characters.kidnapper.sound.file, that.audio,
					function ()
					{
						that.vilain.audio.panner.setPosition(-150, 10, 0);
						that.vilain.audio.volume.gain.value = 2;
						
						// Callback
						success();
					}
				);
			}
		);

	}









	/*----------  METHODS  ----------*/





	// Fade
	
	Map.prototype.fadeIn = function ()
	{

		this.audio.volume.gain = 1;

	}


	



	








	/*----------  UTILS  ----------*/




	// Load sound
	
	Map.prototype.loadBuffer = function (url, success, error)
	{

		// Reference
		var that = this;

		// Request
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = "arraybuffer";
		request.onload = function ()
		{
			// Bufferize
			that.audio.context.decodeAudioData(request.response, 
				function (buffer){ success(buffer); },
				function (){ error('Unvalid buffer format'); }
			);
		};
		request.send();

	};










	
	