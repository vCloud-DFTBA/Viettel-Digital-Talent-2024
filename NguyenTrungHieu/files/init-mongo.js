db = db.getSiblingDB('vtsStudent');
db.createUser(
  {
    user: "hieu",
    pwd: "123",
    roles: [ { role: "readWrite", db: "vtsStudent" } ]
  }
);
db.createCollection('users');

var dataFile = '/docker-entrypoint-initdb.d/initial-data.json';

if (fs.existsSync(dataFile)) {
  var content = fs.readFileSync(dataFile);
  var data = JSON.parse(content);

  db.getCollection('users').insertMany(data);
}