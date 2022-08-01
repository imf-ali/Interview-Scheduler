const path = require('path');
const hbs = require('hbs')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs');

const operationsRoutes = require('./routes/operations');
// const authRoutes = require('./routes/auth');
// const taexecRoutes = require('./routes/taexec');
// const interviewerRoutes = require('./routes/interviewer');
const userRoutes = require('./routes/user');
const candidateRoutes = require('./routes/candidate');
const interviewerslotRoutes = require('./routes/interviewerslot');
const interviewRoutes = require('./routes/interview');
const { startBackgroundJob } = require('./scheduler');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'resume');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Resume file must be a pdf'));
  }
};

app.use(helmet());
app.use(compression());

app.use(bodyParser.urlencoded()); 
app.use(bodyParser.json()); 
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('resume_link')
);
app.use('/resume', express.static(path.join(__dirname, 'resume')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const publicDir = path.join(__dirname,'./public')
const viewsPath = path.join(__dirname,'./template/views')
const partialPath = path.join(__dirname,'./template/partials')

app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialPath)

app.use(express.static(publicDir))

app.use(operationsRoutes);
app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);
app.use('/interviewerslot',interviewerslotRoutes);
app.use('/interview',interviewRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
      `mongodb+srv://yatharth:Micro106@cluster0.xq1qx.mongodb.net/onboardproject?retryWrites=true&w=majority` 
  )
  .then(result => {
    const server = app.listen( 2000 , () => {
      console.log("Server running on port 2000....")
    });
    startBackgroundJob();
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Client connected!');
    });
  })
  .catch(err => console.log(err));

app.get('',(req,res) => {
  res.render('index',{
    name: 'Fahad Ali',
    Role: 'SDE',
  })
})