'use strict';

;(function (global) {

  /**
  * Encoder
  */
  var encode = function(payload){
    var convert2Ascii = function(text){
      return Array
      .from(text)
      .map(function(char){
        if ( /[^\x00-\x7F]/g.test(char) ){
          return char
          .split('')
          .map(x=>`\\u{${ (x.charCodeAt()).toString(16) }}`)
          .join('');
        }
        else
          return char;
      })
      .join('');
    };

    return convert2Ascii(payload)
      .split('')
      // Adds 9th bit, then slices it off for zero padding.
      .map(x=>(0x100 | x.charCodeAt()).toString(2).slice(1))
      .join('')
      .split('')
      .map(x=>String.fromCharCode(x*0xFEFF))
      .join('');
  };


  /**
  * Decoder
  */
  var decode = function(val){

    return Array
      .from(val)
      .map(x=>x.charCodeAt() )
      .filter(x=>(x === 0 || x === 65279 ))
      .map(x=>x & 1)
      .join('')
      .match(/.{8}/g)
      .map(function(c){
         return String.fromCharCode(parseInt(c,2))
      })
      .join('');
  };


  /**
  * DecodedEval - Actually eval the decoded payload.
  */
  var decodedEval = function(code){
    []["filter"]["constructor"]( decode(code) )();
  };



  var phantomScript = {
    encode: encode,
    decode: decode,
    decodedEval: decodedEval
  }

  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = phantomScript :
  typeof define === 'function' && define.amd ? define(phantomScript) :
  global.moment = phantomScript;

}(this));
