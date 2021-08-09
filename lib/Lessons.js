////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Lessons.js - Javascript for lesson management
//
// Copyright (C) 2020 Peter Walsh, Milford, NH 03055
// All Rights Reserved under the MIT license as outlined below.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Calendar[]       List of lessons per course day  (ex: LessonCalendar[3] => "LLM00")
//
// IsLessonToday()  Return TRUE if there is a lesson scheduled for today
// RunLesson()      If there is a lesson today, ask the user if they want it
// ShowLesson()     Show today's lesson
// ShowPrevLesson() Show previous lesson
//
// ResetLesson()    Initialize lesson, prior to running course
//
// StartLesson()    Determine today's lesson and start it
// SkipLesson()     Skip today's lesson and put the program in pause
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Per the (admittedly ad-hoc) coding standard, each section has a single start point "RunXXX()"
//   with no arguments. The possible exit points go back to the "Lesson" section as function calls.
//
// Entry points:
//
//      RunLesson()         // Present today's lesson, if there is one
//
// The "Lesson" subsection is the central control, and supplies these endpoints as functions
//   with no arguments:
//
//      WaitDay()           // Wait at day $DAY until complete
//      WaitLesson()        // Wait at day $DAY until lesson complete
//      WaitHW()            // Wait at day $DAY until previous-day homework complete
//      LessonDone()        // Current day is done (and increment to next day)
//
// These are coded as functions (and not, for example, as NavID('PanelName')) in the web page
//   so that the javascript can fine-tune the transition points. For example, the slideshow
//   section wants to show a long-form intro on day 1, and an abbreviated version on all other
//   days. Code can make these decisions, while a straight-up NavID is fixed.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// NCA00    Neurochemistry of motivation
//
// FAI00    Dealing with failure
//
// FLO00    Flow
//
// PRI00    Pride (best project)
//
// COG00    Cognitive gas tank
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Lesson articles:
//
// AskLesson        Do you have time for today's lesson?
// NoLesson         No lesson today
//
// LessonDone       This completes today's lesson
// WaitDay          Program will wait until day      complete
// WaitLesson       Program will wait until lesson   complete
// WaitHW           Program will wait until homework complete
// Done             This completes the course
//
var Calendar = [
    "",         // Day 00   (placeholder)
    "",         // Day 01
    "TWA00",    // Day 02   Types of motivation - choose weakest
    "TWB00",    // Day 03   (HW)
    "TWC00",    // Day 04   Extrinsic replaces intrinsic, Write down project motives
    "TWD00",    // Day 05   Fold up, write completion
    "TWE00",    // Day 06   Mantras
    "TWF00",    // Day 07   Motivational focus
    "",         // Day 08
    "RST00",    // Day 09   Restarting your project
    "",         // Day 10
    "NCA00",    // Day 11   Neurochemistry: norepinephrine - make easier/simpler
    "NCB00",    // Day 12   Neurochemistry: dopamine
    "",         // Day 13
    "",         // Day 14
    "",         // Day 15
    "",         // Day 16
    "",         // Day 17
    "",         // Day 18
    "",         // Day 19
    "",         // Day 20
    "",         // Day 21
    "",         // Day 22
    "",         // Day 23
    "",         // Day 24
    "JOA00",    // Day 25   Write project map
    "JOB00",    // Day 26   (HW)
    "",         // Day 27
    "",         // Day 28
    "",         // Day 29
    "",         // Day 30
    ];


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IsLessonToday - Return TRUE if there is a lesson scheduled today
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Config is set in local storage)
//
function IsLessonToday() {
    return Calendar[Config.LessonLDay] != "";
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// RunLesson - See if there's a lesson today, and run it
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Config is set in local storage)
//
function RunLesson() {

    if( State == StateEnum.Manual )
        return ShowArticle("Contents");

    if( IsLessonToday() ) ShowArticle("AskLesson");
    else {
        if( Config.LessonLDay == 1 ) ShowArticle("NoLesson1");      // No lesson 1st day
        else                         ShowArticle("NoLesson");       // No lesson today
        IncLDay(); 
        }
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ShowLesson - Find and start the 1st lesson panel
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Config is set in local storage)
//
function ShowLesson() {

    if( !Configured() ) {
        alert("Configure a project first");
        return true;
        }

    ShowArticle(Calendar[Config.LessonLDay]); // Start today's lesson
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ShowPrevLesson - Show previous day's lesson
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Config is set in local storage)
//
function ShowPrevLesson() { 

    if( !Configured() ) {
        alert("Configure a project first");
        return true;
        }

    BackupDay();
    ShowLesson();
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// WaitDay    - Wait at day $DAY until          complete
// WaitLesson - Wait at day $DAY until lesson   complete
// WaitHW     - Wait at day $DAY until homework complete
// DayDone    - Increment to next day
// BackupDay  - Backup lesson day by 1 day
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Config is set in local storage)
//
function WaitDay() {

    if( Config.LessonLDay == 0 )
        return ShowArticle("Contents");

    ShowArticle("WaitDay");
    }

function BackupDay () { Config.LessonLDay = max(Config.LessonLDay-1,1); }
function WaitLesson() { ShowArticle("WaitLesson"); }
function WaitHW    () { ShowArticle("WaitHW"    ); }
function LessonDone() { ShowArticle("LessonDone"); IncLDay(); }
