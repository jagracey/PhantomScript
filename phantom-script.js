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
      });
    };

    var mapping = function(char){
      if (char > 8)  char+= 2;
      if (char > 31) char+= 95;
      return char;
    };

    var mapCharacters = function(text){
      return text
      .split('')
      .map(x=>x.charCodeAt())
      .map(x=>{
        var low  = mapping( x & 0x1F);
        var high = mapping( x >> 5  );
        return String.fromCharCode(high, low);
      })
      .join('');
    };

    return mapCharacters( convert2Ascii(payload).join('') );
  };



  /**
  * Decoder
  */
  var decode = function(val){
    return val
    .split('')
    .map(x=>x.charCodeAt())
    .filter( x=> (x <= 8) || (x >= 11 && x <= 31) || ( x >= 127 && x <= 159) )
    .map(x=>{
      if (x > 126) x-= 95;
      if (x > 10) x-=2;
      return x;
    })
    .reduce((x,cur,i,v)=> i%2? x + String.fromCharCode((v[i-1] << 5) + cur) : x,'');
  };



  var phantomScript = {
    encode: encode,
    decode: decode
  }

  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = phantomScript :
  typeof define === 'function' && define.amd ? define(phantomScript) :
  global.moment = phantomScript;

}(this));
