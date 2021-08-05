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
//      [...]index.html?Lesson=$Name
//
//          Run the named lesson. The name is the "ID" of the template found in
//            the main index.html file. (For example: TAW00 is the 1st lesson in
//            the "two motivations" arc.)
//
//      [...]index.html?Day=$Num
//
//          Set the day to $Num and run normally. Used for debugging the
//            lesson arcs without having to wait a day for each lesson.
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
//      Firefox file:$HOME/Motivation/public_html/index.html?Day=3
//
//          This will set the day to 3, and otherwise run as normal.
//
//  KEYBOARD
//
//      For convenience in debugging (and hackaday prize judging), the following
//        key combinations are available if the "Debug" var is non-zero:
//
//          <ALT>-D  Increment day
//          <ALT>-L  Run day's lesson
//          <ALT>-S  Run slideshow
//          <ALT>-R  Reset lesson to 1st day
//          <ALT>-Q  Reset everything
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
// Per the (admittedly ad-hoc) coding standard, each section has a single start point "RunXXX()"
//   with no arguments. The possible exit points go back to the "Lesson" section as function calls.
//
// So for example "RunSlideshow()" will run the slideshow, and assumes that Config.Category is set
//   so that it knows which category to create and show. "RunLesson()" will check to see if there's
//   a lesson today, and run it (or show one of the end panels). RunConfig() will ask the user to
//   configure their project, and so on.
//
// Entry points:
//
//      RunConfig()         // Configure a project, set Day == 1
//      RunSlideshow()      // Run the slideshow for Config.category
//      RunLesson()         // Present today's lesson, if there is one
//
// The "Lesson" subsection is the central control, and supplies these endpoints as functions
//   with no arguments:
//
//      RunLesson()         // Present today's lesson, if there is one
//      WaitDay()           // Wait at day $DAY until complete
//      WaitLesson()        // Wait at day $DAY until lesson complete
//      WaitHW()            // Wait at day $DAY until previous-day homework complete
//      Done()              // Current day is done (and increment to next day)
//
// These are coded as functions (and not, for example, as NavID('PanelName')) in the web page
//   so that the javascript can fine-tune the transition points. For example, the slideshow
//   section wants to show a long-form intro on day 1, and an abbreviated version on all other
//   days. Code can make these decisions, while a straight-up NavID is fixed.
//

    var Debug    = 1;       // Set to TRUE to enable debug functions
    var HADPrize = 1;       // Set to TRUE to for HAD prize judging

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

    var ArticleID;          // Currently shown article

    var CookieURL = window.location.href.split('?')[0];

    var StateEnum = {
        Normal:     1,      // Normal mode
        Manual:     2,      // Manual control, by (for example) URL arg
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
            RunSlideshow();
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
            }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if( Configured() ) return RunSlideshow(Config.Category);
        if( HADPrize     ) return ShowArticle("Hackaday");

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
// Outputs:     None. (HTML tag always returns TRUE)
//
var KEYCODE_ENTER = 13;
var KEYCODE_ESC   = 27;
var KEYCODE_RIGHT = 39;
var KEYCODE_LEFT  = 37;
var KEYCODE_D     = 68;
var KEYCODE_E     = 69;
var KEYCODE_L     = 76;
var KEYCODE_O     = 79;
var KEYCODE_Q     = 81;
var KEYCODE_R     = 82;
var KEYCODE_S     = 83;

var KEYCODE_d     = 100;
var KEYCODE_e     = 101;
var KEYCODE_o     = 111;

