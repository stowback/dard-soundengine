



	/**
	*
	*	App.js
	*	-------------------
	*	DESC | Main app script
	*
	*/





	/*----------  LAUNCH  ----------*/




	// Properties
	
	var config = {};

	var map, game = null;



	// Ready

	$(function ()
	{

		// Setup
		$.ajaxSetup({ cache: false });

		// Config
		loadConfig(function (data)
		{
			// Store
			config = data;

			// Create map
			map = new Map(config);

			// Init
			map.init(
				function ()
				{
					// Create game
					game = new Game(map);

					// Moves
					$(window).on('keydown', function (e)
					{
						switch(e.keyCode)
						{
							case 37: game.setDaredevilMove("left"); break;
							case 39: game.setDaredevilMove("right"); break;
						}
					});

					// Init
					game.init(function ()
					{
						game.start();
					});


					// Callbacks
					game.callbacks.onWin = function (data){ console.log(data); };
					game.callbacks.onLose = function (data){ console.log(data); };
					game.callbacks.onClue = function (data){ console.log(data); };
				},
				function (error){ console.log(error); });

			var elem = $('<button>Eteindre</button>');
			elem.on('click', function (){ 
				map.fadeOut(0);
				map.daredevil.fadeOut(0);
				map.vilain.fadeOut(0); 
			});

			var pause = $('<button>Pause</button>');
			pause.on('click', function (){ game.setPause(true); });

			var play = $('<button>Play</button>');
			play.on('click', function (){ game.setPause(false); });

			var resume = $('<button>Resume</button>');
			resume.on('click', function (){ game.resume(); });

			$('body').append(elem).append(pause).append(play).append(resume);
		});	

	});










	/*----------  METHODS  ----------*/


	// Config
	
	function loadConfig (callback)
	{

		$.getJSON('js/config.json')
		.success(function (data){ callback(data); })
		.error(function (err){ console.log(err); });

	}
	
	
	