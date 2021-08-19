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
// Hide(IDs)                    Get element by ID and hide   it
// UnHide(IDs,Disp="Block")     Get element by ID and reveal it
// HideUnHide(Hides,Reveals,Disp="block")   Do Hide and UnHide on elements
//
// FadeOut   (Element)          Fade out an element
// FadeIn    (Element)          Fade in an element
// FadeCancel(Element)          Cancel fade process, and reset element
//
// SetCookie(Name,Var,ExpDays)  Set a cookie for later retrieval
// DeleteCookie(Name)           Remove previously stored cookie
// CookiesEnabled()             Return TRUE if cookies can be set
//
// Var = GetCookie(Name)        Get previously stored cookie
//
// SetLocalData(Name,Var)       Set local data for later retrieval
// DeleteLocalData(Name)        Remove previously stored local data
// LocalDataEnabled()           Return TRUE if local data can be set
//
// Var = GetLocalData(Name)     Get previously stored local data
//
// EscapeQuotes(String)         Change quotes (and double quotes) into HTML escape sequences
//
// JSONURI(Var)                 Encode var into JSON, URI compatible
// URIJSON(URI)                 Decode var from URI,  JSON encoded
// Reload()                     Reload current page
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
//              Undefined if no element
//
function GetID(ID) {

    var Element = document.getElementById(ID)

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

    return Elements;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Hide - Get element(s) by ID and hide it(them)
//
// Inputs:      IDs of element to get (can be single value)
//
// Outputs:     None.
//
function Hide(IDs) {

    if( Array.isArray(IDs) ) {
        for( let ID of IDs ) {
            Hide(ID);
            }
        return;
        }

    var Element = document.getElementById(IDs)
    if( Element == undefined ) 
        throw new Error("Cannot find element (" + IDs + ").");

    Element.style.display = "none";
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// UnHide - Get elements by ID and reveal them
//
// Inputs:      ID of element to get (can be single value)
//              (Optional) type of display to use
//
// Outputs:     None.
//
function UnHide(IDs,Type) {

    if( Array.isArray(IDs) ) {
        for( let ID of IDs ) {
            UnHide(ID,Type);
            }
        return;
        }

    var DisplayType = Type;
    if( DisplayType === undefined )
        DisplayType = "block";

    var Element = document.getElementById(IDs)
    if( Element == undefined ) 
        throw new Error("Cannot find element (" + ID + ").");

    Element.style.display = DisplayType;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// HideUnHide - Get element(s) by ID and hide them, get others and reveal (them)
//
// Inputs:      ID of element to get (can be array)
//              (Optional) type of display to use
//
// Outputs:     None.
//
function HideUnHide(Hides,Reveals,Type) {

    Hide(Hides);
    UnHide(Reveals,Type);
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

    var Element = GetID(ID);
    if( Element == undefined ) 
        throw new Error("Cannot find element (" + ID + ").");

    return Element.innerHTML;
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

    Element.style.opacity = op;
    Element.style.filter  = 'alpha(opacity=' + op * 100 + ")";

    FadeTimer = setInterval(function () {
        if( op <= 0 ){
            clearInterval(FadeTimer);
            Element.style.display = 'none';
            Element.style.filter  = "none";
            Element.style.opacity = 1;
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

    Element.style.opacity = op;
    Element.style.filter  = 'alpha(opacity=' + op * 100 + ")";
    Element.style.display = 'flex';

    FadeTimer = setInterval(function () {
        if( op >= 1 ){
            clearInterval(FadeTimer);
            Element.style.display = 'flex';
            Element.style.filter  = "none";
            Element.style.opacity = 1;
            return;
            }
        Element.style.opacity = op;
        Element.style.filter  = 'alpha(opacity=' + op * 100 + ")";
        op += 1.0/FadeSteps;
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
    Element.style.opacity = 1;
    Element.style.filter  = "none";
    Element.style.display = 'flex';
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
// SetLocalData - Set local data for later retrieval
//
// Inputs:      Name of data to set
//              Value to set
//
// Outputs:     None. (Data is locally stored)
//
function SetLocalData(Name, Value) {

    localStorage.setItem(Name,JSON.stringify(Value));
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// GetLocalData - Get previously stored local data
//
// Inputs:      Name of data to get
//
// Outputs:     Cookie value, if cookie exists
//              Zero-length string otherwise
//
function GetLocalData(Name) {

    return JSON.parse(localStorage.getItem(Name));
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// DeleteLocalData - Remove previously stored local data
//
// Inputs:      Name of cookie
//
// Outputs:     None.
//
function DeleteLocalData(Name) {

    localStorage.removeItem(Name);
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// LocalDataEnabled - Return TRUE if local data can be set
//
// Inputs:      None.
//
// Outputs:     TRUE  if local data can be set
//              FALSE otherwise
//
function LocalDataEnabled() {

    try {
        localStorage.setItem("Test", 1);
        localStorage.removeItem("Test");
        return true;
        } 
    catch(e) {
        return false;
        }
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// EscapeQuotes - Change quotes (and double quotes) into HTML escape sequences
//
// Inputs:  String to process
//
// Outputs: Same string, with quotes escaped
//
function EscapeQuotes(String) {

    if( !String )
        return "";

    return String.replace(/"/g, '\\x22').replace(/'/g, '\\x27');
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// JSONURI - Encode var into JSON, URI compatible
// URIJSON - Decode var from URI,  JSON encoded
// Reload  - Reload the page, from the original URL
//
// Inputs:  ...
//
// Outputs: ...
//
function JSONURI(Var) { return encodeURIComponent(JSON.stringify(Var)); }
function URIJSON(URI) { return JSON.parse(    decodeURIComponent(URI)); }
function Reload()     { location.reload(); }
