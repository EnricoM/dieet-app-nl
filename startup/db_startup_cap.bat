"D:\mongoDB\bin\mongod.exe" --dbpath "D:\EMINNAR\MongoData\data\db"

D:\mongoDB\bin\mongoimport -d dieet -c categories categories.json

D:\mongoDB\bin\mongoimport -d dieet -c products --file aardappel.json --jsonArray
D:\mongoDB\bin\mongoimport -d dieet -c products --file alcohol.json --jsonArray
D:\mongoDB\bin\mongoimport -d dieet -c products --file brood.json --jsonArray
D:\mongoDB\bin\mongoimport -d dieet -c products --file broodbeleg.json --jsonArray
D:\mongoDB\bin\mongoimport -d dieet -c products --file desserts.json --jsonArray
D:\mongoDB\bin\mongoimport -d dieet -c products --file dranken.json --jsonArray
D:\mongoDB\bin\mongoimport -d dieet -c products --file fruit.json --jsonArray
D:\mongoDB\bin\mongoimport -d dieet -c products --file granen.json --jsonArray



