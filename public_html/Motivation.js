////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Motivator.js - Javascript for project motivator pages
//
// Copyright (C) 2020 Peter Walsh, Milford, NH 03055
// All Rights Reserved under the MIT license as outlined below.
//
//  FILE
//      Motivation.js
//
//  DESCRIPTION
//
//      Run the project motivation course.
//
//      (See the project documentation for a full description.)
//
//  USAGE
//
//      $BROWSER [...]/index.html?Arg=Value
//
//      No Arguments:
//
//          Run the project motivation state machine. With no configured project,
//            will show the "Intro" article and allow the user to browse the
//            documentation and configure the course.
//
//          With a configured project, run the portion of the course indicated by
//            the recorded progress.
//
//      [...]index.html?Slideshow=$Category
//
//          Show a slideshow for a specified project category (ex: "Ceramics").
//
//
//  EXAMPLE
//
//      Firefox file://Home/Pete/Motivation/public_html/index.html
//
//          This will run the full motivation course.
//
//      Firefox file://Home/Pete/Motivation/public_html/index.html?Slideshow=Ceramics
//
//          This will show a slideshow for the category "Ceramics", and nothing else.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  MIT LICENSE
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy of
//    this software and associated documentation files (the "Software"), to deal in
//    the Software without restriction, including without limitation the rights to
//    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
//    of the Software, and to permit persons to whom the Software is furnished to do
//    so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//    all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
//    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
//    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// The following suffixes are used to make the date units clear.
//
// A "CDay" is a calendar day, adjusted for the user's timezone. It is the number of days since the
//   epoch in the user's timezone, and will be an integer in the neighborhood of 18,000.
//
// An "LDay" is a lesson day. It's an integer from 1 to MaxLDay (probably 1 .. 30).
//
// Thus, "TodayCDay" is today, in days, while "LessonCDay" is the calendar day when the lesson
//   was achieved, and so on.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var Debug = 0;          // Set to TRUE to enable debug functions

    var WindowWidth;
    var WindowHeight;

    var Words;
    var Images;

    var Args;
    var MaxLDay = 30;       // Max day in course
    var TodayCDay;

    var WordPanel;
    var ImagePanel;
    var ArticlePanel;

    var CookieURL = window.location.href.split('?')[0];

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Everything stored locally is in the "Config" variable.
    //
    var Config = {
        StartCDay:      0,      // Calendar day when lesson arc started
        LessonLDay:     0,      // Current lesson   day user is at
        LessonCDay:     0,      // Current calendar day user achieved leddon
        SlideIntroSeen: 0,      // FALSE on very first slideshow
        SlideMultiSeen: 0,      // FALSE unless 2nd slideshow in single day
        Category:       "",     // Category of user's project (ex: "Pottery")
        };

    var StateEnum = {
        Intro:      1,          // Never configured, at intro page
        Manual:     2,          // Manual control, by (for example) URL arg
        Slideshow:  3,          // In slideshow
        Abort:      4,          // Abort (temp state for slideshow)
        Run:        5,          // Standard run
        };
    var State = StateEnum.Intro;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // On first load, calculate a bunch of stuff.
    //
    window.onload = function() {
        //
        // (This crazy nonsense gets the width in all browsers)
        //
        WindowWidth  = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
        WindowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        //
        // These are frequently used. Get the locations and check for existance once at startup
        //
        WordPanel    = GetID("WordPanel");
        ImagePanel   = GetID("ImagePanel");
        ArticlePanel = GetID("ArticleText");

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // Set our day, and grab the config data. If data can't be set, then cannot run program.
        //
        var Now = new Date();
        TodayCDay  = Math.floor((Now.getTime() - Now.getTimezoneOffset()*60000)/8.64e7);

        if( !LocalDataEnabled() ) {
            ShowArticle("COO00");       // JDJ JDJ JDJ
            return;
            }

        GetConfig();

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // Grab the URL arguments.
        //
        // A singleton variable will be set to "" (empty string), while an assignment argument will
        //   be set to it's assigned value.
        //
        Args = {};
        var Query = window.location.search.substring(1);
        var Vars  = Query.split("&");
        for( let Var of Vars ) {
            var Pair = Var.split("=");
            if( Pair[1] ) Args[Pair[0]] = Pair[1];
            else          Args[Pair[0]] = "";
            }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // URL argument: Slideshow=$Category
        //
        // Show a specific slideshow and then exit.
        //
        if( Args["Slideshow"] != undefined ) {
            Config.Category = Args["Slideshow"];
            State           = StateEnum.Manual;

            if( Projects[Config.Category] == undefined ) {
                alert("Unknown project type (" + Config.Category + ").");
                throw new Error("Unknown project type (" + Config.Category + ").");
                return;
                }

console.log("Slideshow: "+ Config.Category);
            RunSlideshow(Config.Category);
            return;
            }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // URL argument: Lesson=LessonID
        //
        // Show the articles for a lesson, then exit.
        //
        if( Args["Lesson"] != undefined ) {
            ArticleID = Args["Lesson"];

            if( GetID(ArticleID) == undefined ) {
                alert("Unknown ArticleID (" + ArticleID + ").");
                throw new Error("Unknown ArticleID (" + ArticleID + ").");
                return;
                }

            State = StateEnum.Manual;
            ShowArticle(ArticleID);

console.log("Lesson: "+ ArticleID);
            return;
            }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // URL argument: Day=DayNo
        //
        // Set the system to a particular day, and run
        //
        if( Args["Day"] != undefined ) {
            Config.LessonLDay = Args["Day"];
            State = StateEnum.Manual;

console.log("Lesson: "+ ArticleID);
            return;
            }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if( Config.LessonLDay > 0 ) RunSlideshow(Config.Category);
        else                        ShowArticle("TOC00");
        }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Show panel - Show one of the panel types
