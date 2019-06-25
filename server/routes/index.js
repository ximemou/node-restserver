//import express from 'express';

const express = require('express');
const app = express();


app.use(require('./usuario'));
app.use(require('./login'));

export default app;
