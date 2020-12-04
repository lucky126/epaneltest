/**
 * data utils
 */
import { fromJS } from "immutable";
import { QTypes, QTypes2 } from "../../../config/enum";
import * as seq from "./seq";
import { getRandomInt } from "../lib/utils";

/**
 * convert qtn Map to payload from saveQuestionnaire API
 * @param qtn Map
 */
export function qtnToPayload(qtn,Version) {
  return {
    qtn: qtn.toJS(),
    logicVersion:Version.version
  };
}

/**
 * 从qtn中获取当前最大的fixSeq中的数字
 * 比如['Q1', 'Q3', 'Q2'] => 4
 * @param qtn Map
 */
function getNextFixSeq(qtn) {
  let maxFixSeq = seq.getMaxFixSeq();
  //console.log('maxFixSeq=' + maxFixSeq)
  maxFixSeq === 0 &&
    qtn.get("pageList").map(page => {
      page.get("qtList").map(question => {
        let fixSeq = (question.get("fixSeq") || "").replace(/[^\d]/g, "");
        fixSeq = parseInt(fixSeq) || 0;
        if (fixSeq > maxFixSeq) {
          maxFixSeq = fixSeq;
        }
      });
    });
  seq.setMaxFixSeq(maxFixSeq);
  return `Q${seq.getNextFixSeq()}`;
}

function getNextTargetFixSeq(qtn) {
  let maxFixSeq = seq.getMaxFixSeq();
  maxFixSeq === 0 &&
    qtn.get("pageList").map(page => {
      page.get("qtList").map(question => {
        let fixSeq = (question.get("fixSeq") || "").replace(/[^\d]/g, "");
        fixSeq = parseInt(fixSeq) || 0;
        if (fixSeq > maxFixSeq) {
          maxFixSeq = fixSeq;
        }
      });
    });
  seq.setMaxFixSeq(maxFixSeq);
  return `Q${seq.getNextFixSeq()}`;
}

/**
 * 从qtn中获取当前最大的fixSeq中的数字
 * 比如['Q1', 'Q3', 'Q2'] => 4
 * @param qtn Map
 */
export function setMaxFixSeq(qtn) {
  let maxFixSeq = 0;
  qtn.pageList.map(page => {
    //console.log(page.qtList)
    page.qtList.map(question => {
      //let fixSeq = (question.fixSeq || '').replace(/[^\d]/g, '')
      let seq = question.fixSeq || "";
      let seqNew =
        seq.indexOf("$") !== -1 ? seq.substr(0, seq.indexOf("$")) : seq;
      let fixSeq = seqNew.replace(/[^\d]/g, "");
      //console.log('question.fixSeq='+question.fixSeq+'fixSeq='+fixSeq)
      fixSeq = parseInt(fixSeq) || 0;
      if (fixSeq > maxFixSeq) {
        maxFixSeq = fixSeq;
      }
    });
  });
  //console.log('**maxFixSeq='+maxFixSeq)
  seq.setMaxFixSeq(maxFixSeq);
}

/**
 * 在state中根据题目序号查找是否有关联logic
 * 如果有，则返回第一个匹配上的logic
 * @premise
 * Q1
 * Q1(A1)
 */
export function findLogicByQt(premise, field = "qt") {
  const searchFun = item => item.get(field).indexOf(premise) > -1;
  return logic =>
    logic.get("source").find(searchFun) || logic.get("target").find(searchFun);
}

/**
 * 组装题目子问题
 * @param type  题目大类型
 * @param selectType 题目小类型
 * @param subSize子问题数
 */
