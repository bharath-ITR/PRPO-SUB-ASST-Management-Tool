
// import jwt from "jsonwebtoken";
// import dotenv from 'dotenv';
// import crypto from 'crypto'; // Import the crypto library
// dotenv.config();

// // Generate a random secret key (256 bits / 32 bytes)
// const generateRandomSecretKey = () => {
//   return crypto.randomBytes(32).toString('hex');
// };

// // If DB_PASSWORD is not defined in the environment variables, generate a random one
// if (!process.env.DB_PASSWORD) {
//   console.warn('DB_PASSWORD not found in environment variables. Generating a random one.');
//   process.env.DB_PASSWORD = generateRandomSecretKey();
//   console.log(process.env.DB_PASSWORD);
// }

// export const Token = (id) => {
//   return jwt.sign({ id }, process.env.DB_PASSWORD, {
//     expiresIn: 3 * 24 * 60 * 60,
//   });
  
// };
// export const ApproveToken=(id)=>{
//   return jwt.sign({ id }, process.env.DB_PASSWORD, {
//     expiresIn: 3 * 24 * 60 * 60,
//   });
// }
// export const RejectToken=(id)=>{
//   return jwt.sign({ id }, process.env.DB_PASSWORD, {
//     expiresIn: 3 * 24 * 60 * 90,
//   });
// }
// export const generateUniqueTokens=(id)=>{
//   return jwt.sign({ id }, process.env.DB_PASSWORD, {
//     expiresIn: 3 * 24 * 60 * 60,
//   });
// }

// /* 
// import jwt from "jsonwebtoken";
// import dotenv from 'dotenv';
// dotenv.config();

// export const Token = (id) => {
//   // Use the following line if you want to sign the token without a specific secret key
//   return jwt.sign({ id }, { expiresIn: 3 * 24 * 60 * 60 });
// };

// export const ApproveToken = (id) => {
//   return jwt.sign({ id }, { expiresIn: 3 * 24 * 60 * 60 });
// };

// export const RejectToken = (id) => {
//   return jwt.sign({ id }, { expiresIn: 3 * 24 * 60 * 90 });
// };

// export const generateUniqueTokens = (id) => {
//   return jwt.sign({ id }, { expiresIn: 3 * 24 * 60 * 60 });
// };
//  */

import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import crypto from 'crypto'; // Import the crypto library
dotenv.config();

// Generate a random secret key (256 bits / 32 bytes)
const generateRandomSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// If NEW_DB_PASSWORD is not defined in the environment variables, generate a random one
if (!process.env.NEW_DB_PASSWORD) {
  // console.warn('NEW_DB_PASSWORD not found in environment variables. Generating a random one.');
  process.env.NEW_DB_PASSWORD = generateRandomSecretKey();
  console.log(process.env.NEW_DB_PASSWORD);
}

export const Token = (id) => {
  return jwt.sign({ id }, process.env.NEW_DB_PASSWORD, {
    expiresIn: 3 * 24 * 60 * 60,
  });
  
};
export const ApproveToken=(id)=>{
  return jwt.sign({ id }, process.env.NEW_DB_PASSWORD, {
    expiresIn: 3 * 24 * 60 * 60,
  });
}
export const RejectToken=(id)=>{
  return jwt.sign({ id }, process.env.NEW_DB_PASSWORD, {
    expiresIn: 3 * 24 * 60 * 90,
  });
}
export const generateUniqueTokens=(id)=>{
  return jwt.sign({ id }, process.env.NEW_DB_PASSWORD, {
    expiresIn: 3 * 24 * 60 * 60,
  });
}

/* 
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const Token = (id) => {
  // Use the following line if you want to sign the token without a specific secret key
  return jwt.sign({ id }, { expiresIn: 3 * 24 * 60 * 60 });
};

export const ApproveToken = (id) => {
  return jwt.sign({ id }, { expiresIn: 3 * 24 * 60 * 60 });
};

export const RejectToken = (id) => {
  return jwt.sign({ id }, { expiresIn: 3 * 24 * 60 * 90 });
};

export const generateUniqueTokens = (id) => {
  return jwt.sign({ id }, { expiresIn: 3 * 24 * 60 * 60 });
};
 */