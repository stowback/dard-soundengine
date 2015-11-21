



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
			map.init(
				function ()
				{
					map.vilain.audio.panner.setPosition(0, 100, 0);
					// map.vilain.fadeIn();
					var elem = $('<button>gauche</button>');
					elem.on('click', function (e)
					{
						console.log('gauche');
						e.preventDefault();
						map.vilain.audio.panner.setPosition(-1, 100, 0);
					});
					var elem2 = $('<button>centre</button>');
					elem2.on('click', function (e)
					{
						console.log('centre');
						e.preventDefault();
						map.vilain.audio.panner.setPosition(0, 100, 0);
					});
					var elem3 = $('<button>droite</button>');
					elem3.on('click', function (e)
					{
						console.log('droite');
						e.preventDefault();
						map.vilain.audio.panner.setPosition(1, 100, 0);
					});
					$('body').append(elem);
					$('body').append(elem2);
					$('body').append(elem3);
					// map.vilain.audio.volume.gain.value = 1;
					// console.log(map.vilain.audio.volume);
					// var elem
					// var elem = $('<button>Commencer la partie</button>');
					// elem.on('click', function (e)
					// {
					// 	e.preventDefault();
					// 	elem.remove();
					// 	game = new Game(map);
					// 	game.init(function ()
					// 	{
					// 		// game.map.fadeIn(5000, function ()
					// 		// {
					// 		// 	console.log('fade in terminé');
					// 		// 	console.log('------------------');
					// 		// 	game.map.fadeOut(2000, function (){ console.log('fade out terminé'); });
					// 		// });
					// 		//game.map.daredevil.fadeIn();
							
					// 		// game.map.vilain.fadeIn();
					// 		console.log(map.vilain.audio.volume);
					// 	});
					// });
					$('body').append(elem);
				},
				function (error){ console.log(error); });
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
	
	
	