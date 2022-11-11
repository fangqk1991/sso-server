module.exports = {
  webPort: 16130,
  webBaseURL: 'http://localhost:16129',
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
