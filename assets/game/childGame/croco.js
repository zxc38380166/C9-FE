const lists = [
  {
    productId: '120',
    game_name: 'Deadliest Sea',
    name_cn: '致命深海',
    name_th: 'Deadliest Sea',
    game_code: 'croco',
    name_tw: '致命深海'
  },
  {
    productId: '121',
    game_name: "Wizard's Academy",
    name_cn: '巫师学院',
    name_th: "Wizard's Academy",
    game_code: 'croco',
    name_tw: '巫师学院'
  },
  {
    productId: '122',
    game_name: 'Dragon Quest',
    name_cn: '屠龙宝藏',
    name_th: 'Dragon Quest',
    game_code: 'croco',
    name_tw: '屠龙宝藏'
  },
  {
    productId: '123',
    game_name: 'John Wild',
    name_cn: '狂野约翰',
    name_th: 'John Wild',
    game_code: 'croco',
    name_tw: '狂野约翰'
  },
  {
    productId: '124',
    game_name: 'Run Away! Zombies',
    name_cn: '快逃！僵尸来袭',
    name_th: 'Run Away! Zombies',
    game_code: 'croco',
    name_tw: '快逃！僵尸来袭'
  },
  {
    productId: '125',
    game_name: 'Samurai Clash',
    name_cn: '武士对决',
    name_th: 'Samurai Clash',
    game_code: 'croco',
    name_tw: '武士对决'
  },
  {
    productId: '126',
    game_name: 'Cursed Doll',
    name_cn: '诅咒人偶',
    name_th: 'Cursed Doll',
    game_code: 'croco',
    name_tw: '诅咒人偶'
  },
  {
    productId: '127',
    game_name: 'Candy Fiesta 1000',
    name_cn: '糖果嘉年华1000',
    name_th: 'Candy Fiesta 1000',
    game_code: 'croco',
    name_tw: '糖果嘉年华1000'
  },
  {
    productId: '128',
    game_name: 'Sugar Fiesta 1000',
    name_cn: '甜蜜狂欢1000',
    name_th: 'Sugar Fiesta 1000',
    game_code: 'croco',
    name_tw: '甜蜜狂欢1000'
  },
  {
    productId: '129',
    game_name: 'Piece Of Cash',
    name_cn: '碎金大作战',
    name_th: 'Piece Of Cash',
    game_code: 'croco',
    name_tw: '碎金大作战'
  },
  {
    productId: '130',
    game_name: 'Left 4 Cash',
    name_cn: '求神现金',
    name_th: 'Left 4 Cash',
    game_code: 'croco',
    name_tw: '求神现金'
  },
  {
    productId: '131',
    game_name: 'Sea of Olympus 1000',
    name_cn: '奥林帕斯之海1000',
    name_th: 'Sea of Olympus 1000',
    game_code: 'croco',
    name_tw: '奥林帕斯之海1000'
  },
  {
    productId: '132',
    game_name: 'Lucky Ranch',
    name_cn: '幸运农场',
    name_th: 'Lucky Ranch',
    game_code: 'croco',
    name_tw: '幸运农场'
  },
  {
    productId: '133',
    game_name: 'Magical Mine',
    name_cn: '魔法矿坑',
    name_th: 'Magical Mine',
    game_code: 'croco',
    name_tw: '魔法矿坑'
  },
  {
    productId: '134',
    game_name: 'Reel Big Catch',
    name_cn: '大获鱼利',
    name_th: 'Reel Big Catch',
    game_code: 'croco',
    name_tw: '大获鱼利'
  },
  {
    productId: '135',
    game_name: 'Clash Cash',
    name_cn: '冲突夺金',
    name_th: 'Clash Cash',
    game_code: 'croco',
    name_tw: '冲突夺金'
  },
  {
    productId: '136',
    game_name: 'Gold of Olympus',
    name_cn: '奥林帕斯黄金',
    name_th: 'Gold of Olympus',
    game_code: 'croco',
    name_tw: '奥林帕斯黄金'
  },
  {
    productId: '140',
    game_name: "Jack's Crypt",
    name_cn: '杰克密室',
    name_th: "Jack's Crypt",
    game_code: 'croco',
    name_tw: '杰克密室'
  },
  {
    productId: '141',
    game_name: 'Arcane Portals',
    name_cn: '秘法传送门',
    name_th: 'Arcane Portals',
    game_code: 'croco',
    name_tw: '秘法传送门'
  },
  {
    productId: '142',
    game_name: 'WUKONG',
    name_cn: '悟空',
    name_th: 'WUKONG',
    game_code: 'croco',
    name_tw: '悟空'
  },
  {
    productId: '143',
    game_name: 'StarShine Princess',
    name_cn: '星耀公主',
    name_th: 'StarShine Princess',
    game_code: 'croco',
    name_tw: '星耀公主'
  },
  {
    productId: '144',
    game_name: 'Ghost Boo-nanza',
    name_cn: '幽灵狂欢夜',
    name_th: 'Ghost Boo-nanza',
    game_code: 'croco',
    name_tw: '幽灵狂欢夜'
  },
  {
    productId: '146',
    game_name: 'Cyber Punk',
    name_cn: '赛博朋克',
    name_th: 'Cyber Punk',
    game_code: 'croco',
    name_tw: '赛博朋克'
  },
  {
    productId: '147',
    game_name: 'Golden Year',
    name_cn: '荣耀黄金年',
    name_th: 'Golden Year',
    game_code: 'croco',
    name_tw: '荣耀黄金年'
  },
  {
    productId: '148',
    game_name: 'Rhino Robbery',
    name_cn: '犀牛夺宝记',
    name_th: 'Rhino Robbery',
    game_code: 'croco',
    name_tw: '犀牛夺宝记'
  },
  {
    productId: '150',
    game_name: 'Symbiote',
    name_cn: '共生体',
    name_th: 'Symbiote',
    game_code: 'croco',
    name_tw: '共生体'
  },
  {
    productId: '151',
    game_name: 'Cursed Clown',
    name_cn: '被诅咒的小丑',
    name_th: 'Cursed Clown',
    game_code: 'croco',
    name_tw: '被诅咒的小丑'
  },
  {
    productId: '152',
    game_name: 'NeZha',
    name_cn: '哪吒',
    name_th: 'NeZha',
    game_code: 'croco',
    name_tw: '哪吒'
  },
  {
    productId: '153',
    game_name: 'Tim & Larry',
    name_cn: '蒂姆和拉里',
    name_th: 'Tim & Larry',
    game_code: 'croco',
    name_tw: '蒂姆和拉里'
  },
  {
    productId: '154',
    game_name: 'Super Waldo',
    name_cn: '超级瓦尔多',
    name_th: 'Super Waldo',
    game_code: 'croco',
    name_tw: '超级瓦尔多'
  }
];

export default lists;
