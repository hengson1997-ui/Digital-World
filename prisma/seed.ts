import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 清空所有表
  await prisma.comment.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.favoriteCollection.deleteMany();
  await prisma.viewHistory.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.message.deleteMany();
  await prisma.post.deleteMany();
  await prisma.recentSearch.deleteMany();
  await prisma.trendingTopic.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ========== 用户（27 个） ==========
  const users = [
    { id: 1, avatar: '林', avatarGradient: 'linear-gradient(135deg, #5ac8fa, #007aff)', name: '林小白', bio: '手机测评博主｜果粉转安卓中｜合作私信', followers: 12800, followerCount: 12800, followingCount: 326, postCount: 89 },
    { id: 2, avatar: '陈', avatarGradient: 'linear-gradient(135deg, #ff6b9d, #c06eff)', name: '陈同学', bio: '大三计算机在读 | 分享日常数码好物 | 偶尔写代码', followers: 8600, followerCount: 8600, followingCount: 412, postCount: 156 },
    { id: 3, avatar: 'K', avatarGradient: 'linear-gradient(135deg, #ff9500, #ffcc00)', name: 'Kevin聊科技', bio: '前华为产品经理 | 现在全职做自媒体 | 每周更新', followers: 45200, followerCount: 45200, followingCount: 89, postCount: 342 },
    { id: 4, avatar: '📷', avatarGradient: 'linear-gradient(135deg, #34c759, #30d158)', name: '摄影师老王', bio: '十年风光摄影 | 索尼党 | 偶尔拍人像', followers: 23100, followerCount: 23100, followingCount: 67, postCount: 201 },
    { id: 5, avatar: '苏', avatarGradient: 'linear-gradient(135deg, #af52de, #5856d6)', name: '苏小默', bio: '重度苹果用户 | 家里全是Apple | 偶尔吐槽', followers: 6700, followerCount: 6700, followingCount: 198, postCount: 73 },
    { id: 6, avatar: '🎧', avatarGradient: 'linear-gradient(135deg, #ff2d55, #ff6b9d)', name: '耳机发烧友阿杰', bio: 'HiFi 耳机收藏 200+ | 分享听感 | 不接受广告', followers: 18900, followerCount: 18900, followingCount: 45, postCount: 128 },
    { id: 7, avatar: '官', avatarGradient: 'linear-gradient(135deg, #007aff, #5ac8fa)', name: '数码社区官方', bio: '官方账号 | 社区通知与活动', followers: 0, followerCount: 0, followingCount: 0, postCount: 0 },
    { id: 8, avatar: '张', avatarGradient: 'linear-gradient(135deg, #ff3b30, #ff6b9d)', name: '张小凡', bio: '游戏党 | PS5+Switch+PC全平台 | 等GTA6', followers: 9800, followerCount: 9800, followingCount: 234, postCount: 67 },
    { id: 9, avatar: '赵', avatarGradient: 'linear-gradient(135deg, #5856d6, #af52de)', name: '赵老师聊数码', bio: '高中物理老师 | 科技爱好者 | 周末更新', followers: 3400, followerCount: 3400, followingCount: 156, postCount: 45 },
    { id: 10, avatar: 'D', avatarGradient: 'linear-gradient(135deg, #007aff, #34c759)', name: 'David的设计日记', bio: 'UI设计师 | 用MacBook和iPad创作 | 分享设计工具', followers: 15600, followerCount: 15600, followingCount: 89, postCount: 112 },
    { id: 11, avatar: '周', avatarGradient: 'linear-gradient(135deg, #ffcc00, #ff9500)', name: '周周爱折腾', bio: '智能家居重度玩家 | HomeKit全屋智能 | 折腾无止境', followers: 7200, followerCount: 7200, followingCount: 67, postCount: 89 },
    { id: 12, avatar: 'M', avatarGradient: 'linear-gradient(135deg, #34c759, #5ac8fa)', name: '码农小李', bio: '全栈开发 | React/Node/Go | 偶尔聊聊生产力工具', followers: 11200, followerCount: 11200, followingCount: 145, postCount: 78 },
    { id: 13, avatar: '刘', avatarGradient: 'linear-gradient(135deg, #ff6b9d, #ff3b30)', name: '刘小美', bio: '穿搭博主 | 偶尔分享数码 | Apple Watch表带收集', followers: 28900, followerCount: 28900, followingCount: 312, postCount: 156 },
    { id: 14, avatar: '黄', avatarGradient: 'linear-gradient(135deg, #af52de, #5856d6)', name: '黄师傅修手机', bio: '手机维修十年 | 分享拆机视频 | 教你避坑', followers: 34500, followerCount: 34500, followingCount: 23, postCount: 234 },
    { id: 15, avatar: 'W', avatarGradient: 'linear-gradient(135deg, #5ac8fa, #007aff)', name: 'Wilson的科技屋', bio: '数码开箱 | 家居科技 | 追求极简生活', followers: 19800, followerCount: 19800, followingCount: 78, postCount: 145 },
    { id: 16, avatar: '孙', avatarGradient: 'linear-gradient(135deg, #ff9500, #ffcc00)', name: '孙大圣', bio: '安卓党 | 刷机爱好者 | 原生Android死忠', followers: 5600, followerCount: 5600, followingCount: 89, postCount: 56 },
    { id: 17, avatar: '吴', avatarGradient: 'linear-gradient(135deg, #34c759, #30d158)', name: '吴哥聊投影', bio: '投影仪发烧友 | 家庭影院搭建 | 分享选购经验', followers: 8900, followerCount: 8900, followingCount: 45, postCount: 67 },
    { id: 18, avatar: 'K', avatarGradient: 'linear-gradient(135deg, #ff2d55, #ff6b9d)', name: '科技美学', bio: '科技自媒体 | 视频为主 | 偶尔图文', followers: 56700, followerCount: 56700, followingCount: 34, postCount: 456 },
    { id: 19, avatar: '郑', avatarGradient: 'linear-gradient(135deg, #007aff, #5ac8fa)', name: '郑小胖', bio: '减肥中的程序员 | 用Apple Watch记录运动 | 分享健康', followers: 2300, followerCount: 2300, followingCount: 178, postCount: 34 },
    { id: 20, avatar: '马', avatarGradient: 'linear-gradient(135deg, #ffcc00, #ff9500)', name: '马老师测评', bio: '独立测评人 | 不接广告 | 只说真话', followers: 41200, followerCount: 41200, followingCount: 12, postCount: 312 },
    { id: 21, avatar: '胡', avatarGradient: 'linear-gradient(135deg, #af52de, #c06eff)', name: '胡桃夹子', bio: '女程序员 | 喜欢粉色数码产品 | 分享桌面改造', followers: 16700, followerCount: 16700, followingCount: 234, postCount: 89 },
    { id: 22, avatar: '林', avatarGradient: 'linear-gradient(135deg, #5ac8fa, #34c759)', name: '林先生的书房', bio: 'Kindle重度用户 | 电子书爱好者 | 偶尔聊平板', followers: 4500, followerCount: 4500, followingCount: 67, postCount: 45 },
    { id: 23, avatar: '罗', avatarGradient: 'linear-gradient(135deg, #ff6b9d, #ff9500)', name: '罗老师说耳机', bio: '前音频工程师 | 现在做耳机测评 | 听感主观仅供参考', followers: 21300, followerCount: 21300, followingCount: 56, postCount: 178 },
    { id: 24, avatar: '许', avatarGradient: 'linear-gradient(135deg, #34c759, #5856d6)', name: '许小仙', bio: 'Vlog博主 | 用iPhone拍视频 | 分享剪辑技巧', followers: 13400, followerCount: 13400, followingCount: 189, postCount: 98 },
    { id: 25, avatar: '韩', avatarGradient: 'linear-gradient(135deg, #ff3b30, #ff2d55)', name: '韩路聊汽车科技', bio: '汽车+科技跨界 | 车机体验 | 智能驾驶', followers: 67800, followerCount: 67800, followingCount: 45, postCount: 234 },
    { id: 26, avatar: '蔡', avatarGradient: 'linear-gradient(135deg, #007aff, #af52de)', name: '蔡老板的科技圈', bio: '二手数码贩子 | 教你捡漏 | 避坑指南', followers: 23400, followerCount: 23400, followingCount: 12, postCount: 167 },
    { id: 27, avatar: '冯', avatarGradient: 'linear-gradient(135deg, #ffcc00, #34c759)', name: '冯小刚不拍电影', bio: '退休工程师 | 玩无人机 | 偶尔聊数码', followers: 7800, followerCount: 7800, followingCount: 34, postCount: 45 }
  ];
  await prisma.user.createMany({ data: users });

  // ========== 分类 ==========
  await prisma.category.createMany({
    data: [
      { key: 'general', label: '综合' },
      { key: 'phone', label: '手机' },
      { key: 'computer', label: '电脑' },
      { key: 'headphone', label: '耳机' },
      { key: 'camera', label: '相机' },
      { key: 'smarthome', label: '智能家居' },
      { key: 'game', label: '游戏' },
      { key: 'wear', label: '穿戴' }
    ]
  });

  const phoneCat = await prisma.category.findUnique({ where: { key: 'phone' } });
  const computerCat = await prisma.category.findUnique({ where: { key: 'computer' } });
  const cameraCat = await prisma.category.findUnique({ where: { key: 'camera' } });
  const headphoneCat = await prisma.category.findUnique({ where: { key: 'headphone' } });
  const wearCat = await prisma.category.findUnique({ where: { key: 'wear' } });
  const smarthomeCat = await prisma.category.findUnique({ where: { key: 'smarthome' } });
  const generalCat = await prisma.category.findUnique({ where: { key: 'general' } });
  const gameCat = await prisma.category.findUnique({ where: { key: 'game' } });

  const now = new Date();
  const h = (hours) => new Date(now.getTime() - hours * 60 * 60 * 1000);

  // ========== 帖子（28 篇） ==========
  const postsData = [
    { title: 'iPhone 17 Pro 用了一周，说说真实感受', content: '从 15 Pro 换过来的，最大的感受就是续航真的起飞了。之前下午三点就得充电，现在晚上到家还有 30%。相机提升感知不强，但视频防抖确实稳了不少。液态玻璃的设计看久了还挺耐看的，就是容易沾指纹。', meta: '2小时前 · 2341阅读', likes: 487, comments: 89, liked: true, images: 3, viewCount: 2341, authorId: 1, categoryId: phoneCat.id, createdAt: h(2), tags: ['iPhone', '手机', '体验'] },
    { title: 'M5 Mac mini 到手了，这体积也太离谱了', content: '之前用的 M1 Mac mini，看到 M5 发布直接下单了。体积小了差不多一半，放桌面几乎不占地方。跑了一下 Final Cut 导出 4K 视频，速度比 M1 快了将近 40%。唯一的问题是接口少了两个 USB-A，我的旧硬盘得买转接头了。', meta: '4小时前 · 1876阅读', likes: 312, comments: 67, liked: false, images: 2, viewCount: 1876, authorId: 5, categoryId: computerCat.id, createdAt: h(4), tags: ['Mac', '开箱', 'M5'] },
    { title: '小米 15 Ultra 拍照翻车了？实际对比给你看', content: '网上好多人说小米 15 Ultra 拍照不行，我特意拿它和 iPhone 17 Pro 做了对比。白天两者差距不大，小米色彩更讨喜。夜景小米噪点控制反而更好。但是视频拍摄确实苹果更稳。总体来说这个价位能打 9 分。', meta: '6小时前 · 3200阅读', likes: 623, comments: 145, liked: false, images: 3, viewCount: 3200, authorId: 3, categoryId: phoneCat.id, createdAt: h(6), tags: ['小米', '拍照', '对比'] },
    { title: '索尼 A7C II 用了半年，说说这台相机的优缺点', content: '优点：轻便、对焦快、画质扎实。缺点：续航拉胯、菜单反人类、没有双卡槽。如果你是旅行摄影为主，这台机子非常合适。但如果是干活用，还是建议 A7 IV 或者等 A7 V。', meta: '10小时前 · 890阅读', likes: 156, comments: 43, liked: false, images: 0, viewCount: 890, authorId: 4, categoryId: cameraCat.id, createdAt: h(10), tags: ['索尼', '相机', '使用感受'] },
    { title: 'AirPods Pro 3 降噪提升巨大，但有个致命缺点', content: '降噪效果比 2 代强了差不多 30%，地铁上几乎听不到任何噪音。音质也有提升，低频更扎实了。但是！这个耳机柄的触控太灵敏了，经常误触暂停。希望后续固件能修复。', meta: '昨天 · 4100阅读', likes: 892, comments: 201, liked: true, images: 2, viewCount: 4100, authorId: 6, categoryId: headphoneCat.id, createdAt: h(24), tags: ['AirPods', '耳机', '降噪'] },
    { title: 'Apple Watch Ultra 3 终于支持血压监测了', content: '等了两年的功能终于来了。实测和家用血压计对比，误差在 5mmHg 以内，日常监测完全够用。表盘也新增了血压趋势图。不过这个功能目前只在美国上线，国内还得等审批。', meta: '昨天 · 2800阅读', likes: 445, comments: 78, liked: false, images: 1, viewCount: 2800, authorId: 2, categoryId: wearCat.id, createdAt: h(28), tags: ['Apple Watch', '健康', '血压'] },
    { title: 'HomePod 2025 款音质实测，比老款强多少？', content: '新款 HomePod 换了新的高音单元，高频解析力明显提升。低频量感比老款少了点，但更干净了。空间音频效果很棒，放在客厅中间听环绕感很强。价格没涨，值得升级。', meta: '2天前 · 1560阅读', likes: 234, comments: 56, liked: false, images: 2, viewCount: 1560, authorId: 5, categoryId: smarthomeCat.id, createdAt: h(48), tags: ['HomePod', '智能家居', '音质'] },
    { title: '为什么我从安卓换回了 iPhone？说说真实原因', content: '用了两年小米 14 Pro，最近换回了 iPhone 17。不是安卓不好，是生态绑定太深了。AirDrop、iMessage、Apple Watch 这些换安卓全断了。而且 iOS 的流畅度确实还是比 MIUI 强一档。安卓的自由度我很怀念，但综合体验还是苹果省心。', meta: '3天前 · 6700阅读', likes: 1234, comments: 345, liked: false, images: 0, viewCount: 6700, authorId: 3, categoryId: generalCat.id, createdAt: h(72), tags: ['iPhone', '安卓', '换机'] },
    { title: 'RTX 5090 首发评测：这性能提升也太夸张了', content: '拿到卡的第一天就跑了 3DMark，Time Spy 直接破 4 万分。4K 全特效赛博朋克 2077 跑满 144 帧不是梦。但是功耗也上去了，满载 450W，电源不够的建议先升级。DLSS 4 的帧生成效果比上代好很多，几乎看不出延迟。', meta: '5小时前 · 4500阅读', likes: 756, comments: 189, liked: false, images: 3, viewCount: 4500, authorId: 8, categoryId: gameCat.id, createdAt: h(5), tags: ['显卡', 'NVIDIA', '游戏'] },
    { title: 'iPad Pro M5 做生产力工具靠谱吗？我试了一周', content: '结论：轻度生产力可以，重度还是不行。写文档、修图、剪短视频都没问题。但 Final Cut 在 iPad 上的功能还是比 Mac 少太多。而且文件管理依然是痛点。如果你主要用来看视频和画画，iPad Pro 依然是最好的选择。', meta: '8小时前 · 2100阅读', likes: 345, comments: 78, liked: false, images: 2, viewCount: 2100, authorId: 10, categoryId: computerCat.id, createdAt: h(8), tags: ['iPad', '生产力', 'M5'] },
    { title: 'Switch 2 值不值得买？老玩家给你分析', content: '硬件升级确实大，屏幕从 720p 升到 1080p，支持 HDR。手柄也改了，摇杆漂移问题应该解决了。但首发游戏阵容一般，主要靠马里奥撑场面。如果你已经有 Switch 1，建议等等；如果是新玩家，直接入。', meta: '12小时前 · 3800阅读', likes: 567, comments: 234, liked: false, images: 1, viewCount: 3800, authorId: 8, categoryId: gameCat.id, createdAt: h(12), tags: ['Switch', '任天堂', '游戏'] },
    { title: '全屋智能家居踩坑总结，花了 3 万块的教训', content: '第一，协议一定要统一，我混用了 Zigbee 和 WiFi，结果经常掉线。第二，网关一定要买好的，我用的某品牌网关三天两头离线。第三，窗帘电机一定要预留电源线，电池版续航拉胯。第四，灯光一定要用零火线方案。', meta: '1天前 · 5200阅读', likes: 890, comments: 167, liked: true, images: 3, viewCount: 5200, authorId: 11, categoryId: smarthomeCat.id, createdAt: h(30), tags: ['智能家居', '踩坑', '经验'] },
    { title: '机械键盘入坑指南：2025 年最值得买的 5 把', content: '1. 预算 200 以内：RK68，性价比之王。2. 预算 500：Leopold FC660M，手感天花板。3. 预算 1000：HHKB Professional Classic，程序员最爱。4. 预算 2000：Realforce R3，静电容无敌。5. 不差钱：Keychron Q1 HE，磁轴新体验。', meta: '1天前 · 6100阅读', likes: 1023, comments: 289, liked: false, images: 0, viewCount: 6100, authorId: 12, categoryId: generalCat.id, createdAt: h(36), tags: ['键盘', '外设', '推荐'] },
    { title: '我的 MacBook Pro 桌面改造，极简风', content: '之前桌面乱七八糟，最近花了两天时间重新整理。显示器用的 Studio Display，键盘是妙控键盘，鼠标是 MX Master 3S。桌面只留了这三样东西，其他全部收纳到抽屉里。现在工作心情都好了很多。', meta: '2天前 · 1800阅读', likes: 234, comments: 45, liked: false, images: 3, viewCount: 1800, authorId: 10, categoryId: computerCat.id, createdAt: h(50), tags: ['桌面', 'MacBook', '极简'] },
    { title: 'iPhone 17 和 iPhone 17 Pro 差多少？帮你做选择', content: '主要差距在三点：1. ProMotion 120Hz vs 60Hz，体感差距明显。2. 长焦镜头，Pro 有 5 倍光学变焦。3. 钛合金边框，手感和重量都不一样。如果你预算够，直接上 Pro。如果预算有限，标准版也完全够用。', meta: '3天前 · 8900阅读', likes: 1567, comments: 456, liked: false, images: 2, viewCount: 8900, authorId: 18, categoryId: phoneCat.id, createdAt: h(70), tags: ['iPhone', '对比', '选购'] },
    { title: '安卓平板还有救吗？2025 年安卓平板横评', content: '测了华为 MatePad Pro、小米 Pad 7 Pro、三星 Tab S10。结论：华为生态最好，小米性价比最高，三星屏幕最强。但说实话，和 iPad 比还是有差距，主要在 App 适配上。安卓平板的 App 质量参差不齐。', meta: '3天前 · 4300阅读', likes: 678, comments: 234, liked: false, images: 3, viewCount: 4300, authorId: 20, categoryId: computerCat.id, createdAt: h(68), tags: ['平板', '安卓', '横评'] },
    { title: '索尼 WH-1000XM6 降噪耳机体验：还是那个味', content: '降噪依然是行业第一梯队，音质比上代提升不大，但佩戴舒适度好了很多。续航 40 小时，充电 3 分钟听 3 小时。唯一的问题是 LDAC 在某些手机上还是会断连。整体来说，如果你有 XM5 不需要升级。', meta: '4天前 · 2600阅读', likes: 456, comments: 89, liked: false, images: 1, viewCount: 2600, authorId: 23, categoryId: headphoneCat.id, createdAt: h(96), tags: ['索尼', '降噪', '耳机'] },
    { title: '用无人机拍了一组日落，分享一下', content: '上周末去海边用 DJI Mini 4 Pro 拍的，夕阳西下的时候光线特别好。后期用 Lightroom 调了下色调，加了点暖色。无人机摄影最爽的就是视角自由，地面拍不到的画面它都能拍到。', meta: '4天前 · 1200阅读', likes: 189, comments: 34, liked: false, images: 3, viewCount: 1200, authorId: 27, categoryId: cameraCat.id, createdAt: h(100), tags: ['无人机', '摄影', '风光'] },
    { title: '程序员的生产力工具栈分享', content: 'IDE：VS Code + JetBrains 全家桶。终端：Warp。笔记：Obsidian。任务管理：Todoist。浏览器：Arc。通讯：Slack + 微信。设计：Figma。这些工具配合起来效率非常高。', meta: '5天前 · 7800阅读', likes: 1890, comments: 567, liked: false, images: 0, viewCount: 7800, authorId: 12, categoryId: generalCat.id, createdAt: h(120), tags: ['程序员', '工具', '效率'] },
    { title: '小米 SU7 车机体验：比特斯拉好用多了', content: '开了一周小米 SU7，车机系统确实流畅。语音助手识别率很高，导航直接用高德，不用手机支架。CarPlay 也支持，但说实话用车机就够了。唯一的问题是第三方 App 太少。', meta: '5天前 · 9200阅读', likes: 2345, comments: 678, liked: false, images: 2, viewCount: 9200, authorId: 25, categoryId: generalCat.id, createdAt: h(125), tags: ['小米', '汽车', '车机'] },
    { title: 'DJI Air 3S 无人机开箱：轻便才是王道', content: '重量只有 249g，不用注册直接飞。画质比上代提升明显，特别是夜景。续航 46 分钟，实际飞行大概 35 分钟。避障系统也升级了，新手不容易炸机。如果你是入门用户，强烈推荐这款。', meta: '6天前 · 1900阅读', likes: 345, comments: 67, liked: false, images: 2, viewCount: 1900, authorId: 4, categoryId: cameraCat.id, createdAt: h(144), tags: ['DJI', '无人机', '开箱'] },
    { title: '二手 iPhone 选购指南：这些坑千万别踩', content: '第一，一定要查序列号，看是不是翻新机。第二，电池健康度低于 85% 的不要买。第三，面容 ID 坏的修起来很贵。第四，美版日版要注意有锁无锁。第五，最好当面交易，验机没问题再付款。', meta: '1周前 · 12000阅读', likes: 3456, comments: 890, liked: false, images: 0, viewCount: 12000, authorId: 26, categoryId: phoneCat.id, createdAt: h(168), tags: ['二手', 'iPhone', '避坑'] },
    { title: 'Vision Pro 用了一个月，说说真实体验', content: '优点：显示效果惊艳，空间视频很震撼，手势操作很直觉。缺点：太重了，戴一小时脖子酸；App 太少，很多都是 iPad App 放大版；价格太贵。总的来说，这是未来的产品，但现在还不够成熟。', meta: '1周前 · 15000阅读', likes: 4567, comments: 1234, liked: false, images: 3, viewCount: 15000, authorId: 18, categoryId: generalCat.id, createdAt: h(170), tags: ['Vision Pro', '苹果', '体验'] },
    { title: '2025 年最值得买的智能手表推荐', content: '1. 苹果用户：Apple Watch Series 10，没得选。2. 安卓用户：三星 Galaxy Watch 7，生态最全。3. 运动达人：佳明 Fenix 8，专业运动数据。4. 性价比：华为 Watch GT 5，续航两周。5. 颜值党：OPPO Watch X，设计最好看。', meta: '1周前 · 8700阅读', likes: 1890, comments: 456, liked: false, images: 0, viewCount: 8700, authorId: 20, categoryId: wearCat.id, createdAt: h(175), tags: ['智能手表', '推荐', '选购'] },
    { title: 'NAS 入门指南：为什么每个人都应该有一台', content: 'NAS 不只是存储，它是你的私人云盘、媒体中心、下载机、备份服务器。我用的群晖 DS923+，4 盘位，跑 Docker 轻松无压力。入门推荐两盘位的 DS223，够用了。', meta: '2周前 · 6500阅读', likes: 1234, comments: 345, liked: false, images: 2, viewCount: 6500, authorId: 15, categoryId: computerCat.id, createdAt: h(336), tags: ['NAS', '群晖', '存储'] },
    { title: '为什么我不推荐买 AirPods Max', content: '价格太贵，音质没有好到值这个价。重量太重，戴久了夹头。降噪不如索尼 XM6。没有防水，出汗就完蛋。充电口还是 Lightning（新款改了）。如果你真想买头戴式，索尼 WH-1000XM6 更值得。', meta: '2周前 · 11000阅读', likes: 2678, comments: 789, liked: false, images: 0, viewCount: 11000, authorId: 23, categoryId: headphoneCat.id, createdAt: h(340), tags: ['AirPods', '耳机', '吐槽'] },
    { title: '小米 15 长期使用报告：三个月后还值得买吗？', content: '三个月用下来，电池健康度还是 100%，MIUI 也更新了几次，bug 少了很多。拍照依然很强，特别是人像模式。唯一让我想换的原因是屏幕亮度在户外还是不太够。整体来说，这个价位最值得买的安卓旗舰。', meta: '2周前 · 7800阅读', likes: 1567, comments: 345, liked: false, images: 2, viewCount: 7800, authorId: 16, categoryId: phoneCat.id, createdAt: h(345), tags: ['小米', '长期使用', '评测'] }
  ];

  const createdPosts = [];
  for (const p of postsData) {
    const post = await prisma.post.create({
      data: {
        title: p.title,
        content: p.content,
        meta: p.meta,
        likes: p.likes,
        comments: p.comments,
        liked: p.liked,
        images: p.images,
        viewCount: p.viewCount,
        authorId: p.authorId,
        categoryId: p.categoryId,
        createdAt: p.createdAt,
        tags: { create: p.tags.map(tag => ({ tag })) }
      }
    });
    createdPosts.push(post);
  }

  // ========== 热门话题 ==========
  await prisma.trendingTopic.createMany({
    data: [
      { rank: 1, title: 'iPhone 17 系列体验报告', hot: '🔥 18.6万 讨论' },
      { rank: 2, title: '小米 15 Ultra 影像争议', hot: '🔥 12.3万 讨论' },
      { rank: 3, title: 'M5 芯片性能首测', hot: '🔥 9.1万 讨论' },
      { rank: 4, title: 'AirPods Pro 3 值不值得买', hot: '7.8万 讨论' },
      { rank: 5, title: 'Apple Watch 血压监测', hot: '6.2万 讨论' }
    ]
  });

  // ========== 热门标签 ==========
  await prisma.tag.createMany({
    data: [
      { tag: 'iPhone' }, { tag: '小米' }, { tag: 'Mac' }, { tag: 'AirPods' },
      { tag: '索尼' }, { tag: 'Apple Watch' }, { tag: '开箱' }, { tag: '对比' }
    ]
  });

  // ========== 消息 ==========
  await prisma.message.createMany({
    data: [
      { senderId: 3, recipientId: 1, preview: '赞了你发布的内容：iPhone 17 Pro 用了一周', time: '5分钟前', badge: 3, type: 'like' },
      { senderId: 5, recipientId: 1, preview: '评论：续航确实比 15 Pro 强太多了，我也有同感', time: '20分钟前', badge: 1, type: 'comment' },
      { senderId: 4, recipientId: 1, preview: '关注了你', time: '1小时前', type: 'follow' },
      { senderId: 6, recipientId: 1, preview: '评论：AirPods Pro 3 的触控问题我也遇到了，太烦了', time: '3小时前', badge: 2, type: 'comment' },
      { senderId: 7, recipientId: 1, preview: '你的帖子「iPhone 17 Pro 用了一周」被推荐至首页', time: '6小时前', badge: 1, type: 'system' },
      { senderId: 2, recipientId: 1, preview: '赞了你的评论：小米 15 Ultra 拍照确实不错', time: '昨天', type: 'like' }
    ]
  });

  // ========== 最近搜索 ==========
  await prisma.recentSearch.createMany({
    data: [
      { keyword: 'iPhone 17 Pro 续航' },
      { keyword: 'M5 Mac mini 值得买吗' },
      { keyword: 'AirPods Pro 3 降噪' },
      { keyword: '小米 15 Ultra 拍照' },
      { keyword: '2025 最佳蓝牙耳机' }
    ]
  });

  // ========== 评论 ==========
  await prisma.comment.createMany({
    data: [
      { userId: 3, postId: createdPosts[0].id, content: '续航提升是真的明显，我从 14 Pro 换过来感知更强', createdAt: h(1) },
      { userId: 5, postId: createdPosts[0].id, content: '液态玻璃看久了确实耐看，就是壳子不好买', createdAt: h(1.5) },
      { userId: 1, postId: createdPosts[2].id, content: '小米这次拍照确实进步很大，视频还是差口气', createdAt: h(5) },
      { userId: 6, postId: createdPosts[4].id, content: '触控误触的问题可以通过设置调灵敏度，你试试', createdAt: h(20) },
      { userId: 2, postId: createdPosts[7].id, content: '深有同感，生态绑定才是最大的护城河', createdAt: h(60) },
      { userId: 4, postId: createdPosts[1].id, content: '接口少了确实不方便，我现在 hub 不离身', createdAt: h(3) }
    ]
  });

  // ========== 收藏夹 ==========
  const defaultCollection = await prisma.favoriteCollection.create({ data: { userId: 1, name: '默认' } });
  const techCollection = await prisma.favoriteCollection.create({ data: { userId: 1, name: '深度好文' } });

  // ========== 收藏 ==========
  await prisma.favorite.createMany({
    data: [
      { userId: 1, postId: createdPosts[2].id, collectionId: defaultCollection.id },
      { userId: 1, postId: createdPosts[4].id, collectionId: defaultCollection.id },
      { userId: 1, postId: createdPosts[7].id, collectionId: techCollection.id }
    ]
  });

  // ========== 浏览历史 ==========
  await prisma.viewHistory.createMany({
    data: [
      { userId: 1, postId: createdPosts[0].id },
      { userId: 1, postId: createdPosts[1].id },
      { userId: 1, postId: createdPosts[2].id },
      { userId: 1, postId: createdPosts[4].id },
      { userId: 1, postId: createdPosts[7].id }
    ]
  });

  console.log('✅ 种子数据写入完成！');
}

main()
  .catch(e => {
    console.error('❌ 种子数据写入失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
