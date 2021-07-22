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
//      Firefox file:$HOME/Motivation/public_html/index.html
//
//          This will run the full motivation course.
//
//      Firefox file:$HOME/Motivation/public_html/index.html?Slideshow=Ceramics
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

    var Debug = 1;          // Set to TRUE to enable debug functions

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

    var StateEnum = {
        Normal:     1,          // Normal mode
        Manual:     2,          // Manual control, by (for example) URL arg
        Slideshow:  3,          // In slideshow
        Abort:      4,          // Abort (temp state for slideshow)
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
        // Set our day, and load the config data. If data can't be set, then cannot run program.
        //
        var Now = new Date();
        TodayCDay  = Math.floor((Now.getTime() - Now.getTimezoneOffset()*60000)/8.64e7);

        State = StateEnum.Normal;

        if( !LocalDataEnabled() )
            return ShowArticle("EnableCookies");

        LoadConfig();

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

console.log("Lesson: "+ ArticleID);
            ShowArticle(ArticleID);
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

console.log("Day: "+ ArticleID);
            return;
            }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if( Configured() ) return RunSlideshow(Config.Category);
        if( Debug        ) return ShowArticle("Hackaday");

        ShowArticle("Contents");
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
var KEYCODE_ALT   = 18;
var KEYCODE_CTRL  = 17;
var KEYCODE_SHIFT = 16;
var KEYCODE_ESC   = 27;
var KEYCODE_D     = 68;
var KEYCODE_L     = 76;
var KEYCODE_Q     = 81;
var KEYCODE_R     = 82;
var KEYCODE_S     = 83;

var ALT   = 0;
var CTRL  = 0;
var SHIFT = 0;

function ProcessKB(Event) {

    var KeyCode;
    var KeyType;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Get the actual key event
    //
    if(  window.event ) {
        KeyCode = window.event.keyCode;
        KeyType = window.event.type;
        }
    else if( Event ) {
        KeyCode = Event.which;
        KeyType = Event.type;
        }
    else alert("Unknown event");

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Track the SHIFT,ALT,and CTRL keys.
    //
    if( KeyCode == KEYCODE_ALT ) {
        if( KeyType == "keydown" ) return ALT = 1;
        if( KeyType == "keyup"   ) return ALT = 0;
        alert("Unknown ALT event");
        return;
        }

    if( KeyCode == KEYCODE_CTRL ) {
        if( KeyType == "keydown" ) return CTRL = 1;
        if( KeyType == "keyup"   ) return CTRL = 0;
        alert("Unknown SHIFT event");
        return;
        }

    if( KeyCode == KEYCODE_SHIFT ) {
        if( KeyType == "keydown" ) return SHIFT = 1;
        if( KeyType == "keyup"   ) return SHIFT = 0;
        alert("Unknown SHIFT event");
        return;
        }

// console.log("A=" + ALT + ",C=" + CTRL + ",S=" + SHIFT + " " +KeyType + ": " + KeyCode);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // None of our special functions use SHIFT or CTRL
    //
    if( SHIFT )
        return;

    if( CTRL )
        return;

    if( !ALT && KeyCode == KEYCODE_ESC && KeyType == "keydown" ) {
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

    if( KeyType != "keydown" )
        return;

    if( !ALT )
        return;

    //
    // SHIFT is released
    // CTRL  is released
    // ALT   is pressed
    // Type is "keydown"
    //      |       |
    //      V       V
    //
    //
    // <ALT>-D  Increment day
    //
    if( KeyCode == KEYCODE_D ) {
        if( !Configured() ) {
            alert("Configure a lesson first");
            return;
            }
        IncLDay();
        Config.LessonCDay = TodayCDay - 1;
        alert("Lesson day is now: " + Config.LessonLDay);
        return;
        }

    //
    // <ALT>-L  Run day's lesson
    //
    if( KeyCode == KEYCODE_L ) {
        if( !Configured() ) {
            alert("Configure a lesson first");
            return;
            }
        RunLesson();
        return;
        }

    //
    // <ALT>-S  Run slideshow
    //
    if( KeyCode == KEYCODE_S ) {
        if( !Configured() ) {
            alert("Configure a lesson first");
            return;
            }
        RunSlideshow(Config.Category);
        return;
        }

    //
    // <ALT>-R  Reset lesson day
    //
    if( KeyCode == KEYCODE_R ) {
        if( !Configured() ) {
            alert("Configure a lesson first");
            return;
            }
        Config.LessonCDay = TodayCDay - 1;
        Config.LessonLDay = 1;
        alert("Reset to day: " + Config.LessonLDay);
        return;
        }

    //
    // <ALT>-Q  Reset everything
    //
    if( KeyCode == KEYCODE_Q )
        return ResetReload();

//    alert("Unknown ALT key: " + KeyCode);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ResetReload - Reset everything and reload the program
//
// Inputs:      None.
//
// Outputs:     None.
//
function ResetReload() {

    InitConfig();
    SaveConfig();
    Reload();
    }
