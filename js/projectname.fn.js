(function($) {
	//last li main nav
	var main = gid('main'),
		external = main.find('a[rel=external]');
	if( external.length )
		external.external_link();

	// hover dropdown
	// $('.dropdown-toggle').dropdownHover();

}(jQuery));

//get id with performance
function gid( theid ) {
	return $( document.getElementById( theid ) );
}

//debug
function log( m ) {
	console.log( m );
}

//attach external click function
$.fn.external_link = function() {
	var e_links = $(this);
	e_links.on('click', function( e ) {
		e.preventDefault();
		//open in a new tab
		window.open( this.href );
	});
}