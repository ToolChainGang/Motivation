////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Article.js - Functions to manage articles
//
// Copyright (C) 2020 Peter Walsh, Milford, NH 03055
// All Rights Reserved under the MIT license as outlined below.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     ShowArticle(ID) - Display article by ID in the main article panel
//      GetArticle(ID) - Return the HTML contents of article by ID
//
//    IsNavArticle(ID) - Return TRUE if article is part of a series
//  IsFirstArticle(ID) - Return TRUE if article is 1st  in series
//   IsLastArticle(ID) - Return TRUE if article is last in series
//     NextArticle(ID) - Return the next article in series
//
//      NavBarHTML(ID) - Generate the navigation HTML for a series article
//
//      ArticleNum(ID) - Return numeric value of article name
//      ArticleNam(ID) - Return text  portion of article name
//
//      CallNotes(ID)  - Perform "call" from current page to the "Notes" page
//      NotesReturn()  - Return from notes panel to the original panel
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
// All articles are in the main index.html page with display:none, identified by ID
//
// The typical usage is for javascript to call ShowArticle(ID). This will grab the innerHTML
//   of the article and display it in the main ArticlePanel, with substitutions.
//
// A "Nav" article will show extra navigation links begin/prev/next/last at the bottom when displayed.
//
// Nav Articles have IDs of the form CCCdd, where "C" is an uppercase alpha letter, and "d" is a
//   decimal digit. Thus, "FLO00" is the first panel in the "Fugue" description set. This is an
//   exact format used for all sequences.
//
// Digits "00" are always the 1st panel in a set, and the last panel has no succeeding numbered
//   panel. Thus, the caller can always determine whether the panel is the first or last in the
//   sequence (and gray out first/prev/next/last links as needed).
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var IDRegex = /^[A-Z]{3}\d{2}$/;

var NavTemplate = '<div class="NavDiv"><hr class="NavSep"/><div class="NavBar">                                   \
            <a id="NavFirst" class="First $FC" title="Start page"    onclick="NavID(\'$FIRST_PAGE\')">« first</a> \
            <a id="NavPrev"  class="Prev  $PC" title="Previous page" onclick="NavID(\'$PREV_PAGE\' )" >‹ prev</a> \
            <a id="NavCont"  class="Notes $NC" title="Contents"      onclick="NavID(\'Contents\')"    >Contents</a>  \
            <a id="NavNext"  class="Next  $NC" title="Next page"     onclick="NavID(\'$NEXT_PAGE\' )" >next ›</a> \
            <a id="NavEnd"   class="Last  $LC" title="End page"      onclick="NavID(\'$LAST_PAGE\' )" >last »</a> \
            </div></div>';

var CatTemplate = '<option value="$CATNAME">$CATDISP</option>';

var CalTemplate = '<td class="CalDay">$DAY</td><td>&nbsp;</td><td><a class="Cal" title="$TITLE" onclick="NavID(\'$PAGE\')">$TITLE ›</a></td>';
var NoLTemplate = '<td class="CalDay">$DAY</td><td>&nbsp;</td><td class="Disabled">none</td>\n';

