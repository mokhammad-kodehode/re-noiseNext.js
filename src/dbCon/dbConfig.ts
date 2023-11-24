import mongoose from 'mongoose';

export async function connect() {
    try {
        console.log(process.env.DATABASE_URI);
        mongoose.connect(process.env.DATABASE_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
    }
}
