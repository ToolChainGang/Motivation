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
//      ["Type"]            // "ShowWord" || "ShowImage" || "HighlightWord"
//      ["Data"]            // The text word to show, or the URL of the image to show
//
//  Slideshow Articles:
//      SSDay1              // 1st day, show expanded slideshow intro
//      SS2ndView           // 2nd slideshow in same day
//      SSToday             // Normal: Show a brief description
//      SSInterrupt         // Process interrupted
//      SSInterrupt         // Process interrupted
//      SSWords             // Choose highlighted word, from 4
//      SSNums              // Choose number of highlighted words
//
var NumSlides = 20;         // Number of slides to show
var SlideMS   = 700;        // MS per slide
var ImgChance = 2.0/6.0;    // Prob that a slide will have an image

var SlideNo;                // Number of slide we're currently at (0 .. NumSlides-1)
var Slides;                 // Array of slides to show
var SlideTimer;

var HighlightFunctions = [
    RedWord,
    GreenWord,
    BlueWord,
    OutlineWord,
    Outline2,
    PosWord,
    PosWord2,
    PosWordT,               // Used for testing
    FlashRed,
//    UpperWord,
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
function RunSlideshow() {

    if( Projects[Config.Category] == undefined ) {
        throw new Error("Unknown project type (" + Config.Category + ").");
        return;
        }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // First time                  : Show a longer, mor explanatory description.
    // Second viewing on single day: Show caution about multiple views
    // Normal                      : Show a brief description
    //
    if( Config.SlideIntroSeen == 0 ) {          // First time: Give a longer, more explanatory description
        ShowArticle("SSDay1");
        Config.SlideIntroSeen = 1;
        SaveConfig();
        }
    else {
        if( Config.LessonCDay == TodayCDay ) {  // Second viewing on single day
            ShowArticle("SS2ndView");
            Config.SlideMultiSeen = 1;
            SaveConfig();
            }
        else {
            ShowArticle("SSToday");             // Normal: Show a brief description
            }
        }

    State = StateEnum.Slideshow;

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // Shuffle the slides and choose the deck.
    //      
    //     33%  Images
    //     66%  Words
    //
    var RWords   = Shuffle(Projects[Config.Category].Words);
    var RImages  = Shuffle(Projects[Config.Category].Images);

    Slides = [];
    for( var i=0; i<NumSlides; i++ ) {

        if( Pct(2.0/6.0) ) Slides.push({Type: "ShowImage", Data: RImages.pop()});
        else               Slides.push({Type: "ShowWord" , Data:  RWords.pop()});
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

NumHW = 2;

    HWords = [];
    var Loops = 0;
    for( var i = 0; i < NumHW; i++ ) {
        while(Loops++ < 600) {

            SlideNo = Uniform(NumSlides);

            if( Slides[SlideNo].Type != "ShowWord" )
                continue;

            if( SlideNo < 2 )               // Don't highlight the 1st two slides.
                continue;

            if( SlideNo == NumSlides-1 )    // Don't highlight the last slide
                continue;

            var Word = Slides[SlideNo].Data;

            if( HWords.includes(Word) )
                continue;

            HWords.push(EscapeQuotes(Word));
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
        State == StateEnum.Normal;
        clearInterval(SlideTimer);
        FadeCancel(ArticlePanel);
        ShowArticle("SSInterrupt");
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

    State == StateEnum.Normal;
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
        State == StateEnum.Normal;
        ShowArticle("SSInterrupt");
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

    if( NumHW > 2 ) ShowArticle('SSNums');
    else            LoadWordPanel();

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
// CheckSSWords - Check the user's slideshow selection
//
// Inputs:      The selected word
//              TRUE if this is the 1st word on the panel
//
// Outputs:     None.
//
function CheckSSWords(SelectedWord,First) {

    if( First ) {
        if( SelectedWord != HWords[0] )         // First word guess incorrect
            return UnHide("SSWordWrong");
        if( HWords.length > 1 )
            return UnHide("SSWord2");           // Show 2nd word, if there is one
        return UnHide("SSWordDone");            // Allow continue
        }

    if( SelectedWord != HWords[1] )             // Second word incorrect
        return UnHide("SSWordWrong");

    return UnHide("SSWordDone");                // Allow continue
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// LoadWordPanel - Load one of the (possibly two) word panels into the ArticlePanel
//
// Inputs:      The highlighted word
//
// Outputs:     None.
//
function LoadWordPanel(HighWord) {

    //
    // Grab all the slide words, except the highlighted ones.
    //
    var SlideWords = [];
    for( let Slide of Slides ) {
        if( Slide.Type == "ShowWord" )
            SlideWords.push(Slide.Data);
        }

    SlideWords = Shuffle(SlideWords);

    //
    // Grab 4 random words that appeared in the slideshow for each highlight
    //
    var RWords = [];
    for( var i = 0; i < 4*HWords.length; i++ )
        RWords.push(EscapeQuotes(SlideWords.pop()));

    RWords[Uniform(4)+0] = HWords[0];
    RWords[Uniform(4)+4] = HWords[1];

    //
    // Paste the words into the panel
    //
    var EndPanel = GetID("SSWords");
    EndPanel.style = "margin-left: auto;";

    EndHTML = EndPanel.innerHTML.replaceAll("$HWORD1",RWords[0])
                                .replaceAll("$HWORD2",RWords[1])
                                .replaceAll("$HWORD3",RWords[2])
                                .replaceAll("$HWORD4",RWords[3])
                                .replaceAll("$HWORD5",RWords[4])
                                .replaceAll("$HWORD6",RWords[5])
                                .replaceAll("$HWORD7",RWords[6])
                                .replaceAll("$HWORD8",RWords[7]);

    ArticlePanel.innerHTML = EndHTML;
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

    Img.src = "Projects/" + Config.Category + "/Images/" + ImageFile;
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
//function   UpperWord(Word) { FlashWord(Word,"text-transform: uppercase;"); }
//function  FlashUpper(Word) { FlashWord(Word,"text-transform: uppercase;color: red;"); }
function    FlashRed(Word) { FlashWord(Word,"color: red;"); }
function    PosWordT(Word) { StyleWord(Word,"direction:rtl;"); }