var NotesCaller;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ShowArticle - Display a specified article in panel form
//
// Inputs:      Name of article to show (ex: "FLO00")
//
// Outputs:     None.
//
function ShowArticle(ID) {

    ArticleID = ID;

    //
    // Special case: calendar article.
    //
    if( ID == "Calendar" ) {
        ShowCalendar();
        return;
        }

    var Article = GetID(ID);
    if( Article == undefined ) 
        throw new Error("Cannot find element (" + ID + ").");

    //
    // Turn off the day banner in manual mode
    //
    var Banner = Article.getElementsByClassName("DayBanner");
    if( Banner.length ) {
        if( State == StateEnum.Manual || !Configured() )
            Banner[0].style.display = "none";
        }

    var ArticleHTML = Article.innerHTML.replaceAll("$DAY"      ,  Config.LessonLDay)
                                       .replaceAll("$MAXDAY"   ,            MaxLDay)
                                       .replaceAll("$CATEGORY" ,  Config.Category  )
                                       .replaceAll("$COOKIEURL",          CookieURL);

    //
    // Nav articles get a navbar
    //
    if( IsNavArticle(ID) )
        ArticleHTML += NavBarHTML(ID);

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
function NavBarHTML(ID) {

    var ANum = ArticleNum(ID);
    var ANam = ArticleNam(ID);

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
    if( IsFirstArticle(ID) ) {
        FirstClass = "Disabled";
        PrevClass  = "Disabled";
        }
    else {
        FirstPage = FirstID(ID);
        PrevPage  = PrevID (ID);
        }

    //
    // Grey out the next/last when at the last page
    //
    if( IsLastArticle(ID) ) {
        NextClass = "Disabled";
        LastClass = "Disabled";
        }
    else {
        NextPage = NextID(ID);
        LastPage = LastID(ID);
        }

    var NavHTML = NavTemplate.replaceAll("$ANAME"     ,ID)
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
// ShowCalendar - Show the calendar page
//
// Inputs:      None.
//
// Outputs:     None.
//
function ShowCalendar() {

    var CalendarHTML = '<table style="border-collapse: collapse;"><tbody><tr style="border-bottom: 2px solid black;">' + 
                       '<td><small>Day</small></td><td>&nbsp;</td><td><small>Lesson</small></td>' +
                       '<td><small>Day</small></td><td>&nbsp;</td><td><small>Lesson</small></td>' +
                       '</tr>\n';

    var Col1Max = Math.floor((MaxLDay+1)/2);
    var Col2Off = Math.floor((MaxLDay+0)/2);

    for( var Col1Day = 1; Col1Day <= Col1Max; Col1Day++ ) {
        var Col1 = CalDayLink(Col1Day);
        var Col2 = CalDayLink(Col1Day + Col2Off);

        CalendarHTML += '<tr>' + Col1 + Col2 + '</tr>\n';
        }

    CalendarHTML += '</tbody>' + '</table>\n';

    var ArticleHTML = GetID("Calendar").innerHTML.replaceAll("$CALENDAR",CalendarHTML);

    ArticlePanel.innerHTML = ArticleHTML;
    ShowPanel("ArticlePanel");
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CalDayLink - Generate table elements for 1 calendar day link
//
// Inputs:      Day of calendar (1 .. MaxLDay)
//
// Outputs:     HTML for calendar links
//
function CalDayLink(Day) { 

    if( Day > MaxLDay ) {
        var BlankHTML = CalTemplate.replaceAll("$TITLE","")
                                   .replaceAll("$PAGE" ,"")
                                   .replaceAll("$DAY"  ,"");
        return BlankHTML;
        }

    var DayPage = Calendar[Day];

    var DayTemplate;
    var DayTitle;

    if( DayPage == "" ) {
        DayTemplate = NoLTemplate;
        DayTitle = "";
        }
    else {
        DayTemplate = CalTemplate;
        DayTitle = GetID(DayPage).getElementsByTagName("h2")[0].innerHTML;

        if( DayTitle.match(/Homework/i) ) {
            DayTitle = GetID(NextID(DayPage)).getElementsByTagName("h2")[0].innerHTML;
            }
        }

    Day = Day.toString();
    if( Day.length < 2 )
        Day = '&nbsp;' + Day;

    var DayHTML = DayTemplate.replaceAll("$TITLE",DayTitle)
                             .replaceAll("$PAGE" ,DayPage)
                             .replaceAll("$DAY"  ,Day);

    return DayHTML;
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
function NavID(ID) { 

    ShowArticle(ID);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IsNavArticle - Return TRUE if article is part of a series
//
// Inputs:      Name of article to show (ex: "FLO00")
//
// Outputs:     TRUE  if article name passes the series regex
//              FALSE otherwise
//
function IsNavArticle(ID) { return IDRegex.test(ID); }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ArticleNum - Return numeric value of panel name
//
// Inputs:      Name of panel (ex: "FLO12")
//
// Outputs:     Numeric value of panel number (12, from example above)
//
function ArticleNum(ID) {

    if( !IDRegex.test(ID) ) 
        throw new Error("Misformed panel name (" + ID + ".");

    return parseInt(ID.substr(3,2));
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
function ArticleNam(ID) {

    if( !IDRegex.test(ID) ) 
        throw new Error("Misformed panel name (" + ID + ".");

    return ID.substr(0,3);
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// FirstID - Return name of first panel
//
// Inputs:      Name of current panel (ex: "FLO12")
//
// Outputs:     Name of first   panel (ex: "FLO00")
//
function FirstID(ID) {

    return ArticleNam(ID) + String(0).padStart(2, '0');
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// NextID - Return name of next panel
//
// Inputs:      Name of current panel (ex: "FLO12")
//
// Outputs:     Name of next    panel (ex: "FLO13")
//
// NOTE: Textual construction only - actual panel of that name may not exist
//
function NextID(ID) {

    return ArticleNam(ID) + String(1+ArticleNum(ID)).padStart(2, '0');
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// LastID - Return name of last panel
//
// Inputs:      Name of current panel (ex: "FLO12")
//
// Outputs:     Name of last    panel (ex: "FLO20")
//
function LastID(ID) {

    var LastName = ID;
    while( !IsLastArticle(LastName) ) {
        LastName = NextID(LastName);
        }

    return LastName;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// PrevID - Return name of prev panel
//
// Inputs:      Name of current panel (ex: "FLO12")
//
// Outputs:     Name of prev panel    (ex: "FL011")
//
// NOTE: Will not go below zero
//
function PrevID(ID) {

    var ANum = ArticleNum(ID);
    if( ANum > 0 )
        ANum -= 1;

    return ArticleNam(ID) + String(ANum).padStart(2, '0');
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
function IsFirstArticle(ID) {

    return ArticleNum(ID) == 0;
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
function IsLastArticle(ID) {

    return GetID(NextID(ID)) == undefined;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CallNotes - Perform "call" from current page to the "Notes" page
//
// Inputs:      Name of current panel (ex: "FLO12")
//
// Outputs:     None.
//
function CallNotes(ID) {

    NotesCaller = ID;

    return ShowArticle("Notes");
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// NotesReturn - Return from notes panel to the original panel
//
// Inputs:      None.
//
// Outputs:     None.
//
function NotesReturn() { return ShowArticle(NotesCaller); }
