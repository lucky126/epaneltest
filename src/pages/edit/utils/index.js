// eslint-disable-next-line import/prefer-default-export
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
  