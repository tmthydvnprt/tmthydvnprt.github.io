/*globals $,microformat,timContact,timeDuration */

var timResume = $.extend({}, microformat["h-resume"], {
    "p-name"             : "R&eacute;sum&eacute;",
    "p-summary"          : "An electrical engineer turned computer scientist. A professional history of <code>vhdl</code>, a personal and academic history of <code>matlab</code>, <code>javascript</code>, and <code>python</code>.  I talk to and teach machines, I convince them to do what I want.",
    "p-contact"          : timContact,
    "p-education"        : [
        $.extend({}, microformat["h-event"], {
            "p-name"             : "Master of Science in Electrical Engineering",
            "p-abbr"             : "M.Sc. in E.E.",
            "p-summary"          : "Image Processing",
            "dt-start"           : "2011-09",
            "dt-end"             : "2012-06",
            "dt-duration"        : timeDuration("2011-09", "2012-06"),
            "p-location"         : "California Polytechnic State University, San Luis Obispo California"
        }),
        $.extend({}, microformat["h-event"], {
            "p-name"             : "Bachelor of Science in Electrical Engineering",
            "p-abbr"             : "B.Sc. in E.E.",
            "p-summary"          : "Digital Signal Processing",
            "dt-start"           : "2007-08",
            "dt-end"             : "2012-06",
            "dt-duration"        : timeDuration("2007-08", "2012-06"),
            "p-location"         : "California Polytechnic State University, San Luis Obispo California"
        }),
        $.extend({}, microformat["h-event"], {
            "p-name"             : "High School Diploma",
            "p-abbr"             : "H.S.",
            "p-summary"          : "A.P. Math and Science",
            "dt-start"           : "2003-08",
            "dt-end"             : "2007-06",
            "dt-duration"        : timeDuration("2003-08", "2007-06"),
            "p-location"         : "Foothill Technology High School, Ventura California"
        })
    ],
    "p-experience"       : [
        $.extend({}, microformat["h-event"], {
            "p-name"             : "Electrical Engineer II",
            "p-abbr"             : "EE II",
            "dt-start"           : "2012-10",
            "dt-end"             : "present",
            "dt-duration"        : timeDuration("2012-10", "present"),
            "p-category"         : "Full Time",
            "p-description"      : 'Hardware & Firmware design for Digital Signal Processing in <abbr title="Electronic Warfare">EW</abbr> applications',
            "p-location"         : 'Raytheon <abbr title="Space and Airborne Systems">SAS</abbr>'
        }),
        $.extend({}, microformat["h-event"], {
            "p-name"             : "Electrical Engineering Intern",
            "p-abbr"             : "EE Intern",
            "dt-start"           : "2009-06",
            "dt-end"             : "2011-09",
            "dt-duration"        : timeDuration("2009-06", "2011-09"),
            "p-category"         : "Full Time Summer Internship",
            "p-description"      : 'Hardware & Firmware design for Digital Signal Processing in <abbr title="Electronic Warfare">EW</abbr> applications',
            "p-location"         : 'Raytheon <abbr title="Space and Airborne Systems">SAS</abbr>'
        }),
        /*
            "dt-start"           : "2010-07",
            "dt-end"             : "2010-09",
            "dt-start"           : "2010-01",
            "dt-end"             : "2010-03",
            "dt-start"           : "2009-06",
            "dt-end"             : "2009-08",
        */
        $.extend({}, microformat["h-event"], {
            "p-name"             : "Barista",
            "p-abbr"             : "Barista",
            "dt-start"           : "2005-05",
            "dt-end"             : "2008-12",
            "dt-duration"        : timeDuration("2005-05", "2008-12"),
            "p-category"         : "Part Time",
            "p-description"      : "Shift Lead managing a coffeehouse",
            "p-location"         : "Simone's Coffee & Tea"
        })
    ],
    "p-skill"           : [
        $.extend({}, microformat["h-skill"], {
            "p-name"             : "Languages Spoken",
            "p-summary"          : "I am a polyglot",
            "p-skillset"         : [
                $.extend({}, microformat["h-skillset"], {
                    "p-name"         : "Natural",
                    "p-competency"   : [
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "English",
                            "p-abbr"             : "English",
                            "p-rating"           : "5",
                            "dt-start"           : "1990-01",
                            "dt-end"             : "present",
                            "dt-duration"        : timeDuration("1990-01", "present")
                        })
                    ]
                }),
                $.extend({}, microformat["h-skillset"], {
                    "p-name"         : "Computational",
                    "p-competency"   : [
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "Python",
                            "p-abbr"             : "Python",
                            "p-rating"           : "5",
                            "dt-start"           : "2011-04",
                            "dt-end"             : "present",
                            "dt-duration"        : timeDuration("2011-04", "present")
                        }),
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "JavaScript",
                            "p-abbr"             : "JavaScript",
                            "p-rating"           : "4",
                            "dt-start"           : "2006-09",
                            "dt-end"             : "present",
                            "dt-duration"        : timeDuration("2006-09", "present")
                        }),
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "MATLAB",
                            "p-abbr"             : "MATLAB",
                            "p-rating"           : "5",
                            "dt-start"           : "2011-01",
                            "dt-end"             : "present",
                            "dt-duration"        : timeDuration("2011-01", "present")
                        }),
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "VHDL",
                            "p-abbr"             : "VHDL",
                            "p-rating"           : "5",
                            "dt-start"           : "2008-09",
                            "dt-end"             : "present",
                            "dt-duration"        : timeDuration("2008-09", "present")
                        }),
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "PHP",
                            "p-abbr"             : "PHP",
                            "p-rating"           : "2",
                            "dt-start"           : "2012-10",
                            "dt-end"             : "2013-10",
                            "dt-duration"        : timeDuration("2012-10", "2013-10")
                        }),
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "Bash",
                            "p-abbr"             : "Bash",
                            "p-rating"           : "1",
                            "dt-start"           : "2012-12",
                            "dt-end"             : "present",
                            "dt-duration"        : timeDuration("2012-12", "present")
                        }),
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "Tcl, Verilog, VisualBasic, C, AWK, Sed",
                            "p-abbr"             : "Tcl, Verilog, VisualBasic, C, AWK, Sed",
                            "p-rating"           : "1",
                            "dt-start"           : "2008-01",
                            "dt-end"             : "present",
                            "dt-duration"        : timeDuration("2008-01", "present"),
                            "p-note"             : "I do not enjoy this last group and have a limited understanding, but I can hack something together if need be."
                        })
                    ],
                    "p-note" : "Ordered by enjoyment; rated by understanding."
                }),
                $.extend({}, microformat["h-skillset"], {
                    "p-name"         : "Presentational",
                    "p-competency"   : [
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "HTML",
                            "p-abbr"             : "HTML",
                            "p-rating"           : "5",
                            "dt-start"           : "2005-09",
                            "dt-end"             : "present",
                            "dt-duration"        : timeDuration("2005-09", "present")
                        }),
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "CSS",
                            "p-abbr"             : "CSS",
                            "p-rating"           : "4",
                            "dt-start"           : "2006-01",
                            "dt-end"             : "present",
                            "dt-duration"        : timeDuration("2006-01", "present")
                        }),
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "Markdown",
                            "p-abbr"             : "Markdown",
                            "p-rating"           : "5",
                            "dt-start"           : "2013-01",
                            "dt-end"             : "present",
                            "dt-duration"        : timeDuration("2013-01", "present")
                        }),
                        $.extend({}, microformat["h-competency"], {
                            "p-summary"          : "LaTeX",
                            "p-abbr"             : "LaTeX",
                            "p-rating"           : "1",
                            "dt-start"           : "2012-05",
                            "dt-end"             : "present",
                            "dt-duration"        : timeDuration("2012-05", "present")
                        })
                    ]
                })
            ]
        })
    ],
    "p-publications" : [
        $.extend({}, microformat["h-cite"], {
            "p-publication"      : "Master's Thesis",
            "p-name"             : "Early Forest Fire Detection using Texture Analysis of Principal Components from Multispectral Video",
            "dt-published"       : "2012-06",
            "p-author"           : "Timothy M. Davenport",
            "u-url"              : "http://digitalcommons.calpoly.edu/theses/795/",
            "p-content"          : "[Abstract] The aim of this study is to incorporate the spectral, temporal and spatial attributes of a smoke plume for Early Forest Fire Detection. Image processing techniques are used on multispectral (red, green, blue, mid-wave infrared, and long-wave infrared) video to segment and indentify the presence of a smoke plume within a scene. <a href=\"http://digitalcommons.calpoly.edu/theses/795/#abstract\">...</a>"
        }),
        $.extend({}, microformat["h-cite"], {
            "p-publication"      : "SPIE Conference Proceedings Paper",
            "p-name"             : "Characterization and identification of smoke plume for early forest Detection",
            "dt-published"       : "2012-10",
            "p-author"           : "Saghri, J.A., Jacobs, J.T., Kohler, D., Davenport, T., Moussa, G.",
            "u-url"              : "http://spie.org/Publications/Proceedings/Paper/10.1117/12.930755",
            "p-content"          : "[Absctract] Characterization and discrimination of fire smoke for a land-based early forest fire detection system are discussed. Preliminary results of several fire plume identification schemes applied to multispectral video data obtained from a number of controlled fire experiments are presented. The temporal, spectral, and spatial signatures of the fire are exploited. The methods discussed include: (1) range filtering followed by entropy filtering of the infrared (IR) video data, (2) dual range moving average differencing followed by principal component analysis (PCA) of IR video data, and (3) PCA of visible color video data followed by texture analysis and segmentation. The three schemes presented are tailored to detect the fire core, the heat plume, and the smoke, respectively."
        }),
        $.extend({}, microformat["h-cite"], {
            "p-publication"      : "SPIE Conference Proceedings Paper",
            "p-name"             : "Detection of smoke plume for a land-based early forest fire detection system",
            "dt-published"       : "2015-09",
            "p-author"           : "Saghri, J.A., Jacobs, J.T., Davenport, T., Garges, D.",
            "u-url"              : "http://spie.org/Publications/Proceedings/Paper/10.1117/12.2189352",
            "p-content"          : "[Absctract] A promising daytime smoke plume detection for a land-based early forest fire detection system is proposed. The visible video imagery from a land-based monitoring camera is processed to detect the smoke which likely rises in an early stage of a forest fire. Unlike the fire core and its surrounding heat which are detected via day/night infrared imaging, the relatively cold smoke plume can only be captured in the visible spectrum of light. The smoke plume is detected via exploitation of its temporal signature. This is accomplished via Principal Component Transformation (PCT) operations on consecutive sequences of visible video frames followed by spatial filtering of one of the resulting low-order Principal Component (PC) images. It is shown that the blue channel of the Red, Green, Blue (RGB) color camera is most effective in detecting the smoke plume. Smoke plume is clearly detected and isolated via simple blurring, thresholding, and median filtering of one of the resulting low-order principle component (PC) images. The robustness of this PCA-based method relative to simple temporal frame differencing and use of color, i.e., visible spectral signature of smoke, are discussed. Various parameters of the system including the required observation time and number of frames to retain for PCT, selection of which low-order PC to use, and types and sizes of the filters applied to the selected PC image to detect and isolate the smoke plume, are discussed."
        })
    ],
    "p-note" : 'This r&eacute;sum&eacute; is a <a href=\"#!/jsonresume\">json object</a> containing <a href=\"http://microformats.org/wiki/microformats2\">microformat2</a> structured data and rendered as html.  The semantic data uses the draft vocabularies <code>h-resume</code>, <code>h-card</code>, <code>h-adr</code>, <code>h-geo</code> and <code>h-event</code>, along with experiemental vocabularies <code>h-skill</code>, <code>h-skillset</code>, <code>h-competency</code> and <code>h-cite</code>.  Artistic license was exercised by using non-standard custom properties (e.g. <code>dt-start</code>/<code>end</code> in <code>h-compentency</code>, or <code>p-note</code> in any <code>h</code> vocab); however these were, hopefully, used as logical extentions of the official <abbr title="Application Programming Interface">API</abbr> and shouldn\'t break a microformat2 parser. <a href="#!/contact">Contact</a> me if you have suggestions.'
});
