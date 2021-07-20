////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Slideshow.js - Create and run the slideshow
//
// Copyright (C) 2020 Peter Walsh, Milford, NH 03055
// All Rights Reserved under the MIT license as outlined below.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// RunSlideshow             Create and start the slideshow
// BeginSlideshow           Begin the actual slideshow process
// NextSlide                Show the next slide in the slideshow
// ShowSlide                Show a slideshow slide
// ShowWord                 Show single word slideshow slide
// ShowImage                Show image slideshow slide
// HighlightWord            Highlight single word slideshow slide
//
// StyleWord(Word,Style)    Show single word slideshow slide with specified style
//
// --- Highlighting functions ---
//
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
//  Slides
//      ["Type"]    // "ShowWord" || "ShowImage" || "HighlightWord"
//      ["Data"]    // The text word to show, or the URL of the image to show
//
var NumSlides = 10;         // Number of slides to show
var SlideMS   = 700;        // MS per slide
var ImgChance = 2.0/6.0;    // Prob that a slide will have an image

var SlideNo;                // Number of slide we're currently at (0 .. NumSlides-1)
var Slides = [];            // Array of slides to show
var SlideTimer;

var HighlightFunctions = [
    RedWord,
    GreenWord,
    BlueWord,
    OutlineWord,
    UpperWord,
    Outline2,
    PosWord,
    PosWord2,
    PosWordT,               // Used for testing
//    FlashRed,
//    FlashUpper,
    ];

