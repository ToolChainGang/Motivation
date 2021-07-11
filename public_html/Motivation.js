////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Motivator.js - Javascript for project motivator pages
//
// Copyright (C) 2020 Peter Walsh, Milford, NH 03055
// All Rights Reserved under the MIT license as outlined below.
//
//  FILE
//      Motivation.js
//
//  DESCRIPTION
//
//      Run the project motivation course.
//
//      (See the project documentation for a full description.)
//
//  USAGE
//
//      $BROWSER [...]/index.html?Arg=Value
//
//      No Arguments:
//
//          Run the project motivation state machine. With no configured cookie,
//            will show the "Intro" article and allow the user to browse the
//            documentation and configure the course.
//
//          With a configured cookie, run the portion of the course indicated by
//            the recorded progress.
//
//      [...]index.html?Slideshow=$Category
//
//          Show a slideshow for a specified project category (ex: "Ceramics").
//
//
//  EXAMPLE
//
//      Firefox file://Home/Pete/Motivation/public_html/index.html
//
//          This will run the full motivation course.
//
//      Firefox file://Home/Pete/Motivation/public_html/index.html?Slideshow=Ceramics
//
//          This will show a slideshow for the category "Ceramics", and nothing else.
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
// MotWords[]           # Motivational word data from the server
//    [Con]->[...]      # Conscientiousness words
//    [Dop]->[...]      # Dopamine related words (journey, path)
//    [Int]->[...]      # Intrinsic motivation words
//    [Joy]->[...]      # Words relating to "Joy"
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var ServerAddr   = "ws:localhost:5000";

    var ServerSocket;
    var ServerData;

    var WindowWidth;
    var WindowHeight;

    var Words;
    var Images;
    var Category;

    var Args;

    var WordPanel;
    var ImagePanel;
    var ArticlePanel;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // On first load, calculate reliable page dimensions and do page-specific initialization
    //
    window.onload = function() {
        //
        // (This crazy nonsense gets the width in all browsers)
        //
        WindowWidth  = window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
        WindowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var BaseURL = window.location.href.split('?')[0];           // Remove any arguments
        var Panels  = GetClass("WindowURL");

        for( let Panel of Panels )
            Panel.innerHTML = BaseURL;

        //
        // These are frequently used. Get the locations and check for existance once at startup
        //
        WordPanel    = GetID("WordPanel");
        ImagePanel   = GetID("ImagePanel");
        ArticlePanel = GetID("ArticlePanel");

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // Grab the URL arguments.
        //
        // A singleton variable will be set to "" (empty string), while an assignment argument will
        //   be set to it's assigned value.
        //
        Args = {};
        var Query = window.location.search.substring(1);
        var Vars  = Query.split("&");
        for( let Var of Vars ) {
            var Pair = Var.split("=");
            if( Pair[1] ) Args[Pair[0]] = Pair[1];
            else          Args[Pair[0]] = "";
            }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // URL argument: Slideshow=$Category
        //
        // Show a specific slideshow and then exit.
        //
        if( Args["Slideshow"] != undefined ) {
            Category = Args["Slideshow"];

            if( Projects[Category] == undefined ) {
                throw new Error("Unknown project type (" + Category + ").");
                return;
                }

            Words  = Shuffle(Projects[Category].Words);
            Images = Shuffle(Projects[Category].Images);

            ShowArticle("SLI00");
            CreateSlideshow(Words,Images,"SLI01");
            return;
            }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        Words  = Shuffle(Projects.Ceramics.Words);
        Images = Shuffle(Projects.Ceramics.Images);

        //
        // If "ShowArticles" is given, uncover the list of articles.
        //
        // Used for debugging, so the author can run through and edit the text.
        //
        if( Args["ShowArticles"] != undefined ) {
            GetID("ArticleList").style.display = "block";

            var Articles = GetTag("Article");
            for( let Article of Articles ) {
                HTML = Article.innerHTML;
                Article.innerHTML = HTML + '<br /><hr style="height:6px; background-color: lightblue; " /><br />';
                }
            }

        else ShowArticle("SLI00");

        CreateSlideshow(Words,Images,"SLI01");
        }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Show panel - Show one of the panel types
//
// Inputs:      Name of panel to show (one of: "WordPanel", "ImagePanel", "ArticlePanel")
//
// Outputs:     None.
//
function ShowPanel(PanelName) {

    var Panels = GetClass("Panel");
    for( let Panel of Panels ) {
        Panel.style.display = "none";
        }

    GetID(PanelName).style.display = "block";
    };
