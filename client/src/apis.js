const SERVER_URL_LOCAL = 'http://localhost:5500';
const SERVER_URL_REMOTE = 'https://movies-my-flix-server.herokuapp.com';

const SUB_DIR_LOCAL = '/';
const SUB_DIR_REMOTE = '/client';

const isDevelopment = process.env.NODE_ENV === 'development';

const SERVER_URL = isDevelopment ? SERVER_URL_LOCAL : SERVER_URL_REMOTE;
const SUB_DIR = isDevelopment ? SUB_DIR_LOCAL : SUB_DIR_REMOTE;

module.exports = {
    SERVER_URL,
    SUB_DIR
};