


const adminRole= ( req, res, next )=>{

    if(!req.userAuth){
        return res.status(400).json({
            message: 'Attempting to verify the role without validating the token first'
        })
    }

    const { access_permission } = req.userAuth;
    if(access_permission !== 'ADMIN_ROLE'){
        return res.status(401).json({
            message: "You need an administrator role to complete this action"
        });
    }

    next();
}

const superRole= ( req, res, next )=>{

    if(!req.userAuth){
        return res.status(400).json({
            message: 'Attempting to verify the role without validating the token first'
        })
    }

    const { access_permission } = req.userAuth;
    if(access_permission !== 'SUPER_ROLE'){
        return res.status(401).json({
            message: "You need a super role to complete this action"
        });
    }

    next();
}







export { 
        adminRole,
        superRole,
       }