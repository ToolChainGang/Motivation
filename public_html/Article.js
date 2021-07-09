////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Article.js - Functions to manage article panels
//
// Copyright (C) 2020 Peter Walsh, Milford, NH 03055
// All Rights Reserved under the MIT license as outlined below.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     ShowArticle(ArticleName) - Display a specified article in panel form
//      GetArticle(ArticleName) - Return HTML contents of names panel
//
//  IsFirstArticle(ArticleName) - Return TRUE if panel is 1st  in series
//   IsLastArticle(ArticleName) - Return TRUE if panel is last in series
//
//      ArticleNum(ArticleName) - Return numeric value of panel name
//      ArticleNam(ArticleName) - Return text  portion of panel name
//
// NextArticleName(ArticleName) - Return name of next panel
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
// The panels are loaded into the main index.html page with display:none.
//
// The assumed usage is for javascript to call GetArticle(ArticleName), which will return the innerHTML
//   of the identified panel.
//
// All Articles have names of the form CCCdd, where "C" is an uppercase alpha letter, and "d" is a
//   decimal digit. Thus, "FLO00" is the first panel in the "Fugue" description set. This is an
//   exact format used for all names.
//
// Digits "00" are always the 1st panel in a set, and the last panel has no succeeding numbered
//   panel. Thus, the caller can always determine whether the panel is the first or last in the
//   sequence (and make appropriate first/prev/next/last links).
//
// Articles are defined by any HTML within an "Article" tag, of the specified name.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var ArticleNameRegex = /^[A-Z]{3}\d{2}$/;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ShowArticle - Display a specified article in panel form
//
// Inputs:      Name of article to show (ex: "FLO00")
//
// Outputs:     None.
//
function ShowArticle(ArticleName) {

    ArticlePanel.innerHTML = GetHTML(ArticleName);
    ShowPanel("ArticlePanel");
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ArticleNum - Return numeric value of panel name
//
// Inputs:      Name of panel (ex: "FLO12")
//
// Outputs:     Numeric value of panel number (12, from example above)
//
function ArticleNum(ArticleName) {

    if( !ArticleNameRegex.test(ArticleName) ) 
        throw new Error("Misformed panel name (" + ArticleName + ".");

    return parseInt(ArticleName.substr(3,2));
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ArticleNam - Return text portion of panel name
//
// Inputs:      Name of panel (ex: "FLO12")
//
// Outputs:     Text portion of panel name ("FLO", from example above)
//
function ArticleNam(ArticleName) {

    if( !ArticleNameRegex.test(ArticleName) ) 
        throw new Error("Misformed panel name (" + ArticleName + ".");

    return ArticleName.substr(0,3);
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// NextArticleName - Return name of next panel
//
// Inputs:      Name of current panel (ex: "FLO12")
//
// Outputs:     Name of next panel
//
// NOTE: Textual construction only - actual panel of that name may not exist
//
function NextArticleName(ArticleName) {

    return ArticleNam(ArticleName) + String(1+ArticleNum(ArticleName)).padStart(2, '0');
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IsFirstArticle - Return TRUE if panel is 1st in series
//
// Inputs:      Name of panel (ex: "FLO12")
//
// Outputs:     TRUE  if panel number is "00"
//              FALSE otherwise
//
function IsFirstArticle(ArticleName) {

    return ArticleNum(ArticleName) == 0;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IsLastArticle - Return TRUE if panel is last in series
//
// Inputs:      Name of panel (ex: "FLO12")
//
// Outputs:     TRUE  if next panel number exists ("FLO13" in example)
//              FALSE otherwise
//
function IsLastArticle(ArticleName) {

    return GetArticle(NextArticleName) != undefined;
    }
