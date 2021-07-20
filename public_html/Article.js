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
//      NavBarHTML(ArticleName) - Generate the navigation HTML for an article
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

var NavTemplate = '<div class="NavDiv"><hr class="NavSep"/><div class="NavBar">                                   \
            <a id="NavFirst" class="First $FC" title="Start page"    onclick="NavID(\'$FIRST_PAGE\')">« first</a> \
            <a id="NavPrev"  class="Prev  $PC" title="Previous page" onclick="NavID(\'$PREV_PAGE\' )" >‹ prev</a> \
            <a id="NavUp"    class="Up    $UC" title="Up a level"    onclick="NavUp()"             >⌃up⌃</a>      \
            <a id="NavNext"  class="Next  $NC" title="Next page"     onclick="NavID(\'$NEXT_PAGE\' )" >next ›</a> \
            <a id="NavEnd"   class="Last  $LC" title="End page"      onclick="NavID(\'$LAST_PAGE\' )" >last »</a> \
            </div></div>';

var CatTemplate = '<option value="$CATNAME">$CATDISP</option>';

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

    var Article = GetID(ArticleName);

    //
    // Turn off the day banner in manual mode (and Day == 0)
    //
    var Banner  = Article.getElementsByClassName("DayBanner");
    if( Banner.length ) {
        if( Config.LessonLDay == 0 )
            Banner[0].style.display = "none";
        }

    var ArticleHTML = Article.innerHTML.replaceAll("$DAY"      ,  Config.LessonLDay)
                                       .replaceAll("$CATEGORY" ,  Config.Category  )
                                       .replaceAll("$MAXDAY"   ,            MaxLDay)
                                       .replaceAll("$COOKIEURL",          CookieURL);

    //
    // All articles get a navbar, unless they have "class=NoNAV" set
    //
    if( !Article.classList.contains("NoNav") )
        ArticleHTML += NavBarHTML(ArticleName);

    //
    // Articles that contain CatList (ie - category configuration)
    //
    if( Article.classList.contains("CatList") )
        ArticleHTML = ArticleHTML.replaceAll("$CATLIST",CatListHTML());

    ArticlePanel.innerHTML = ArticleHTML;
    ShowPanel("ArticlePanel");
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// NavBarHTML - Generate the navigation HTML for an article
//
// Inputs:      Name of article to generate nav bar for (ex: "FLO00")
//
// Outputs:     HTML of generated navbar
//
function NavBarHTML(ArticleName) {

    var ANum = ArticleNum(ArticleName);
    var ANam = ArticleNam(ArticleName);

    var FirstPage;
    var FirstClass;

    var PrevPage;
    var PrevClass;

    var NextPage;
    var NextClass;

    var LastPage;
    var LastClass;

    //
    // Grey out the first/prev when at the first page
    //
    if( IsFirstArticle(ArticleName) ) {
        FirstClass = "Disabled";
        PrevClass  = "Disabled";
        }
    else {
        FirstPage = FirstArticleName(ArticleName);
        PrevPage  = PrevArticleName (ArticleName);
        }

    //
    // Grey out the next/last when at the last page
    //
    if( IsLastArticle(ArticleName) ) {
        NextClass = "Disabled";
        LastClass = "Disabled";
        }
    else {
        NextPage = NextArticleName(ArticleName);
        LastPage = LastArticleName(ArticleName);
        }

    var NavHTML = NavTemplate.replaceAll("$ANAME"     ,ArticleName)
                             .replaceAll("$FC"        ,FirstClass)
                             .replaceAll("$PC"        , PrevClass)
                             .replaceAll("$NC"        , NextClass)
                             .replaceAll("$LC"        , LastClass)
                             .replaceAll("$FIRST_PAGE",FirstPage)
                             .replaceAll("$PREV_PAGE" , PrevPage)
                             .replaceAll("$NEXT_PAGE" , NextPage)
                             .replaceAll("$LAST_PAGE" , LastPage);

    return NavHTML;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CatListHTML - Return category list in HTML
//
// Inputs:      None.
//
// Outputs:     HTML of category list (as radio buttons)
//
function CatListHTML() {

    var Categories = Object.keys(Projects);

    ListHTML = "";
    for( let Category of Categories ) {
        var CatHTML = CatTemplate.replaceAll("$CATNAME",Category)
                                 .replaceAll("$CATDISP",Projects[Category].Meta.Display);
        ListHTML += CatHTML;
        }
  
    return ListHTML;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// NavID - Navigate to article, by ID
//
// Inputs:      Name of article to show (ex: "FLO00")
//
// Outputs:     None.
//
function NavID(ArticleName) { 

    ShowArticle(ArticleName);
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
// FirstArticleName - Return name of first panel
//
// Inputs:      Name of current panel (ex: "FLO12")
//
// Outputs:     Name of first   panel (ex: "FLO00")
//
function FirstArticleName(ArticleName) {

    return ArticleNam(ArticleName) + String(0).padStart(2, '0');
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// NextArticleName - Return name of next panel
//
// Inputs:      Name of current panel (ex: "FLO12")
//
// Outputs:     Name of next    panel (ex: "FLO13")
//
// NOTE: Textual construction only - actual panel of that name may not exist
//
function NextArticleName(ArticleName) {

    return ArticleNam(ArticleName) + String(1+ArticleNum(ArticleName)).padStart(2, '0');
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// LastArticleName - Return name of last panel
//
// Inputs:      Name of current panel (ex: "FLO12")
//
// Outputs:     Name of last    panel (ex: "FLO20")
//
function LastArticleName(ArticleName) {

    var LastName = ArticleName;
    while( !IsLastArticle(LastName) ) {
        LastName = NextArticleName(LastName);
        }

    return LastName;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// PrevArticleName - Return name of prev panel
//
// Inputs:      Name of current panel (ex: "FLO12")
//
// Outputs:     Name of prev panel    (ex: "FL011")
//
// NOTE: Will not go below zero
//
function PrevArticleName(ArticleName) {

    var ANum = ArticleNum(ArticleName);
    if( ANum > 0 )
        ANum -= 1;

    return ArticleNam(ArticleName) + String(ANum).padStart(2, '0');
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

    return GetID(NextArticleName(ArticleName)) == undefined;
    }
