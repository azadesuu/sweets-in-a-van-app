// middleware to ensure user is logged in
function customerIsLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    // if not logged in, redirect to login form
    res.redirect('/customer/login');
}
function vendorIsLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    // if not logged in, redirect to login form
    res.redirect('/vendor/login');
}


// export the function so that we can use
// in other parts of our all
module.exports = {
    customerIsLoggedIn,
    vendorIsLoggedIn
}