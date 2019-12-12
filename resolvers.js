var LinvoDB = require("linvodb3");
const Promise = require('bluebird');
LinvoDB.dbPath = './data';
let yazilar = new LinvoDB('yazilar', {}, {});
let users = new LinvoDB('users', {}, {});
let kategoriler = new LinvoDB('kategoriler', {}, {});

Promise.promisifyAll(yazilar.find().__proto__);

const resolvers = {
    Query: {
        yazilar: async () => {
            return await yazilar.find({}).execAsync();
        },
        users: async () => {
            return await users.find({}).execAsync();
        },
        kategoriler: async () => {
            return await kategoriler.find({}).execAsync();
        },
        UserById: async (_, args) => {
            let us = await users.findOne({ _id: args.id}).execAsync();
            return us;
        },
        UserByKadiSifre: async (_, args) => {
            let user = await users.findOne({kadi: args.kadi, sifre: args.sifre}).execAsync();
            return user;
        },
        yaziById: async (_, args) => {
            console.log(args);
            let yazi = await yazilar.findOne({_id: args.id}).execAsync();
            let user = await users.findOne({_id: yazi.yazar}).execAsync();
            yazi.yazar_adi = user.adi;
            yazi.yazar_soyadi = user.soyadi;
            yazi.yazar_kadi = user.kadi;
            return yazi;
        }
    },
    Mutation: {
        yaziEkle: (_, args) => {
            let newYazi = args.yazi;
            let doc = new yazilar(newYazi);
            doc.save()
            return doc;
        },
        userEkle: (_, args) => {
            let newUser = args.user;
            let doc = new users(newUser);
            doc.save();
            return doc;
        }
    }
}

module.exports = resolvers;