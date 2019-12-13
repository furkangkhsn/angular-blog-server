const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type User {
    _id: ID!,
    adi: String,
    soyadi: String,
    kadi: String,
    sifre: String,
    email: String,
    yetkiler: [Int],
    takip: [String],
    takipci: [String],
    fotograf: String,
    yazi_adeti: Int
  }

  type Yazi {
    _id: ID!,
    baslik: String,
    icerik: String,
    yazar: ID!,
    tarih: String,
    kategori: ID!,
    yayinda: Boolean,
    yazar_adi: String,
    yazar_soyadi: String,
    yazar_kadi: String
  }

  type Kategori {
    _id: ID!,
    adi: String
  }

  type kayitSonuc {
    sonuc: String
  }

  type girisSonuc {
    sonuc: String,
    tip: Boolean,
    user: GirisYapmisUser
  }

  type GirisYapmisUser {
    _id: ID!,
    adi: String,
    soyadi: String,
    kadi: String,
    email: String,
    yetkiler: [Int],
    takip: [String],
    takipci: [String],
    fotograf: String,
    yazi_adeti: Int
  }

  input KayitUser {
    adi: String,
    soyadi: String,
    kadi: String,
    email: String,
    sifre: String,
    sifret: String
  }

  input GirisUser {
    kadi: String,
    sifre: String
  }

  input UserInput {
    adi: String,
    soyadi: String,
    kadi: String,
    sifre: String,
    email: String,
    yetkiler: [Int]
  }
  
  input YaziInput {
    baslik: String,
    icerik: String,
    yazar: ID!,
    tarih: String,
    kategori: ID!
  }

  type Query {
    yazilar: [Yazi],
    users: [User],
    kategoriler: [Kategori],
    UserById(id: ID!): User,
    UserByKadiSifre(kadi: String, sifre: String): User!,
    yaziById(_id: String): Yazi,
    TakipciByUserId(id: ID!): [User]
  }

  type Mutation {
    yaziEkle(yazi: YaziInput): Yazi,
    userEkle(user: UserInput): User,
    kayit(user: KayitUser): kayitSonuc,
    giris(user: GirisUser): girisSonuc
  }

`;

module.exports = typeDefs;