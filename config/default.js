module.exports = {
  webPort: 12700,
  webBaseURL: 'http://localhost:12699',
  webJwtSecret: '<TmplDemo Random 32>',
  mysql: {
    ssoDB: {
      host: '127.0.0.1',
      port: 3306,
      dialect: 'mysql',
      database: 'demo_db',
      username: 'root',
      password: '',
    },
  },
  redisCache: {
    host: '127.0.0.1',
    port: 30100,
  },
}
