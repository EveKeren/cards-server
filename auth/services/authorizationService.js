export const isBusiness = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("Authentication Error: Please Login");
  }

  if (!req.user.isBusiness) {
    return res
      .status(403)
      .send("Authorization Error: Only business users are allowed");
  }

  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("Authentication Error: Please Login");
  }

  if (!req.user.isAdmin) {
    return res
      .status(403)
      .send("Authorization Error: Only admin users are allowed");
  }

  next();
};

export const isAdminOrOwner = (idParamName = "id") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Authentication Error: Please Login");
    }

    const resourceUserId = req.params[idParamName];
    const currentUserId = req.user._id;

    if (req.user.isAdmin || resourceUserId === currentUserId) {
      return next();
    }

    return res.status(403).send("Authorization Error: Access denied");
  };
};

export const isOwner = (idParamName = "id") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Authentication Error: Please Login");
    }

    const resourceUserId = req.params[idParamName];
    const currentUserId = req.user._id;

    if (resourceUserId === currentUserId) {
      return next();
    }

    return res.status(403).send("Authorization Error: Access denied");
  };
};
