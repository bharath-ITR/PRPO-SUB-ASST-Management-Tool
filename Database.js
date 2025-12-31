


import mongoose from 'mongoose';

const Database = async () => {
    mongoose.set('strictQuery', false);

   
    try {

       
        const MONGODB_URI = process.env.MONGODB_URI;
          await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database', error);
        throw error;  // <-- important
    }
};

export default Database;
