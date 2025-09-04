import {load} from 'cheerio';
import {Node} from "../types";

let DEFAULT_NODES: Record<string, Node[]> = {
    "中国电信": [
        {"id": "1123", "name": "青海西宁 - 电信", "category": "中国电信"},
        {"id": "1127", "name": "甘肃兰州 - 电信", "category": "中国电信"},
        {"id": "1128", "name": "黑龙江哈尔滨 - 电信", "category": "中国电信"},
        {"id": "1129", "name": "吉林长春 - 电信", "category": "中国电信"},
        {"id": "1131", "name": "山西太原 - 电信", "category": "中国电信"},
        {"id": "1132", "name": "天津 - 电信", "category": "中国电信"},
        {"id": "1134", "name": "江西南昌 - 电信", "category": "中国电信"},
        {"id": "1135", "name": "海南海口 - 电信", "category": "中国电信"},
        {"id": "1136", "name": "广西南宁 - 电信", "category": "中国电信"},
        {"id": "1137", "name": "云南昆明 - 电信", "category": "中国电信"},
        {"id": "1138", "name": "重庆 - 电信", "category": "中国电信"},
        {"id": "1168", "name": "辽宁大连 - 电信", "category": "中国电信"},
        {"id": "1169", "name": "广东深圳 - 电信", "category": "中国电信"},
        {"id": "1170", "name": "内蒙古 - 电信", "category": "中国电信"},
        {"id": "1214", "name": "湖北武汉 - 电信", "category": "中国电信"},
        {"id": "1218", "name": "西藏拉萨 - 电信", "category": "中国电信"},
        {"id": "1227", "name": "上海 - 电信", "category": "中国电信"},
        {"id": "1228", "name": "陕西西安 - 电信", "category": "中国电信"},
        {"id": "1274", "name": "贵州贵阳 - 电信", "category": "中国电信"},
        {"id": "1304", "name": "四川成都 - 电信", "category": "中国电信"},
        {"id": "1305", "name": "浙江宁波 - 电信", "category": "中国电信"},
        {"id": "1306", "name": "河南洛阳 - 电信", "category": "中国电信"},
        {"id": "1307", "name": "河北石家庄 - 电信", "category": "中国电信"},
        {"id": "1308", "name": "山东青岛 - 电信", "category": "中国电信"},
        {"id": "1310", "name": "北京 - 电信", "category": "中国电信"},
        {"id": "1311", "name": "湖南长沙 - 电信", "category": "中国电信"},
        {"id": "1312", "name": "江苏扬州 - 电信", "category": "中国电信"},
        {"id": "1319", "name": "宁夏银川 - 电信", "category": "中国电信"},
        {"id": "1320", "name": "安徽滁州 - 电信", "category": "中国电信"},
        {"id": "1339", "name": "广东广州 - 电信", "category": "中国电信"},
        {"id": "1340", "name": "福建福州 - 电信", "category": "中国电信"},
        {"id": "1343", "name": "福建龙岩 - 电信", "category": "中国电信"},
        {"id": "1344", "name": "河南郑州 - 电信", "category": "中国电信"},
        {"id": "1345", "name": "江苏苏州 - 电信", "category": "中国电信"},
        {"id": "1348", "name": "江苏徐州 - 电信", "category": "中国电信"},
        {"id": "1352", "name": "福建泉州 - 电信", "category": "中国电信"},
        {"id": "1353", "name": "新疆昌吉 - 电信", "category": "中国电信"},
        {"id": "1354", "name": "浙江温州 - 电信", "category": "中国电信"},
        {"id": "1357", "name": "广东东莞 - 电信", "category": "中国电信"},
        {"id": "1366", "name": "青海海东 - 电信", "category": "中国电信"},
        {"id": "1367", "name": "新疆乌鲁木齐 - 电信", "category": "中国电信"},
        {"id": "1369", "name": "安徽合肥 - 电信", "category": "中国电信"},
        {"id": "1370", "name": "广东佛山 - 电信", "category": "中国电信"},
        {"id": "1371", "name": "江苏南通 - 电信", "category": "中国电信"},
        {"id": "1382", "name": "四川德阳 - 电信", "category": "中国电信"},
        {"id": "1385", "name": "湖北十堰 - 电信", "category": "中国电信"},
        {"id": "1387", "name": "云南楚雄 - 电信", "category": "中国电信"},
        {"id": "1388", "name": "云南红河 - 电信", "category": "中国电信"},
        {"id": "1389", "name": "陕西延安 - 电信", "category": "中国电信"},
        {"id": "1390", "name": "江西吉安 - 电信", "category": "中国电信"},
        {"id": "1391", "name": "浙江嘉兴 - 电信", "category": "中国电信"},
        {"id": "1392", "name": "云南玉溪 - 电信", "category": "中国电信"}
    ],
    "中国联通": [
        {"id": "1226", "name": "四川成都 - 联通", "category": "中国联通"},
        {"id": "1252", "name": "陕西西安 - 联通", "category": "中国联通"},
        {"id": "1253", "name": "重庆 - 联通", "category": "中国联通"},
        {"id": "1254", "name": "上海 - 联通", "category": "中国联通"},
        {"id": "1255", "name": "青海西宁 - 联通", "category": "中国联通"},
        {"id": "1256", "name": "甘肃兰州 - 联通", "category": "中国联通"},
        {"id": "1257", "name": "云南昆明 - 联通", "category": "中国联通"},
        {"id": "1258", "name": "广西柳州 - 联通", "category": "中国联通"},
        {"id": "1259", "name": "西藏拉萨 - 联通", "category": "中国联通"},
        {"id": "1260", "name": "新疆乌鲁木齐 - 联通", "category": "中国联通"},
        {"id": "1261", "name": "内蒙古 - 联通", "category": "中国联通"},
        {"id": "1262", "name": "山西太原 - 联通", "category": "中国联通"},
        {"id": "1263", "name": "宁夏银川 - 联通", "category": "中国联通"},
        {"id": "1264", "name": "海南海口 - 联通", "category": "中国联通"},
        {"id": "1265", "name": "江西南昌 - 联通", "category": "中国联通"},
        {"id": "1266", "name": "天津 - 联通", "category": "中国联通"},
        {"id": "1267", "name": "黑龙江哈尔滨 - 联通", "category": "中国联通"},
        {"id": "1273", "name": "北京 - 联通", "category": "中国联通"},
        {"id": "1275", "name": "江苏徐州 - 联通", "category": "中国联通"},
        {"id": "1276", "name": "湖北武汉 - 联通", "category": "中国联通"},
        {"id": "1277", "name": "湖南益阳 - 联通", "category": "中国联通"},
        {"id": "1278", "name": "广东潮州 - 联通", "category": "中国联通"},
        {"id": "1296", "name": "安徽芜湖 - 联通", "category": "中国联通"},
        {"id": "1297", "name": "浙江杭州 - 联通", "category": "中国联通"},
        {"id": "1298", "name": "河北邯郸 - 联通", "category": "中国联通"},
        {"id": "1299", "name": "贵州贵阳 - 联通", "category": "中国联通"},
        {"id": "1300", "name": "河南郑州 - 联通", "category": "中国联通"},
        {"id": "1301", "name": "辽宁大连 - 联通", "category": "中国联通"},
        {"id": "1302", "name": "福建福州 - 联通", "category": "中国联通"},
        {"id": "1303", "name": "山东济南 - 联通", "category": "中国联通"},
        {"id": "1334", "name": "吉林松原 - 联通", "category": "中国联通"},
        {"id": "1355", "name": "广东揭阳 - 联通", "category": "中国联通"},
        {"id": "1358", "name": "安徽合肥 - 联通", "category": "中国联通"},
        {"id": "1365", "name": "广东广州 - 联通", "category": "中国联通"},
        {"id": "1368", "name": "吉林长春 - 联通", "category": "中国联通"},
        {"id": "1373", "name": "陕西咸阳 - 联通", "category": "中国联通"},
        {"id": "1375", "name": "四川眉山 - 联通", "category": "中国联通"},
        {"id": "1376", "name": "湖北咸宁 - 联通", "category": "中国联通"},
        {"id": "1377", "name": "浙江舟山 - 联通", "category": "中国联通"},
        {"id": "1383", "name": "山东淄博 - 联通", "category": "中国联通"},
        {"id": "1384", "name": "广西南宁 - 联通", "category": "中国联通"},
        {"id": "1393", "name": "辽宁沈阳 - 联通", "category": "中国联通"},
        {"id": "1395", "name": "云南玉溪 - 联通", "category": "中国联通"},
        {"id": "1396", "name": "山东泰安 - 联通", "category": "中国联通"},
        {"id": "1397", "name": "湖南岳阳 - 联通", "category": "中国联通"}
    ],
    "中国移动": [
        {"id": "1233", "name": "浙江杭州 - 移动", "category": "中国移动"},
        {"id": "1237", "name": "江苏南京 - 移动", "category": "中国移动"},
        {"id": "1242", "name": "湖南长沙 - 移动", "category": "中国移动"},
        {"id": "1243", "name": "山东济南 - 移动", "category": "中国移动"},
        {"id": "1244", "name": "贵州贵阳 - 移动", "category": "中国移动"},
        {"id": "1245", "name": "重庆 - 移动", "category": "中国移动"},
        {"id": "1246", "name": "河南郑州 - 移动", "category": "中国移动"},
        {"id": "1247", "name": "云南昆明 - 移动", "category": "中国移动"},
        {"id": "1248", "name": "陕西西安 - 移动", "category": "中国移动"},
        {"id": "1249", "name": "上海 - 移动", "category": "中国移动"},
        {"id": "1250", "name": "北京 - 移动", "category": "中国移动"},
        {"id": "1280", "name": "内蒙古 - 移动", "category": "中国移动"},
        {"id": "1281", "name": "青海西宁 - 移动", "category": "中国移动"},
        {"id": "1282", "name": "甘肃兰州 - 移动", "category": "中国移动"},
        {"id": "1283", "name": "四川成都 - 移动", "category": "中国移动"},
        {"id": "1284", "name": "宁夏银川 - 移动", "category": "中国移动"},
        {"id": "1285", "name": "山西太原 - 移动", "category": "中国移动"},
        {"id": "1286", "name": "河北承德 - 移动", "category": "中国移动"},
        {"id": "1287", "name": "湖北武汉 - 移动", "category": "中国移动"},
        {"id": "1288", "name": "福建厦门 - 移动", "category": "中国移动"},
        {"id": "1289", "name": "广西南宁 - 移动", "category": "中国移动"},
        {"id": "1290", "name": "广东深圳 - 移动", "category": "中国移动"},
        {"id": "1291", "name": "黑龙江哈尔滨 - 移动", "category": "中国移动"},
        {"id": "1292", "name": "吉林长春 - 移动", "category": "中国移动"},
        {"id": "1293", "name": "辽宁大连 - 移动", "category": "中国移动"},
        {"id": "1294", "name": "海南海口 - 移动", "category": "中国移动"},
        {"id": "1295", "name": "天津 - 移动", "category": "中国移动"},
        {"id": "1318", "name": "安徽淮南 - 移动", "category": "中国移动"},
        {"id": "1321", "name": "西藏拉萨 - 移动", "category": "中国移动"},
        {"id": "1338", "name": "广东广州 - 移动", "category": "中国移动"},
        {"id": "1346", "name": "江苏苏州 - 移动", "category": "中国移动"},
        {"id": "1349", "name": "江西南昌 - 移动", "category": "中国移动"},
        {"id": "1351", "name": "新疆乌鲁木齐 - 移动", "category": "中国移动"},
        {"id": "1356", "name": "广东佛山 - 移动", "category": "中国移动"},
        {"id": "1359", "name": "广东湛江 - 移动", "category": "中国移动"},
        {"id": "1360", "name": "浙江温州 - 移动", "category": "中国移动"},
        {"id": "1361", "name": "江苏南通 - 移动", "category": "中国移动"},
        {"id": "1362", "name": "浙江金华 - 移动", "category": "中国移动"},
        {"id": "1363", "name": "浙江绍兴 - 移动", "category": "中国移动"},
        {"id": "1378", "name": "江苏盐城 - 移动", "category": "中国移动"},
        {"id": "1379", "name": "江苏镇江 - 移动", "category": "中国移动"},
        {"id": "1380", "name": "广东惠州 - 移动", "category": "中国移动"},
        {"id": "1386", "name": "福建福州 - 移动", "category": "中国移动"},
        {"id": "1398", "name": "浙江嘉兴 - 移动", "category": "中国移动"},
        {"id": "1399", "name": "广东湛江 - 移动", "category": "中国移动"},
        {"id": "1400", "name": "云南曲靖 - 移动", "category": "中国移动"},
        {"id": "1401", "name": "辽宁沈阳 - 移动", "category": "中国移动"},
        {"id": "1402", "name": "陕西咸阳 - 移动", "category": "中国移动"},
        {"id": "1403", "name": "广东江门 - 移动", "category": "中国移动"}
    ],
    "港澳台、海外": [
        {"id": "1150", "name": "中国台湾 - 海外", "category": "港澳台、海外"},
        {"id": "1156", "name": "菲律宾 - 海外", "category": "港澳台、海外"},
        {"id": "1213", "name": "日本东京 - 海外", "category": "港澳台、海外"},
        {"id": "1219", "name": "美国洛杉矶 - 海外", "category": "港澳台、海外"},
        {"id": "1316", "name": "新加坡 - 海外", "category": "港澳台、海外"},
        {"id": "1317", "name": "美国阿什本 - 海外", "category": "港澳台、海外"},
        {"id": "1322", "name": "美国西雅图 - 海外", "category": "港澳台、海外"},
        {"id": "1323", "name": "韩国首尔 - 海外", "category": "港澳台、海外"},
        {"id": "1324", "name": "德国法兰克福 - 海外", "category": "港澳台、海外"},
        {"id": "1327", "name": "巴西圣保罗 - 海外", "category": "港澳台、海外"},
        {"id": "1328", "name": "英国伦敦 - 海外", "category": "港澳台、海外"},
        {"id": "1329", "name": "南非 - 海外", "category": "港澳台、海外"},
        {"id": "1330", "name": "埃及开罗 - 海外", "category": "港澳台、海外"},
        {"id": "1331", "name": "阿根廷 - 海外", "category": "港澳台、海外"},
        {"id": "1332", "name": "新西兰 - 海外", "category": "港澳台、海外"},
        {"id": "1347", "name": "中国香港 - 海外", "category": "港澳台、海外"}
    ]
};

