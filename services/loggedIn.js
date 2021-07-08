module.exports = function( respObj, status ) {
    if ( typeof respObj === "string" ) {
        respObj = {
            message: respObj
        };
    }

    return function ( req, res, next ) {
        if ( req.user ) {
            next();
        } else {
            res.status( status || 404 ).end();
        }
    }
}
