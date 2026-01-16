const list = [
  {
    productId: '2001',
    game_name: 'Transformers',
    name_cn: '变形金刚',
    name_th: 'ทรานฟอร์เมอร์',
    game_code: 'fg_slot',
    name_tw: '變形金剛'
  },
  {
    productId: '2002',
    game_name: 'Grave Robbers',
    name_cn: '摸金校尉',
    name_th: 'ล่าขุมทรัพย์ ลึกใต้โลก',
    game_code: 'fg_slot',
    name_tw: '摸金校尉'
  },
  {
    productId: '2003',
    game_name: 'King Kong',
    name_cn: '金刚',
    name_th: 'คิงคอง',
    game_code: 'fg_slot',
    name_tw: '金剛'
  },
  {
    productId: '2004',
    game_name: 'Gold Rush',
    name_cn: '淘金热',
    name_th: 'นิยมค้าหาเงินทอง',
    game_code: 'fg_slot',
    name_tw: '淘金熱'
  },
  {
    productId: '2005',
    game_name: 'Route 66',
    name_cn: '66路',
    name_th: 'ถนน 66',
    game_code: 'fg_slot',
    name_tw: '66路'
  },
  {
    productId: '2006',
    game_name: 'Azteke',
    name_cn: '阿兹特克',
    name_th: 'แอซเท็ก',
    game_code: 'fg_slot',
    name_tw: '阿茲特克'
  },
  {
    productId: '2007',
    game_name: 'Egypt',
    name_cn: '埃及',
    name_th: 'อียิปต์',
    game_code: 'fg_slot',
    name_tw: '埃及'
  },
  {
    productId: '2008',
    game_name: 'Carnival',
    name_cn: '狂欢',
    name_th: 'งานรื่นเริง',
    game_code: 'fg_slot',
    name_tw: '狂歡'
  },
  {
    productId: '2009',
    game_name: 'Medieval Thrones',
    name_cn: '中世纪特权',
    name_th: 'สิทธิพิเศษในยุคกลาง',
    game_code: 'fg_slot',
    name_tw: '中世紀特權'
  },
  {
    productId: '2010',
    game_name: 'The Qin Empire',
    name_cn: '大秦帝国',
    name_th: 'จักรวรรดิฉิน',
    game_code: 'fg_slot',
    name_tw: '大秦帝國'
  },
  {
    productId: '2251',
    game_name: 'Naruto',
    name_cn: '火影忍者',
    name_th: 'นารูโตะ',
    game_code: 'fg_slot',
    name_tw: '火影忍者'
  },
//   {
//     productId: '2252',
//     game_name: 'Joyful Fruit',
//     name_cn: '欢乐水果',
//     name_th: 'ผลไม้มีความสุข',
//     game_code: 'fg_slot',
//     name_tw: '歡樂水果'
//   },
//   {
//     productId: '2253',
//     game_name: 'Street Fighter',
//     name_cn: '街头霸王',
//     name_th: 'นักต่อสู้บนถนน',
//     game_code: 'fg_slot',
//     name_tw: '街頭霸王'
//   },
//   {
//     productId: '2254',
//     game_name: 'Warship Maiden',
//     name_cn: '战舰少女',
//     name_th: 'หญิงสาวเรือรบ',
//     game_code: 'fg_slot',
//     name_tw: '戰艦少女'
//   },
//   {
//     productId: '2255',
//     game_name: 'Eastern Countries',
//     name_cn: '东方国度',
//     name_th: 'รัฐตะวันออก',
//     game_code: 'fg_slot',
//     name_tw: '東方國度'
//   },
//   {
//     productId: '2256',
//     game_name: 'Western Cowboy',
//     name_cn: '西部牛仔',
//     name_th: 'โคบาลตะวันตก',
//     game_code: 'fg_slot',
//     name_tw: '西部牛仔'
//   },
//   {
//     productId: '2257',
//     game_name: 'Fantasy Earth',
//     name_cn: '幻想大陆',
//     name_th: 'ทวีปแฟนตาซี',
//     game_code: 'fg_slot',
//     name_tw: '幻想大陸'
//   },
  {
    productId: '2258',
    game_name: 'Las Vegas',
    name_cn: '拉斯维加斯',
    name_th: 'ลาสเวกัส',
    game_code: 'fg_slot',
    name_tw: '拉斯維加斯'
  },
  {
    productId: '2259',
    game_name: 'Wilderness Escort',
    name_cn: '荒野大镖客',
    name_th: 'กำมือของดอลลาร์ป่า',
    game_code: 'fg_slot',
    name_tw: '荒野大鏢客'
  },
  {
    productId: '2260',
    game_name: 'Cleopatra',
    name_cn: '埃及艳后',
    name_th: 'คลีโอพัตรา',
    game_code: 'fg_slot',
    name_tw: '埃及豔後'
  },
  {
    productId: '2501',
    game_name: 'Xian Jian',
    name_cn: '仙剑',
    name_th: 'ดาบนางฟ้า',
    game_code: 'fg_slot',
    name_tw: '仙劍'
  },
  {
    productId: '2502',
    game_name: 'Alice',
    name_cn: '梦游仙境',
    name_th: 'ผจญภัยมหัศจรรย์วัลเดอร์แลนด์',
    game_code: 'fg_slot',
    name_tw: '夢遊仙境'
  },
  {
    productId: '2503',
    game_name: '80 Days Travel',
    name_cn: '80天旅行',
    name_th: 'ท่องเที่ยว 80 วัน',
    game_code: 'fg_slot',
    name_tw: '80天旅行'
  },
  {
    productId: '2504',
    game_name: 'Pirates Fortune',
    name_cn: '海盗财富',
    name_th: 'สมบัติโจรสลัด',
    game_code: 'fg_slot',
    name_tw: '海盜財富'
  },
  {
    productId: '2505',
    game_name: 'Xi You',
    name_cn: '西游',
    name_th: 'ไซอิ๋ว',
    game_code: 'fg_slot',
    name_tw: '西遊'
  },
  {
    productId: '2506',
    game_name: 'Bai She Zhuan',
    name_cn: '白蛇传',
    name_th: 'ตำนานเดชนางพญางูขาว',
    game_code: 'fg_slot',
    name_tw: '白蛇傳'
  },
  {
    productId: '2507',
    game_name: 'Lord Of The Ring',
    name_cn: '指环王',
    name_th: 'ลอร์ดออฟเดอะริงส์',
    game_code: 'fg_slot',
    name_tw: '指環王'
  },
  {
    productId: '2508',
    game_name: 'Feng Shen Bang',
    name_cn: '封神榜',
    name_th: 'รายชื่อเทพเจ้า',
    game_code: 'fg_slot',
    name_tw: '封神榜'
  },
  {
    productId: '2509',
    game_name: 'King Of Glory',
    name_cn: '荣耀王者',
    name_th: 'กษัตริย์แห่งความรุ่งโรจน์',
    game_code: 'fg_slot',
    name_tw: '榮耀王者'
  },
  {
    productId: '2510',
    game_name: 'Freaks Fortune',
    name_cn: '怪物命运',
    name_th: 'ชะตากรรมของมอนสเตอร์',
    game_code: 'fg_slot',
    name_tw: '怪物命運'
  },
  {
    productId: '2011',
    game_name: 'Eiffel',
    name_cn: '埃菲尔',
    name_th: 'ไอเฟล',
    game_code: 'fg_slot',
    name_tw: '埃菲爾'
  },
  {
    productId: '2012',
    game_name: 'Ny Symbols',
    name_cn: '新年符号',
    name_th: 'สัญลักษณ์ของปีใหม่',
    game_code: 'fg_slot',
    name_tw: '新年符號'
  },
  {
    productId: '2013',
    game_name: 'Marilyn Monroe',
    name_cn: '性感女神',
    name_th: 'อนุสาวรีย์เทพีเสรีภาพ',
    game_code: 'fg_slot',
    name_tw: '性感女神'
  },
  {
    productId: '2014',
    game_name: 'Doomsday',
    name_cn: '世界末日',
    name_th: 'วันโลกาวินาศ',
    game_code: 'fg_slot',
    name_tw: '世界末日'
  },
  {
    productId: '2015',
    game_name: 'Modern War',
    name_cn: '现代战争',
    name_th: 'สงครามสมัยใหม่',
    game_code: 'fg_slot',
    name_tw: '現代戰爭'
  },
  {
    productId: '2016',
    game_name: 'Sweet Water Oasis',
    name_cn: '甜水绿洲',
    name_th: 'น้ำหวานพื้นที่เขียว',
    game_code: 'fg_slot',
    name_tw: '甜水綠洲'
  },
  {
    productId: '2017',
    game_name: 'Caribbean Pirates',
    name_cn: '加勒比海盗',
    name_th: 'โจรสลัดแห่งแคริบเบียน',
    game_code: 'fg_slot',
    name_tw: '加勒比海盜'
  },
  {
    productId: '2018',
    game_name: 'Kung Fu Panda',
    name_cn: '功夫熊猫',
    name_th: 'กังฟูแพนด้า',
    game_code: 'fg_slot',
    name_tw: '功夫熊貓'
  },
  {
    productId: '2019',
    game_name: 'Jurassic',
    name_cn: '侏罗纪公园',
    name_th: 'ยุคจูแรสซิก',
    game_code: 'fg_slot',
    name_tw: '侏羅紀公園'
  },
  {
    productId: '2020',
    game_name: 'PVZ',
    name_cn: '植物大战僵尸',
    name_th: 'พืช v.s. ซอมบี้',
    game_code: 'fg_slot',
    name_tw: '植物大戰僵屍'
  },
  {
    productId: '2021',
    game_name: 'Overwatch',
    name_cn: '守望英雄',
    name_th: 'ดูฮีโร่',
    game_code: 'fg_slot',
    name_tw: '守望英雄'
  },
//   {
//     productId: '2022',
//     game_name: 'Avatar',
//     name_cn: '阿凡达',
//     name_th: 'อวตาร',
//     game_code: 'fg_slot',
//     name_tw: '阿凡達'
//   },
  {
    productId: '2261',
    game_name: 'Greek Legend',
    name_cn: '希腊传说',
    name_th: 'ตำนานของกรีก',
    game_code: 'fg_slot',
    name_tw: '希臘傳說'
  },
  {
    productId: '2262',
    game_name: 'Bloodz VS Wolvez',
    name_cn: '吸血鬼PK狼人',
    name_th: 'แวมไพร์ PK มนุษย์หมาป่า',
    game_code: 'fg_slot',
    name_tw: '吸血鬼PK狼人'
  },
  {
    productId: '2263',
    game_name: 'Dream Journey',
    name_cn: '梦幻西游',
    name_th: 'ความฝันไซอิ๋ว',
    game_code: 'fg_slot',
    name_tw: '夢幻西遊'
  },
  {
    productId: '2264',
    game_name: 'Girls Football',
    name_cn: '女校足球队',
    name_th: 'ทีมฟุตบอลโรงเรียน',
    game_code: 'fg_slot',
    name_tw: '女校足球隊'
  },
  {
    productId: '2265',
    game_name: 'Girls Rugby',
    name_cn: '女校橄榄球',
    name_th: 'รักบี้ลีกโรงเรียนหญิง',
    game_code: 'fg_slot',
    name_tw: '女校橄欖球'
  },
  {
    productId: '2266',
    game_name: 'Girls Kendo Club',
    name_cn: '女校剑道部',
    name_th: 'ชมรมเคนโด้โรงเรียน',
    game_code: 'fg_slot',
    name_tw: '女校劍道部'
  },
  {
    productId: '2267',
    game_name: 'Guan Yun Chang',
    name_cn: '武圣关云长',
    name_th: 'นักกังฟูกวนอู',
    game_code: 'fg_slot',
    name_tw: '武聖關雲長'
  },
  {
    productId: '2268',
    game_name: 'Assassins Creed',
    name_cn: '刺客信条',
    name_th: 'ลัทธินักฆ่า',
    game_code: 'fg_slot',
    name_tw: '刺客信條'
  },
  {
    productId: '2269',
    game_name: 'Tomb Raider',
    name_cn: '古墓丽影',
    name_th: 'สุสานจู่โจม',
    game_code: 'fg_slot',
    name_tw: '古墓麗影'
  },
  {
    productId: '2270',
    game_name: 'The Wizard Of Oz',
    name_cn: '绿野仙踪',
    name_th: 'พ่อมดมหัศจรรย์แห่งออซ',
    game_code: 'fg_slot',
    name_tw: '綠野仙蹤'
  },
  {
    productId: '2271',
    game_name: 'Sword Heroes',
    name_cn: '剑侠情缘',
    name_th: 'นักดาบแห่งความรัก',
    game_code: 'fg_slot',
    name_tw: '劍俠情緣'
  },
  {
    productId: '2272',
    game_name: 'King Of Fighters',
    name_cn: '格斗之王',
    name_th: 'กษัตริย์การต่อสู้',
    game_code: 'fg_slot',
    name_tw: '格鬥之王'
  },
  {
    productId: '2511',
    game_name: 'Black Pearl',
    name_cn: '黑珍珠号',
    name_th: 'ไข่มุกดำได้แก้รับก',
    game_code: 'fg_slot',
    name_tw: '黑珍珠號'
  },
  {
    productId: '2512',
    game_name: 'Rich Farm',
    name_cn: '富饶农场',
    name_th: 'ฟาร์มอุดมสมบูรณ์',
    game_code: 'fg_slot',
    name_tw: '富饒農場'
  },
  {
    productId: '2513',
    game_name: 'Maya',
    name_cn: '玛雅',
    name_th: 'มายะ',
    game_code: 'fg_slot',
    name_tw: '瑪雅'
  },
  {
    productId: '2514',
    game_name: 'India Dreams',
    name_cn: '印第安',
    name_th: 'ชาวอินเดีย',
    game_code: 'fg_slot',
    name_tw: '印第安'
  },
  {
    productId: '2515',
    game_name: 'Mysterious East',
    name_cn: '神秘东方',
    name_th: 'ลึกลับตะวันออก',
    game_code: 'fg_slot',
    name_tw: '神秘東方'
  },
  {
    productId: '2516',
    game_name: 'Tanks',
    name_cn: '战争',
    name_th: 'สงคราม',
    game_code: 'fg_slot',
    name_tw: '戰爭'
  },
  {
    productId: '2517',
    game_name: 'Ne Zha Nao Hai',
    name_cn: '哪吒闹海',
    name_th: 'นาซานาโอะ',
    game_code: 'fg_slot',
    name_tw: '哪吒鬧海'
  },
  {
    productId: '2518',
    game_name: 'Tanabata Love',
    name_cn: '七夕情缘',
    name_th: 'เทศกาลทานาบาตะแห่งความรัก',
    game_code: 'fg_slot',
    name_tw: '七夕情緣'
  },
  {
    productId: '2519',
    game_name: 'Four Beauties',
    name_cn: '四大美女',
    name_th: 'สี่ยอดพธู',
    game_code: 'fg_slot',
    name_tw: '四大美女'
  },
  {
    productId: '2520',
    game_name: 'Jin Ping Mei',
    name_cn: '金瓶梅',
    name_th: 'จินผิ่งเหม่ย',
    game_code: 'fg_slot',
    name_tw: '金瓶梅'
  },
  {
    productId: '2521',
    game_name: 'Hong Lou Meng',
    name_cn: '红楼梦',
    name_th: 'ความฝันในหอมแดง',
    game_code: 'fg_slot',
    name_tw: '紅樓夢'
  },
  {
    productId: '2522',
    game_name: 'Wu Song Da Hu',
    name_cn: '武松打虎',
    name_th: 'วูซองฮิตเสือ',
    game_code: 'fg_slot',
    name_tw: '武松打虎'
  },
  {
    productId: '3101',
    game_name: 'Girls Swim Team',
    name_cn: '女校游泳队',
    name_th: 'ทีมว่ายน้ำหญิงโรงเรียน',
    game_code: 'fg_slot',
    name_tw: '女校游泳隊'
  },
  {
    productId: '3102',
    game_name: 'Cheerleaders',
    name_cn: '女校啦啦队',
    name_th: 'การเชียร์ลีดเดอร์โรงเรียนหญิง',
    game_code: 'fg_slot',
    name_tw: '女校啦啦隊'
  },
  {
    productId: '3103',
    game_name: 'Girls Gymnastics',
    name_cn: '女校体操队',
    name_th: 'ทีมยิมนาสติกหญิง',
    game_code: 'fg_slot',
    name_tw: '女校體操隊'
  },
  {
    productId: '3201',
    game_name: 'Tian Long Ba Bu',
    name_cn: '天龙八部',
    name_th: 'มังกรแปดกระทรวง',
    game_code: 'fg_slot',
    name_tw: '天龍八部'
  },
  {
    productId: '3202',
    game_name: 'Lu Ding Ji',
    name_cn: '鹿鼎记',
    name_th: 'อุ้ยเสี่ยวป้อของ',
    game_code: 'fg_slot',
    name_tw: '鹿鼎記'
  },
  {
    productId: '3203',
    game_name: 'Swordsman',
    name_cn: '笑傲江湖',
    name_th: 'นักดาบหัวเราะ',
    game_code: 'fg_slot',
    name_tw: '笑傲江湖'
  },
  {
    productId: '3204',
    game_name: 'Shen Diao Xia Lv',
    name_cn: '神雕侠侣',
    name_th: 'มังกรหยก',
    game_code: 'fg_slot',
    name_tw: '神雕俠侶'
  },
  {
    productId: '3301',
    game_name: 'Lucky Fruit',
    name_cn: '幸运水果机',
    name_th: 'เครื่องผลไม้โชคดี',
    game_code: 'fg_slot',
    name_tw: '幸運水果機'
  },
  {
    productId: '3302',
    game_name: 'Diamond Love',
    name_cn: '钻石之恋',
    name_th: 'เพชรแห่งความรัก',
    game_code: 'fg_slot',
    name_tw: '鑽石之戀'
  },
  {
    productId: '3303',
    game_name: 'Zeus',
    name_cn: '众神之王',
    name_th: 'กษัตริย์พระเจ้า',
    game_code: 'fg_slot',
    name_tw: '眾神之王'
  },
  {
    productId: '3304',
    game_name: 'Pink Lady',
    name_cn: '粉红女郎',
    name_th: 'เลดี้สีชมพู',
    game_code: 'fg_slot',
    name_tw: '粉紅女郎'
  },
  {
    productId: '3305',
    game_name: 'PSY',
    name_cn: '鸟叔',
    name_th: 'ลุงนก',
    game_code: 'fg_slot',
    name_tw: '鳥叔'
  },
//   {
//     productId: '2023',
//     game_name: 'Constellation',
//     name_cn: '十二星座',
//     name_th: 'สิบสองราศี',
//     game_code: 'fg_slot',
//     name_tw: '十二星座'
//   },
//   {
//     productId: '2024',
//     game_name: 'Chinese Zodiac',
//     name_cn: '十二生肖',
//     name_th: 'สิบสองนักษัตร',
//     game_code: 'fg_slot',
//     name_tw: '十二生肖'
//   },
//   {
//     productId: '2025',
//     game_name: 'Angry Birds',
//     name_cn: '愤怒的小鸟',
//     name_th: 'แองกรี้เบิร์ด',
//     game_code: 'fg_slot',
//     name_tw: '憤怒的小鳥'
//   },
//   {
//     productId: '2026',
//     game_name: 'Fishing Joy',
//     name_cn: '捕鱼达人',
//     name_th: 'แฮปปี้จับปลา',
//     game_code: 'fg_slot',
//     name_tw: '捕魚達人'
//   },
  {
    productId: '2273',
    game_name: 'Lucky Dog',
    name_cn: '瑞狗迎春',
    name_th: 'สุนัขต้นรับตรุษจีน',
    game_code: 'fg_slot',
    name_tw: '瑞狗迎春'
  },
  {
    productId: '2274',
    game_name: 'Catwoman',
    name_cn: '哥谭魅影猫女',
    name_th: 'เงาของเมืองโกทาม',
    game_code: 'fg_slot',
    name_tw: '哥譚魅影貓女'
  },
  {
    productId: '2275',
    game_name: 'Zhao Cai Jin Bao',
    name_cn: '招财进宝',
    name_th: 'โชคลาภ',
    game_code: 'fg_slot',
    name_tw: '招財進寶'
  },
  {
    productId: '2276',
    game_name: 'Great Blue',
    name_cn: '湛蓝深海',
    name_th: 'ทะเลสีฟ้า',
    game_code: 'fg_slot',
    name_tw: '湛藍深海'
  },
  {
    productId: '2523',
    game_name: 'Jin Gou Wang Cai',
    name_cn: '金狗旺财',
    name_th: 'สุนัขสีทองนำโชคทางการเงิน',
    game_code: 'fg_slot',
    name_tw: '金狗旺財'
  },
  {
    productId: '2525',
    game_name: 'Gong He Xin Chun',
    name_cn: '恭贺新春',
    name_th: 'ขอแสดงความยินดีกับตรุษจีน',
    game_code: 'fg_slot',
    name_tw: '恭賀新春'
  },
  {
    productId: '2526',
    game_name: 'Gladiatus',
    name_cn: '角斗士',
    name_th: 'กลาดิเอเตอร์',
    game_code: 'fg_slot',
    name_tw: '角鬥士'
  },
  {
    productId: '2527',
    game_name: 'Egypt Queen',
    name_cn: '埃及女王',
    name_th: 'สมเด็จพระราชินีแห่งอียิปต์',
    game_code: 'fg_slot',
    name_tw: '埃及女王'
  },
  {
    productId: '3306',
    game_name: 'Slamdunk',
    name_cn: '灌篮高手',
    name_th: 'สแลมดังค์',
    game_code: 'fg_slot',
    name_tw: '灌籃高手'
  },
  {
    productId: '3307',
    game_name: 'Qiang Hong Bao',
    name_cn: '抢红包',
    name_th: 'หยิบซองจดหมายสีแดง',
    game_code: 'fg_slot',
    name_tw: '搶紅包'
  },
  {
    productId: '3308',
    game_name: 'Lantern Festival',
    name_cn: '闹元宵',
    name_th: 'การเล่นเทศกาลโคมไฟ',
    game_code: 'fg_slot',
    name_tw: '鬧元宵'
  },
  {
    productId: '3309',
    game_name: 'Forest Dance',
    name_cn: '森林舞会',
    name_th: 'ป่าสุขสันต์',
    game_code: 'fg_slot',
    name_tw: '森林舞會'
  },
  {
    productId: '2277',
    game_name: 'Golden Globe',
    name_cn: '金球争霸',
    name_th: 'เอาชนะในทั่วโลก',
    game_code: 'fg_slot',
    name_tw: '金球爭霸'
  },
  {
    productId: '2278',
    game_name: 'Golden Foot',
    name_cn: '黄金右脚',
    name_th: 'เท้าขวาทอง',
    game_code: 'fg_slot',
    name_tw: '黃金右腳'
  },
  {
    productId: '2279',
    game_name: 'Fifa World',
    name_cn: '世界杯吉祥物',
    name_th: 'มิ่งขวัญฟุตบอลระดับโลก',
    game_code: 'fg_slot',
    name_tw: '世界盃吉祥物'
  },
  {
    productId: '2528',
    game_name: 'Argentina',
    name_cn: '潘帕斯雄鹰',
    name_th: 'นกอินทรีปัมวิส',
    game_code: 'fg_slot',
    name_tw: '潘帕斯雄鷹'
  },
  {
    productId: '2529',
    game_name: 'Stars Shine',
    name_cn: '群星闪耀',
    name_th: 'ดวงดาวสว่างไสว',
    game_code: 'fg_slot',
    name_tw: '群星閃耀'
  },
  {
    productId: '3310',
    game_name: 'The Golden Boot',
    name_cn: '金靴争霸',
    name_th: 'เจ้าแห่งดาวซัลโว',
    game_code: 'fg_slot',
    name_tw: '金靴爭霸'
  },
  {
    productId: '3311',
    game_name: 'Passion Fans',
    name_cn: '激情球迷',
    name_th: 'แฟนบอลผู้คลั่งไคล้',
    game_code: 'fg_slot',
    name_tw: '激情球迷'
  },
  {
    productId: '3312',
    game_name: 'World Cup',
    name_cn: '激情世界杯',
    name_th: 'ความตื่นเต้นฟุตบอลระดับโลก',
    game_code: 'fg_slot',
    name_tw: '激情世界盃'
  },
  {
    productId: '2280',
    game_name: 'Tarzan',
    name_cn: '人猿泰山',
    name_th: 'ทาร์ซาน',
    game_code: 'fg_slot',
    name_tw: '人猿泰山'
  },
  {
    productId: '3316',
    game_name: "Captain's Treasure",
    name_cn: '船长宝藏',
    name_th: 'สมบัติกัปตัน',
    game_code: 'fg_slot',
    name_tw: '船長寶藏'
  },
  {
    productId: '3313',
    game_name: 'Crazy7',
    name_cn: '疯狂七',
    name_th: 'บ้าเจ็ด',
    game_code: 'fg_slot',
    name_tw: '瘋狂七'
  },
  {
    productId: '2532',
    game_name: 'Magpie Bridge',
    name_cn: '鹊桥会',
    name_th: 'ประชุมสะพาน',
    game_code: 'fg_slot',
    name_tw: '鵲橋會'
  },
  {
    productId: '3315',
    game_name: 'Titanic',
    name_cn: '泰坦尼克号',
    name_th: 'ไททานิค',
    game_code: 'fg_slot',
    name_tw: '泰坦尼克號'
  },
  {
    productId: '2282',
    game_name: 'Spider Man',
    name_cn: '蜘蛛侠',
    name_th: 'สไปเดอร์แมน',
    game_code: 'fg_slot',
    name_tw: '蜘蛛俠'
  },
  {
    productId: '2281',
    game_name: 'Fast & Furious',
    name_cn: '速度与激情',
    name_th: 'เร็วและรุนแรง',
    game_code: 'fg_slot',
    name_tw: '速度與激情'
  },
  {
    productId: '2530',
    game_name: 'Funky Monkey',
    name_cn: '古怪猴子',
    name_th: 'ลิงมหัศจรรย์',
    game_code: 'fg_slot',
    name_tw: '古怪猴子'
  },
  {
    productId: '3314',
    game_name: 'BoomBeach',
    name_cn: '海岛奇兵',
    name_th: 'หมู่เกาะ',
    game_code: 'fg_slot',
    name_tw: '海島奇兵'
  },
  {
    productId: '2531',
    game_name: 'Fruit_Party',
    name_cn: '水果派对',
    name_th: 'ปาร์ตี้ผลไม้',
    game_code: 'fg_slot',
    name_tw: '水果派對'
  },
  {
    productId: '3317',
    game_name: 'WILDMonkey',
    name_cn: '百变猴子',
    name_th: 'เปลี่ยนลิงได้',
    game_code: 'fg_slot',
    name_tw: '百變猴子'
  },
  {
    productId: '2283',
    game_name: 'New Year',
    name_cn: '新年',
    name_th: 'ปีใหม่',
    game_code: 'fg_slot',
    name_tw: '新年'
  },
  {
    productId: '2284',
    game_name: 'Bless&Wealth',
    name_cn: '多福多财',
    name_th: 'อวยพรและความมั่งคั่ง',
    game_code: 'fg_slot',
    name_tw: '多福多財'
  },
  {
    productId: '3318',
    game_name: 'Arcade Water Margin',
    name_cn: '街机水浒传',
    name_th: 'น้ำอาเขต',
    game_code: 'fg_slot',
    name_tw: '街機水滸傳'
  },
  {
    productId: '2534',
    game_name: 'Fafafa',
    name_cn: '发发发',
    name_th: 'เส้นผม',
    game_code: 'fg_slot',
    name_tw: '發發發'
  },
 {
    productId: '3319',
    game_name: 'Water Margin Heroes',
    name_cn: '水浒英雄',
    name_th: 'วีรบุรุษของขอบน้ำ',
    game_code: 'fg_slot',
    name_tw: '水滸英雄'
  },
//   {
//     productId: '3320',
//     game_name: 'Jin Ping Mei 2',
//     name_cn: '金瓶梅2',
//     name_th: 'พลัมสีทอง2',
//     game_code: 'fg_slot',
//     name_tw: '金瓶梅2'
//   },
{
    productId: '3321',
    game_name: 'Red Envelope2',
    name_cn: '抢红包2',
    name_th: 'หยิบซองจดหมายสีแดง2',
    game_code: 'fg_slot',
    name_tw: '搶紅包2'
  },
  {
    productId: '3322',
    game_name: 'Fafafa2',
    name_cn: '发发发2',
    name_th: 'เส้นผม2',
    game_code: 'fg_slot',
    name_tw: '發發發2'
  },
  {
    productId: '3324',
    game_name: 'Fruit_Party2',
    name_cn: '水果派对2',
    name_th: 'ปาร์ตี้ผลไม้2',
    game_code: 'fg_slot',
    name_tw: '水果派對2'
  },
//   {
//     productId: '3325',
//     game_name: 'WILDMonkey2',
//     name_cn: '百变猴子2',
//     name_th: 'เปลี่ยนลิงได้2',
//     game_code: 'fg_slot',
//     name_tw: '百變猴子2'
//   },
  {
    productId: '3323',
    game_name: 'Qianghongbao3',
    name_cn: '抢红包3',
    name_th: 'ปาร์ตี้ผลไม้3',
    game_code: 'fg_slot',
    name_tw: '搶紅包3'
  },
  {
    productId: '3326',
    game_name: 'Forest Dance2',
    name_cn: '森林舞会2',
    name_th: 'ป่าสุขสันต์2',
    game_code: 'fg_slot',
    name_tw: '森林舞會2'
  },
//   {
//     productId: '3329',
//     game_name: 'Fortune sheep',
//     name_cn: '喜气洋洋',
//     name_th: 'แกะฟอร์จูน',
//     game_code: 'fg_slot',
//     name_tw: '喜氣洋洋'
//   },
//   {
//     productId: '3328',
//     game_name: "King's Game",
//     name_cn: '国王游戏',
//     name_th: 'เกมของกษัตริย์',
//     game_code: 'fg_slot',
//     name_tw: '國王遊戲'
//   },
//   {
//     productId: '3330',
//     game_name: 'Crazy Gold City',
//     name_cn: '疯狂黄金城',
//     name_th: 'เมืองทองคำสุดคลั่ง',
//     game_code: 'fg_slot',
//     name_tw: '瘋狂黃金城'
//   },
//   {
//     productId: '3331',
//     game_name: "Mahjong's Here Pro",
//     name_cn: '麻将来了 Pro',
//     name_th: 'เส้นทา งมาของ Pro',
//     game_code: 'fg_slot',
//     name_tw: '麻將來了 Pro'
//   }
]




export default list;
