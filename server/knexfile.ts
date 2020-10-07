module.exports = {
  
        client:'pg',
        version:'13.0',
        connection: {
          host : '127.0.0.1',
          port : 2345,
          user : 'postgres',
          password : '12345678',
          database : 'dbcoletagem'
        },
        migrations: {
            directory: __dirname + '/src/database/migrations'
        },
        seeds: {
          directory: __dirname + '/src/database/seeds'
        }
}