export const updateNodesFromHtml = (html: string): void => {
    try {
        const $ = load(html);
        const newNodes: Record<string, Node[]> = {};

        $('optgroup').each((_, group) => {
            const category = $(group).attr('label');
            if (!category) return;

            if (!newNodes[category]) {
                newNodes[category] = [];
            }

            $(group).find('option').each((_, option) => {
                const id = $(option).attr('value');
                const name = $(option).text().trim();
                if (id && name) {
                    newNodes[category].push({id, name, category});
                }
            });
        });

        if (Object.keys(newNodes).length > 0) {
            DEFAULT_NODES = newNodes;
        }
    } catch {
        // keep existing DEFAULT_NODES on error
    }
};

export const getDefaultNodes = (): Record<string, Node[]> => {
    return DEFAULT_NODES;
};

export const getAllNodes = (): Node[] => {
    return Object.values(DEFAULT_NODES).flat();
};

export const getNodesByCategory = (category: string): Node[] => {
    return DEFAULT_NODES[category] || [];
};

export const getRandomNodes = (): string[] => {
    const categories = Object.keys(DEFAULT_NODES);
    return categories.map(category => {
        const nodes = DEFAULT_NODES[category];
        const randomIndex = Math.floor(Math.random() * nodes.length);
        return nodes[randomIndex].id;
    });
};