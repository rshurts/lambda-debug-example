const AWS = require("aws-sdk");

AWS.config.region = "us-east-1";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const characters = [
  {
    name: "Frodo Baggins",
    aliases: ["Mr. Underhill", "Ringbearer"],
    tags: ["hobbit", "ringbearer", "fellowship", "shire"]
  },
  {
    name: "Gandalf",
    aliases: ["Stormcrow", "Mithrandir"],
    tags: ["wizard", "fellowship"]
  },
  {
    name: "Samewise Gamgee",
    aliases: ["Sam"],
    tags: ["hobbit", "fellowship", "shire"]
  },
  {
    name: "Meridac 'Merry' Brandybuck",
    aliases: ["Merry"],
    tags: ["hobbit", "fellowship", "shire"]
  },
  {
    name: "Peregrin Took",
    aliases: ["Pippin"],
    tags: ["hobbit", "fellowship", "shire"]
  },
  {
    name: "Aragorn",
    aliases: ["Strider", "Elssar", "Elfstone", "Dunadan"],
    tags: ["men", "gondor", "dunedain", "ranger", "fellowship"]
  },
  {
    name: "Legolas",
    tags: ["elf", "fellowship"]
  },
  {
    name: "Gimli",
    tags: ["dwarf", "fellowship"]
  },
  {
    name: "Boromir",
    tags: ["men", "gondor", "fellowship"]
  },
  {
    name: "Gollum",
    aliases: ["Smeagol", "Slinker", "Stinker"],
    tags: ["ringbearer", "corrupted", "hobbit"]
  },
  {
    name: "Bilbo Baggins",
    tags: ["hobbit", "ringbearer", "shire"]
  },
  {
    name: "Tom Bombadil",
    aliases: ["Master", "Eldest", "Iarwain Ben-adar", "Forn", "Orald"],
    tags: ["spirit"]
  },
  {
    name: "Glorfindel",
    tags: ["elf", "lord"]
  },
  {
    name: "Elrond",
    tags: ["elf", "lord", "halfelven", "rivendell"]
  },
  {
    name: "Arwen Evenstar",
    aliases: ["Undomiel"],
    tags: ["elf", "halfelven", "rivendell"]
  },
  {
    name: "Gladriel",
    aliases: ["Lady of the Golden Wood"],
    tags: ["elf", "lady", "lothlorien"]
  }
];

const putReqs = characters.map(x => ({
  PutRequest: {
    Item: x
  }
}));

const reqItems = {
  RequestItems: {
    lotr: putReqs
  }
};

dynamodb
  .batchWrite(reqItems)
  .promise()
  .then(() => console.log("Table seeded."))
  .catch(e => console.error(e));
