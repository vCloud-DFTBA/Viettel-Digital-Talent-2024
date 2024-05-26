db = db.getSiblingDB('vtsStudent');
db.createUser(
  {
    user: "hieu",
    pwd: "123",
    roles: [ { role: "readWrite", db: "vtsStudent" } ]
  }
);
