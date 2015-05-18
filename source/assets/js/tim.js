/*globals $,microformat,timeDuration,renderMicroFormat,ganttResume,timResume,timContact,console,prettyPrint*/

$(document).ready(function () {

/*
	var pithies = [
		'Sometimes I think orchestras rock out harder than metal heads.',
		'I would alter Freud\'s statement to say "to love and to learn"',
		'This is some pithy quote that would sum up myself & this whole website.',
		'Unquestionably, one ought never be board, for there are far to great a number of things to fascinate and occupy the mind.',
		'What you are about to experience may or may not make sense; either you <em>will</em> understand, or you will have been given <strong>strings</strong>, threads to unravel a spool of endless topics <em>to</em> understand.'
	];
*/

	// page js
	// -------------------------------------------------------------------------------------
	var page              = $('#page'),
		second            = $('#second'),
		minute            = $('#minute'),
		hour              = $('#hour'),
		localtime         = $('#localtime'),
		bigSecond         = {},
		bigMinute         = {},
		bigHour           = {},
		bigWord           = {},
		local             = {},
		utc               = {},
		julian            = {},
		posix             = {},
		hash              = '',
        urlpath           = '',
        filename          = '',
        newlocation       = '',
		alphabet          = '`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?',
		verbInterval      = 0,
		verbTimeout       = 0,
		charInterval      = 0,
		secondInterval    = 0,
		secondBigInterval = 0,
		initHoldOff       = 0,
		bringOut          = 0,
		pageOrder         = ['home', 'epigraph', 'synopsis', 'ruminations', 'resume', 'colophon', 'contact'],
		currentPage       = 0,
		geometers         = '<h1 class="geometers">&Alpha;&Gamma;&Epsilon;&Omega;&Mu;&Epsilon;&Tau;&Rho;&Eta;&Tau;&Omicron;&Sigma; &Mu;&Eta;&Delta;&Epsilon;&Iota;&Sigma; &Epsilon;&Iota;&Sigma;&Iota;&Tau;&Omega;</h1>';

    
	// General Functions
	// -------------------------------------------------------------------------------------
	function wordTime(time) {
		var hour      = time.getHours(),
			minute    = time.getMinutes(),
			second    = time.getSeconds(),
			ones      = [null, 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
			teens     = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
			tens      = [null, null, 'twenty', 'thirty', 'forty', 'fifty'],
			hourStr   = '',
			minuteStr = '',
			secondStr = '';
		if (second === 0) {
			secondStr = '&nbsp;';
		} else if (second < 10) {
			secondStr = 'o\'' + ones[second];
		} else if (second < 19) {
			secondStr = teens[second - 10];
		} else {
			secondStr  = tens[Math.floor(second / 10)];
			secondStr += (second % 10 === 0) ? '' : '-' + ones[second % 10];
		}
		if (minute === 0) {
			minuteStr = 'o\'clock';
		} else if (minute < 10) {
			minuteStr = 'o\'' + ones[minute];
		} else if (minute < 19) {
			minuteStr = teens[minute - 10];
		} else {
			minuteStr  = tens[Math.floor(minute / 10)];
			minuteStr += (minute % 10 === 0) ? '' : '-' + ones[minute % 10];
		}
		hourStr = ones.concat(teens)[hour % 12];
		return '<p>' + hourStr + '</p><p>' + minuteStr + '</p><p>' + secondStr + '</p>';
	}

	function tickClock() {
		var now    = new Date(),
			hrDeg  = 180 + Math.floor(360 * (now.getHours()   / 12)) % 360,
			minDeg = 180 + Math.floor(360 * (now.getMinutes() / 60)),
			secDeg = 180 + Math.floor(360 * (now.getSeconds() / 60));
		second.css('-webkit-transform', 'rotate(' + secDeg + 'deg)');
		minute.css('-webkit-transform', 'rotate(' + minDeg + 'deg)');
		hour.css('-webkit-transform', 'rotate(' + hrDeg + 'deg)');
		localtime.html('<h4><span class="time">' + now.toLocaleTimeString().split('').join('</span><span class="time">') + '</span> <small><span class="time">' + now.toLocaleDateString().split('').join('</span><span class="time">') + '</span></small></h4>');
		return false;
	}
	function tickBigClock() {
		var now    = new Date(),
			hrDeg  = 180 + Math.floor(360 * (now.getHours()   / 12)) % 360,
			minDeg = 180 + Math.floor(360 * (now.getMinutes() / 60)),
			secDeg = 180 + Math.floor(360 * (now.getSeconds() / 60)),
            isoString  = now.getUTCFullYear() + '-' + (now.getUTCMonth() + 1) + '-' + now.getUTCDate() + 'T' + now.getUTCHours() + ':' + now.getUTCMinutes() + ':' + now.getUTCSeconds();

		bigSecond.css('-webkit-transform', 'rotate( ' + secDeg + 'deg)');
		bigMinute.css('-webkit-transform', 'rotate( ' + minDeg + 'deg)');
		bigHour.css('-webkit-transform', 'rotate(' + hrDeg + 'deg)');

		bigWord.html(wordTime(now));
		local.text(now.toLocaleString());
		utc.text(now.toUTCString());
		posix.text((+Math.floor(now / 1000)));
		julian.text(((now / 86400000) + 2440587.5));

		bigWord.attr('datetime', isoString);
		local.attr('datetime', isoString);
		utc.attr('datetime', isoString);
		posix.attr('datetime', isoString);
		julian.attr('datetime', isoString);

		return false;
	}
	function renderTemplate(name, titleText) {
		if (titleText) {
			$('title').html(titleText);
		} else {
			$('title').text(name);
		}
		page.html($('#' + name + '-template').html());
		$(page.children()[0]).attr('id', name);
	}
	function backNextChange(url) {
		if (url === 'back') {
			currentPage = (currentPage > 0) ? (currentPage - 1) : 0;
			window.location = window.location.href.replace(window.location.hash, '') + '#!/' + pageOrder[currentPage];
		} else if (url === 'next') {
			currentPage = (currentPage < pageOrder.length - 1) ? (currentPage + 1) : pageOrder.length - 1;
			window.location = window.location.href.replace(window.location.hash, '') + '#!/' + pageOrder[currentPage];
		}
	}

    // add string formatting
    if (!String.prototype.format) {
        String.prototype.format = function() {
            var str = this.toString();
            if (!arguments.length)
                return str;
            var args = typeof arguments[0],
                args = (("string" === args || "number" === args) ? arguments : arguments[0]);
            for (arg in args)
                str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
            return str;
        }
    }
    
	// store pages
	var pages = {
		home     : function () {
            
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
                verbPeriod     = 800,
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
            
            // 'build' verb by randomly iterate thru characters and 'landing' on correct letters
            function renderVerb() {

                // initialize verb
                clearTimeout(verbTimeout);
                verbText = blankText;
                verbIndx = (verbIndx + 1) % verbs.length;
                randChar  = 0;
                charIndx  = 0;
                verb.text(verbText);

                // iterate thru random characters for each letter
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
                        randChar  = 0;
                        charIndx  = 0;
                        verb.text(verbText);
                        clearInterval(charInterval);
                        // wait for next verb
                        verbTimeout = setTimeout(renderVerb, verbPeriod);
                    }
                }, charPeriod);
            }

            // kickoff first timeout
            verbTimeout = setTimeout(renderVerb, verbPeriod);
		},
		epigraph    : function () {
			renderTemplate('epigraph', 'tim(othy) > epigraph');
		},
		synopsis    : function () {
			renderTemplate('synopsis', 'tim(othy) > synopsis');
		},
		ruminations : function () {
			renderTemplate('ruminations', 'tim(othy) > ruminations');
		},
		projects : function () {
            
			renderTemplate('projects', 'tim(othy) > projects');
            $.getJSON('https://api.github.com/users/tmthydvnprt/repos', function (data) {
                var repos = [],                
                    ITEM_TEMPLATE = [
                        '<li class="list-group-item">',
                        '    <div class="pull-right text-right">',
                        '        <span class="badge"><i class="fa fa-file"></i> {size}</span><br>',
                        '        <code>{language}</code>',
                        '    </div>',
                        '    <h4 class="list-group-item-heading"><a href="http://tmthydvnprt.github.io/{name}">{name} <i class="fa fa-link"></i></a> <small>(<a href="{html_url}"><i class="fa fa-book"></i> repo</a>)</small></h4>',
                        '    <p class="list-group-item-text">',
                        '        {description}<br>',
                        '        <small><time>{created_at}</time><br><time>{updated_at}</time></small>',
                        '    </p>',
                        '</li>'
                    ].join('');
                
                data.forEach(function (item) {
                    var repo_item = item;
                    repos.push(ITEM_TEMPLATE.format(repo_item));
                });
                $('#project-list').append(repos.join('\n'));
            });

		},
		resume      : function () {
			renderTemplate('resume', 'tim(othy) > r&eacute;sum&eacute;');
			$('#tim-resume').html(renderMicroFormat(timResume, $('#h-resume-template').html()));
			$('#tim-resume').append('<hr><h1 class="text-center"><em>Timeline</em></h1>');
			$('#tim-resume').append(ganttResume(timResume));
			$('#tim-resume').append(geometers);
		},
		jsonresume  : function () {
			renderTemplate('jsonresume', 'tim(othy) > r&eacute;sum&eacute; > (json + microformat2)');
			$('#tim-jsonresume').text(JSON.stringify(timResume, undefined, '  '));
			$('#tim-jsonresume').append(geometers);
			prettyPrint();
		},
		contact     : function () {
			renderTemplate('contact', 'tim(othy) > contact');
			$('#tim-contact').html(renderMicroFormat(timContact, $('#h-card-template').html()));
			$('#tim-contact .p-note').remove();
		},
		colophon    : function () {
			renderTemplate('colophon', 'tim(othy) > colophon');

			$('.typo').hover(function () {
				$('#lorem h1').text($(this).css('font-family').split(', ')[0].replace(/'/g, ''));
				$('#lorem').css({
					'font-family' : $(this).css('font-family'),
					'top'         : window.pageYOffset
				});
			}, function () {
				$('#lorem').css({
					'top' : '-1000px'
				});
			});

		},
		monogram   : function () {
			renderTemplate('monogram', 'tim(othy) > monogram');
		},
		fontpy    : function () {
			renderTemplate('fontpy', 'tim(othy) > font-size python script');
			prettyPrint();
		},
		base64imagepy : function () {
			renderTemplate('base64imagepy', 'tim(othy) > base64 image python script');
			prettyPrint();
		},
		time        : function () {
			renderTemplate('time', 'timo(othy) > time');
			$('#clock').addClass('holdoff-time');
			bigSecond = $('#bigsecond');
			bigMinute = $('#bigminute');
			bigHour   = $('#bighour');
			bigWord   = $('#bigword');
			local     = $('#local');
			utc       = $('#utc');
			julian    = $('#julian');
			posix     = $('#posix');
			tickBigClock();
			secondBigInterval = setInterval(function () {
				tickBigClock();
			}, 1000);
		}
	};

	// route hashchanges to page
	function router() {

		// clear last page stuff
		clearInterval(charInterval);
		clearInterval(verbInterval);
		clearInterval(secondBigInterval);
		$('.holdoff-time').removeClass('holdoff-time');

		// cache page, hash, and filename
		page = page || $('#page');
		hash = location.hash.slice(1);
        urlpath = location.pathname.split('/');
        filename = urlpath.slice(-1)[0];
        
        console.log('page ' + page);
        console.log('hash ' + hash);
        console.log('urlpath ' + urlpath);
        console.log('filename ' + filename);
        
        // off-page hash
        if (filename === 'index.html') {
            // default to home if one index page
            hash = hash || '!/home';
            
            if (hash.slice(0, 2) === '!/') {
                
                $('#page section').addClass('bringOut');

                bringOut = setTimeout(function () {
                    page.removeClass('rendered');
                    page.addClass('routing');

                    hash = hash.slice(2);
                    if (pages.hasOwnProperty(hash)) {
                        currentPage = pageOrder.indexOf(hash);
                        pages[hash]();
                    } else {
                        currentPage = 0;
                        pages.home();
                    }

                    // setup
                    page.addClass('rendered');

                    $('html,body').animate({
                        scrollTop: 0
                    }, 512);

                    clearInterval(bringOut);
                }, 500);

            // on-page hash = scroll to any on page target
            } else if (hash) {
                if (hash === 'back' || hash === 'next') {
                    backNextChange(hash);
                } else {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top - 60
                        }, 512);
                    }
                }
            }
        } else {
            if (hash.slice(0, 2) === '!/') {
                urlpath[urlpath.length - 1] = "index.html";
                newlocation = urlpath.join("/") + location.hash;
                location.assign(newlocation);
            }
        }
	}

	initHoldOff = setTimeout(function () {
		$('.holdoff').removeClass('holdoff');
		clearTimeout(initHoldOff);
	}, 256);

	// listen for hash change or page load
	$(window).on('hashchange', router);
	$(window).on('load', router);

	// listen for key up change
	$(window).keyup(function (e) {
		if (e.keyCode === 37) {
			backNextChange('back');
		} else if (e.keyCode === 39) {
			backNextChange('next');
		}
	});

	tickClock();
	secondInterval = setInterval(function () {
		tickClock();
	}, 1000);
});