export function initialSubData(type, subSize) {
  let conf = {},
    label = type === 4 ? "第1名" : "新子问题",
    seq = 1;
  const sub1 = {
    label: label,
    mySeq: "Z" + seq,
    seq: seq,
    required: true,
    qtPosition: 0,
    subPosition: 0,
    position: seq - 1,
    type: 0,
    smin: -1,
    smax: -1,
    isQuote: false,
    fixSeq: "Z" + seq,
    width: 0 //前端新增字段
  };
  let subs = [];
  for (let i = 1; i <= subSize; i++) {
    if (i === 1) {
      //添加第一个选项
      subs.push(sub1);
    } else {
      (label = type === 4 ? "第" + i + "名" : "新子问题"),
        subs.push(
          Object.assign({}, sub1, {
            label: label,
            fixSeq: "Z" + i,
            mySeq: "Z" + i,
            position: i - 1,
            seq: i
          })
        );
    }
  }
  return subs;
}

/**
 * 针对不同题的个性化初始值设置
 * @param type 题目类型
 * @param selectType 题目子类型
 */
function initialModifier(type, selectType) {
  return data => {
    switch (type) {
      case 6: //描述说明题
        return data.set("text", "输入描述信息");
      case 1:
        if (selectType === 11 || selectType === 12) {
          return data.update("opts", opts =>
            opts.map(opt =>
              opt.set("conf", {
                rect: {
                  x: 0,
                  y: 0,
                  width: 30,
                  height: 30,
                  d: "M0,0L30,0L30,30L0,30Z",
                  draggable: false,
                  value: "热点主题",
                  strokeWidth: 3,
                  stroke: "red",
                  fill: "none"
                },
                circle: {
                  cx: 30,
                  cy: 30,
                  r: 4,
                  strokeWidth: 2,
                  stroke: "white",
                  fill: "red",
                  display: "inline-block",
                  opacity: 1
                }
              })
            )
          );
        }
        return data;
      case 2: //填空题
        return data.update("opts", opts =>
          opts.map(opt =>
            opt
              .set("required", true)
              .set("fmt", "text")
              .set("conf", fromJS({ width: 20, height: 1 }))
              .set("label", selectType === 1 ? "" : "新选项")
          )
        );
      case 3: //矩阵题
        return data
          .update("opts", opts => opts.map(opt => opt.set("width", 0)))
          .set("conf", fromJS({subWidth:0.1,isSubWidth:true,isTitleWidth:true,titleWidth:1,CustomSubWidth:null,CustomTitleWidth:null}))
          .set("subs", initialSubData(3, 2));
      case 4: //排序题
        return data
          .set("subs", initialSubData(4, 2))
          .set("conf", fromJS({ topNumber: 2, leastNumber: 2 }));
      case 7: //图片上传题
        return data.update("opts", opts =>
          opts.map(opt => opt.set("label", ""))
        );
      case 8: //打分题
        if (selectType === 4) {
          //如果是多项打分题，那么有子问题
          return data
            .set("conf", fromJS({ group: 5, picker: 1, isQuestionWidth: true, isSubQuestionWidth: true, questionWidthVal: '100%', subQuestionWidthVal:'10%' }))
            .set("subs", initialSubData(8, 2));
        } else {
          return data.set("conf", fromJS({group: 5, location: 1, picker: 1, optWidth:0.1,isCheck:true,widthSet:null,isSetScore:false}));
        }
      default:
        return data;
    }
  };
}

/**
 * 组装题目选项
 * @param type  题目大类型
 * @param selectType 题目小类型
 * @param optSize
 */
