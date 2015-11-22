



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
					game = new Game(map);
					game.init(function ()
					{
						game.start();
					});
				},
				function (error){ console.log(error); });

			var elem = $('<button>Eteindre</button>');
			elem.on('click', function (){ 
				map.fadeOut(0);
				map.daredevil.fadeOut(0);
				map.vilain.fadeOut(0); 
			});
			$('body').append(elem);
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
	
	
	