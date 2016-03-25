"format cjs";

var x = document.getElementById( "testframe" );
var iframeDoc = ( x.contentWindow || x.contentDocument );
if ( iframeDoc.document ) {
  iframeDoc = iframeDoc.document;
}

canSsr = {
  globalDocument: iframeDoc
};