export function initialOptData(type, selectType, optSize) {
  let conf = {},
    label = "新选项",
    seq = 1;
  switch (type) {
    case 2: //填空题
      label = selectType === 1 ? "" : "新选项";
      conf = { width: 20, height: 1 };
      break;
    case 3://矩阵量标题
      conf = { showLabel: true };
      label = selectType === 2 ? "非常不满意" : "新选项";
      break;
    case 7: //图片上传题
      label = "";
      break;
    case 8: //单项打分题
      conf = { showLabel: true };
      break;
    case 9: //指标题
      label = "有";
      break;
    case 10: //指标追问题
      label = "有";
      break;
    case 1:
      conf = (selectType === 2 || selectType ===13) ? {showLabel:true} :{};
      label = "新选项";
      break;
    default:
      label = "新选项";
  }
  const opt1 = {
    fixSeq: "A" + seq,
    fmt: "text",
    img: "",
    input: false,
    label,
    mySeq: "A" + seq,
    optQuote: false,
    position: seq - 1,
    required: false,
    seq,
    val: seq,
    value:seq,
    conf
  };
  let opts = [];
  if ((type === 1 && (selectType === 9 || selectType === 10)) || type === 6) {
    //图片选择题和描述说明没有选项
    return opts;
  }
  for (let i = 1; i <= optSize; i++) {
    if (i === 1) {
      //添加第一个选项
      opts.push(opt1);
    } else if (i == 2 && (type == 9 || type == 10)) {
      opts.push(
        Object.assign({}, opt1, {
          fixSeq: "A" + i,
          mySeq: "A" + i,
          position: i - 1,
          label: "无",
          seq: i,
          val: i,
          conf
        })
      );
    } else if (type === 8 && i !== optSize) {
      //非最后一个打分题选项的处理
      conf = { showLabel: false };
      opts.push(
        Object.assign({}, opt1, {
          fixSeq: "A" + i,
          mySeq: "A" + i,
          position: i - 1,
          label: "",
          seq: i,
          val: i,
          conf
        })
      );
    } else if(i === 5 && type === 3 && selectType === 2){
      conf = { showLabel: true };
      opts.push(
        Object.assign({}, opt1, {
          fixSeq: "A" + i,
          mySeq: "A" + i,
          position: i - 1,
          label: "非常满意",
          seq: i,
          val: i,
          conf
        })
      )
    }else if(i !== 5 && type === 3 && selectType === 2 && i !== 1){
      conf = { showLabel: false };
      opts.push(
        Object.assign({}, opt1, {
          fixSeq: "A" + i,
          mySeq: "A" + i,
          position: i - 1,
          label: "",
          seq: i,
          val: i,
          conf
        })
      )
    }else if(type === 1 && (selectType === 2 || selectType === 13)){
      //评分单项和评分多项增加显示选项属性
      conf = { showLabel: true };
      opts.push(
        Object.assign({}, opt1, {
          fixSeq: "A" + i,
          mySeq: "A" + i,
          position: i - 1,
          label: "新选项",
          seq: i,
          val: i,
          value:i,
          conf
        })
      );
    }else{
      //最后一个打分题或所有非打分题选项的处理
      opts.push(
        Object.assign({}, opt1, {
          fixSeq: "A" + i,
          mySeq: "A" + i,
          position: i - 1,
          seq: i,
          val: i
        })
      );
    }
  }
  return opts;
}

/**
 * 根据type和selectType获取初始化时的标题
 */
export function getInitialTitle(type, selectType) {
  if (type === 1) {
    if (selectType === 10) {
      return "图片多选题";
    } else if (selectType === 12) {
      return "热点多选题";
    }
  }
  return QTypes[type].sub[selectType];
  /*if(host == "tjc.epanel.cn"){
   return QTypes2[type].sub[selectType]
   }else {
   return QTypes[type].sub[selectType]
   }*/
}

export function getInitialTitle2(type, selectType) {
  /*const host = window.location.host
  if (type === 1) {
    if (selectType === 10) {
      return '图片多选题'
    } else if (selectType === 12) {
      return '热点多选题'
    }
  }*/
  return QTypes2[type].sub[selectType];
  /*if(host == "tjc.epanel.cn"){
   return QTypes2[type].sub[selectType]
   }else {
   return QTypes[type].sub[selectType]
   }*/
}

/**
 * 添加一个题目所需要的初始数据
 * @param type number 题目type
 * @param selectType number 题目子type
 * @param qtn Map
 */
