/*
OpenRailwayMap Copyright (C) 2012 Alexander Matheisen
This program comes with ABSOLUTELY NO WARRANTY.
This is free software, and you are welcome to redistribute it under certain conditions.
See http://wiki.openstreetmap.org/wiki/OpenRailwayMap for details.
*/


window.openrailwaymap = {
	'root': params['urlbase'],
	'apiUrl': 'https://api.openrailwaymap.org/',
	'tiledir': 'https://{s}.tiles.openrailwaymap.org/',
	'availableStyles': {
		"standard": "Infrastructure",
		"maxspeed": "Maxspeeds",
		"signals": "Signalling",
	},
	'availableTranslations': {
		"ca": "ca_ES",
		"cs": "cs_CZ",
		"da": "da_DK",
		"de": "de_DE",
		"el": "el_GR",
		"en": "en_GB",
		"es": "es_ES",
		"fi": "fi_FI",
		"fr": "fr_FR",
		"ja": "ja_JP",
		"lt": "lt_LT",
		"nl": "nl_NL",
		"nqo": "nqo_GN",
		"pl": "pl_PL",
		"pt": "pt_PT",
		"ru": "ru_RU",
		"sl": "sl_SI",
		"sv": "sv_SE",
		"tr": "tr_TR",
		"uk": "uk_UA",
		"vi": "vi_VN",
		"zh": "zh_TW"
	}
};


// main function, creates map and layers, controls other functions
isReady(function(event)
{
	getRequest(window.openrailwaymap.root + "/locales/" + getUserLang() + "/LC_MESSAGES/messages.json", function(response)
	{
		window.openrailwaymap.translations = JSON.parse(response);

		map = L.map('mapFrame');

		// railmap layer
		railmap = new L.TileLayer(window.openrailwaymap.tiledir+'standard/{z}/{x}/{y}.png',
		{
			attribution: _("Rendering: OpenRailwayMap"),
			minZoom: 2,
			maxZoom: 19,
			tileSize: 256
		}).addTo(map);

		setupControls();

		// set rendering style
		if (params['style'] != null && styleValid(params['style']))
			setStyle(params['style']);
		else
			setStyle("standard");

		// setting start position
		startposition = new Startposition(map);
	});
});


// changes the current map rendering style to the style given as parameter
function setStyle(style)
{
	// helper variable for saving current map style
	railmap.selectedStyle = style;
	// change tileserver url to load different style
	railmap._url = window.openrailwaymap.tiledir+style+'/{z}/{x}/{y}.png';
	// reload all tiles after style was changed
	railmap.redraw();
}


// changes the current map rendering style to the style given as parameter and updates legend, permalink and style selection
function applyStyle(style)
{
	setStyle(style);

	// mark selected item as checked
	var selectableItems = gEBI('styleSelectionBar').getElementsByTagName('input');
	for (var i=0; i<selectableItems.length; i++)
		if (selectableItems[i].value == style)
			var index = i;

	selectableItems[index].checked = true;
	updateLegend("legend", style);
	updatePermalink(railmap.selectedStyle);
}


// build a radio-button list of available map styles
function getStyleSelection()
{
	gEBI('styleSelectionBar').innerHTML = '<form id="styleSelection"><b>'+_("Select a map style")+':</b><br /><p>';
	for (var style in window.openrailwaymap.availableStyles)
		if (window.openrailwaymap.availableStyles.hasOwnProperty(style))
			gEBI('styleSelectionBar').innerHTML += '<label><input onchange="applyStyle(this.value)" type="radio" name="style" value="'+style+'">'+_(window.openrailwaymap.availableStyles[style])+'</label><br />';
	gEBI('styleSelectionBar').innerHTML += '</p></form>';
}


// returns true if the given stylename is a valid and available style; otherwise false is returned
function styleValid(style)
{
	return (window.openrailwaymap.availableStyles.hasOwnProperty(style));
}
