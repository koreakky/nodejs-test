const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');

const app = express();
app.set('port', process.env.PORT || 3000);

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: {fileSize: 5 * 1024 * 1024},
});

app.use(
    morgan('dev'),
    express.static(path.join(__dirname, 'public')),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.COOKIE_SECRET),
);
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}))

app.use((req, res, next) => {
   console.log('모든 요청에 대해 처리함.');
   next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);


app.post('/upload', upload.array('many'), (req, res) => {
   console.log(req.file, req.body);
   res.send('ok');
});

app.use((err, req, res, next) => {
    console.log('에러 처리 미들웨어에서 에러를 처리함.');
    res.status(404).send('Not Found!');
});

app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});