function ProcessKB(Event) {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Process modifiers separately
    //
    if( ProcessModKB() )
        return;

//console.log("PKB: " + "A=" + ALT + ",C=" + CTRL + ",S=" + SHIFT + " " +KeyType + ": " + KeyCode);

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
        // ESC while in the slideshow. Slideshow section will handle this.
        //
        if( InSlideshow ) {
            SSInterrupt = 1;
            return;
            }

        //
        // ESC otherwise - Show the table of contents
        //
        ShowArticle("Contents");
        return;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Debug functions - Enable with "Debug" var, at top
    //
    if( Debug ) {
        if( ProcessDebugKB() )
            return;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Special functions for Hackaday prize judging
    //
    if( HADPrize ) {
        if( ProcessHADKB() )
            return;
        }

//    alert("Unknown ALT key: " + KeyCode);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ProcessDebugKB - Process keypresses enabled in debug mode
//
// Inputs:      None. (Uses global vars above)
//
// Outputs:     TRUE  if the event was handled by this function
//              FALSE if caller should continue with other processors
//
function ProcessDebugKB() {

    if( KeyType != "keydown" )
        return false;

    if( SHIFT )
        return false;

    if( CTRL )
        return false;

    if( ALT )
        return false;

    //
    // DEBUG
    //
    // SHIFT is released
    // CTRL  is released
    // ALT   is released
    // Type is "keydown"
    //
    var ArticleList = [];
    for( let Article of GetTag("Article") ) {
        ArticleList.push(Article.id);
        }

    var CurrentIndex = ArticleList.indexOf(ArticleID);

    if( CurrentIndex < 0 )
        return false;

    //
    // RIGHT ARROW - Go to the next lesson panel
    //
    if( KeyCode == KEYCODE_RIGHT ) {
        CurrentIndex += 1;
        if( CurrentIndex >= ArticleList.length )
            CurrentIndex = ArticleList.length-1;

        console.log(ArticleList[CurrentIndex]);
        ShowArticle(ArticleList[CurrentIndex]);
        return true;
        }

    //
    // RIGHT ARROW - Go to the prev lesson panel
    //
    if( KeyCode == KEYCODE_LEFT ) {
        CurrentIndex -= 1;
        if( CurrentIndex < 0 )
            CurrentIndex = 0;

        console.log(ArticleList[CurrentIndex]);
        ShowArticle(ArticleList[CurrentIndex]);
        return true;
        }

    return false;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ProcessHADKB - Process keypresses enabled in hackaday mode
//
// Inputs:      None. (Uses global vars above)
//
// Outputs:     TRUE  if the event was handled by this function
//              FALSE if caller should continue with other processors
//
function ProcessHADKB() {

    if( KeyType != "keydown" )
        return false;

    if( SHIFT )
        return false;

    if( CTRL )
        return false;

    if( !ALT )
        return false;

    //
    // SHIFT is released
    // CTRL  is released
    // ALT   is pressed
    // Type is "keydown"
    //      |       |
    //      V       V
    //

    //
    // <ALT>-D  Set lesson day
    //
    if( KeyCode == KEYCODE_D ) {
        let Day = prompt("Lesson day " + Config.LessonLDay + 
                         " (" + Calendar[Config.LessonLDay] + ")" + 
                          "\nEnter new lesson day: ");

        if( Day == null )           // ESC entered
            return true;

        if( Day < 1 || Day > 30 ) {
            alert("Not a valid day 1 .. 30 (" + Day + ")");
            return true;
            }

        Config.LessonLDay = Day;
        Config.LessonCDay = TodayCDay - 1;
        SaveConfig();
        alert("Lesson day is now: " + Config.LessonLDay);
        return true;
        }

    //
    // <ALT>-L  Run day's lesson
    //
    if( KeyCode == KEYCODE_L ) {
        if( Debug ) ShowLesson();           // For debugging
        else        RunLesson();            // Normal - ask if user wants to view
        return true;
        }

    //
    // <ALT>-S  Run slideshow
    //
    if( KeyCode == KEYCODE_S ) {
        if( !Configured() ) {
            alert("Configure a lesson first");
            return true;
            }
        RunSlideshow(Config.Category);
        return true;
        }

    //
    // <ALT>-R  Reset lesson day
    //
    if( KeyCode == KEYCODE_R ) {
        if( !Configured() ) {
            alert("Configure a lesson first");
            return true;
            }
        Config.LessonCDay = TodayCDay - 1;
        Config.LessonLDay = 1;
        SaveConfig();
        alert("Reset to day: " + Config.LessonLDay);
        return true;
        }

    //
    // <ALT>-Q  Reset everything
    //
    if( KeyCode == KEYCODE_Q ) {
        ResetReload();
        return true;
        }

    return false;
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// HUH - Hide one element, unhide another
//
// Inputs:      ID of element to get
//
// Outputs:     None.
//
function HUH(ID1,ID2) {

    Hide(ID1);
    UnHide(ID2);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// NavPrim - Handle special priming word entry
//
// Inputs:      The KBD event
//
// Outputs:     FALSE if user's input should not be entered
//              TRUE  if OK to put user's entry in field
//
function NavPrim(Event) {

    if( ProcessModKB(Event) )
        return true;

    if( KeyType != "keydown" )
        return true;

    //
    // Allow CTRL and ALT to reload page &c, useful for debugging
    //
    if( CTRL || ALT )
        return true;

    //
    // Check the actual key typed
    //
    if( KeyCode != KEYCODE_D && 
        KeyCode != KEYCODE_E && 
        KeyCode != KEYCODE_O &&
        KeyCode != KEYCODE_d && 
        KeyCode != KEYCODE_e && 
        KeyCode != KEYCODE_o )
        return false;               // Don't acept user's input

    UnHide("NotePa1");

    return true;                    // Put user's input in box
    }
