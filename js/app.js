



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
	
	
	