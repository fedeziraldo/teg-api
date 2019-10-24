const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_DB}`, { useNewUrlParser: true }, function(error){
   if(error){
      throw error; 
   }else{
      console.log('Conectado a MongoDB')
   }
});

module.exports = mongoose