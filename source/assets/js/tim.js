/*globals $,microformat,timeDuration,renderMicroFormat,ganttResume,timResume,timContact,console,prettyPrint*/

$(document).ready(function () {

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
        API_FAIL_STR      = '<li class="list-group-item"><h1 class="text-center"><s>...gathering data...</s><br>...<em>tried</em> to gather data...<br>We\'ve been <strong><a href="https://developer.github.com/v3/#rate-limiting" target="_blank">rate-limited</a></strong> by GitHub\'s API</a>!<br><small>Calls from this <a href="https://www.google.com/#q=what+is+my+ip" target="_blank"><abbr title="Internet Protocol">IP</abbr> address</a> will fail for one hour.</small><br><i class="fa fa-frown-o fa-2x"></i></h1></li>',
		alphabet          = '`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?',
		verbInterval      = 0,
		verbTimeout       = 0,
		charInterval      = 0,
		secondInterval    = 0,
		secondBigInterval = 0,
		initHoldOff       = 0,
		bringOut          = 0,
		pageOrder         = ['home', 'epigraph', 'synopsis', 'ruminations', 'projects', 'resume', 'colophon', 'contact'],
		currentPage       = 0,
        //this will store the scroll position
        keepScroll        = false,
        keepHash          = '',
        cachedRepos       = null,
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
    function formatDate(d) {
        var MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
        return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
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
        String.prototype.format = function () {
            var str = this.toString(),
                args,
                arg;
            if (!arguments.length) {
                return str;
            }
            args = typeof arguments[0];
            args = ("string" === args || "number" === args) ? arguments : arguments[0];
            for (arg in args) {
                str = str.replace(new RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
            }
            return str;
        };
    }
    
	// store pages
	var pages = {
		home     : function () {
            
			renderTemplate('home', 'tim(othy)');

            var verb           = $('#verb'),
                verbList       = $('#verb-list'),
                VERB_TEMPLATE  = '<span class="label label-primary" style="-webkit-transition-delay:{delay}s;-moz-transition-delay:{delay}s;-ms-transition-delay:{delay}s;-o-transition-delay:{delay}s;transition-delay:{delay}s;">{verb}</span>',
                verbHtml       = [],
                verbs          = 'code read write study learn think ponder wonder wander walk hike garden plant grow calc design develop compute graph plot save invest "work"'.split(' '),
                verbIndx       = 0,
                maxVerbLen     = 0,
                blankText      = '',
                verbText       = '',
                r              = '',
                i              = 0,
                v              = 0,
                charPeriod     = 35,
                verbPeriod     = 800,
                randCharNum    = 6,
                randChar       = 0,
                charIndx       = 0;
            
            // add all verbs for showing on hover
            for (v = 0; v < verbs.length; v += 1) {
                verbHtml.push(VERB_TEMPLATE.format({
                    "delay" : (0.5 * v / verbs.length),
                    "verb" : verbs[v]
                }));
            }
            
            verbList.html('<span class="big bracket left">{</span>' + verbHtml.join('') + '<span class="big bracket right">}</span>');
            
			// find max length
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
                verbIndx = Math.floor(verbs.length * Math.random());
                // verbIndx = (verbIndx + 1) % verbs.length;
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
            
            if (!cachedRepos) {
            
                function getRepo() {
                    return $.getJSON('https://api.github.com/users/tmthydvnprt/repos');
                }

                var i = 0,
                    repos = [],
                    LANG_TEMPLATE = '<li><code>{lang}</code> <span class="badge">{count} kiB</span></li>',
                    FORK_TEMPLATE = '<i class="fa fa-code-fork"></i> ',
                    ITEM_TEMPLATE = [
                        '<li class="list-group-item">',
                        '    <div class="row">',
                        '        <div class="col-xs-7 col-sm-8">',
                        '            <h4 class="list-group-item-heading">{if_fork}<a href="http://tmthydvnprt.github.io/{name}">{name} <i class="fa fa-link"></i></a> <small>(<a href="{html_url}"><i class="fa fa-book"></i> repo</a>)</small></h4>',
                        '            <p class="list-group-item-text">',
                        '                {description}',
                        '                <ul class="list-inline">',
                        '                    <li><small><i class="fa fa-fw fa-clock-o"></i> <time>{created_at}</time></small></li>',
                        '                    <li><small><i class="fa fa-fw fa-refresh"></i> <time>{updated_at}</time></small></li>',
                        '                    <li><small><i class="fa fa-fw fa-cloud-upload"></i> <time>{pushed_at}</time></small></li>',
                        '                </ul>',
                        '            </p>',
                        '        </div>',
                        '        <div class="col-xs-5 col-sm-4 text-right">',
                        '            <ul class="list-unstyled">',
                        '                <li><i class="fa fa-file-code-o"></i> <span class="badge">{size} files</span></li>',
                        '                {language_list}',
                        '            </ul>',
                        '        </div>',
                        '    </div>',
                        '</li>'
                    ].join('');

                $.when(getRepo()).done(function (data) {

                    var url_array = [],
                        lang_list = {};
                    
                    function getLanguage(data) {
                        return $.getJSON(data.languages_url, function (languages) {
                            var lang_array = [],
                                lang = '',
                                count = 0;
                            for (lang in languages) {
                                if (languages.hasOwnProperty(lang)) {
                                    lang_array.push(LANG_TEMPLATE.format(
                                        {"lang": lang, "count": Math.floor(languages[lang] / 10.24) / 100}
                                    ));
                                }
                            }
                            lang_list[data.name] = lang_array;
                        });
                    }

                    data.forEach(function (item) {
                        url_array.push(getLanguage(item));
                    });

                    $.when.apply($, url_array).done(function (languages) {
                        var repo_item;
                        console.log(lang_list);
                        for (i = 0; i < data.length; i += 1) {
                            repo_item = data[i];
                            
                            // make time nice
                            repo_item.created_at = formatDate(new Date(repo_item.created_at));
                            repo_item.updated_at = formatDate(new Date(repo_item.updated_at));
                            repo_item.pushed_at = formatDate(new Date(repo_item.pushed_at));

                            if (repo_item.fork) {
                                repo_item.if_fork = FORK_TEMPLATE;
                            } else {
                                repo_item.if_fork = '';
                            }
                            repo_item.language_list = lang_list[data[i].name].join('');
                            repos.push(ITEM_TEMPLATE.format(repo_item));
                        }
                        
                        // cached git data for later
                        cachedRepos = repos;
                        $('#project-list').html(repos.join('\n'));
                    });
                }).fail(function () {
                    setTimeout(function () {
                        $('#project-list').html(API_FAIL_STR);
                    }, 512);
                });
            } else {
                $('#project-list').html(cachedRepos.join('\n'));
            }

		},
		resume      : function () {
			renderTemplate('resume', 'tim(othy) > r&eacute;sum&eacute;');
			$('#tim-resume').html(renderMicroFormat(timResume, $('#h-resume-template').html()));
			$('#tim-resume div').attr('id', 'document');
			$('#tim-timeline').html(ganttResume(timResume, 'Timeline'));
            $('#tim-timeline div').attr('id', 'timeline');
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
			renderTemplate('time', 'tim(othy) > time');
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
		},
		unknown   : function () {
			renderTemplate('unknown', 'tim(othy) > unknown');
		}
	};

	// route hashchanges to page
	function router(e) {
        		
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
        
        console.log('urlpath : ' + urlpath);
        console.log('hash    : ' + hash);
        console.log('filename: ' + filename);
        
        // index page with internal hash routing
        if (filename === 'index.html') {
            
            // default to home if on index page
            hash = hash || '!/home';
            
            // on-page hash
            if (hash.slice(0, 2) === '!/') {
                
                // zoom to the top
                $('html,body').animate({
                    scrollTop: 0
                }, 300);
                
                // animate out
                //$('#page section').addClass('bringOut');
                $('.bringIn').addClass('bringOut');

                // wait until animation it done
                bringOut = setTimeout(function () {
                    page.removeClass('rendered');
                    page.addClass('routing');

                    // route to new page
                    hash = hash.slice(2);
                    if (pages.hasOwnProperty(hash)) {
                        currentPage = pageOrder.indexOf(hash);
                        pages[hash]();
                    } else {
                        pages.unknown();
                    }

                    // setup page
                    page.addClass('rendered');
                    $('a[href*="#"]').click(function () {
                        // stop auto scroll
                        keepHash = location.hash;
                        keepScroll = document.body.scrollTop;
                    });

                    clearInterval(bringOut);
                }, 500);

            // on-page hash
            } else if (hash) {
                // special case back/next hash
                if (hash === 'back' || hash === 'next') {
                    backNextChange(hash);
                // regular scroll to target hash
                } else {
                    if (keepScroll !== false) {
                        //move scroll position to stored position
                        document.body.scrollTop = keepScroll;
                        keepScroll = false;
//                        location.hash = keepHash;
                    }
                    var target = $('#' + hash);
                    target = target.length ? target : $('[name=' + hash + ']');
                    if (target.length) {
                        $('html,body').animate({
                            scrollTop: target.offset().top - 60
                        }, 512);
                    }
                }
            }
        // if on any other page
        } else {
            // add index to hashrouting
            if (hash.slice(0, 2) === '!/') {
                urlpath[urlpath.length - 1] = "index.html";
                newlocation = urlpath.join("/") + location.hash;
                location.assign(newlocation);
            } else {
                console.log('do nothing');
                pages.unknown();
            }
        }
        
        return false;
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