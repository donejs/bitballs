
module.exports = function ( respObj, status ) {
  if ( typeof respObj === "string" ) {
    respObj = {
      message: respObj
    };
  }
  return function ( req, res, next ) {
    if ( req.isAdmin ) {
      next();
    } else {
      if ( respObj ) {
        res.status( status || 401 ).json( respObj );
      } else {
        res.status( status || 404 ).end();
      }
    }
  };
};