//
// We show 1, 2, or 3 hidden words. The 3 case never keeps track of the individual
//   words, it just asks the user how many there were.
//
var NumHW;                  // Number of hidden words
var HWords = [];            // Words which are highlighted
var HW2Pct = 5;             // % chance of 2 hidden words
var HW3Pct = 1;             // % chance of 3 hidden words

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// RunSlideshow - Create and run the slideshow
//
// Inputs:      Category of slides to show
//
// Outputs:     None.
//
function RunSlideshow(Category) {

    State = StateEnum.Slideshow;

    if( Projects[Category] == undefined ) {
        throw new Error("Unknown project type (" + Category + ").");
        return;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // First time                  : Show a longer, mor explanatory description.
    // Second viewing on single day: Show caution about multiple views
    // Normal                      : Show a brief description
    //
    if( Config.SlideIntroSeen == 0 ) {          // First time: Give a longer, more explanatory description
        ShowArticle("SLI00");
        Config.SlideIntroSeen = 1;
        SetConfig();
        }
    else {
        if( Config.LessonCDay == TodayCDay ) {  // Second viewing on single day
            ShowArticle("SLI10");
            Config.SlideMultiSeen = 1;
            SetConfig();
            }
        else {
            ShowArticle("SLI20");               // Normal: Show a brief description
            }
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Shuffle the slides and choose the deck.
    //      
    //     33%  Images
    //     66%  Words
    //
    var RWords   = Shuffle(Projects[Category].Words);
    var RImages  = Shuffle(Projects[Category].Images);

    Slides = [];
    for( var i=0; i<NumSlides; i++ ) {

        if( Pct(2.0/6.0) ) Slides.push({Type: "ShowImage", Data: RImages.pop()});
        else               Slides.push({Type: "ShowWord" , Data: RWords .pop()});
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Randomly Choose the number of hidden words.
    //      
    //      1%  Three hidden words
    //      5%  Two   hidden words
    //     94%  One   hidden word
    //
    var Die = D100();

    NumHW = 1;
    if( Die <= HW2Pct ) NumHW = 2;
    if( Die <= HW3Pct ) NumHW = 3;

    HWords = [];
    for( var i = 0; i < NumHW; i++ ) {
        while(1) {

            SlideNo = Uniform(NumSlides);

            if( Slides[SlideNo].Type != "ShowWord" )
                continue;

            if( SlideNo <= 2 )              // Don't highlight the 1st two words.
                continue;

            if( SlideNo == NumSlides-1 )    // Don't highlight the last word.
                continue;

            var Word = Slides[SlideNo].Data;

            if( HWords.includes(Word) )
                continue;

            HWords.push(Word);
            Slides[SlideNo].Type = "Highlight";
            break;
            }
        }
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// BeginSlideshow - Begin the actual slideshow
//
// Inputs:      None.
//
// Outputs:     None.
//
function BeginSlideshow() {

    //
    // Process user ESC
    //
    if( State == StateEnum.Abort ) {
        clearInterval(SlideTimer);
        FadeCancel(ArticlePanel);
        ShowArticle("SLE10");
        return;
        }

    FadeOut(ArticlePanel);

    SlideNo = 0;

    SlideTimer = setInterval(function () {
        clearInterval(SlideTimer);
        SlideTimer = setInterval(function () {
            NextSlide();
            },SlideMS);
        },2000);
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// NextSlide - Show the next slide
//
// Inputs:      None.
//
// Outputs:     None.
//
function NextSlide() {

    //
    // Process user ESC
    //
    if( State == StateEnum.Abort ) {
        clearInterval(SlideTimer);
        ShowArticle("SLE10");
        FadeCancel(ArticlePanel);
        return;
        }

    if( SlideNo < Slides.length )
        return ShowSlide(SlideNo++);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // End slideshow
    //
    clearInterval(SlideTimer);

    var EndPanel = GetID("SLW00");

    EndHTML = EndPanel.innerHTML.replaceAll("$HWORD1",HWords[0])
                                .replaceAll("$HWORD2",HWords[1])
                                .replaceAll("$HWORD3",HWords[2])
                                .replaceAll("$HWORD4",HWords[3]);

    ArticlePanel.innerHTML = EndHTML;

    //
    // Wait 1 sec, then fade in the end panel
    //
    ShowPanel("ArticlePanel");
    SlideTimer = setInterval(function () {
        clearInterval(SlideTimer);
        FadeIn(ArticlePanel);
        },1000);
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ShowSlide - Show a slideshow slide
//
// Inputs:      Index of the slide to show
//
// Outputs:     None.
//
function ShowSlide(SlideNo) {

    var SlideType = Slides[SlideNo].Type;
    var SlideData = Slides[SlideNo].Data;

    if     ( SlideType == "ShowWord"  ) ShowWord     (SlideData);
    else if( SlideType == "ShowImage" ) ShowImage    (SlideData);
    else if( SlideType == "Highlight" ) HighlightWord(SlideData);
    else throw new Error("Unknown slide type (" + SlideType + ").");
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ShowWord - Show single word slideshow slide
//
// Inputs:      Word to show
//
// Outputs:     None.
//
function ShowWord(Word) {

    WordPanel.innerHTML = '<div class="SlideWord">' + Word + '</div>';

    ShowPanel("WordPanel");
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ShowImage - Show image slideshow slide
//
// Inputs:      Filename of image to show
//
// Outputs:     None.
//
function ShowImage(ImageFile) {

    var Img = new Image();
    Img.onload = function() {
        var Width  = this.naturalWidth;
        var Height = this.naturalHeight;

        if( Width > WindowWidth ) {
            Height *= WindowWidth/Width;
            Width   = WindowWidth;
            }

        if( Height > WindowHeight ) {
            Width *= WindowHeight/Height;
            Height = WindowHeight;
            }

        this.width  = Width;
        this.height = Height;

        ImagePanel.innerHTML   = "";
        ImagePanel.appendChild(Img);
        ShowPanel("ImagePanel");
        }

    Img.src = ImageFile;
    Img.className = "SlideImage";
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// HighlightWord - Highlight single word slideshow slide
//
// Inputs:      Word to show
//
// Outputs:     None.
//
function HighlightWord(Word) {

    var HighlightFunction = Draw(HighlightFunctions);

    HighlightFunction(Word);
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Highlighting functions
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// StyleWord - Show single word slideshow slide with specified style
//
// Inputs:      Word to show
//              Style to show
//
// Outputs:     None.
//
function StyleWord(Word,Style) {

    var WordHTML = '<span style="' + Style + '">' + Word + '</span>';

    WordPanel.innerHTML = WordHTML;

    ShowPanel("WordPanel");
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// FlashWord - Show single word slideshow slide and "flash" the style at the user
//
// Inputs:      Word to show
//              Style to show
//
// Outputs:     None.
//
function FlashWord(Word,Style) {

    ShowWord(Word);

    var StyleTimer = setInterval(function () {
        clearInterval(StyleTimer);
        StyleWord(Word,Style);
        StyleTimer = setInterval(function () {
            clearInterval(StyleTimer);
            ShowWord(Word);
            },SlideMS/2);
        },SlideMS/4);
    }

function     RedWord(Word) { StyleWord(Word,"color: red;"); }
function   GreenWord(Word) { StyleWord(Word,"color: green;"); }
function    BlueWord(Word) { StyleWord(Word,"color: blue;"); }
function OutlineWord(Word) { StyleWord(Word,"border: 3px solid    red; border-radius: 9px;"); }
function    Outline2(Word) { StyleWord(Word,"border: 3px dashed green; border-radius: 2px;"); }
function    Outline2(Word) { StyleWord(Word,"border: 3px dotted blue; border-radius: 2px;"); }
function     PosWord(Word) { StyleWord(Word,"position: absolute;"); }
function    PosWord2(Word) { StyleWord(Word,"writing-mode:vertical-rl;"); }
function   UpperWord(Word) { FlashWord(Word,"text-transform: uppercase;"); }
function    FlashRed(Word) { FlashWord(Word,"color: red;"); }
function  FlashUpper(Word) { FlashWord(Word,"text-transform: uppercase;color: red;"); }
function    PosWordT(Word) { StyleWord(Word,"direction:rtl;"); }
