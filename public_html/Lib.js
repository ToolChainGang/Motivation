////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Lib.js - Javascript general functions
//
// Copyright (C) 2020 Peter Walsh, Milford, NH 03055
// All Rights Reserved under the MIT license as outlined below.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// GetID(ID)                    Get element by ID, with error checking
// GetHTML(ID)                  Get innerHTML of element by ID, with error checking
// GetClass(Class)              Get all elements by class name, with error checking
//
// FadeOut   (Element)          Fade out an element
// FadeIn    (Element)          Fade in an element
// FadeCancel(Element)          Cancel fade process, and reset element
//
// SetCookie(Name,Var,ExpDays)  Set a cookie for later retrieval
//
// Var = GetCookie(Name)        Get previously stored cookie
//
// DeleteCookie(Name)           Remove previously stored cookie
// CookiesEnabled(Name)         Return TRUE if cookies can be set
//
// JSONURI(Var)                 Encode var into JSON, URI compatible
// URIJSON(URI)                 Decode var from URI,  JSON encoded
//
// TestCookies                  Test the cookie storage mechanism (for debugging)
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

var FadeTimer;
var FadeSteps  = 20;        // Number of steps of fade
var FadeStepMS = 60;        // Fade step time, in MS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// GetID - Get element by ID, with error checking
//
// Inputs:      ID of element to get
//
// Outputs:     Element with that ID
//
function GetID(ID) {

    var Element = document.getElementById(ID)
    if( Element === undefined ) 
        throw new Error("Cannot find element (" + ID + ".");

    return Element;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// GetClass - Get all elements by class name, with error checking
//
// Inputs:      Element class to get
//
// Outputs:     All elements of that class
//
function GetClass(Class) {

    var Elements = document.getElementsByClassName(Class);

    if( Elements.length == 0 ) 
        throw new Error("Cannot find class (" + Class + ".");

    return Elements;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// GetTag - Get all elements by tag type, with error checking
//
// Inputs:      Element tag to get
//
// Outputs:     All elements with that tag
//
function GetTag(Tag) {

    var Elements = document.getElementsByTagName(Tag);

    if( Elements.length == 0 ) 
        throw new Error("Cannot find tag (" + Tag + ".");

    return Elements;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// GetHTML - Get innerHTML of element by ID, with error checking
//
// Inputs:      Element to get
//
// Outputs:     None.
//
function GetHTML(ID) {

    return GetID(ID).innerHTML;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// FadeOut - Fade out an element
//
// Inputs:      Element to fade
//
// Outputs:     None.
//
function FadeOut(Element) {

    var op = 1;  // Initial opacity

    FadeTimer = setInterval(function () {
        if( op <= 0 ){
            clearInterval(FadeTimer);
            Element.style.display = 'none';
            Element.style.filter  = "none";
            Element.style.opacity = 0;
            return;
            }
        Element.style.opacity = op;
        Element.style.filter  = 'alpha(opacity=' + op * 100 + ")";
        op -= 1.0/FadeSteps;
        }, FadeStepMS);
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// FadeIn - Fade in an element
//
// Inputs:      Element to fade
//
// Outputs:     None.
//
function FadeIn(Element) {

    var op = 0;     // Initial opacity

    FadeTimer = setInterval(function () {
        if( op >= 1 ){
            clearInterval(FadeTimer);
            Element.style.display = 'block';
            Element.style.filter  = "none";
            Element.style.opacity = 1;
            return;
            }
        Element.style.opacity = op;
        Element.style.filter  = 'alpha(opacity=' + op * 100 + ")";
        op += 1.0/FadeSteps;;
        }, FadeStepMS);
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// FadeCancel - Cancel fade process, and reset element
//
// Inputs:      Element currently fading
//
// Outputs:     None.
//
function FadeCancel(Element) {

    clearInterval(FadeTimer);
    Element.style.display = 'block';
    Element.style.filter  = "none";
    Element.style.opacity = 1;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// SetCookie - Set a cookie for later retrieval
//
// Inputs:      Name of cookie
//              Value to set
//              Expiration, in days
//
// Outputs:     None. (Cookie is set in document)
//
function SetCookie(Name, Value, ExpireDays) {
    var CookieDate = new Date();

    CookieDate.setTime(CookieDate.getTime() + (ExpireDays * 24 * 60 * 60 * 1000));

    var Expires    = "expires=" + CookieDate.toGMTString();
    var CookiePath = Name + "=" + JSONURI(Value) + ";" + Expires + ";path=/;SameSite=Strict";
    document.cookie = CookiePath;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// GetCookie - Get a previously stored cookie
//
// Inputs:      Name of cookie
//
// Outputs:     Cookie value, if cookie exists
//              Zero-length string otherwise
//
function GetCookie(Name) {

    var Data = document.cookie.match(new RegExp(Name + '=([^;]+)'));

    if( Data )
        return URIJSON(Data[1]);

    return "";
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// DeleteCookie - Remove previously stored cookie
//
// Inputs:      Name of cookie
//
// Outputs:     None.
//
function DeleteCookie(Name) {

    document.cookie = Name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.' + window.location.host.toString();
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CookiesEnabled - Return TRUE if cookies can be set
//
// Inputs:      None.
//
// Outputs:     TRUE  if cookies can be set
//              FALSE otherwise
//
function CookiesEnabled() {

    SetCookie("TestCookie", "TestValue", 1);
    return GetCookie("TestCookie");
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// JSONURI - Encode var into JSON, URI compatible
// URIJSON - Decode var from URI,  JSON encoded
//
// Inputs:  ...
//
// Outputs: ...
//
function JSONURI(Var) { return encodeURIComponent(JSON.stringify(Var)); }
function URIJSON(URI) { return JSON.parse(    decodeURIComponent(URI)); }

/*
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// TestCookies - Test the cookie/var mechanism
//
// Inputs:  None.
//
// Outputs: None. Will throw message if cookies don't work
//
function TestCookies() {

var Test1 = 
{
"evt": [{
    "id": "2;4",
    "qty": "2"
}, {
    "id": "3",
    "qty": "7"
}],
"exc": [{
    "id": "2",
    "qty": "3"
}, {
    "id": "1",
    "qty": "6"
}],
"qt": "15",
"ti": "067e61623b6f4ae2a1712470b63dff00",
"rm": {
    "aci": "6",
    "rt": "5"
    }
};

SetCookie("Froboz",Test1,30);
var Test2 = GetCookie("Froboz");

if( JSON.stringify(Test1) !== JSON.stringify(Test2) )
    throw new Error("Cookies are broken.");
}

*/
