import express from 'express';
import dependencies from '../../../infrastructure/dependencies';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: any, res: any, next: any) => {
  const {config} = dependencies;
  const{secret} = config;
  const authHeader: string | undefined = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token == null){
    return res.status(401).json({
      message: 'No token provided',
    })
  }

  jwt.verify(token, secret, (err, decoded:any) => {
    if (err) {
        return res.status(403).json({ message: "Unauthorized, invalid token!" });
    }
    req.user = { id: decoded.userId, email: decoded.email };
    next();
    console.log("Authenticated User:", decoded);
});
}