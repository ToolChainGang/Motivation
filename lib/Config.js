////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Config.js - Configuration functions
//
// Copyright (C) 2020 Peter Walsh, Milford, NH 03055
// All Rights Reserved under the MIT license as outlined below.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// InitConfig  - Initialize config for first run (Configured() will return false)
// SaveConfig  - Save configuration info locally
// LoadConfig  - Retrieve configuration info from local storage
// Configured  - Return TRUE if project is configured
//
// StartConfig - Start the configuration process
// SetConfig   - Grab the configuration information and store.
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
    ProjName:       "",     // Project name
    Category:       "",     // Category of user's project (ex: "Pottery")
    UserName:       "",     // User's name
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IncLDay - Increment the lesson day that the user has achieved.
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Config is set in local storage)
//
function IncLDay() {

    Config.LessonCDay = TodayCDay

    //
    // The MaxLDay panel presents options to reset the course, so don't increment
    //   past that point.
    //   
    if( Config.LessonLDay < MaxLDay )
        Config.LessonLDay++;

    SaveConfig();
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// StartConfig - Start the configuration process
//
// Inputs:      None.
//
// Outputs:     None.
//
function StartConfig() {

    if( Configured )                        // Already config - ask to change
        return ShowArticle("AskConfig");

    InitConfig();

    ShowArticle("CON00");
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// SetConfig - Grab the configuration information and store.
//
// Inputs:      None.
//
// Outputs:     None.
//
function SetConfig() {

    //
    // Config is initialized in StartConfig() above.
    //
    // ("ProjName" and "Category" are set by the HTML page)
    //
    Config.StartCDay  = TodayCDay;
    Config.LessonLDay = 1;
    Config.LessonCDay = TodayCDay - 1;
//    Config.ProjName   = GetID("ProjectName").value;
//    Config.Category   = GetID(  "SelectCat").value;
    Config.UserName   = GetID(     "MyName").value;

    SaveConfig();
    ShowArticle("Configured");
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// InitConfig - Initialize config for first run
// SaveConfig - Save configuration info locally
// LoadConfig - Retrieve configuration info from local storage
// Configured - Return TRUE if project is configured
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Global var Config is set)
//
function Configured() { return Config.LessonLDay != 0 }
function SaveConfig() { SetLocalData("Config",Config); }

function LoadConfig() {

    InitConfig();

    var StoredConfig = GetLocalData("Config");

    if( StoredConfig )
        Config = StoredConfig;
    }

function InitConfig() { 

    Config = {
        StartCDay:      0,      // Calendar day when lesson arc started
        LessonLDay:     0,      // Current lesson   day user is at
        LessonCDay:     0,      // Current calendar day user achieved leddon
        SlideIntroSeen: 0,      // FALSE on very first slideshow
        SlideMultiSeen: 0,      // FALSE unless 2nd slideshow in single day
        ProjName:       "",     // Project name
        Category:       "",     // Category of user's project (ex: "Pottery")
        UserName:       "",     // User's name
        };
    }
