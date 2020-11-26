/**
 * Created by xijinling on 2017/7/1.
 */
// 问卷状态
export const QtnStatus = {
    0: "编辑中",
    2: "回收中",
    4: "已删除",
    5: "已结束"
  };
  
  // 题类型, type && selectType
  export const QTypes = {
    1: {
      name: "选择题",
      sub: {
        0: "单选题",
        1: "多选题",
        2: "评分单选题",
        13: "评分多选题",
        8: "下拉单选题",
        9: "图片选择题",
        11: "广告热点题"
        //12: '图片热点多选题' // TODO
        //10: '图片多选题',
      }
    },
    2: {
      name: "填空题",
      sub: {
        1: "填空题",
        2: "多项填空题",
        4: "地理位置题",
        3: "城市题",
        5: '单项滑块打分题',
        6: '多项滑块打分题'
      }
    },
    3: {
      name: "矩阵题",
      sub: {
        0: "矩阵单选题",
        1: "矩阵多选题",
        2: "矩阵量表题"
      }
    },
    4: {
      name: "排序题",
      sub: {
        0: "拖动排序题"
      }
    },
    6: {
      name: "过渡题",
      sub: {
        1: "描述说明"
      }
    },
    7: {
      name: "上传题",
      sub: {
        1: "上传题"
      }
    },
    8: {
      name: "量表题",
      sub: {
        2: "单项量表题",
        4: "多项量表题"
      }
    },
    11: {
      name: '日期时间题',
      sub: {
        1: '日期时间题'
      }
    },
    13: {
      name: "图片延时",
      sub: {
        9: "图片延时"
      }
    } /*,
  >>>>>>> questionCity
    9: {
      name: '指标题',
      sub: {
        1: '指标题'
      }
    },
    10: {
      name: '指标题',
      sub: {
        1: '指标题'
  
      }
    }*/
    /*14: {
      name: '地理位置题',
      sub: {
        2: '地理位置题'
      }
    }*/
    /*,
  =======
    } /*,
    12: {
      name: '城市题',
      sub: {
        1: '城市题'
      }
    }*/
  };
  
  export const QTypes2 = {
    2: {
      name: "填空题",
      sub: {
        1: "填空题"
      }
    },
    7: {
      name: "上传题",
      sub: {
        1: "上传题"
      }
    },
    9: {
      name: "指标题",
      sub: {
        0: "指标题"
      }
    },
    10: {
      name: "指标题",
      sub: {
        0: "指标题"
      }
    },
    11: {
      name: "日期时间题",
      sub: {
        1: "日期时间题"
      }
    }
  };
  
  export const QTypes3 = {
    1: {
      name: "选择题",
      sub: {
        0: "单选题",
        1: "多选题",
        8: "下拉单选题",
        9: "图片选择题"
        //11: '广告热点题'
        //12: '图片热点多选题' // TODO
        //10: '图片多选题',
      }
    },
    2: {
      name: "多项填空题",
      sub: {
        2: "多项填空题"
      }
    },
    3: {
      name: "矩阵题",
      sub: {
        0: "矩阵单选题",
        1: "矩阵多选题"
      }
    },
    4: {
      name: "排序题",
      sub: {
        0: "拖动排序题"
      }
    },
    6: {
      name: "过渡题",
      sub: {
        1: "描述说明"
      }
    },
    8: {
      name: "量表题",
      sub: {
        2: "单项打分题",
        4: "多项打分题"
      }
    }
  };
  
  export const VIEW_MODE = {
    MOBILE: "h5", //手机版样式
    PC: "pc" //pc版样式
  };
  
  export const MATRIX_PATTERN = {
    ROW: "patten_1", //按行显示选项，默认模式
    COLUMN: "patten_2"
  };
  
  export const MATRIX_THEME = {
    SPLIT: 0, //拆题显示，默认显示方式
    TABLE: 1 //表格显示
  };
  
  export const SCALE_GROUP = {
    GROUP_2: 2, //2级
    GROUP_3: 3, //3级
    GROUP_4: 4, //4级
    GROUP_5: 5, //5级
    GROUP_6: 6, //6级
    GROUP_7: 7, //7级
    GROUP_8: 8, //8级
    GROUP_9: 9, //9级
    GROUP_10: 10, //10级
    GROUP_11: 11, //11级
    GROUP_12: 12 //12级
  };
  
  export const SCALE_LOCATION = {
    LOCATION_NOT: -1, //无
    LOCATION_LEFT: 1, //左右两侧
    LOCATION_TOP: 2, //图形上方
    LOCATION_SIDE: 3 //上方两侧
  };
  
  export const SCALE_LOCATION2 = {
    LOCATION_SIDE: 2, //上方两侧
    LOCATION_TOP: 3 //图形上方
  };
  
  export const SCALE_PICKER = {
    STAR: 1, //星型
    SMILE: 2, //微笑
    HEART: 3, //心
    THUMB: 4, //大拇指
    SORRY: 5, //难过
    SLIDER: 6, //滑块
    LINE: 7 //连线
  };
  
  export const HOT_CANVAS_WIDTH = 760; //图片热点题画布大小
  
 
