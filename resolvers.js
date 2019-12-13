const LinvoDB = require("linvodb3");
const Promise = require('bluebird');
const bcrypt = require('bluebird');
const jwt = require('jsonwebtoken');
LinvoDB.dbPath = './data';
const yazilar = new LinvoDB('yazilar', {}, {});
const users = new LinvoDB('users', {}, {});
const kategoriler = new LinvoDB('kategoriler', {}, {});
const SECRET_KEY = 'gizlikey';

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
            let yazi_adeti = await yazilar.find({ yazar: us._id }).execAsync();
            us.yazi_adeti = yazi_adeti.length;
            return us;
        },
        UserByKadiSifre: async (_, args) => {
            let user = await users.findOne({kadi: args.kadi, sifre: args.sifre}).execAsync();
            return user;
        },
        yaziById: async (_, args) => {
            let yazi = await yazilar.findOne({_id: args.id}).execAsync();
            let user = await users.findOne({_id: yazi.yazar}).execAsync();
            yazi.yazar_adi = user.adi;
            yazi.yazar_soyadi = user.soyadi;
            yazi.yazar_kadi = user.kadi;
            return yazi;
        },
        TakipciByUserId: async (_, args) => {
            let user = await users.findOne({ _id: args.id }).execAsync();
            let users_arr = await users.find({ _id: { $in: user.takipci } }).execAsync();
            console.log(users_arr);
            
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
        },
        kayit: async (_, {user}) => {
            if(user.sifre != user.sifret) return {sonuc: 'Şifreler uyuşmuyor!'};
            let dbuser = await users.findOne({kadi: user.kadi}).execAsync();
            if(dbuser) return {sonuc: 'Kullanıcı adı kullanılıyor! Şifrenizi mi unuttunuz?'};
            dbuser = await users.findOne({email: user.email}).execAsync();
            if(dbuser) return {sonuc: 'Eposta zaten kullanılıyor!'};

            let doc = new users(user);
            doc.save();
            return {sonuc: 'Başarıyla kaydolundu! Giriş yapabilirsiniz.'};
        },
        giris: async (_, {user}) => {
            let dbuser = await users.findOne({ kadi: user.kadi }).execAsync();
            if(!dbuser) return { sonuc: 'Böyle bir kullanıcı yok!', tip: false };
            if(dbuser.sifre != user.sifre) return { sonuc: 'Şifre hatalı!', tip: false };
            const token = jwt.sign({kadi: user.kadi, id: dbuser._id, sifre: user.sifre}, SECRET_KEY);
            let us = {
                _id: dbuser._id,
                adi: dbuser.adi,
                soyadi: dbuser.soyadi,
                kadi: dbuser.kadi,
                email: dbuser.email,
                yetkiler: dbuser.yetkiler,
                takip: dbuser.takip,
                takipci: dbuser.takipci,
                fotograf: dbuser.fotograf,
                yazi_adeti: dbuser.yazi_adeti
            }
            return { sonuc: token, tip: true, user: us };
        }
    }
}

module.exports = resolvers;