/*globals $,toString*/
// microformat render library
// -------------------------------------------------------------------------------------
// check types
var isStringy = function (arg) {
        return typeof arg === 'string' || typeof arg === 'number';
    },
    isArray = Array.isArray || function (arg) {
        return toString.call(arg) === '[object Array]';
    },
    isObject = function (arg) {
        return toString.call(arg) === '[object Object]';
    };
function timeDuration(datetime1, datetime2) {
	if (datetime1 === '?' || datetime2 === '?') {
		return "?";
	} else {
		var t1         = (datetime1 === 'present') ? new Date() : new Date(datetime1),
			t2         = (datetime2 === 'present') ? new Date() : new Date(datetime2),
			timeDiff   = (t2 - t1),
			timeStr    = 'P',
			years      = Math.floor(timeDiff / (365.25 * 24 * 3600 * 1000)),
			decYears   = timeDiff % (365.25 * 24 * 3600 * 1000),
			months     = Math.round(decYears / (30 * 24 * 3600 * 1000)),
			weeks      = 0,
			days       = 0,
			hours      = 0,
			minutes    = 0,
			seconds    = 0;
        if (years   > 0) { timeStr += years + 'Y'; }
        if (months  > 0) { timeStr += months + 'M'; }
        if (weeks   > 0) { timeStr += weeks + 'W'; }
        if (days    > 0) { timeStr += days + 'D'; }
        if (hours   > 0 || minutes > 0 || seconds > 0) { timeStr += 'T'; }
        if (hours   > 0) { timeStr += hours + 'H'; }
        if (minutes > 0) { timeStr += minutes + 'M'; }
        if (seconds > 0) { timeStr += seconds + 'S'; }
		return timeStr;
	}
}
function inverseDuration(duration, start, end) {
	var dt,
        years  = duration.match(/([0-9]*)Y/),
        months = duration.match(/([0-9]*)M/),
        weeks  = duration.match(/([0-9]*)W/),
        days   = duration.match(/([0-9]*)D/);

	years  = (years)  ? +years[1]  : 0;
	months = (months) ? +months[1] : 0;
	weeks  = (weeks)  ? +weeks[1]  : 0;
	days   = (days)   ? +days[1]   : 0;

	if (start) {
		dt = new Date(start);
		dt.setUTCFullYear(dt.getUTCFullYear() + years);
		dt.setUTCMonth(dt.getUTCMonth() + months);
	} else if (end) {
		dt = new Date(end);
		dt.setUTCFullYear(dt.getUTCFullYear() - years);
		dt.setUTCMonth(dt.getUTCMonth() - months);
	} else {
		dt = new Date();
		dt.setUTCFullYear(dt.getUTCFullYear() - years);
		dt.setUTCMonth(dt.getUTCMonth() - months);
	}
	dt.setUTCDate(1);
	dt.setUTCHours(0);
	dt.setUTCMinutes(0);
	dt.setUTCSeconds(0);

	return dt;
}
function text2Date(dt) {
	var date = (dt === 'present' || dt === '?') ? new Date() : new Date(dt);
	date.setUTCDate(1);
	date.setUTCHours(0);
	date.setUTCMinutes(0);
	date.setUTCSeconds(0);
	return date;
}
function parseDate(dt) {
    var years, months, weeks, days, durationStr, type, date;
	if (dt === "?") {
		return "?";
	} else {
		if (dt.slice(0, 1) === 'P' || dt.slice(0, 1) === 'T') {
			years  = dt.match(/([0-9]*)Y/);
            months = dt.match(/([0-9]*)M/);
            weeks  = dt.match(/([0-9]*)W/);
            days   = dt.match(/([0-9]*)D/);
            durationStr = '';
			if (years) {
				durationStr += years[1] + ' yr ';
			}
			if (months) {
				durationStr += months[1] + ' mo ';
			}
			if (weeks) {
				durationStr += weeks[1] + ' wk ';
			}
			if (days) {
				durationStr += days[1] + ' dy ';
			}
			return durationStr.trim();
		} else {
			type = dt.split('-').length;
			date = (dt === 'present') ? new Date() : new Date(dt);
			if (type === 2 || dt === 'present') {
				return (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();
			} else {
				return date.toLocaleDateString();
			}
		}
	}
}
function processString(prop, value) {
	if (prop.slice(0, 2) === 'dt') {
		return parseDate(value);
	} else {
		return value;
	}
}
function renderMicroFormat(mfObj, mfTemplate) {
	// parse
	var html = isStringy(mfTemplate) ? $.parseHTML(mfTemplate.trim()) : mfTemplate,
        obj  = isStringy(mfObj)      ? $.parseJSON(mfObj.trim())      : mfObj,
        prop,
        i;
	html = $(html[0]);
	// go thru each property
	for (prop in obj) {
		if (prop !== 'template' && obj[prop]) {
			if (isStringy(obj[prop])) {
				if (prop === "u-logo") {
					html.find('.' + prop + ':empty').attr('src', obj[prop]);
				} else {

/*
					if (prop === "p-name") {
						console.log( "--------------------------" );
						console.log( prop );
						console.log( obj[prop] );
						console.log( processString( prop, obj[prop] ) );
						console.log( html.find('.'+prop+':empty') );
						console.log( html.find('.'+prop+':empty') );
					}
*/

					html.find('.' + prop + ':empty').html(processString(prop, obj[prop]));

					// add attributes if necessary
					if (prop.slice(0, 2) === 'dt') {
						html.find('.' + prop).attr('datetime', obj[prop]);
					} else if (prop.slice(0,2) === "u-") {
						html.find('.' + prop).attr('href', obj[prop]);
					} else if (prop === "u-email") {
						html.find('.' + prop).attr('href', 'mailto:' + obj[prop]);
					} else if (prop === "p-rating") {
						html.find('.' + prop).attr('title', '0-5 rating : ' + obj[prop]);
						html.find('.' + prop).html('&nbsp;');
					}
				}
			} else if (isArray(obj[prop])) {
				for (i = 0; i < obj[prop].length; i += 1) {
					html.find('.' + prop).append(renderMicroFormat(obj[prop][i], $(obj[prop][i].template).html()));
				}
			} else if (isObject(obj[prop])) {
				if (obj[prop].hasOwnProperty("template")) {
					html.find('.' + prop + ':empty').html(renderMicroFormat(obj[prop], $(obj[prop].template).html()));
				} else {
					html.find('.' + prop + ':empty').html();
				}
			}
		}
	}
	// remove anything in template that wasn't rendered
	html.find(':empty:not(br):not(hr):not(img)').remove();
	html.find('img:not([src])').remove();
	return html;
}
function ganttResume(mfObj, title) {

	var html      = $.parseHTML('<div><header><em><h1 class="p-name text-center">' + title + '</h1></em></header><hr><div class="gantt-resume"><p>Education</p><div class="p-education"></div><p>Experience</p><div class="p-experience"></div><p>Skill</p><div class="p-skill"></div><div class="lines"></div></div></div>'),
		item      = {},
		ganttObj  = {
			'Education'  : [],
			'Experience' : [],
			'Skill'      : []
		},
		minDt     = new Date(),
		maxDt     = 0,
		totalTime = 0,
		firstYear = 0,
		firstYOffset = 0,
		word      = '',
		date      = 0,
		iso       = 0,
		years     = 0,
		width     = 0,
		left      = 0,
		i         = 0,
		j         = 0,
		set       = '';

	html = $(html[0]);

	for (i = 0; i < mfObj["p-education"].length; i += 1) {
		ganttObj.Education.push({
			'name'  : mfObj["p-education"][i]['p-name'],
			'start' : text2Date(mfObj["p-education"][i]['dt-start']),
			'end'   : text2Date(mfObj["p-education"][i]['dt-end'])
		});
		maxDt = Math.max(maxDt, ganttObj.Education[i].end);
		minDt = Math.min(minDt, ganttObj.Education[i].start);
	}
	for (i = 0; i < mfObj["p-experience"].length; i += 1) {
		ganttObj.Experience.push({
			'name'  : mfObj["p-experience"][i]['p-name'],
			'start' : text2Date(mfObj["p-experience"][i]['dt-start']),
			'end'   : text2Date(mfObj["p-experience"][i]['dt-end'])
		});
		maxDt = Math.max(maxDt, ganttObj.Experience[i].end);
		minDt = Math.min(minDt, ganttObj.Experience[i].start);
	}
	for (set in mfObj["p-skill"]) {
		for (j = 0; j < mfObj["p-skill"][set]['p-skillset'].length; j += 1) {
			for (i = 0; i < mfObj["p-skill"][set]['p-skillset'][j]['p-competency'].length; i += 1) {
				ganttObj.Skill.push({
					'name'  : mfObj["p-skill"][set]['p-skillset'][j]['p-competency'][i]['p-name'],
					'start' : text2Date(mfObj["p-skill"][set]['p-skillset'][j]['p-competency'][i]['dt-start']),
					'end'   : text2Date(mfObj["p-skill"][set]['p-skillset'][j]['p-competency'][i]['dt-end'])
				});
				maxDt = Math.max(maxDt, ganttObj.Skill[i].end);
				if (ganttObj.Skill[i].start > new Date('2000-01-01')) {
					minDt = Math.min(minDt, ganttObj.Skill[i].start);
				}
			}
		}
	}

	totalTime    = (maxDt - minDt);
	firstYear    = new Date(minDt);
	firstYear.setFullYear(firstYear.getFullYear() + 1);
	firstYear.setUTCMonth(0);
	firstYear.setUTCDate(1);
	years        = totalTime / (60 * 60 * 24 * 365.25 * 1000);
	firstYOffset = (firstYear - minDt) / totalTime;

	for (i = 0; i < mfObj["p-education"].length; i += 1) {
		item  = renderMicroFormat(mfObj["p-education"][i], $('#gantt-event-template').html());
		width = (100 * (ganttObj.Education[i].end - ganttObj.Education[i].start) / totalTime);
		left  = (100 * (ganttObj.Education[i].start - minDt) / totalTime);
		item.attr('style', 'width:' + width + '%;left:' + left + '%;');
		html.find('.p-education').append(item);
	}
	for (i = 0; i < mfObj["p-experience"].length; i += 1) {
		item  = renderMicroFormat(mfObj["p-experience"][i], $('#gantt-event-template').html());
		width = (100 * (ganttObj.Experience[i].end - ganttObj.Experience[i].start) / totalTime);
		left  = (100 * (ganttObj.Experience[i].start - minDt) / totalTime);
		item.attr('style', 'width:' + width + '%;left:' + left + '%;');
		html.find('.p-experience').append(item);
	}
	for (set in mfObj["p-skill"]) {
		html.find('.p-skill').append('<p class="p-name">' + mfObj["p-skill"][set]['p-name'] + '</p>');
		for (j = 0; j < mfObj["p-skill"][set]['p-skillset'].length; j += 1) {
            html.find('.p-skill').append('<div class="p-skillset"><p class="p-name">' + mfObj["p-skill"][set]['p-skillset'][j]['p-name'] + '</p></div>');
			for (i = 0; i < mfObj["p-skill"][set]['p-skillset'][j]['p-competency'].length; i += 1) {
				item  = renderMicroFormat(mfObj["p-skill"][set]['p-skillset'][j]['p-competency'][i], $('#gantt-skill-template').html());
				width = (100 * (text2Date(mfObj["p-skill"][set]['p-skillset'][j]['p-competency'][i]['dt-end']) -  text2Date(mfObj["p-skill"][set]['p-skillset'][j]['p-competency'][i]['dt-start'])) / totalTime);
				left  = (100 * (text2Date(mfObj["p-skill"][set]['p-skillset'][j]['p-competency'][i]['dt-start']) - minDt) / totalTime);
				if (left < 0) {
					item.find('.display-start').addClass('off-page');
					item.attr('style', 'width:100%;left:0%;');
				} else {
					item.attr('style', 'width:' + width + '%;left:' + left + '%;');
				}
				html.find('.p-skillset:last').append(item);
			}
		}
	}
	item = '';
	for (i = 0; i < years; i += 1) {
		date  = new Date(firstYear);
		date.setUTCFullYear(date.getUTCFullYear() + i);
		left  = 100 * (date - minDt) / totalTime;
		iso   = date.getUTCFullYear().toString();
		word  = date.getUTCFullYear().toString();
		item += '<div class="line" style="left:' + left + '%;margin-left:-1px;"><time class="marker" datetime="' + iso + '"><span class="hidden-xs">' + word.slice(0, 2) + '</span><span class="visible-xs-inline">&apos;</span>' + word.slice(2, 4) + '</time></div>';
	}
	html.find('.lines').html(item);
	return html;
}

var microformatDefs = {
	"h-adr" : {
		"template"           : "#h-adr-template",
		"p-street-address"   : "house/apartment number, floor, street name",
		"p-extended-address" : "additional street details",
		"p-post-office-box"  : "post office mailbox",
		"p-locality"         : "city/town/village",
		"p-region"           : "state/county/province",
		"p-postal-code"      : "postal code, e.g. ZIP in the US",
		"p-country-name"     : "should be full name of country, country code ok",
		"p-label"            : "a mailing label, plain text, perhaps with preformatting",
		"p-geo"              : "(or u-geo with a RFC 5870 geo: URL), optionally embedded h-geo",
		"p-note"             : "user notes"
	},
	"h-geo" : {
		"template"           : "#h-geo-template",
		"p-name"             : "location name",
		"p-latitude"         : "decimal latitude",
		"p-longitude"        : "decimal longitude",
		"p-altitude"         : "decimal altitude",
		"p-note"             : "user notes"
	},
	"h-card" : {
		"template"           : "#h-card-template",
		"p-name"             : "The full/formatted name of the person or organisation",
		"p-honorific-prefix" : "e.g. Mrs., Mr. or Dr.",
		"p-given-name"       : "given (often first) name",
		"p-additional-name"  : "other/middle name",
		"p-family-name"      : "family (often last) name",
		"p-sort-string"      : "string to sort by",
		"p-honorific-suffix" : "e.g. Ph.D, Esq.",
		"p-nickname"         : "nickname/alias/handle",
		"u-email"            : "email address",
		"u-logo"             : "a logo representing the person or organisation",
		"u-photo"            : "photo",
		"u-url"              : "home page",
		"u-uid"              : "unique identifier, often canonical URL",
		"p-adr"              : "postal address, optionally embed an h-adr",
		"p-tel"              : "telephone number",
		"dt-bday"            : "birth date",
		"u-key"              : "cryptographic public key e.g. SSH or GPG",
		"p-org"              : "affiliated organization, optionally embed an h-card",
		"p-job-title"        : "job title, previously 'title' in hCard, disambiguated.",
		"p-role"             : "description of role",
		"u-impp"             : "per RFC 4770, new in vCard4 (RFC6350)",
		"p-sex"              : "biological sex, new in vCard4 (RFC6350)",
		"p-gender-identity"  : "gender identity, new in vCard4 (RFC6350)",
		"dt-anniversary"     : "?",
		"p-category"         : "category/tag",
		"p-note"             : "user notes"
	},
	"h-event" : {
		"template"           : "#h-event-template",
		"p-name"             : "event name (or title)",
		"p-summary"          : "short summary of the event",
		"dt-start"           : "datetime the event starts",
		"dt-end"             : "datetime the event ends",
		"dt-duration"        : "duration of the event",
		"p-description"      : "more detailed description of the event",
		"u-url"              : "permalink for the event",
		"p-category"         : "event category(ies)/tag(s)",
		"p-location"         : "where the event takes place, optionally embedded h-card, h-adr, or h-geo",
		"p-note"             : "user notes"
	},
	"h-skill" : {
		"template"           : "#h-skill-template",
		"p-name"             : "text describing gategory of skill",
		"p-skillset"         : "text describing skill or h-skillset",
		"p-note"             : "user notes"
	},
	"h-skillset" : {
		"template"           : "#h-skillset-template",
		"p-name"             : "text describing gategory of skill",
		"p-competency"       : "text describing skill or h-competency",
		"p-note"             : "user notes"
	},
	"h-competency" : {
		"template"           : "#h-competency-template",
		"p-summary"          : "text describing skill",
		"p-rating"           : "level of competency in skill",
		"dt-duration"        : "iso duration of skill",
		"p-note"             : "user notes"
	},
	"h-cite" : {
		"template"           : "#h-cite-template",
		"p-name"             : "name of the work",
		"dt-published"       : "date (and optionally time) of publication",
		"p-author"           : "author of publication, with optional nested h-card",
		"u-url"              : "a URL to access the cited work",
		"u-uid"              : "a URL/URI that uniquely/canonically identifies the cited work, canonical permalink.",
		"p-publication"      : "for citing articles in publications with more than one author, or perhaps when the author has a specific publication vehicle for the cited work. Also works when the publication is known, but the authorship information is either unknown, ambiguous, unclear, or collaboratively complex enough to be unable to list explicit author(s), e.g. like with many wiki pages.",
		"dt-accessed"        : "date the cited work was accessed for whatever reason it is being cited. Useful in case online work changes and it's possible to access the dt-accessed datetimestamped version in particular, e.g. via the Internet Archive.",
		"p-content"          : "for when the citation includes the content itself, like when citing short text notes (e.g. tweets).",
		"p-note"             : "user notes"
	},
	"h-resume" : {
		"template"           : "#h-resume-template",
		"p-name"             : "brief name of the resume",
		"p-summary"          : "overview of qualifications and objectives",
		"p-contact"          : "current contact info in an h-card",
		"p-education"        : "an education h-event event, years, embedded h-card of the school, location.",
		"p-experience"       : "a job or other professional experience h-event event, years, embedded h-card of the organization, location, job-title.",
		"p-skill"            : "a skill or ability, optionally including level and/or duration of experience",
		"p-affiliation"      : "an affiliation with an h-card organization",
		"p-publication"      : "a publication with cite tag, or h-cite",
		"p-note"             : "user notes"
	}
};

var microformat = {},
    type,
    property;

for (type in microformatDefs) {
	microformat[type] = {};
	for (property in microformatDefs[type]) {
		microformat[type][property] = (property !== 'template') ? "" : microformatDefs[type][property];
	}
}