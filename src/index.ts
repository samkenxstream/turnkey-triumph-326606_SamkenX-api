import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import Checkpoint, { LogLevel } from '@snapshot-labs/checkpoint';
import config from './config.json';
import * as writer from './writer';
import checkpoints from './checkpoints.json';

const dir = __dirname.endsWith('dist/src') ? '../' : '';
const schemaFile = path.join(__dirname, `${dir}../src/schema.gql`);
const schema = fs.readFileSync(schemaFile, 'utf8');

const checkpoint = new Checkpoint(config, writer, schema, {
  logLevel: LogLevel.Info,
  prettifyLogs: process.env.NODE_ENV !== 'production'
});
checkpoint.reset();

checkpoint.seedCheckpoints(checkpoints).then(() => checkpoint.start());

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ limit: '4mb', extended: false }));
app.use(cors({ maxAge: 86400 }));
app.use('/', checkpoint.graphql);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
