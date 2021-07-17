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

var Calendar = [
    "",         // Day 01
    "",         // Day 02
    "MOA00",    // Day 03   Types of motivation
    "MOB00",    // Day 04
    "MOC00",    // Day 05
    "",         // Day 06
    "",         // Day 07
    "",         // Day 08
    "",         // Day 09
    "",         // Day 10
    "",         // Day 11
    "",         // Day 12
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
    "",         // Day 25
    "",         // Day 26
    "",         // Day 27
    "",         // Day 28
    "",         // Day 29
    "",         // Day 30
    "",         // Day 31
    "",         // Day 32
    "",         // Day 33
    "",         // Day 34
    "",         // Day 35
    "",         // Day 36
    "",         // Day 37
    "",         // Day 38
    "",         // Day 39
    "",         // Day 40
    "",         // Day 41
    "",         // Day 42
    "",         // Day 43
    "",         // Day 44
    "",         // Day 45
    "",         // Day 46
    "",         // Day 47
    "",         // Day 48
    "",         // Day 49
    "",         // Day 50
    "",         // Day 51
    "",         // Day 52
    "",         // Day 53
    "",         // Day 54
    "",         // Day 55
    "",         // Day 56
    "",         // Day 57
    "",         // Day 58
    "",         // Day 59
    "",         // Day 60
    ];

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IsLessonToday - Return TRUE if there is a lesson scheduled today
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Cookie is set in document)
//
function IsLessonToday() {
    return Calendar[Day] != "";
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// StartLesson - Begin today's lesson
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Cookie is set in document)
//
function StartLesson() {

    if( IsLessonToday ) ShowArticle(Calendar[Day]); // Start today's lesson
    else                ShowArticle("LEN00");       // No lesson today
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// SkipLesson - Skip today's lesson
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Cookie is set in document)
//
function SkipLesson() {

    Homework = 1;
    ShowArticle("LEW00");       // "Pause until complete"
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CompleteLesson - Complete today's lesson
//
// Inputs:      None. (Global vars are used)
//
// Outputs:     None. (Cookie is set in document)
//
function CompleteLesson() {

    ShowArticle("LEC00");
    }
