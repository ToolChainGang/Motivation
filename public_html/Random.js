////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Random.js - Random number functions
//
// Copyright (C) 2020 Peter Walsh, Milford, NH 03055
// All Rights Reserved under the MIT license as outlined below.
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Pct(Odds)        Return TRUE if odds win
// Uniform(Max)     Return 1 value from uniform distribution
// D100()           Return random die number in range 1 .. 100
// Draw(Array)      Return 1 random element from an array
// Shuffle(Array)   Return array with elements shuffled
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Pct - Return TRUE if odds win
//
// Inputs:      Odds, expressed as a percentage (0 .. 1)
//
// Outputs:     TRUE  if random draw < Odds
//              FALSE if random draw faile
//
function Pct(Odds) {

    return Math.random() < Odds;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Uniform - Return 1 value from uniform distribution
//
// Inputs:      Size of distribution (N)
//
// Outputs:     One number from uniform distribution
//
// NOTE: Returns integer number [0 .. N-1], suitable for array subscripts.
//
function Uniform(N) {

    return Math.floor(Math.random()*N);
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// D100 - Return random die number in range 1 .. 100
//
// Inputs:      None.
//
// Outputs:     One number, in the range 1 .. 100
//
function D100() {

    return 1+Uniform(100);
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Draw - Return 1 random element from an array
//
// Inputs:      Array (of any type) with elements
//
// Outputs:     One element from array, randomly chosen
//
function Draw(Deck) {

    if( ! Array.isArray(Deck) )
        throw new Error("Draw from non-array.");

    return Deck[Uniform(Deck.length)];
    }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Shuffle - Return array with elements shuffled
//
// Inputs:      Array (of any type) with elements
//
// Outputs:     Same array, with elements shuffled
//
function Shuffle(Deck) {

    RDeck = [...Deck];

    //
    // Fisher-Yates shuffle (AKA Knuth shuffle)
    //
    for(let i = RDeck.length-1; i > 0; i--) {
        const j    = Uniform(i);
        const temp = RDeck[i];
        RDeck[i] = RDeck[j];
        RDeck[j] = temp;
        }

    return RDeck;
    }
