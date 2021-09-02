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
//
// ResetLesson()    Initialize lesson, prior to running course
//
// StartLesson()    Determine today's lesson and start it
// SkipLesson()     Skip today's lesson and put the program in pause
//
// WaitDay          Wait at day $DAY until          complete
// WaitLesson       Wait at day $DAY until lesson   complete
// WaitHW           Wait at day $DAY until homework complete
// LessonDone       Increment to next lesson
//
// PauseLesson      Disable  lesson daily increment
// ResumeLesson     Reenable lesson daily increment
// LessonPaused     Return TRUE if lesson paused
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
    "TWD00",    // Day 05   (HW) Fold up, write completion
    "TWE00",    // Day 06   Mantras
    "TWF00",    // Day 07   (HW) Motivational focus
    "",         // Day 08
    "RST00",    // Day 09   Restarting your project
    "",         // Day 10
    "NCA00",    // Day 11   Neurochemistry: norepinephrine - make easier/simpler
    "NCB00",    // Day 12   (HW) Neurochemistry: dopamine - do 1 small task
    "NCC00",    // Day 13   (HW) Continuing easier than starting
    "NCD00",    // Day 14   Serotonin is reward
    "",         // Day 15
    "RSU00",    // Day 16   Restarting, part 2
    "RSA00",    // Day 17   RAS part 1
    "RSB00",    // Day 18   RAS part 2
    "JOA00",    // Day 19   Project as journey
    "JOB00",    // Day 20   (HW) Lesson plan/Idea
    "JOC00",    // Day 21   (HW) Sketch
    "JOD00",    // Day 22   Decision
    "",         // Day 23
    "FAI00",    // Day 24   Dealing with failure
    "",         // Day 25
    "COG00",    // Day 26   (HW)
    "TUA00",    // Day 27   Tuning 1
    "FLO00",    // Day 28   Flow
    "",         // Day 29
    "PRI00",    // Day 30   Pride
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

    if( !IsLessonToday() ) {
        if( Config.LessonLDay == 1 ) ShowArticle("NoLesson1");      // No lesson 1st day
        else                         ShowArticle("NoLesson");       // No lesson today
        ResumeLesson();
        return;
        }

    ShowArticle("AskLesson");
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

    //
    // Special check, allows debug functions to directly call ShowLesson()
    //
    if( !IsLessonToday() ) {
        if( Config.LessonLDay == 1 ) ShowArticle("NoLesson1");      // No lesson 1st day
        else                         ShowArticle("NoLesson");       // No lesson today
        ResumeLesson();
        return;
        }

    ShowArticle(Calendar[Config.LessonLDay]);                       // Start today's lesson
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// WaitDay      - Wait at day $DAY until          complete
// WaitLesson   - Wait at day $DAY until lesson   complete
// WaitHW       - Wait at day $DAY until homework complete
// LessonDone   - Increment to next lesson
//
// PauseLesson  - Disable  lesson daily increment
// ResumeLesson - Reenable lesson daily increment
// LessonPaused - Return TRUE if lesson paused
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Config is set in local storage)
//
function PauseLesson () { Config.Paused = 1;                                SaveConfig() };
function ResumeLesson() { Config.Paused = 0; Config.LessonCDay = TodayCDay; SaveConfig() };
function LessonPaused() { return Config.Paused; }

function WaitDay   () { PauseLesson (); ShowArticle("WaitDay"    ); }
function WaitLesson() { PauseLesson (); ShowArticle("WaitLesson"); }
function WaitHW    () { PauseLesson (); ShowArticle("WaitHW"    ); }
function LessonDone() { ResumeLesson(); ShowArticle("LessonDone"); }
