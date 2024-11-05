const Admin = require('./admin');
const Fournisseurs = require('./fournisseurs');
const Dealers = require('./dealers');
const Users = require('./users');
const Rooms = require('./rooms');
const History = require('./history');

// Admin relationships
Admin.hasMany(History, { foreignKey: 'admin_id' });
History.belongsTo(Admin, { foreignKey: 'admin_id' });

// Fournisseurs relationships
Fournisseurs.hasMany(Dealers, { foreignKey: 'fournisseur_id' });
Dealers.belongsTo(Fournisseurs, { foreignKey: 'fournisseur_id' });

Fournisseurs.hasMany(History, { foreignKey: 'fournisseur_id' });
History.belongsTo(Fournisseurs, { foreignKey: 'fournisseur_id' });

// Dealers relationships
Dealers.hasMany(Users, { foreignKey: 'dealer_id' });
Users.belongsTo(Dealers, { foreignKey: 'dealer_id' });

Dealers.hasMany(History, { foreignKey: 'dealer_id' });
History.belongsTo(Dealers, { foreignKey: 'dealer_id' });

// Users relationships (for PrimaryUser and SecondaryUser)
Users.hasMany(History, { foreignKey: 'user_id', as: 'PrimaryHistories' });
History.belongsTo(Users, { foreignKey: 'user_id', as: 'PrimaryUser' });

Users.hasMany(History, { foreignKey: 'users_id', as: 'SecondaryHistories' });
History.belongsTo(Users, { foreignKey: 'users_id', as: 'SecondaryUser' });

module.exports = {
  Users,
  Admin,
  Fournisseurs,
  History,
  Dealers,
  Rooms
};