//
// Inputs:      Name of panel to show (one of: "WordPanel", "ImagePanel", "ArticlePanel")
//
// Outputs:     None.
//
function ShowPanel(PanelName) {

    var Panels = GetClass("Panel");
    for( let Panel of Panels ) {
        Panel.style.display = "none";
        }

    GetID(PanelName).style.display = "block";
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ProcessKB - Process KB chars
//
// Inputs:      The event
//
// Outputs:     None.
//
var KEYCODE_ENTER = 13;
var KEYCODE_ESC   = 27;
var KEYCODE_D     = 68;
var KEYCODE_L     = 76;
var KEYCODE_S     = 83;

function ProcessKB(Event) {

    if( event.keyCode == KEYCODE_ESC ) {
        //
        // ESC is to abort slideshow
        //
        if( State == StateEnum.Slideshow ) {
            State = StateEnum.Abort;
            return;
            }
        //
        // ESC otherwise
        //
        ShowArticle("LEW02");
        return;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Debug functions - Enable with "Debug" var, at top
    //
    if( !Debug )
        return;

    //
    // <ALT>-D  Enter day and run
    //
    if( event.keyCode == KEYCODE_D ) {
        return;
        }

    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ConfigSetCat - Set the category, as part of the configuration process
//
// Inputs:      Element user clicked on
//
// Outputs:     None. (Configuration is set locally)
//
function ConfigSetCat(UserCategory) {

    Config.Category = UserCategory;
    SetConfig();
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// SetConfig  - Save configuration info locally
// GetConfig  - Retrieve configuration info from local storage
// InitConfig - Initialize config for first run
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Global var Config is set)
//
function SetConfig() { SetLocalData("Config",Config); }

function GetConfig() { 
    Config = GetLocalData("Config");

    if( Config == null )
        InitConfig();
    }

function InitConfig() { 

    Config = {
        StartCDay:      0,      // Calendar day when lesson arc started
        LessonLDay:     0,      // Current lesson   day user is at
        LessonCDay:     0,      // Current calendar day user achieved leddon
        SlideIntroSeen: 0,      // FALSE on very first slideshow
        SlideMultiSeen: 0,      // FALSE unless 2nd slideshow in single day
        Category:       "",     // Category of user's project (ex: "Pottery")
        };
    }
