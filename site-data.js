const KEMESSER_PRODUCTS = [
  { id: "thawline", name: "ThawLINE", type: "管式细胞复苏仪", scenario: "冻存管、试管、西林瓶等管式样本", features: "四通道并行复苏 / 二级权限 / SD 卡数据存储 / PC 导出", url: "product-thawline.html" },
  { id: "thawline-pro", name: "ThawLINE Pro", type: "管式细胞复苏仪", scenario: "多人、多角色、多批次标准化实验室", features: "三级权限 / 运行方案 / 蓝牙打印 / 温度曲线", url: "product-thawline-pro.html" },
  { id: "thawwaker", name: "ThawWaker", type: "袋式细胞复苏仪", scenario: "冻存袋、细胞袋、血袋等袋式样本", features: "容量选择 / 热盖贴合 / STOP / 在线打印报告", url: "product-thawwaker.html" },
  { id: "thawhome-tube", name: "ThawHome 管式", type: "管式细胞复苏仪", scenario: "1.5ml-2.0ml 与 4.0ml-5.0ml 管式样本", features: "A/B 型槽 / 中英文界面 / 蜂鸣提醒 / 错误代码", url: "product-thawhome.html" },
  { id: "thawhome-bag", name: "ThawHome 袋式", type: "袋式细胞复苏仪", scenario: "50ml 冻存袋", features: "C 型槽 / 翻盖结构 / 快速复苏 / CE 认证", url: "product-thawhome-bag.html" },
  { id: "mobithaw", name: "MobiThaw", type: "便携式细胞复苏仪", scenario: "移动场景、小型实验室、临时处理", features: "Type-C 充电 / 无水化解冻 / 数据导出 / 臭氧杀菌", url: "product-mobithaw.html" },
  { id: "cellhome", name: "CellHome", type: "程序降温盒", scenario: "-80℃ 环境中的细胞程序降温", features: "无酒精 / 无液体介质 / 平均 -1℃/min / 可重复使用", url: "product-cellhome.html" },
  { id: "coolhome", name: "CoolHome", type: "无冰工作站", scenario: "冷冻操作与样本处理平台", features: "减少传统冰浴操作问题 / 可与模块配合", url: "product-coolhome.html" },
  { id: "holderhome", name: "HolderHome", type: "无冰冷冻箱", scenario: "样本低温暂存与操作配套", features: "低温暂存 / 无冰操作 / 台面使用", url: "product-holderhome.html" },
  { id: "blockhome", name: "BlockHome", type: "试管模块", scenario: "多规格试管、冻存管孔位适配", features: "模块化孔位 / 样本分区 / 批量操作", url: "product-blockhome.html" }
];

const KEMESSER_MANUALS = [
  { productId: "thawline", product: "ThawLINE", series: "复苏系列", type: "管式细胞复苏仪", language: "中文", version: "V1.0", updated: "2026-06-12", size: "1.4MB", file: "assets/manuals/thawline-zh.pdf" },
  { productId: "thawline", product: "ThawLINE", series: "复苏系列", type: "管式细胞复苏仪", language: "English", version: "V1.0", updated: "2026-06-12", size: "1.3MB", file: "assets/manuals/thawline-en.pdf" },
  { productId: "thawline-pro", product: "ThawLINE Pro", series: "复苏系列", type: "管式细胞复苏仪", language: "中文", version: "V1.0", updated: "2026-06-12", size: "2.2MB", file: "assets/manuals/thawline-pro-zh.pdf" },
  { productId: "thawline-pro", product: "ThawLINE Pro", series: "复苏系列", type: "管式细胞复苏仪", language: "English", version: "V1.0", updated: "2026-06-12", size: "1.7MB", file: "assets/manuals/thawline-pro-en.pdf" },
  { productId: "thawwaker", product: "ThawWaker", series: "复苏系列", type: "袋式细胞复苏仪", language: "中文", version: "V1.0", updated: "2026-06-12", size: "1.4MB", file: "assets/manuals/thawwaker-zh.pdf" },
  { productId: "thawwaker", product: "ThawWaker", series: "复苏系列", type: "袋式细胞复苏仪", language: "English", version: "V1.0", updated: "2026-06-12", size: "1.2MB", file: "assets/manuals/thawwaker-en.pdf" },
  { productId: "thawhome-tube", product: "ThawHome 管式", series: "复苏系列", type: "管式细胞复苏仪", language: "中文", version: "V1.0", updated: "2026-06-12", size: "1.2MB", file: "assets/manuals/thawhome-tube-zh.pdf" },
  { productId: "thawhome-tube", product: "ThawHome Tube", series: "复苏系列", type: "管式细胞复苏仪", language: "English", version: "V1.0", updated: "2026-06-12", size: "1.0MB", file: "assets/manuals/thawhome-tube-en.pdf" },
  { productId: "thawhome-bag", product: "ThawHome 袋式", series: "复苏系列", type: "袋式细胞复苏仪", language: "中文", version: "V1.0", updated: "2026-06-12", size: "1.1MB", file: "assets/manuals/thawhome-bag-zh.pdf" },
  { productId: "thawhome-bag", product: "ThawHome Bag", series: "复苏系列", type: "袋式细胞复苏仪", language: "English", version: "V1.0", updated: "2026-06-12", size: "964KB", file: "assets/manuals/thawhome-bag-en.pdf" },
  { productId: "cellhome", product: "CellHome", series: "冻存系列", type: "程序降温盒", language: "中文", version: "V1.0", updated: "2026-06-12", size: "368KB", file: "assets/manuals/cellhome-zh.pdf" },
  { productId: "cellhome", product: "CellHome", series: "冻存系列", type: "程序降温盒", language: "English", version: "V1.0", updated: "2026-06-12", size: "213KB", file: "assets/manuals/cellhome-en.pdf" }
];

window.KEMESSER_PRODUCTS = KEMESSER_PRODUCTS;
window.KEMESSER_MANUALS = KEMESSER_MANUALS;
