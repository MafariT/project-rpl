import express from 'express';
import userRouter from './routes/users';
import navRouter from './routes/view';

const app = express();
const PORT = 5000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', navRouter)
app.use('/api/users', userRouter)

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
})