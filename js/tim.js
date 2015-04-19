$(document).ready(function() {
	// page js
	// -------------------------------------------------------------------------------------
	var page              = $('#page'),
		alphabet          = '`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?',
		verbInterval      = 0,
		charInterval      = 0,
		secondInterval    = 0,
		secondBigInterval = 0,
		initHoldOff       = 0,
		bringOut          = 0;
    
	function renderTemplate( name, titleText ) {
		if (titleText) {
			$('title').html(titleText);
		} else {
			$('title').text(name);
		}
		page.html( $('#'+name+'-template').html() );
		$(page.children()[0]).attr('id',name);
	}
    
    function renderHome() {

        renderTemplate( 'home', 'tim(othy)' );

        var verb           = $('#verb'),
            verbs          = ['read', 'code', 'write', 'walk', 'ponder', 'hike', 'garden'],
            verbIndx       = 0,
            maxVerbLen     = 0,
            verbText       = '',
            r              = '',
            charPeriod     = 40,
            verbPeriod     = 2500,
            randCharNum    = 5,
            randChar       = 0,
            charIndx       = 0;
        verbs.forEach(function(item) {
            maxVerbLen = Math.max(maxVerbLen , item.length);
        });

        // timing intervals
        verbInterval = setInterval(function() {
            verbText = Array( maxVerbLen + 1 ).join('_');
            charInterval = setInterval(function() {
                if ( charIndx < verbs[verbIndx].length ) {
                    if (randChar < randCharNum) {
                        r        = Math.floor( alphabet.length * Math.random() );
                        verbText = verbText.substr( 0, charIndx ) + alphabet[r] + verbText.substr( charIndx + 1 );
                        randChar++;
                    } else {
                        verbText = verbText.substr( 0, charIndx ) + verbs[verbIndx][charIndx] + verbText.substr( charIndx + 1 );
                        charIndx++;
                        randChar = 0;
                    }
                    verb.text( verbText );
                } else {
                    verbText = verbs[verbIndx] + verbText.substr( verbs[verbIndx].length );
                    verbIndx = (verbIndx + 1) % verbs.length;
                    randChar  = 0;
                    charIndx  = 0;
                    verb.text( verbText );
                    clearInterval( charInterval );
                }
            }, charPeriod );
        }, verbPeriod );
    }
    
	// route hashchanges to page
	function router() {

		// clear last page stuff
		clearInterval( charInterval );
		clearInterval( verbInterval );
		clearInterval( secondBigInterval );
		$('.holdoff-time').removeClass('holdoff-time');

		// cache page & url
		page = page || $('#page');
		url  = location.hash.slice(1) || '!/home';

		// off-page hash
		if ( url.slice(0,2) == '!/' ) {

			$('#page section').addClass('bringOut');

			bringOut = setTimeout( function() {
				page.removeClass('rendered');
				page.addClass('routing');

                renderHome();

				// setup
				page.addClass('rendered');

				$('html,body').animate({
					scrollTop: 0
				}, 512);

				clearInterval( bringOut );
			}, 500 );

		// on-page hash = scroll to any on page target
		} else {
			if ( url == 'back' || url == 'next' ) {
				backNextChange( url );
			} else {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top - 60
					}, 512);
				}
			}
		}
	}
    
    initHoldOff = setTimeout( function() {
		$('.holdoff').removeClass('holdoff');
		clearTimeout( initHoldOff );
	}, 256 );

	// listen for hash change or page load
	$(window).on('hashchange', router );
	$(window).on('load', router );

});