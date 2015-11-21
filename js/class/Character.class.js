



	/**
	*
	*	Character.class.js
	*	------------------
	*	DESC | Manage a character on the map with its sounds
	*
	*/






	/*----------  DEFINITION  ----------*/



	// Object
	
	var Character = function ()
	{

		// Audio
		this.audio = {};

	};


	// Init
	
	Character.prototype.init = function (sound, audio, success, error)
	{

		// Reference
		var that = this;

		// Audio
		this.audio.source = audio.context.createBufferSource();
		this.audio.source.loop = true;
		this.audio.panner = audio.context.createPanner();
		this.audio.volume = audio.context.createGain();
		this.audio.source.connect(this.audio.volume);
		this.audio.volume.connect(this.audio.panner);
		this.audio.panner.connect(audio.mixer);

		this.audio.volume.gain.value = 0;

		// Load
		var request = new XMLHttpRequest();
		request.open('GET', sound, true);
		request.responseType = "arraybuffer";
		request.onload = function ()
		{
			// Bufferize
			audio.context.decodeAudioData(request.response,
				function (buffer)
				{
					// Buffer
					that.audio.buffer = buffer;
					that.audio.source.buffer = that.audio.buffer;

					that.audio.source.start(0);

					// Callback
					success();
				},
				function (){ error('Error with audio buffer'); }
			);
		};
		request.send();

	};











	/*----------  METHODS  ----------*/




	//  Volume
	
	Character.prototype.setVolume = function (volume)
	{

		this.audio.volume.gain.value = volume;

	};


	// Fade
	
	Character.prototype.fadeIn = function (duration)
	{

		this.setVolume(1);

	};

	Character.prototype.fadeOut = function (duration)
	{

		this.setVolume(0);

	};













	