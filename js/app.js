



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
					var elem = $('<button>Commencer la partie</button>');
					elem.on('click', function (e)
					{
						e.preventDefault();
						elem.remove();
						game = new Game(map);
						game.init(function ()
						{
							game.map.fadeIn(3000, function ()
							{
								game.map.daredevil.fadeIn(1200);
								game.map.vilain.fadeIn(1000);
							});
						});
					});
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
	
	
	