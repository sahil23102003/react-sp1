import exress from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = exress();

app.use(cors());
app.use(exress.json());

mongoose.
connect('mongodb://localhost:27017/intern-portal')
.then(() => console.log('MongoDB connected')).
catch((err) => console.log(err));

app.listen(5000, () => {
  console.log('Server is running on port 5000');
})