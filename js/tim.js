/*global $ */

$(document).ready(function () {
    "use strict";
    
	// page js
	// -------------------------------------------------------------------------------------
	var page         = $('#page'),
		alphabet     = '`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?',
		verbInterval = 0,
		charInterval = 0,
        bringOut     = 0;
    
	function renderTemplate(name, titleText) {
		if (titleText) {
			$('title').html(titleText);
		} else {
			$('title').text(name);
		}
		page.html($('#' + name + '-template').html());
		$(page.children()[0]).attr('id', name);
	}
    
    function renderHome() {

        renderTemplate('home', 'tim(othy)');

        var verb           = $('#verb'),
            verbs          = ['read', 'code', 'write', 'walk', 'ponder', 'hike', 'garden'],
            verbIndx       = 0,
            maxVerbLen     = 0,
            blankText      = '',
            verbText       = '',
            r              = '',
            i              = 0,
            charPeriod     = 35,
            verbPeriod     = 3200,
            randCharNum    = 6,
            randChar       = 0,
            charIndx       = 0;
        verbs.forEach(function (item) {
            maxVerbLen = Math.max(maxVerbLen, item.length);
        });
        
        //verbText = new Array(maxVerbLen + 1).join('_');
        for (i = 0; i < maxVerbLen; i += 1) {
            blankText += '_';
        }

        // timing intervals
        verbInterval = setInterval(function () {
            
            verbText = blankText;
            charInterval = setInterval(function () {
                if (charIndx < verbs[verbIndx].length) {
                    if (randChar < randCharNum) {
                        r        = Math.floor(alphabet.length * Math.random());
                        verbText = verbText.substr(0, charIndx) + alphabet[r] + verbText.substr(charIndx + 1);
                        randChar += 1;
                    } else {
                        verbText = verbText.substr(0, charIndx) + verbs[verbIndx][charIndx] + verbText.substr(charIndx + 1);
                        charIndx += 1;
                        randChar = 0;
                    }
                    verb.text(verbText);
                } else {
                    verbText = verbs[verbIndx] + verbText.substr(verbs[verbIndx].length);
                    verbIndx = (verbIndx + 1) % verbs.length;
                    randChar  = 0;
                    charIndx  = 0;
                    verb.text(verbText);
                    clearInterval(charInterval);
                }
            }, charPeriod);
        }, verbPeriod);
    }
    
	// route hashchanges to page
	function router() {

		// clear last page stuff
		clearInterval(charInterval);
		clearInterval(verbInterval);

		// cache page & url
		page = page || $('#page');

		// off-page hash

        $('#page section').addClass('bringOut');

        bringOut = setTimeout(function () {
            page.removeClass('rendered');
            page.addClass('routing');

            renderHome();

            // setup
            page.addClass('rendered');

            $('html,body').animate({
                scrollTop: 0
            }, 512);

            clearInterval(bringOut);
        }, 500);
	}

	// listen for hash change or page load
	$(window).on('hashchange', router);
	$(window).on('load', router);

});