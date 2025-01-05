// middlewares/session.js
export const updateUserSession = (req, _, next) => {
    if (req.user && "username" in req.user && "email" in req.user) {
        req.session.user = req.user;
        req.session.visited = true;
        req.session.save((err) => {
            if (err)
                return next(err);
            next();
        });
    }
    else {
        next();
    }
};
//# sourceMappingURL=updateUserSession.js.map