export function getInitialData(type, selectType, qtn) {
  const qtnId = qtn.get("id");
  let fixSeq = getNextFixSeq(qtn);
  let opts = [];
  let conf = {};
  if (type === 1 && (selectType === 9 || selectType === 10)) {
    //图片选项题没有图片
    opts = [];
  } else if (
    //填空题、城市题、地理位置题、滑块打分题和图片上传题
    (type === 2 &&
      (selectType === 1 || selectType === 4 || selectType === 3)) || selectType === 5 ||
    type === 7
  ) {
    //填空题、城市题和图片上传题
    opts = initialOptData(type, selectType, 1);
  } else if (type === 8) {
    //打分题
    opts = initialOptData(type, selectType, 5);
    /*if(selectType === 4){
      console.log(2222)
      conf = { isQuestionWidth: true, isSubQuestionWidth: true, questionWidthVal: '100%', subQuestionWidthVal:'10%'};
    }*/
  } else if (type === 1 && (selectType === 11 || selectType === 12)) {
    opts = initialOptData(type, selectType, 1);
  } else if (type === 10) {
    fixSeq = getNextTargetFixSeq(qtn);
    opts = initialOptData(type, selectType, 2);
  } else if (type === 13) {
    opts = initialOptData(type, selectType, 0);
  } else if (type === 3 && selectType === 2){
    //矩阵量标题，初始化选项个数5
    opts = initialOptData(type, selectType, 5);
  }
  else{
    //其它题型
    opts = initialOptData(type, selectType, 2);
  }



  if (type === 9) {
    conf = { showExplain: true, targetExplain: "", targetLevel: 1 };
  }
  if (type === 2 && (selectType === 5 || selectType === 6)) {
    conf = {
      position: 1,
      sliderMin: 0,
      sliderMax: 100,
      score: 1,
      scoreSet: null,
      isShowScore: true,
      isShowDescribe: true,
      isTotalScore: false,
      describeBefore: '最小值',
      describeAfter: '最大值',
      totalScore: 100,
      optWidth: 0.1,
      isCheck: true,
      widthSet: null
    }
  }

  const initialData = {
    type, //题目类型
    selectType, //0-单选，1-多选，2-单选.量表.圆圈，3-单选.量表.星形，4-单选.量表.心形，5-单选.量表.笑脸，6-单选.量表.大拇指赞，7-单选.量表.滑块
    qtnId, //问卷编号
    fixSeq, //String，固定序号
    seq: 1, //用户序号
    disSeq: fixSeq, //String，用户序号
    cols: 1, //Integer,选项按几列显示
    conf: JSON.stringify(conf), //JSON, 题的个性化设置，JSON格式字符串
    disStatus: 0, //显示状态：0显示，1隐藏
    flag: 0, //是否甄别
    img: "", //String,题干图片
    isQuote: false, //是否引用
    mySeq: fixSeq, //String，题号
    optQuote: false, //true为选项引用，false为非选项引用
    opts,
    pattenId: "patten_1",
    position: 0, //选项出示规则
    qtPosition: 0, //位置
    quota: 0, //1为配额题,0为非配额题
    rank: false,
    required: true, //是否必答
    score: 1, //显示分值 1显示， 0不显示
    smax: opts.length,
    smin: 1,
    sort: false,
    subPosition: 0, //位置
    subQuote: false, //true为子问题引用，false为非子问题引用
    subs: [],
    text:
      type == 9 || type == 10 || type == 11
        ? getInitialTitle2(type, selectType)
        : getInitialTitle(type, selectType),
    id: getRandomInt(), //生成一个随机的id
    useStatus: 0 //可用状态：0可用，1为删除
  };

  const convertOpts = data =>
    data.set("opts", JSON.stringify(data.get("opts").toJS()));
  return fromJS(initialData)
    .update(initialModifier(type, selectType))
    .update(convertOpts)
    .toJS();
}