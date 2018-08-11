const fs = require('fs');

module.exports = {
    moveSync: function(oldPath, newPath) {
        return fs.renameSync(oldPath, newPath);
    }
};