import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import querystring from 'querystring';

import AppError from './errors/AppError';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/login', async (request, response) => {
  const { code } = request.body;

  if (!code) {
    throw new AppError('Code not provided.');
  }

  const requestBody = {
    code,
    grant_type: 'authorization_code',
  };

  const session = await axios({
    method: 'POST',
    url: 'https://staging.conectew.com.br/services/login/oauth2/token',
    data: querystring.stringify(requestBody),
    auth: {
      username: 'fbf079ce-7d38-49b1-be97-10ba01b2b9d4',
      password: '01f3f741-dd58-4a37-8beb-227747f94ab3',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ZmJmMDc5Y2UtN2QzOC00OWIxLWJlOTctMTBiYTAxYjJiOWQ0OjAxZjNmNzQxLWRkNTgtNGEzNy04YmViLTIyNzc0N2Y5NGFiMwo=',
    },
  }).catch(error => {
    const { message } = error.response.data;
    const { statusCode } = error.response;
    throw new AppError(message, statusCode);
  });

  return response.json(session.data);
});

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('🏥 Server start on http://localhost:3333');
});
