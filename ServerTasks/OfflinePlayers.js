const db = require("../ServerModules/Database");

class OfflinePlayers {
    constructor(database) {
        this.db = database;
    }

    async updateOfflinePlayers() {
        try {
            const query = { last_activity: { $lte: Date.now() - 60000 } };
            const recordsToUpdate = await this.findRecords(query);
      
            for (const record of recordsToUpdate) {
              const currentCount = parseInt(record.RawMaterialCount_ResistanceToVirus, 10) || 0;
              const updatedValue = currentCount + 1;
              await this.updateRecord(record._id, { RawMaterialCount_ResistanceToVirus: updatedValue });              
            }
          } catch (error) {
            console.error('Error:', error);
          }        
    }

    findRecords(query) {
        return new Promise((resolve, reject) => {
          this.db.find(query, (err, docs) => {
            if (err) reject(err);
            else resolve(docs);
          });
        });
      }
    
      updateRecord(id, updateData) {
        return new Promise((resolve, reject) => {
          this.db.update({ _id: id }, { $set: updateData }, {}, err => {
            if (err) reject(err);
            else resolve();
          });
        });
      }    

}

module.exports = OfflinePlayers;
/*
async function updateOfflinePlayers() {
    try {
        const query = { last_activity: { $lte: Date.now() - 60000 } };
        const recordsToUpdate = await new Promise((resolve, reject) => {
            db.find(query, (err, docs) => {
                if(err) reject(err);
                else resolve(docs);
            });
        });        

        recordsToUpdate.forEach(async record => {
            const updatedValue = record.RawMaterialCount_ResistanceToVirus + 1;

            await new Promise((resolve, reject) => {
                db.update({ _id: record._id }, { $set: { RawMaterialCount_ResistanceToVirus: updatedValue }}, {}, err => {
                    if(err) reject(err);
                    else resolve();
                });
            });            
        });
    }
    catch(error) {
        console.error("Error:", error);
    }
}


setInterval(updateOfflinePlayers, 5000);
*/