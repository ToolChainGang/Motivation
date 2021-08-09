////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// KB.js - Javascript keyboard functions
//
// Copyright (C) 2021 Peter Walsh, Milford, NH 03055
// All Rights Reserved under the MIT license as outlined below.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ParseKBEvent(Event)      Process KB event
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

var KEYCODE_ALT   = 18;
var KEYCODE_CTRL  = 17;
var KEYCODE_SHIFT = 16;

var KB = {
    ALT:     0,         // 1 == ALT   is pressed
    CTRL:    0,         // 1 == CTRL  is pressed
    SHIFT:   0,         // 1 == SHIFT is pressed
    KeyCode: 0,         // Keycode seen
    KeyType: 0,         // One of: "keyup", "keydown", "keypress"
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ParseKBEvent - Process KB event
//
// Inputs:      The event
//
// Outputs:     TRUE  if the event was handled by this function
//              FALSE if caller should continue with other processors
//
function ParseKBEvent(Event) {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Get the actual key event
    //
    if( window.event ) {
        KB.KeyCode = window.event.keyCode;
        KB.KeyType = window.event.type;
        }
    else if( Event ) {
        KB.KeyCode = Event.which;
        KB.KeyType = Event.type;
        }
    else {
        alert("Unknown event");
        return true;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Track the SHIFT,ALT,and CTRL keys.
    //
    if( KB.KeyCode == KEYCODE_ALT ) {
        if( KB.KeyType == "keydown" ) { KB.ALT = 1; return 1; }
        if( KB.KeyType == "keyup"   ) { KB.ALT = 0; return 1; }
        alert("Unknown ALT event");
        return true;
        }

    if( KB.KeyCode == KEYCODE_CTRL ) {
        if( KB.KeyType == "keydown" ) { KB.CTRL = 1; return 1; }
        if( KB.KeyType == "keyup"   ) { KB.CTRL = 0; return 1; }
        alert("Unknown CTRL event");
        return true;
        }

    if( KB.KeyCode == KEYCODE_SHIFT ) {
        if( KB.KeyType == "keydown" ) { KB.SHIFT = 1; return 1; }
        if( KB.KeyType == "keyup"   ) { KB.SHIFT = 0; return 1; }
        alert("Unknown SHIFT event");
        return true;
        }

    return false;
    }
