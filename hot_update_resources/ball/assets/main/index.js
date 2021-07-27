System.register("chunks:///_virtual/update-value-label.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, _decorator, Label;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "02566VN0PhN8o7NqZg0WyFs", "update-value-label", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let UpdateValueLabel = exports('UpdateValueLabel', (_dec = ccclass("UpdateValueLabel"), _dec(_class = (_temp = class UpdateValueLabel extends Label {
        constructor(...args) {
          super(...args);
          this.isPlaying = false;
          this.startVal = 0;
          this.endVal = 0;
          this.diffVal = 0;
          this.currTime = 0;
          this.changingTime = 0;
        }

        start() {// Your initialization goes here.
        }

        playUpdateValue(startVal, endVal, changingTime) {
          this.startVal = startVal;
          this.endVal = endVal;
          this.diffVal = this.endVal - this.startVal;
          this.currTime = 0;
          this.changingTime = changingTime;
          this.string = startVal.toString();
          this.isPlaying = true;
        }

        update(dt) {
          if (!this.isPlaying) {
            return;
          }

          if (this.currTime < this.changingTime) {
            this.currTime += dt;
            var currVal = this.startVal + parseInt((this.currTime / this.changingTime * this.diffVal).toString());

            if (currVal < this.startVal) {
              currVal = this.startVal;
            } else if (currVal > this.endVal) {
              currVal = this.endVal;
            }

            this.string = `${currVal}`;
            return;
          }

          this.string = `${this.endVal}`;
          this.isPlaying = false;
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetworkHelper.ts", ['cc', './GameManager.ts', './HttpHelper.ts'], function (exports) {
  'use strict';

  var cclegacy, GameManager, HttpHelper;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      GameManager = module.default;
    }, function (module) {
      HttpHelper = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "18bbeQdrYdPKa2AMLqCOz8O", "NetworkHelper", undefined);

      class NetworkHelper {
        // 构造函数
        constructor() {
          GameManager.logHelper.log(" NetworkHelper 启动... ");
          this.http = HttpHelper.sharedInstance();
        } // 单例


        static sharedInstance() {
          if (!this.networkHelper) {
            this.networkHelper = new NetworkHelper();
          }

          return this.networkHelper;
        }

      }

      exports('default', NetworkHelper);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/board-manager.ts", ['cc', './_rollupPluginModLoBabelHelpers.js', './constants.ts', './utils.ts'], function (exports) {
  'use strict';

  var cclegacy, Vec3, Prefab, _decorator, Component, instantiate, _applyDecoratedDescriptor, _initializerDefineProperty, Constants, utils;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      Component = module.Component;
      instantiate = module.instantiate;
    }, function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      Constants = module.Constants;
    }, function (module) {
      utils = module.utils;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "2a0a0QivvtEZodpOZ79qMFb", "board-manager", undefined);

      const {
        ccclass,
        property
      } = _decorator;

      const _tempPos = new Vec3();

      const _diamondPos = new Vec3();

      let BoardManager = exports('BoardManager', (_dec = ccclass("BoardManager"), _dec2 = property(Prefab), _dec3 = property(Prefab), _dec(_class = (_class2 = (_temp = class BoardManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "boardPrefab", _descriptor, this);

          _initializerDefineProperty(this, "diamondPrefab", _descriptor2, this);

          this.diamondSprintList = [];
          this.diamondCenterX = 0;
          this._boardList = [];
          this._boardInsIdx = 0;
        } // 当前实例编号


        start() {
          this.initBoard();
          this.initDiamond();
        } // 每次开始游戏板重置


        reset() {
          this._boardInsIdx = 0;
          Constants.game.initFirstBoard = false;
          let pos = Constants.BOARD_INIT_POS.clone();
          let board;
          const type = Constants.BOARD_TYPE.NORMAL;

          for (let i = 0; i < Constants.BOARD_NUM; i++) {
            board = this._boardList[i];
            board.reset(type, pos, 1);
            pos = this.getNextPos(board, 1);
          }

          board = this._boardList[0];
          board.isActive = true;
          Constants.game.ball.currBoard = board;

          if (this.diamondSprintList[0]) {
            for (var i = 0; i < Constants.DIAMOND_NUM; i++) {
              this.diamondSprintList[i].active = false;
            }
          }
        } // 板初始化


        initBoard() {
          for (let i = 0; i < Constants.BOARD_NUM; i++) {
            const node = instantiate(this.boardPrefab);
            node.name = this._boardInsIdx.toString();
            this._boardInsIdx++;
            this.node.addChild(node);
            const board = node.getComponent('Board');

            this._boardList.push(board);
          }

          this.reset();
        } // 游戏过程中新增板


        newBoard(newType, diffLevel) {
          const oldBoard = this._boardList[Constants.BOARD_NUM - 1];
          const pos = this.getNextPos(oldBoard, diffLevel, _tempPos);

          const board = this._boardList.shift();

          if (newType === Constants.BOARD_TYPE.SPRINT) {
            this.diamondCenterX = pos.x;
            this.setDiamond(pos);
            board.reset(newType, pos, 0);
          } else {
            board.reset(newType, pos, diffLevel);
          }

          board.name = this._boardInsIdx.toString();
          this._boardInsIdx++;

          this._boardList.push(board);
        } // 获得新板位置


        getNextPos(board, count, out) {
          const pos = out ? out.set(board.node.position) : board.node.position.clone();
          const o = utils.getDiffCoeff(count, 1, 2);
          pos.x = (Math.random() - .5) * Constants.SCENE_MAX_OFFSET_X * o;

          if (board.type === Constants.BOARD_TYPE.SPRINT) {
            pos.y += Constants.BOARD_GAP_SPRINT;
            pos.x = board.node.position.x;
          }

          if (board.type === Constants.BOARD_TYPE.SPRING) {
            pos.y += Constants.BOARD_GAP_SPRING;
          } else {
            pos.y += Constants.BOARD_GAP;
          }

          return pos;
        }

        initDiamond() {
          for (let i = 0; i < Constants.DIAMOND_NUM; i++) {
            this.diamondSprintList[i] = instantiate(this.diamondPrefab);
            this.node.addChild(this.diamondSprintList[i]);
            this.diamondSprintList[i].active = false;
          }
        }

        setDiamond(pos) {
          const position = pos.clone();
          position.y += Constants.BALL_JUMP_STEP_SPRINT * Constants.DIAMOND_START_FRAME;

          for (let i = 0; i < Constants.DIAMOND_NUM; i++) {
            this.setNextDiamondPos(position);
            this.diamondSprintList[i].setPosition(position);
            this.diamondSprintList[i].active = true;
          }
        }

        newDiamond() {
          _diamondPos.set(this.diamondSprintList[Constants.DIAMOND_NUM - 1].position);

          this.setNextDiamondPos(_diamondPos);
          const node = this.diamondSprintList.shift();
          node.setPosition(_diamondPos);
          node.active = true;
          this.diamondSprintList.push(node);
        }

        clearDiamond() {
          for (let i = 0; i < Constants.DIAMOND_NUM; i++) {
            this.diamondSprintList[i].active = false;
          }
        }

        setNextDiamondPos(pos) {
          pos.y += Constants.DIAMOND_SPRINT_STEP_Y;
          pos.x += 1.5 * (Math.random() - 0.5);

          if (pos.x > this.diamondCenterX + Constants.SCENE_MAX_OFFSET_X) {
            pos.x = this.diamondCenterX + Constants.SCENE_MAX_OFFSET_X;
          } else if (pos.x < this.diamondCenterX - Constants.SCENE_MAX_OFFSET_X) {
            pos.x = this.diamondCenterX - Constants.SCENE_MAX_OFFSET_X;
          }
        }

        getBoardList() {
          return this._boardList;
        }

        getDiamondSprintList() {
          return this.diamondSprintList;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "boardPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "diamondPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameManager.ts", ['cc', './StorageHelper.ts', './UtillHelper.ts', './LogerHelper.ts', './HotUpdateHelper.ts'], function (exports) {
  'use strict';

  var cclegacy, StorageHelper, UtillHelper, LogHelper, HotUpdateHelper;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      StorageHelper = module.default;
    }, function (module) {
      UtillHelper = module.default;
    }, function (module) {
      LogHelper = module.default;
    }, function (module) {
      HotUpdateHelper = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "2d3c1Do4PtLzIw/dm/1Z+DA", "GameManager", undefined);

      class GameManager {
        // 各种助手
        // 日志助手
        // 工具助手
        // 网络助手
        // 热更新助手
        // 存储助手
        // 构造函数
        constructor() {
          this.initHelpers();
        } // 驱动（单例）


        static drive() {
          if (!GameManager.gameManager) {
            GameManager.gameManager = new GameManager();
          }

          return GameManager.gameManager;
        } // 初始化各种助手


        initHelpers() {
          GameManager.logHelper = LogHelper.sharedInstance();
          GameManager.utilHelper = UtillHelper.sharedInstance();
          GameManager.hotUpdateHelper = HotUpdateHelper.sharedInstance();
          GameManager.storageHelper = StorageHelper.sharedInstance();
        } // 


        static stop() {// GameManager.logHelper = null;
          // GameManager.utilHelper = null;
          // GameManager.hotUpdateHelper = null;
          // GameManager.networkHelper = null;
          // GameManager.storageHelper = null;
        }

      }

      exports('default', GameManager);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/page-result.ts", ['cc', './update-value-label.ts', './_rollupPluginModLoBabelHelpers.js', './constants.ts', './revive.ts'], function (exports) {
  'use strict';

  var cclegacy, Node, _decorator, Component, UpdateValueLabel, _applyDecoratedDescriptor, _initializerDefineProperty, Constants, Revive;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      UpdateValueLabel = module.UpdateValueLabel;
    }, function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      Constants = module.Constants;
    }, function (module) {
      Revive = module.Revive;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

      cclegacy._RF.push({}, "31b007MqixM3YyJROFsTMEh", "page-result", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let PageResult = exports('PageResult', (_dec = ccclass("PageResult"), _dec2 = property({
        type: UpdateValueLabel
      }), _dec3 = property(Node), _dec4 = property(Node), _dec5 = property(Node), _dec(_class = (_class2 = (_temp = class PageResult extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "scoreLabel", _descriptor, this);

          this.targetProgress = 0;

          _initializerDefineProperty(this, "nodeTips1", _descriptor2, this);

          _initializerDefineProperty(this, "nodeTips2", _descriptor3, this);

          _initializerDefineProperty(this, "result", _descriptor4, this);
        }

        init() {
          this.targetProgress = 0;
          this.scoreLabel.playUpdateValue(this.targetProgress, this.targetProgress, 0);
          this.scoreLabel.isPlaying = false;
        }

        onEnable() {
          Constants.game.node.on(Constants.GAME_EVENT.HIDETIPS, this.hideTips, this);
          Constants.game.node.on(Constants.GAME_EVENT.ADDSCORE, this.addScore, this);
          Constants.game.node.on(Constants.GAME_EVENT.DYING, this.gameDie, this);
          this.showTips(true);
          this.showResult(false);
          this.init();
        }

        start() {
          const reviveComp = this.result.getComponent(Revive);
          reviveComp.pageResult = this;
        }

        onDisable() {
          Constants.game.node.off(Constants.GAME_EVENT.HIDETIPS, this.hideTips, this);
          Constants.game.node.off(Constants.GAME_EVENT.ADDSCORE, this.addScore, this);
        }

        addScore(score) {
          this.targetProgress = score;
          let curProgress = Number(this.scoreLabel.string);
          this.scoreLabel.playUpdateValue(curProgress, this.targetProgress, (this.targetProgress - curProgress) / 20);
        }

        gameDie() {
          this.showTips(false);
          this.showResult(true);
        }

        showTips(show) {
          this.nodeTips1.active = show;
          this.nodeTips2.active = show;
        }

        hideTips() {
          this.showTips(false);
        }

        showResult(isShow) {
          this.result.active = isShow;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "scoreLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "nodeTips1", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "nodeTips2", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "result", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/revive.ts", ['cc', './_rollupPluginModLoBabelHelpers.js', './constants.ts'], function (exports) {
  'use strict';

  var cclegacy, WidgetComponent, Label, SpriteComponent, _decorator, Component, _applyDecoratedDescriptor, _initializerDefineProperty, Constants;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      WidgetComponent = module.WidgetComponent;
      Label = module.Label;
      SpriteComponent = module.SpriteComponent;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      Constants = module.Constants;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

      cclegacy._RF.push({}, "37e87RwLXtA5LwGn6Zuq48u", "revive", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let Revive = exports('Revive', (_dec = ccclass("Revive"), _dec2 = property(WidgetComponent), _dec3 = property(Label), _dec4 = property({
        type: Label
      }), _dec5 = property({
        type: Label
      }), _dec6 = property(SpriteComponent), _dec(_class = (_class2 = (_temp = class Revive extends Component {
        constructor(...args) {
          super(...args);
          this.closeCb = null;

          _initializerDefineProperty(this, "wgMenu", _descriptor, this);

          _initializerDefineProperty(this, "historyLabel", _descriptor2, this);

          _initializerDefineProperty(this, "scoreLabel", _descriptor3, this);

          _initializerDefineProperty(this, "progressLabel", _descriptor4, this);

          _initializerDefineProperty(this, "spCountDown", _descriptor5, this);

          this.pageResult = null;
        }

        onEnable() {
          this.show();
        }

        show() {
          const score = Constants.game.score;
          this.scoreLabel.string = score.toString();

          if (Constants.MAX_SCORE < score) {
            Constants.MAX_SCORE = score;
          }

          this.historyLabel.string = Constants.MAX_SCORE.toString(); // this.closeCb = closeCallback;

          this.countDownTime = 5;
          this.progressLabel.string = this.countDownTime + '';
          this.currentTime = 0;
          this.spCountDown.fillRange = 1;
          this.isCountDowning = true;
        }

        onBtnReviveClick() {
          this.isCountDowning = false;
          Constants.game.audioManager.playClip();
          Constants.game.node.emit(Constants.GAME_EVENT.REVIVE);
          this.pageResult.showResult(false); // uiManager.instance.hideDialog('fight/revive');
        }

        onBtnSkipClick() {
          Constants.game.audioManager.playClip();
          this.isCountDowning = false; // uiManager.instance.hideDialog('fight/revive');
          // this.closeCb && this.closeCb();

          Constants.game.gameOver();
        }

        update(dt) {
          if (!this.isCountDowning) {
            return;
          }

          this.currentTime += dt;
          let spare = this.countDownTime - this.currentTime;
          this.progressLabel.string = Math.ceil(spare) + '';

          if (spare <= 0) {
            spare = 0; //触发倒计时结束

            this.isCountDowning = false;
            this.onBtnSkipClick();
          }

          let percent = spare / this.countDownTime; // 展示百分比

          this.spCountDown.fillRange = percent;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "wgMenu", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "historyLabel", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "scoreLabel", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "progressLabel", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "spCountDown", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/HotUpdateHelper.ts", ['cc', './HotUpdateConfig.ts', './GameManager.ts'], function (exports) {
  'use strict';

  var sys, game, cclegacy, HotUpdateConfig, GameManager;
  return {
    setters: [function (module) {
      sys = module.sys;
      game = module.game;
      cclegacy = module.cclegacy;
    }, function (module) {
      HotUpdateConfig = module.default;
    }, function (module) {
      GameManager = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "476460LcdxL/r5wdcwSoDvQ", "HotUpdateHelper", undefined);

      class HotUpdateHelper {
        // 资源管理器实例
        // 热更回调
        constructor() {
          this.hotUpdateResStoragePath = "";
          GameManager.logHelper.log(" HotUpdateHelper 启动... ");
          this.assetsManager = null;
          this.hotUpdateResStoragePath = "";
          this.retryCount = 0;
          this.init();
        } // 单例


        static sharedInstance() {
          if (!HotUpdateHelper.hotUpdateHelper) {
            HotUpdateHelper.hotUpdateHelper = new HotUpdateHelper();
          }

          return HotUpdateHelper.hotUpdateHelper;
        } // 初始化资源管理器


        init() {
          // 只在 native 环境下生效
          if (!sys.isNative) {
            return;
          } // 设置热更资源的存储路径


          this.hotUpdateResStoragePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + HotUpdateConfig.HOT_UPDATE_RES_STORAGE_PATH;
          GameManager.logHelper.log("热更资源存储路径为：" + this.hotUpdateResStoragePath); // 资源版本比较

          let resVersionCompareHandle = (clientResVersion, serverResVersion) => {
            GameManager.logHelper.log("客户端资源版本为：" + clientResVersion + " ，服务器资源版本为：" + serverResVersion); // 验证版本号

            let clientResVersionInfoArray = clientResVersion.split(HotUpdateConfig.HOP_UPDATE_RES_VERSION_SEPARATOR);
            let serverResVersionInfoArray = serverResVersion.split(HotUpdateConfig.HOP_UPDATE_RES_VERSION_SEPARATOR);

            for (let i = 0; i < clientResVersionInfoArray.length; ++i) {
              var _GameManager$utilHelp;

              if (!((_GameManager$utilHelp = GameManager.utilHelper) === null || _GameManager$utilHelp === void 0 ? void 0 : _GameManager$utilHelp.isNumber(clientResVersionInfoArray[i]))) {
                GameManager.logHelper.log("客户端资源版本号格式错误，请检查！");
                return 0;
              }
            }

            for (let i = 0; i < serverResVersionInfoArray.length; ++i) {
              var _GameManager$utilHelp2;

              if (!((_GameManager$utilHelp2 = GameManager.utilHelper) === null || _GameManager$utilHelp2 === void 0 ? void 0 : _GameManager$utilHelp2.isNumber(serverResVersionInfoArray[i]))) {
                GameManager.logHelper.log("服务端资源版本号格式错误，请检查！");
                return 0;
              }
            } // 比较版本号


            let versionItemCount = 0;

            if (serverResVersionInfoArray.length > clientResVersionInfoArray.length) {
              versionItemCount = serverResVersionInfoArray.length;
            } else {
              versionItemCount = clientResVersionInfoArray.length;
            }

            for (let i = 0; i < versionItemCount; ++i) {
              let clientVersionItem = clientResVersionInfoArray[i] ? parseInt(clientResVersionInfoArray[i]) : 0; // GameManager.logHelper.log("客户端第 " + i + " 位版本号为：" + clientVersionItem);

              var serverVersionItem = serverResVersionInfoArray[i] ? parseInt(serverResVersionInfoArray[i]) : 0; // GameManager.logHelper.log("服务端第 " + i + " 位版本号为：" + serverVersionItem);

              if (clientVersionItem == serverVersionItem) {
                continue;
              } else {
                return clientVersionItem - serverVersionItem;
              }
            }

            return 0;
          };

          if (!this.assetsManager) {
            this.assetsManager = new jsb.AssetsManager(HotUpdateConfig.HOT_UPDATE_LOCAL_MANIFEST_PATH, this.hotUpdateResStoragePath, resVersionCompareHandle);
          } // 更新事件回调


          this.assetsManager.setEventCallback(event => {
            switch (event.getEventCode()) {
              case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // 没有搜索到本地的配置文件
                GameManager.logHelper.log("未找到本地 manifest 文件，跳过热更新，进入游戏！");
                this.continueGame();
                break;

              case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                // 下载服务器上的配置文件出错
                GameManager.logHelper.log("下载资源比对配置文件失败，跳过热更新，进入游戏!");
                this.continueGame();
                break;

              case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                // 解析配置文件错误
                GameManager.logHelper.log("解析配置文件失败，跳过热更新，进入游戏！");
                this.continueGame();
                break;

              case jsb.EventAssetsManager.ERROR_UPDATING:
                // 更新出错
                GameManager.logHelper.log("资源 " + event.getAssetId() + " 更新出错，错误信息：" + event.getMessage() + " ，跳过热更新，进入游戏！");
                this.continueGame();
                break;

              case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                // 资源解压出错
                GameManager.logHelper.log("资源解压失败！错误信息为：" + event.getMessage() + "，跳过热更新，进入游戏！");
                this.continueGame();
                break;

              case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                // 已经是最新版本
                GameManager.logHelper.log("已经是最新版本！进入游戏！");
                this.continueGame();
                break;

              case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                // 发现新版本
                GameManager.logHelper.log("发现新版本！开始热更流程！" + event.getAssetId());
                setInterval(() => {
                  this.assetsManager.update();
                }, 5000);
                break;

              case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                // 更新中
                let assetId = event.getAssetId();

                if (assetId != HotUpdateConfig.HOT_UPDATE_VERSION_MANIFEST_ASSET_ID && assetId != HotUpdateConfig.HOT_UPDATE_PROJECT_MANIFEST_ASSET_ID) {
                  let currentProgress = event.getPercent();

                  if (String(currentProgress) == "NaN") {
                    currentProgress = 0;
                  } else {
                    currentProgress = parseFloat(currentProgress.toFixed(2));
                  }

                  GameManager.logHelper.log("更新中, 当前进度为：" + currentProgress);
                  let respData = {
                    needHotUpdate: true,
                    progress: currentProgress
                  };
                  this.hotUpdateCallback(respData);
                }

                break;

              case jsb.EventAssetsManager.ASSET_UPDATED:
                GameManager.logHelper.log("资源 " + event.getAssetId() + " 更新完成！");
                break;

              case jsb.EventAssetsManager.UPDATE_FINISHED:
                // 更新完成
                // 如果进度小于 100%， 强置成 100%
                let respData = {
                  needHotUpdate: true,
                  progress: 1
                };
                this.hotUpdateCallback(respData);
                GameManager.logHelper.log("更新完成, 重启游戏！");
                this.restartGame();
                break;

              case jsb.EventAssetsManager.UPDATE_FAILED:
                // 更新失败
                GameManager.logHelper.log("更新失败！ 错误信息为：" + event.getMessage());
                this.retryUpdate();
                break;
            }
          });
        } // 重新开始游戏


        restartGame() {
          var _GameManager$storageH; // 清空监听器


          this.assetsManager.setEventCallback(null); // 获取当前热更资源搜索路径

          let searchPaths = jsb.fileUtils.getSearchPaths();

          if (!searchPaths) {
            searchPaths = [];
          }

          GameManager.logHelper.log("当前热更资源搜索路径为：");
          GameManager.logHelper.log(searchPaths);

          if (searchPaths.length == 0 || searchPaths.indexOf(this.hotUpdateResStoragePath) == -1) {
            searchPaths.unshift(this.hotUpdateResStoragePath);
          }

          GameManager.logHelper.log("更新后的搜索路径为：");
          GameManager.logHelper.log(searchPaths);
          (_GameManager$storageH = GameManager.storageHelper) === null || _GameManager$storageH === void 0 ? void 0 : _GameManager$storageH.setItem(HotUpdateConfig.HOT_UPDATE_RES_SEARCH_PATHS_LOCAL_STORAGE_KEY, searchPaths);
          jsb.fileUtils.setSearchPaths(searchPaths); // 销毁 GameManager 各组件

          GameManager.stop();
          GameManager.logHelper.log("重启游戏！");
          game.restart();
        } // 重新尝试更新


        retryUpdate() {
          this.retryCount++;

          if (this.retryCount < HotUpdateConfig.HOT_UPDATE_RETRY_MAX_COUNT) {
            this.assetsManager.downloadFailedAssets();
          } else {
            GameManager.logHelper.log("已达到最大重试次数！");
            this.retryCount = 0;
            this.continueGame();
          }
        } // 继续游戏


        continueGame() {
          let respData = {
            needHotUpdate: false,
            progress: 100
          };

          if (this.hotUpdateCallback) {
            this.hotUpdateCallback(respData);
          } else {
            GameManager.logHelper.log("热更回调不存在，请检查！");
          }

          this.assetsManager.setEventCallback(null);
          return;
        } // 检查是否存在资源更新


        checkUpdate(hotUpdateCallback) {
          // 只在 native 环境下生效
          if (!sys.isNative) {
            return;
          }

          GameManager.logHelper.log("检测热更新...");

          if (!hotUpdateCallback) {
            GameManager.logHelper.log("参数错误，请检查！");
            return;
          }

          this.hotUpdateCallback = hotUpdateCallback; // 打印热更资源搜索路径

          let searchPaths = jsb.fileUtils.getSearchPaths();

          if (!searchPaths) {
            searchPaths = [];
          }

          GameManager.logHelper.log("热更资源搜索路径为：");
          GameManager.logHelper.log(searchPaths);
          this.assetsManager.checkUpdate();
        }

      }

      exports('default', HotUpdateHelper);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/StorageHelper.ts", ['cc', './GameManager.ts'], function (exports) {
  'use strict';

  var sys, cclegacy, GameManager;
  return {
    setters: [function (module) {
      sys = module.sys;
      cclegacy = module.cclegacy;
    }, function (module) {
      GameManager = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "4a29aKuprpJvq/yBXVzrayg", "StorageHelper", undefined);

      class StorageHelper {
        constructor() {
          GameManager.logHelper.log(" StorageHelper 启动... ");
        } // 单例


        static sharedInstance() {
          if (!StorageHelper.storageHelper) {
            StorageHelper.storageHelper = new StorageHelper();
          }

          return StorageHelper.storageHelper;
        } // 按 key 存储


        setItem(key, value) {
          if (key == null || key == undefined || value == null || value == undefined) {
            GameManager.logHelper.log("参数异常，请检查");
            return;
          } // 序列化


          let valueStr = "";

          if (typeof value == "object") {
            valueStr = JSON.stringify(value);
          } else {
            valueStr = value + "";
          }

          sys.localStorage.setItem(key, valueStr);
        } // 按 key 获取值


        getItem(key) {
          if (key == null || key == undefined) {
            GameManager.logHelper.log("参数异常，请检查");
            return "";
          }

          let valueStr = sys.localStorage.getItem(key);

          if (!valueStr) {
            valueStr = "";
          }

          return valueStr;
        } // 按 key 删除存储的值


        removeItem(key) {
          if (key == null || key == undefined) {
            GameManager.logHelper.log("参数异常，请检查");
            return;
          }

          sys.localStorage.removeItem(key);
        } // 清空存储区


        clear() {
          sys.localStorage.clear();
        }

      }

      exports('default', StorageHelper);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ui-manager.ts", ['cc', './_rollupPluginModLoBabelHelpers.js', './constants.ts'], function (exports) {
  'use strict';

  var cclegacy, Node, _decorator, Component, _applyDecoratedDescriptor, _initializerDefineProperty, Constants;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      Constants = module.Constants;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "4becfUEfe1C2prK7h8zxNvz", "ui-manager", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let UIManager = exports('UIManager', (_dec = ccclass("UIManager"), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = (_temp = class UIManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "pageStart", _descriptor, this);

          _initializerDefineProperty(this, "pageResult", _descriptor2, this);
        }

        onLoad() {
          Constants.game.uiManager = this;
        }

        start() {
          this.pageResult.active = false;
        }

        showDialog(isMain, ...args) {
          this.pageResult.active = !isMain;
          this.pageStart.active = isMain;
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "pageStart", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "pageResult", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/audio-manager.ts", ['cc', './_rollupPluginModLoBabelHelpers.js'], function (exports) {
  'use strict';

  var cclegacy, AudioClip, _decorator, Component, AudioSource, _applyDecoratedDescriptor, _initializerDefineProperty;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      AudioClip = module.AudioClip;
      _decorator = module._decorator;
      Component = module.Component;
      AudioSource = module.AudioSource;
    }, function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _temp;

      cclegacy._RF.push({}, "52ff6Qg0MlJaaUpLNS1HPTJ", "audio-manager", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let AudioManager = exports('AudioManager', (_dec = ccclass("AudioManager"), _dec2 = property(AudioClip), _dec3 = property(AudioClip), _dec(_class = (_class2 = (_temp = class AudioManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "bg", _descriptor, this);

          _initializerDefineProperty(this, "click", _descriptor2, this);

          this.audioComp = null;
        }

        start() {
          this.audioComp = this.getComponent(AudioSource);
        }

        playSound(play = true) {
          if (!play) {
            this.audioComp.stop();
            return;
          }

          this.audioComp.clip = this.bg;
          this.audioComp.play();
        }

        playClip() {
          this.audioComp.playOneShot(this.click);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bg", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "click", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/UtillHelper.ts", ['cc', './GameManager.ts'], function (exports) {
  'use strict';

  var cclegacy, GameManager;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      GameManager = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "5f6bbyi9P9DoLFfVFgR1hie", "UtillHelper", undefined);

      class UtillHelper {
        constructor() {
          GameManager.logHelper.log(" UtillHelper 启动... ");
        } // 单例


        static sharedInstance() {
          if (!UtillHelper.utilHelper) {
            UtillHelper.utilHelper = new UtillHelper();
          }

          return UtillHelper.utilHelper;
        } // 洗牌


        shuffle(array) {
          if (!array || array.length <= 0) {
            return;
          }

          let index = -1;
          let arrayLength = array.length;
          let lastIndex = arrayLength - 1;

          while (++index < arrayLength) {
            let randomNum = index + Math.floor(Math.random() * (lastIndex - index + 1));
            let value = array[randomNum];
            array[randomNum] = array[index];
            array[index] = value;
          }

          return array;
        } // 查询数组中，某个元素的个数


        checkItemNumInArray(item, array) {
          let count = 0;
          let remainingNum = 0;

          for (let i = 0; i < array.length; ++i) {
            if (array[i] == item) {
              count++;
            }
          }

          remainingNum = 4 - count;

          if (remainingNum < 0) {
            remainingNum = 0;
          }

          return remainingNum;
        } // 验证邮箱格式


        verifyEmailFormat(email) {
          let regExp = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$');
          let result = false;

          if (regExp.test(email)) {
            result = true;
          }

          return result;
        } // 判断一个字符串是否为 Json 格式


        isJsonObject(str) {
          if (!str) {
            GameManager.logHelper.log("isJsonObject 方法参数异常，请检查");
            return false;
          }

          let isJsonObject = false;

          try {
            let jsonObject = JSON.parse(str);

            if (jsonObject && typeof jsonObject == "object") {
              isJsonObject = true;
            }
          } catch (e) {
            isJsonObject = false;
          }

          return isJsonObject;
        } // 判断一个值是否为数字


        isNumber(value) {
          if (!value) {
            GameManager.logHelper.log("isNumber 方法 参数异常，请检查");
            return false;
          }

          if (!isNaN(value)) {
            return true;
          } else {
            return false;
          }
        }

      }

      exports('default', UtillHelper);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/HttpHelper.ts", ['cc', './NetworkConfig.ts'], function (exports) {
  'use strict';

  var cclegacy, NetworkConfig;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      NetworkConfig = module.default;
    }],
    execute: function () {
      cclegacy._RF.push({}, "66a5cCJmEhA6bVG5KnCpSq0", "HttpHelper", undefined);

      class HttpHelper {
        // XMLHttpRequest 实例
        // 最近一次的请求接口
        // 最后一次的请求数据
        // 发送请求的时间戳
        // 接收到响应的时间戳
        // 重连次数
        // 构造函数
        constructor() {
          this.xhr = new XMLHttpRequest();
          this.lastRequestPath = "";
          this.lastRequestData = null;
          this.lastSendRequestTime = 0;
          this.lastReceiveResponseTime = 0;
          this.reconnectCount = 0;
        } // 单例


        static sharedInstance() {
          if (this.httpHelper == null) {
            this.httpHelper = new HttpHelper();
          }

          return this.httpHelper;
        } // 发送 GET 请求


        sendGetRequest(path, data, handler) {
          if (!path) {
            console.log("参数异常，请检查！");
            return;
          } // 设置请求超时时长


          this.xhr.timeout = NetworkConfig.HTTP_TIMOUT; // 请求数据

          if (!data) {
            data = {};
          } // 保存最近一次的请求信息


          this.lastRequestPath = path;
          this.lastRequestData = data; // 拼接数据字符串

          let dataStr = "?";

          for (let key in data) {
            if (dataStr != "?") {
              dataStr += "&";
            }

            dataStr += key + "=" + data[key];
          } // 拼接完整的 url


          let url = NetworkConfig.HTTP_SCHEME + "://" + NetworkConfig.DYNAMIC_HTTP_HOST + ":" + NetworkConfig.DYNAMIC_HTTP_PORT + path + encodeURI(dataStr);
          console.log("====== 向 " + NetworkConfig.DYNAMIC_HTTP_HOST + ":" + NetworkConfig.DYNAMIC_HTTP_PORT + " 发送 GET 请求！======"); // console.log("请求接口为： " + path);
          // console.log("请求数据为： " + JSON.stringify(data));

          console.log("请求 url 为： " + url); // cc.log("请求接口为： " + path);

          this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState == 4) {
              console.log("xhr 状态码为: " + this.xhr.status);

              if (this.xhr.status >= 200 && this.xhr.status < 300) {
                this.reconnectCount = 0;
                this.lastReceiveResponseTime = Date.now();
                let respStr = this.xhr.responseText;
                console.log("接口 " + path + " 返回数据为：" + respStr + " ，耗时 " + (this.lastReceiveResponseTime - this.lastSendRequestTime) + " ms"); // 解析数据

                try {
                  let respJson = JSON.parse(respStr);

                  if (respJson) {
                    // 回调
                    if (handler) {
                      handler(respJson);
                    } else {
                      console.log("处理器不存在，请检查！");
                    }
                  }
                } catch (e) {
                  console.log("解析响应数据出错，错误信息为：" + e);
                  return;
                }
              } else {
                console.log("未能正确响应，重新向接口 " + path + " 发送请求！");
                setTimeout(() => {
                  this.retry();
                }, NetworkConfig.HTTP_RETRY_INTERVAL);
              }
            }
          };

          this.xhr.onerror = () => {
            console.log("请求接口 " + this.lastRequestPath + " 出错，请检查！");
          };

          this.xhr.ontimeout = () => {
            this.retry();
          };

          this.xhr.open("GET", url, true);
          this.xhr.send();
          this.lastSendRequestTime = Date.now();
        } // 发送 Post 请求


        sendPostRequest(path, data) {// TODO:
        } // 重试


        retry() {
          this.reconnectCount++;
          console.log("请求超时，当前重试次数为：" + this.reconnectCount);
          this.xhr.abort();
          this.sendGetRequest(this.lastRequestPath, this.lastRequestData);
        }

      }

      exports('default', HttpHelper);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/game.ts", ['cc', './_rollupPluginModLoBabelHelpers.js', './constants.ts', './board-manager.ts', './ui-manager.ts', './audio-manager.ts', './ball.ts', './camera-ctrl.ts'], function (exports) {
  'use strict';

  var cclegacy, Prefab, _decorator, Component, instantiate, _applyDecoratedDescriptor, _initializerDefineProperty, Constants, BoardManager, UIManager, AudioManager, Ball, CameraCtrl;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      Component = module.Component;
      instantiate = module.instantiate;
    }, function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      Constants = module.Constants;
    }, function (module) {
      BoardManager = module.BoardManager;
    }, function (module) {
      UIManager = module.UIManager;
    }, function (module) {
      AudioManager = module.AudioManager;
    }, function (module) {
      Ball = module.Ball;
    }, function (module) {
      CameraCtrl = module.CameraCtrl;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

      cclegacy._RF.push({}, "6b6999+5cFK4K47RCoawnB4", "game", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      /**
       * @zh 游戏管理类，同时也是事件监听核心对象。
       */

      let Game = exports('Game', (_dec = ccclass("Game"), _dec2 = property(Prefab), _dec3 = property(BoardManager), _dec4 = property(CameraCtrl), _dec5 = property(UIManager), _dec6 = property(AudioManager), _dec(_class = (_class2 = (_temp = class Game extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "ballPref", _descriptor, this);

          _initializerDefineProperty(this, "boardManager", _descriptor2, this);

          _initializerDefineProperty(this, "cameraCtrl", _descriptor3, this);

          _initializerDefineProperty(this, "uiManager", _descriptor4, this);

          _initializerDefineProperty(this, "audioManager", _descriptor5, this);

          this.initFirstBoard = false;
          this.state = Constants.GAME_STATE.READY;
          this.score = 0;
          this.hasRevive = false;
          this._ball = null;
        }

        get ball() {
          return this._ball;
        }

        __preload() {
          Constants.game = this;
        }

        onLoad() {
          if (!this.ballPref) {
            console.log('There is no ball!!');
            this.enabled = false;
            return;
          }

          const ball = instantiate(this.ballPref); // @ts-ignore

          ball.parent = this.node.parent;
          this._ball = ball.getComponent(Ball);
        }

        start() {
          this.node.on(Constants.GAME_EVENT.RESTART, this.gameStart, this);
          this.node.on(Constants.GAME_EVENT.REVIVE, this.gameRevive, this);
        }

        onDestroy() {
          this.node.off(Constants.GAME_EVENT.RESTART, this.gameStart, this);
          this.node.off(Constants.GAME_EVENT.REVIVE, this.gameRevive, this);
        }

        resetGame() {
          this.state = Constants.GAME_STATE.READY;

          this._ball.reset();

          this.cameraCtrl.reset();
          this.boardManager.reset();
          this.uiManager.showDialog(true);
        }

        gameStart() {
          this.audioManager.playSound();
          this.uiManager.showDialog(false);
          this.state = Constants.GAME_STATE.PLAYING;
          this.hasRevive = false;
          this.score = 0;
        }

        gameDie() {
          this.audioManager.playSound(false);
          this.state = Constants.GAME_STATE.PAUSE;

          if (!this.hasRevive) {
            this.node.emit(Constants.GAME_EVENT.DYING, () => {
              this.gameOver();
            });
          } else {
            this.gameOver();
          }
        }

        gameOver() {
          this.state = Constants.GAME_STATE.OVER;
          this.audioManager.playSound(false);
          this.resetGame();
        }

        gameRevive() {
          this.hasRevive = true;
          this.state = Constants.GAME_STATE.READY;
          this.ball.revive();
          this.scheduleOnce(() => {
            this.audioManager.playSound();
            this.state = Constants.GAME_STATE.PLAYING;
          }, 1);
        }

        addScore(score) {
          this.score += score;
          this.node.emit(Constants.GAME_EVENT.ADDSCORE, this.score);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ballPref", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "boardManager", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "cameraCtrl", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "uiManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "audioManager", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/page-start.ts", ['cc', './constants.ts'], function (exports) {
  'use strict';

  var cclegacy, Component, _decorator, Constants;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      _decorator = module._decorator;
    }, function (module) {
      Constants = module.Constants;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "75579oVThhNcJN3jNLu42YC", "page-start", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let PageStart = exports('PageStart', (_dec = ccclass("PageStart"), _dec(_class = class PageStart extends Component {
        gameStart() {
          Constants.game.node.emit(Constants.GAME_EVENT.RESTART);
          Constants.game.audioManager.playClip();
        }

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/LogerHelper.ts", ['cc'], function (exports) {
  'use strict';

  var log, cclegacy;
  return {
    setters: [function (module) {
      log = module.log;
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "81f98DIwlBD84eAsVKCUMMY", "LogerHelper", undefined);

      class LogHelper {
        constructor() {} // 单例


        static sharedInstance() {
          if (!LogHelper.logHelper) {
            LogHelper.logHelper = new LogHelper();
            LogHelper.logHelper.log(" LogHelper 启动... ");
          }

          return LogHelper.logHelper;
        } // 输出 log


        log(msg) {
          log(msg);
        }

      }

      exports('default', LogHelper);

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/migrate-canvas.ts", ['cc'], function () {
  'use strict';

  var cclegacy, director, Director, Canvas, Camera, game, Node;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
      Director = module.Director;
      Canvas = module.Canvas;
      Camera = module.Camera;
      game = module.game;
      Node = module.Node;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8a9552q+NRLy4Ru4WllseaG", "migrate-canvas", undefined);

      const customLayerMask = 0x000fffff;
      const builtinLayerMask = 0xfff00000;
      director.on(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
        var _director$getScene, _director$getScene2, _director$getScene3;

        const roots = (_director$getScene = director.getScene()) === null || _director$getScene === void 0 ? void 0 : _director$getScene.children;
        let allCanvases = (_director$getScene2 = director.getScene()) === null || _director$getScene2 === void 0 ? void 0 : _director$getScene2.getComponentsInChildren(Canvas);
        if (allCanvases.length <= 1) return;
        allCanvases = allCanvases.filter(x => !!x.cameraComponent);
        let allCameras = (_director$getScene3 = director.getScene()) === null || _director$getScene3 === void 0 ? void 0 : _director$getScene3.getComponentsInChildren(Camera);
        let usedLayer = 0;
        allCameras.forEach(x => usedLayer |= x.visibility & customLayerMask);
        const persistCanvas = [];

        for (let i = 0, l = roots.length; i < l; i++) {
          const root = roots[i];
          if (!game.isPersistRootNode(root)) continue;
          const canvases = root.getComponentsInChildren(Canvas);
          if (canvases.length === 0) continue;
          persistCanvas.push(...canvases.filter(x => !!x.cameraComponent));
        }

        persistCanvas.forEach(val => {
          const isLayerCollided = allCanvases.find(x => x !== val && x.cameraComponent.visibility & val.cameraComponent.visibility & customLayerMask);

          if (isLayerCollided) {
            const availableLayers = ~usedLayer;
            const lastAvailableLayer = availableLayers & ~(availableLayers - 1);
            val.cameraComponent.visibility = lastAvailableLayer | val.cameraComponent.visibility & builtinLayerMask;
            setChildrenLayer(val.node, lastAvailableLayer);
            usedLayer |= availableLayers;
          }
        });
      });

      function setChildrenLayer(node, layer) {
        for (let i = 0, l = node.children.length; i < l; i++) {
          node.children[i].layer = layer;
          setChildrenLayer(node.children[i], layer);
        }
      }

      let setParentEngine = Node.prototype.setParent;
      {
        Node.prototype.setParent = function (value, keepWorldTransform) {
          setParentEngine.call(this, value, keepWorldTransform);
          if (!value) return; // find canvas

          let layer = getCanvasCameraLayer(this);

          if (layer) {
            this.layer = layer;
            setChildrenLayer(this, layer);
          }
        };
      }

      function getCanvasCameraLayer(node) {
        let layer = 0;
        let canvas = node.getComponent(Canvas);

        if (canvas && canvas.cameraComponent) {
          if (canvas.cameraComponent.visibility & canvas.node.layer) {
            layer = canvas.node.layer;
          } else {
            layer = canvas.cameraComponent.visibility & ~(canvas.cameraComponent.visibility - 1);
          }

          return layer;
        }

        if (node.parent) {
          layer = getCanvasCameraLayer(node.parent);
        }

        return layer;
      }

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/HotUpdateConfig.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "8c0f8j5d4VNWKmYORzo6uR8", "HotUpdateConfig", undefined);

      class HotUpdateConfig {}

      exports('default', HotUpdateConfig);
      HotUpdateConfig.HOT_UPDATE_LOCAL_MANIFEST_PATH = "project.manifest";
      HotUpdateConfig.HOT_UPDATE_RES_STORAGE_PATH = "hot_update_res/";
      HotUpdateConfig.HOP_UPDATE_RES_VERSION_SEPARATOR = ".";
      HotUpdateConfig.HOT_UPDATE_RETRY_MAX_COUNT = 10;
      HotUpdateConfig.HOT_UPDATE_RES_SEARCH_PATHS_LOCAL_STORAGE_KEY = "HOT_UPDATE_RES_SEARCH_PATHS_LOCAL_STORAGE_KEY";
      HotUpdateConfig.HOT_UPDATE_VERSION_MANIFEST_ASSET_ID = "@version";
      HotUpdateConfig.HOT_UPDATE_PROJECT_MANIFEST_ASSET_ID = "@manifest";

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ball.ts", ['cc', './_rollupPluginModLoBabelHelpers.js', './constants.ts', './utils.ts', './pool-manager.ts'], function (exports) {
  'use strict';

  var cclegacy, Vec3, Prefab, _decorator, Component, Node, ParticleUtils, find, Camera, Label, Animation, ParticleSystem, _applyDecoratedDescriptor, _initializerDefineProperty, Constants, utils, PoolManager;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      Component = module.Component;
      Node = module.Node;
      ParticleUtils = module.ParticleUtils;
      find = module.find;
      Camera = module.Camera;
      Label = module.Label;
      Animation = module.Animation;
      ParticleSystem = module.ParticleSystem;
    }, function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      Constants = module.Constants;
    }, function (module) {
      utils = module.utils;
    }, function (module) {
      PoolManager = module.PoolManager;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

      cclegacy._RF.push({}, "900c8pQ81tCcrbRdvi9SxTB", "ball", undefined);

      const {
        ccclass,
        property
      } = _decorator; // 局部 vec3 变量复用

      const _tempPos = new Vec3();

      let Ball = exports('Ball', (_dec = ccclass("Ball"), _dec2 = property(Prefab), _dec3 = property({
        type: Prefab
      }), _dec4 = property({
        type: Prefab
      }), _dec(_class = (_class2 = (_temp = class Ball extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "diamondParticlePrefab", _descriptor, this);

          _initializerDefineProperty(this, "scoreAniPrefab", _descriptor2, this);

          _initializerDefineProperty(this, "trail02Prefab", _descriptor3, this);

          this.currBoard = null;
          this.boardCount = 0;
          this.jumpState = Constants.BALL_JUMP_STATE.JUMPUP;
          this.currBoardIdx = 0;
          this.diffLevel = 1;
          this.currJumpFrame = 0;
          this.hasSprint = false;
          this.isTouch = false;
          this.touchPosX = 0;
          this.movePosX = 0;
          this.isJumpSpring = false;
          this.boardGroupCount = 0;
          this.trailNode = null;
          this.timeScale = 0;
          this._wPos = new Vec3();
        }

        start() {
          Constants.game.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
          Constants.game.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          Constants.game.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          Constants.game.node.on(Constants.GAME_EVENT.RESTART, this.gameStart, this); // @ts-ignore
          // this.trailNode = PoolManager.instance.getNode(this.trail01Prefab, this.node.parent);

          this.updateBall();
          this.reset();
        }

        onDestroy() {
          Constants.game.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
          Constants.game.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
          Constants.game.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
          Constants.game.node.off(Constants.GAME_EVENT.RESTART, this.gameStart, this);
        }

        update(deltaTime) {
          this.timeScale = Math.floor(deltaTime / Constants.normalDt * 100) / 100;

          if (Constants.game.state === Constants.GAME_STATE.PLAYING) {
            const boardBox = Constants.game.boardManager;
            const boardList = boardBox.getBoardList();

            if (this.jumpState === Constants.BALL_JUMP_STATE.SPRINT) {
              // 冲刺状态结束后状态切换
              if (this.currJumpFrame > Constants.BALL_JUMP_FRAMES_SPRINT) {
                this.jumpState = Constants.BALL_JUMP_STATE.JUMPUP;
                this.isJumpSpring = false;
                this.currJumpFrame = 0;
                this.hasSprint = false; // const eulerAngles = this.node.eulerAngles;
                // this.node.eulerAngles = new Vec3(eulerAngles.x, -Constants.BALL_SPRINT_STEP_Y, eulerAngles.z);

                boardBox.clearDiamond();
              }

              this.currJumpFrame += this.timeScale;
              const diamondSprintList = boardBox.getDiamondSprintList();

              for (let i = 0; i < Constants.DIAMOND_NUM; i++) {
                if (Math.abs(this.node.position.y - diamondSprintList[i].position.y) <= Constants.DIAMOND_SPRINT_SCORE_AREA && Math.abs(this.node.position.x - diamondSprintList[i].position.x) <= Constants.DIAMOND_SPRINT_SCORE_AREA) {
                  Constants.game.addScore(Constants.DIAMOND_SCORE);
                  this.showScore(Constants.DIAMOND_SCORE);
                  Constants.game.ball.playDiamondParticle(this.node.position);
                  diamondSprintList[i].active = false;
                }
              }

              this.setPosY();
              this.setPosX(); // this.setRotY();

              this.touchPosX = this.movePosX;
              const y = this.node.position.y + Constants.CAMERA_OFFSET_Y_SPRINT;
              Constants.game.cameraCtrl.setOriginPosY(y);
            } else {
              for (let i = this.currBoardIdx + 1; i >= 0; i--) {
                const board = boardList[i];
                const pos = this.node.position;
                const boardPos = boardList[i].node.position;

                if (Math.abs(pos.x - boardPos.x) <= boardList[i].getRadius() && Math.abs(pos.y - (boardPos.y + Constants.BOARD_HEIGTH)) <= Constants.DIAMOND_SCORE_AREA) {
                  boardList[i].checkDiamond(pos.x);
                } // 超过当前跳板应该弹跳高度，开始下降


                if (this.jumpState === Constants.BALL_JUMP_STATE.FALLDOWN) {
                  if (this.currJumpFrame > Constants.PLAYER_MAX_DOWN_FRAMES || this.currBoard.node.position.y - pos.y - (Constants.BOARD_GAP + Constants.BOARD_HEIGTH) > 0.001) {
                    ParticleUtils.stop(this.trailNode);
                    Constants.game.gameDie();
                    return;
                  } // 是否在当前检测的板上


                  if (this.isOnBoard(board)) {
                    this.currBoard = board;
                    this.currBoardIdx = i;
                    this.activeCurrBoard();
                    break;
                  }
                }
              }

              this.currJumpFrame += this.timeScale;

              if (this.jumpState === Constants.BALL_JUMP_STATE.JUMPUP) {
                if (this.isJumpSpring && this.currJumpFrame >= Constants.BALL_JUMP_FRAMES_SPRING) {
                  // 处于跳跃状态并且当前跳跃高度超过弹簧板跳跃高度
                  this.jumpState = Constants.BALL_JUMP_STATE.FALLDOWN;
                  this.currJumpFrame = 0;
                } else {
                  if (!this.isJumpSpring && this.currJumpFrame >= Constants.BALL_JUMP_FRAMES) {
                    // 跳跃距离达到限制，开始下落
                    this.jumpState = Constants.BALL_JUMP_STATE.FALLDOWN;
                    this.currJumpFrame = 0;
                  }
                }
              }

              this.setPosY();
              this.setPosX(); // this.setRotZ();

              if (this.currBoard.type !== Constants.BOARD_TYPE.SPRINT) {
                Constants.game.cameraCtrl.setOriginPosX(this.node.position.x);
              }

              this.touchPosX = this.movePosX;
            }

            this.setTrailPos();
          }
        }

        onTouchStart(touch, event) {
          this.isTouch = true;
          this.touchPosX = touch.getLocation().x;
          this.movePosX = this.touchPosX;
        }

        onTouchMove(touch, event) {
          this.movePosX = touch.getLocation().x;
        }

        onTouchEnd(touch, event) {
          this.isTouch = false;
        }

        gameStart() {
          this.playTrail();
        }

        reset() {
          this.boardCount = 0;
          this.diffLevel = 1;

          _tempPos.set(Constants.BOARD_INIT_POS);

          _tempPos.y += Constants.BALL_RADIUS + Constants.BOARD_HEIGTH / 2 - .001;
          this.node.setPosition(_tempPos);
          this.node.eulerAngles = new Vec3();
          this.currJumpFrame = 0;
          this.jumpState = Constants.BALL_JUMP_STATE.FALLDOWN;
          this.hasSprint = false;
          this.currBoardIdx = 0;
          this.show();
          this.setTrailPos();
        }

        updateBall() {
          // PoolManager.instance.putNode(this.trailNode);
          // @ts-ignore
          this.trailNode = PoolManager.instance.getNode(this.trail02Prefab, this.node.parent);
        }

        show() {
          this.node.active = true;
        }

        hide() {
          this.node.active = false;
        }

        activeCurrBoard() {
          const pos = this.node.position;
          const boardPos = this.currBoard.node.position;
          const boardType = this.currBoard.type;
          const y = boardPos.y + Constants.BALL_RADIUS + this.currBoard.getHeight() / 2 - .01;
          this.node.setPosition(pos.x, y, pos.z);
          this.currJumpFrame = 0;

          if (boardType === Constants.BOARD_TYPE.SPRINT) {
            this.jumpState = Constants.BALL_JUMP_STATE.SPRINT; // this.node.eulerAngles = new Vec3(this.node.eulerAngles.x, this.node.eulerAngles.y, 0);

            Constants.game.cameraCtrl.setOriginPosX(boardPos.x);
          } else {
            this.jumpState = Constants.BALL_JUMP_STATE.JUMPUP;
          }

          if (!this.currBoard.isActive) {
            this.currBoard.isActive = true;
            let score = Constants.SCORE_BOARD_NOT_CENTER;

            if (boardType !== Constants.BOARD_TYPE.NORMAL && boardType !== Constants.BOARD_TYPE.DROP || Math.abs(pos.x - boardPos.x) <= Constants.BOARD_RADIUS_CENTER) {
              score = Constants.SCORE_BOARD_CENTER;
            }

            Constants.game.addScore(score);
            this.showScore(score);
            this.boardCount++;

            if (this.boardCount === 5) {
              Constants.game.node.emit(Constants.GAME_EVENT.HIDETIPS);
            }

            this.diffLevel += score / 2;

            for (let l = this.currBoardIdx - Constants.BOARD_NEW_INDEX; l > 0; l--) {
              this.newBoard();
            }
          }

          this.isJumpSpring = boardType === Constants.BOARD_TYPE.SPRING;
          this.currBoard.setBump();
          this.currBoard.setWave();

          if (boardType == Constants.BOARD_TYPE.SPRING || boardType == Constants.BOARD_TYPE.SPRINT) {
            this.currBoard.setSpring();
          } // 掉落板开始掉落


          const boardList = Constants.game.boardManager.getBoardList();

          if (boardType === Constants.BOARD_TYPE.DROP) {
            for (let l = 0; l < this.currBoardIdx; l++) {
              boardList[l].setDrop();
            }
          }

          const c = boardPos.y + Constants.CAMERA_OFFSET_Y;
          Constants.game.cameraCtrl.setOriginPosY(c);
          Constants.game.cameraCtrl.preType = boardType;
        } // 创建新跳板信息


        newBoard() {
          let type = Constants.BOARD_TYPE.NORMAL;

          if (this.boardGroupCount <= 0) {
            const coeff = utils.getDiffCoeff(this.diffLevel, 1, 10);
            const t = Math.random() * coeff;

            if (t < 4.2) {
              type = Constants.BOARD_TYPE.NORMAL;
              this.boardGroupCount = 2;
            } else if (t <= 5.5) {
              type = Constants.BOARD_TYPE.GIANT;
              this.boardGroupCount = 3;
            } else if (t <= 6.2) {
              type = Constants.BOARD_TYPE.SPRING;

              if (Math.random() > 0.5) {
                this.boardGroupCount = 2;
              }
            } else if (t <= 7) {
              type = Constants.BOARD_TYPE.DROP;
              this.boardGroupCount = 3;
            } else if (t <= 7.5 && false === this.hasSprint) {
              type = Constants.BOARD_TYPE.SPRINT;
              this.hasSprint = true;
            } else {
              type = Constants.BOARD_TYPE.NORMAL;
            }
          }

          this.boardGroupCount--;
          Constants.game.boardManager.newBoard(type, this.diffLevel);
        } // 界面上的弹跳分数


        showScore(score) {
          const node = PoolManager.instance.getNode(this.scoreAniPrefab, find('Canvas/resultUI'));
          const pos = new Vec3();
          const cameraComp = Constants.game.cameraCtrl.node.getComponent(Camera);

          this._wPos.set(this.node.worldPosition);

          cameraComp.convertToUINode(this._wPos, find('Canvas/resultUI'), pos);
          pos.x += 50;
          node.setPosition(pos);
          node.getComponentInChildren(Label).string = `+${score}`;
          const animationComponent = node.getComponent(Animation);
          animationComponent.once(Animation.EventType.FINISHED, () => {
            PoolManager.instance.putNode(node);
          });
          animationComponent.play();
        }

        setPosX() {
          if (this.isTouch && this.touchPosX !== this.movePosX) {
            _tempPos.set(this.node.position);

            if (this.jumpState === Constants.BALL_JUMP_STATE.SPRINT) {
              let x = (this.movePosX - this.touchPosX) * Constants.COEFF_POS_BALL;
              this.node.setPosition(_tempPos.x + x, _tempPos.y, _tempPos.z);

              _tempPos.set(this.node.position);

              x = _tempPos.x;
              let t = 1.3 * Constants.SCENE_MAX_OFFSET_X;
              const currBoardPos = this.currBoard.node.position;

              if (x > currBoardPos.x + t) {
                this.node.setPosition(currBoardPos.x + t, _tempPos.y, _tempPos.z);
              } else if (x < this.currBoard.node.position.x - t) {
                this.node.setPosition(currBoardPos.x - t, _tempPos.y, _tempPos.z);
              }
            } else {
              const x = (this.movePosX - this.touchPosX) * Constants.COEFF_POS_BALL;
              this.node.setPosition(_tempPos.x + x, _tempPos.y, _tempPos.z);
            }
          }
        } // 垂直位置变化，每帧变动


        setPosY() {
          _tempPos.set(this.node.position); // 跳跃状态处理


          if (this.jumpState === Constants.BALL_JUMP_STATE.JUMPUP) {
            if (this.isJumpSpring) {
              _tempPos.y += Constants.BALL_JUMP_STEP_SPRING[Math.floor(this.currJumpFrame / 3)] * this.timeScale;
            } else {
              _tempPos.y += Constants.BALL_JUMP_STEP[Math.floor(this.currJumpFrame / 2)] * this.timeScale;
            }

            this.node.setPosition(_tempPos); // 下落状态处理
          } else if (this.jumpState === Constants.BALL_JUMP_STATE.FALLDOWN) {
            if (this.currBoard.type === Constants.BOARD_TYPE.SPRING) {
              if (this.currJumpFrame < Constants.BALL_JUMP_FRAMES_SPRING) {
                const step = Constants.BALL_JUMP_FRAMES_SPRING - this.currJumpFrame - 1;
                _tempPos.y -= Constants.BALL_JUMP_STEP_SPRING[Math.floor((step >= 0 ? step : 0) / 3)] * this.timeScale;
              } else {
                _tempPos.y -= Constants.BALL_JUMP_STEP_SPRING[0] * this.timeScale;
              }
            } else if (this.currJumpFrame < Constants.BALL_JUMP_FRAMES) {
              const step = Constants.BALL_JUMP_FRAMES - this.currJumpFrame - 1;
              _tempPos.y -= Constants.BALL_JUMP_STEP[Math.floor((step >= 0 ? step : 0) / 2)] * this.timeScale;
            } else {
              _tempPos.y -= Constants.BALL_JUMP_STEP[0] * this.timeScale;
            }

            this.node.setPosition(_tempPos); // 冲刺跳跃状态处理
          } else if (this.jumpState === Constants.BALL_JUMP_STATE.SPRINT) {
            _tempPos.y += Constants.BALL_JUMP_STEP_SPRINT * this.timeScale;
            this.node.setPosition(_tempPos);

            if (this.currJumpFrame >= Constants.DIAMOND_START_FRAME + 20 && this.currJumpFrame <= Constants.BALL_JUMP_FRAMES_SPRINT - 50 && Math.floor(this.currJumpFrame) % Math.floor(Constants.DIAMOND_SPRINT_STEP_Y / Constants.BALL_JUMP_STEP_SPRINT) == 0) {
              Constants.game.boardManager.newDiamond();
            }
          }
        } // 当前处于哪块板子上


        isOnBoard(board) {
          const pos = this.node.position;
          const boardPos = board.node.position;
          const x = Math.abs(pos.x - boardPos.x);
          const y = pos.y - boardPos.y; // 在板子的半径内

          if (x <= board.getRadius()) {
            if (y >= 0 && y <= Constants.BALL_RADIUS + board.getHeight() / 2) {
              return true;
            } // 处于下落状态


            if (this.isJumpSpring && this.currJumpFrame >= Constants.BALL_JUMP_FRAMES_SPRING) {
              // 是否处于反弹后的第一次匀减速范围内
              if (Math.abs(y) < Constants.BALL_JUMP_STEP_SPRING[0]) {
                return true;
              }
            } else if (!this.isJumpSpring && this.currJumpFrame >= Constants.BALL_JUMP_FRAMES) {
              if (Math.abs(y) < Constants.BALL_JUMP_STEP[0]) {
                return true;
              }
            }
          }

          return false;
        }

        revive() {
          this.currBoardIdx--;

          if (this.currBoard.type === Constants.BOARD_TYPE.SPRINT) {
            this.currBoardIdx++;
            this.currBoard = Constants.game.boardManager.getBoardList()[this.currBoardIdx];
          }

          this.currBoard.revive();
          const pos = this.currBoard.node.position.clone();
          pos.y += Constants.BALL_RADIUS + this.currBoard.getHeight() / 2 - .001;
          this.node.setPosition(pos);
          this.node.eulerAngles = new Vec3(0, 0, 0);
          this.currJumpFrame = 0;
          this.show();
          const y = this.currBoard.node.position.y + Constants.CAMERA_OFFSET_Y;
          Constants.game.cameraCtrl.setOriginPosX(pos.x);
          Constants.game.cameraCtrl.setOriginPosY(y);
          this.playTrail();
          this.setTrailPos();
        }

        playDiamondParticle(pos) {
          // @ts-ignore
          const diamondParticle = PoolManager.instance.getNode(this.diamondParticlePrefab, this.node.parent);
          diamondParticle.setPosition(pos);
          const particleSystemComp = diamondParticle.getComponent(ParticleSystem);
          particleSystemComp.play();

          const fun = () => {
            if (!particleSystemComp.isPlaying) {
              PoolManager.instance.putNode(diamondParticle);
              this.unschedule(fun);
            }
          };

          this.schedule(fun, 0.1);
        }

        playTrail() {
          ParticleUtils.play(this.trailNode);
        }

        setTrailPos() {
          const pos = this.node.position;
          this.trailNode.setPosition(pos.x, pos.y - 0.1, pos.z);
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "diamondParticlePrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "scoreAniPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "trail02Prefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/camera-ctrl.ts", ['cc', './_rollupPluginModLoBabelHelpers.js', './constants.ts'], function (exports) {
  'use strict';

  var cclegacy, Vec3, Node, _decorator, Component, _applyDecoratedDescriptor, _initializerDefineProperty, Constants;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      Node = module.Node;
      _decorator = module._decorator;
      Component = module.Component;
    }, function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      Constants = module.Constants;
    }],
    execute: function () {
      var _dec, _dec2, _class, _class2, _descriptor, _temp;

      cclegacy._RF.push({}, "b5204GgQaBDNqMtOdI4KDJl", "camera-ctrl", undefined);

      const {
        ccclass,
        property
      } = _decorator;

      const _tempPos = new Vec3();

      let CameraCtrl = exports('CameraCtrl', (_dec = ccclass("CameraCtrl"), _dec2 = property(Node), _dec(_class = (_class2 = (_temp = class CameraCtrl extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "planeNode", _descriptor, this);

          this.preType = Constants.BOARD_TYPE.NORMAL;
          this._originPos = new Vec3();
        }

        start() {
          this._originPos.set(Constants.CAMERA_INIT_POS);

          this.setPosition(this._originPos);
          this.node.eulerAngles = Constants.CAMERA_INIT_ROT;
        }

        setOriginPosX(val) {
          this._originPos.x = val;
        }

        setOriginPosY(val) {
          this._originPos.y = val;
        }

        update() {
          _tempPos.set(this.node.position);

          if (_tempPos.x === this._originPos.x && _tempPos.y === this._originPos.y) {
            return;
          } // 横向位置误差纠正


          if (Math.abs(_tempPos.x - this._originPos.x) <= Constants.CAMERA_MOVE_MINI_ERR) {
            _tempPos.x = this._originPos.x;
            this.setPosition(_tempPos);
          } else {
            const x = this._originPos.x - _tempPos.x;
            _tempPos.x += x / Constants.CAMERA_MOVE_X_FRAMES;
            this.setPosition(_tempPos);
          }

          _tempPos.set(this.node.position); // 纵向位置误差纠正


          if (Math.abs(_tempPos.y - this._originPos.y) <= Constants.CAMERA_MOVE_MINI_ERR) {
            _tempPos.y = this._originPos.y;
            this.setPosition(_tempPos);
          } else {
            const y = this._originPos.y - _tempPos.y;

            if (this.preType === Constants.BOARD_TYPE.SPRING) {
              _tempPos.y += y / Constants.CAMERA_MOVE_Y_FRAMES_SPRING;
              this.setPosition(_tempPos);
            } else {
              _tempPos.y += y / Constants.CAMERA_MOVE_Y_FRAMES;
              this.setPosition(_tempPos);
            }
          }
        } // 相机的默认位置


        reset() {
          this._originPos.set(Constants.CAMERA_INIT_POS);

          this.setPosition(this._originPos);
        } // 相机更新的同时更新背景板


        setPosition(position) {
          this.node.setPosition(position);
          const y = position.y - 27;
          this.planeNode.setPosition(position.x, y, -100);
        }

      }, _temp), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "planeNode", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/board.ts", ['cc', './_rollupPluginModLoBabelHelpers.js', './constants.ts', './utils.ts'], function (exports) {
  'use strict';

  var cclegacy, Vec3, Prefab, _decorator, Component, instantiate, MeshRenderer, Color, _applyDecoratedDescriptor, _initializerDefineProperty, Constants, utils;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
      Prefab = module.Prefab;
      _decorator = module._decorator;
      Component = module.Component;
      instantiate = module.instantiate;
      MeshRenderer = module.MeshRenderer;
      Color = module.Color;
    }, function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _initializerDefineProperty = module.initializerDefineProperty;
    }, function (module) {
      Constants = module.Constants;
    }, function (module) {
      utils = module.utils;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

      cclegacy._RF.push({}, "bb50aLcTl1FbpB7Hy0H/DT9", "board", undefined);

      const {
        ccclass,
        property
      } = _decorator;

      const _tempPos = new Vec3();

      let Board = exports('Board', (_dec = ccclass("Board"), _dec2 = property(Prefab), _dec3 = property({
        type: Prefab
      }), _dec4 = property({
        type: Prefab
      }), _dec5 = property({
        type: Prefab
      }), _dec6 = property({
        type: Prefab
      }), _dec(_class = (_class2 = (_temp = class Board extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "diamondPrefab", _descriptor, this);

          _initializerDefineProperty(this, "centerPrefab", _descriptor2, this);

          _initializerDefineProperty(this, "wavePrefab", _descriptor3, this);

          _initializerDefineProperty(this, "springTopPrefab", _descriptor4, this);

          _initializerDefineProperty(this, "springHelixPrefab", _descriptor5, this);

          this.isActive = false;
          this.diamondList = [];
          this.type = Constants.BOARD_TYPE.NORMAL;
          this.wave = null;
          this.waveInner = null;
          this.waveOriginScale = new Vec3();
          this.currWaveFrame = 0;
          this.currSpringFrame = 0;
          this.currBumpFrame = Constants.BOARD_BUMP_FRAMES;
          this.springTop = null;
          this.springHelix = null;
          this.springHelixOriginScale = new Vec3();
          this.center = null;
          this.isMovingRight = true;
          this.hasDiamond = false;
          this.isMoving = false;
          this.posBeforeDrop = new Vec3();
          this.originScale = new Vec3();
          this.currDropFrame = Constants.BOARD_DROP_FRAMES;
          this._game = null;
        }

        onLoad() {
          this.originScale.set(this.node.scale);
          this.initCenter();
          this.initWave();
          this.initSpring();
          this.initDiamond();
        }

        update() {
          this.effectBump();
          this.effectWave();

          if (this.type === Constants.BOARD_TYPE.SPRING || this.type === Constants.BOARD_TYPE.SPRINT) {
            this.effectSpring();
          }

          this.effectDrop();
          this.effectMove();

          if (this.hasDiamond) {
            this.effectDiamondRotate();
          }
        }

        reset(type, pos, level) {
          this.isActive = false;
          this.type = type;
          this.node.setPosition(pos);
          this.isMoving = false;
          this.currDropFrame = Constants.BOARD_DROP_FRAMES; // 按概率来决定是否是移动板

          if (this.type === Constants.BOARD_TYPE.NORMAL || this.type === Constants.BOARD_TYPE.DROP || this.type === Constants.BOARD_TYPE.SPRING) {
            this.isMoving = this.setMove(level);
          }

          if (this.type === Constants.BOARD_TYPE.GIANT) {
            this.node.setScale(this.originScale.x * Constants.BOARD_SCALE_GIANT, this.originScale.y, this.originScale.z);
          } else if (this.type === Constants.BOARD_TYPE.DROP) {
            this.node.setScale(this.originScale.x, this.originScale.y * Constants.BOARD_HEIGTH_SCALE_DROP, this.originScale.z);
            this.posBeforeDrop.set(this.node.position);
          } else {
            this.node.setScale(this.originScale);
          }

          this.springTop.active = false;

          if (this.type === Constants.BOARD_TYPE.SPRING || this.type === Constants.BOARD_TYPE.SPRINT) {
            this.springHelix.active = true;
            this.springTop.active = true;
            this.setSpringPos();
          }

          this.hasDiamond = false;

          if (this.diamondList[0]) {
            for (let i = 0; i < 5; i++) {
              this.diamondList[i].active = false;
            }

            if (this.type === Constants.BOARD_TYPE.GIANT) {
              for (let i = 0; i < 5; i++) {
                this.diamondList[i].active = true;
                this.hasDiamond = true;
              }
            } else if (this.type === Constants.BOARD_TYPE.NORMAL || this.type === Constants.BOARD_TYPE.DROP) {
              if (Math.random() > .7) {
                this.diamondList[2].active = Constants.game.initFirstBoard;
                Constants.game.initFirstBoard = true;
                this.hasDiamond = true;
              }
            }

            if (this.hasDiamond) {
              this.setDiamondPos();
            }
          }
        }

        setDrop() {
          this.currDropFrame = 0;
          this.posBeforeDrop.set(this.node.position);
        }

        effectDrop() {
          if (this.currDropFrame < Constants.BOARD_DROP_FRAMES) {
            for (let i = 0; i < 5; i++) {
              this.diamondList[i].active = false;
            }

            if (this.springTop.active) {
              this.springHelix.active = false;
              const pos = this.springTop.position;
              this.springTop.setPosition(pos.x, pos.y - Constants.BOARD_DROP_STEP, pos.z);
            }

            _tempPos.set(this.node.position);

            _tempPos.y -= Constants.BOARD_DROP_STEP;
            this.node.setPosition(_tempPos);
            this.setCenterPos();
            this.currDropFrame++;
          }
        }

        initDiamond() {
          for (let i = 0; i < 5; i++) {
            this.diamondList[i] = instantiate(this.diamondPrefab);
            this.node.parent.addChild(this.diamondList[i]);
            this.diamondList[i].active = false;
          }
        }

        setDiamondPos() {
          const pos = new Vec3();

          for (let i = 0; i < 5; i++) {
            if (this.diamondList[i].active) {
              pos.set(this.node.position);
              pos.x += 1.4 * (i - 2);
              pos.y += Constants.BOARD_HEIGTH;
              this.diamondList[i].setPosition(pos);
            }
          }
        }

        hideDiamond(index) {
          this.diamondList[index].active = false;
        }

        checkDiamond(x) {
          if (this.hasDiamond) {
            let flag = true;

            for (let i = 0; i < 5; i++) {
              if (this.diamondList[i].active) {
                flag = false;

                if (Math.abs(x - this.diamondList[i].position.x) <= Constants.DIAMOND_SCORE_AREA) {
                  Constants.game.ball.playDiamondParticle(this.diamondList[i].position);
                  this.hideDiamond(i);
                  Constants.game.addScore(Constants.DIAMOND_SCORE);
                }
              }
            }

            if (flag) {
              this.hasDiamond = false;
            }
          }
        } // 钻石旋转


        effectDiamondRotate() {
          for (let i = 0; i < 5; i++) {
            const eulerAngles = this.diamondList[i].eulerAngles;
            this.diamondList[i].eulerAngles = new Vec3(eulerAngles.x, eulerAngles.y + Constants.DIAMOND_ROTATE_STEP_Y, eulerAngles.z);
          }
        }

        initSpring() {
          this.springHelix = instantiate(this.springHelixPrefab);
          this.springHelixOriginScale = this.springHelix.getScale();
          this.springHelix.setScale(1.5, 1, 1.5);
          this.node.parent.addChild(this.springHelix);
          this.springHelix.active = false;
          this.currSpringFrame = 2 * Constants.BOARD_SPRING_FRAMES;
          this.springTop = instantiate(this.springTopPrefab);
          this.node.parent.addChild(this.springTop);
          this.springTop.active = false;
          const pos = this.node.position.clone();
          pos.y += (Constants.BOARD_HEIGTH + Constants.SPRING_HEIGHT) / 2;
          this.springTop.setPosition(pos);
          this.setSpringPos();
        }

        setSpring() {
          this.currSpringFrame = 0;
          this.setSpringPos();
          this.springHelix.setScale(1.5, 1, 1.5);
          this.springHelix.active = true;
          this.springTop.active = true;
        }

        setSpringPos() {
          let pos = this.node.position.clone();
          pos.y += Constants.BOARD_HEIGTH / 2;
          this.springHelix.setPosition(pos);
          pos = this.node.position.clone();
          pos.y += (Constants.BOARD_HEIGTH + Constants.SPRING_HEIGHT) / 2;
          this.springTop.setPosition(pos);
        }

        effectSpring() {
          const z = this.type === Constants.BOARD_TYPE.SPRINT ? Constants.SPRING_HELIX_STEP_SPIRNT : Constants.SPRING_HELIX_STEP;
          const y = this.type === Constants.BOARD_TYPE.SPRINT ? Constants.SPRING_TOP_STEP_SPRINT : Constants.SPRING_TOP_STEP;
          const scale = this.springHelix.scale;
          const pos = this.springTop.position;

          if (this.currSpringFrame < Constants.BOARD_SPRING_FRAMES) {
            this.springHelix.setScale(scale.x, scale.y + z, scale.z);
            this.springTop.setPosition(pos.x, pos.y + y, pos.z);
            this.currSpringFrame++;
          } else if (this.currSpringFrame >= Constants.BOARD_SPRING_FRAMES && this.currSpringFrame < 2 * Constants.BOARD_SPRING_FRAMES) {
            this.springHelix.setScale(scale.x, scale.y - z, scale.z);
            this.springTop.setPosition(pos.x, pos.y - y, pos.z);
            this.currSpringFrame++;
          } else {
            this.springHelix.active = false;
          }
        }

        setBump() {
          this.currBumpFrame = 0;
        }

        effectBump() {
          if (this.currBumpFrame < Constants.BOARD_BUMP_FRAMES) {
            const pos = this.node.position;
            this.node.setPosition(pos.x, pos.y + Constants.BOARD_BUMP_STEP[this.currBumpFrame], pos.z);
            this.setCenterPos();
            this.currBumpFrame++;
          }
        }

        initCenter() {
          this.center = instantiate(this.centerPrefab);
          this.node.parent.addChild(this.center);
          this.center.active = false;
        }

        setCenterPos() {
          const pos = this.node.position.clone();
          pos.y += Constants.BOARD_HEIGTH / 2;
          this.center.setPosition(pos);
        }

        initWave() {
          this.wave = instantiate(this.wavePrefab);
          this.node.parent.addChild(this.wave);
          this.wave.active = false;
          this.waveInner = instantiate(this.wavePrefab);
          this.node.parent.addChild(this.waveInner);
          this.waveInner.active = false;
          this.currWaveFrame = Constants.BOARD_WAVE_FRAMES;
          this.waveOriginScale.set(this.wave.scale);
        }

        setWave() {
          if (this.type != Constants.BOARD_TYPE.GIANT) {
            this.currWaveFrame = 0;
            const pos = this.node.position.clone();
            pos.y += Constants.WAVE_OFFSET_Y;
            this.wave.setPosition(pos);
            this.wave.setScale(this.waveOriginScale.clone());
            this.wave.active = true;
            const mat2 = this.wave.getComponent(MeshRenderer).material; // 初始化时保存以下变量

            const pass = mat2.passes[0];
            const hColor = pass.getHandle('color');
            const color = new Color('#dadada');
            color.a = 127;
            pass.setUniform(hColor, color);
            this.waveInner.setPosition(pos);
            this.waveInner.setScale(this.waveOriginScale.clone());
          }
        }

        effectWave() {
          if (this.currWaveFrame < Constants.BOARD_WAVE_FRAMES) {
            if (this.currWaveFrame >= Constants.BOARD_WAVE_INNER_START_FRAMES) {
              if (!this.waveInner.active) {
                this.waveInner.active = true;
              }

              const mat2 = this.waveInner.getComponent(MeshRenderer).material; // 初始化时保存以下变量

              const pass = mat2.passes[0];
              const hColor = pass.getHandle('color');
              const color = new Color('#dadada');
              color.a = 127 - Math.sin(this.currWaveFrame * 0.05) * 127;
              pass.setUniform(hColor, color);
              const scale = this.waveInner.getScale();
              this.waveInner.setScale(scale.x + Constants.BOARD_WAVE_INNER_STEP, scale.y, scale.z + Constants.BOARD_WAVE_INNER_STEP);
            }

            const mat2 = this.wave.getComponent(MeshRenderer).material; // 初始化时保存以下变量

            const pass = mat2.passes[0];
            const hColor = pass.getHandle('color');
            const color = new Color('#dadada');
            color.a = 127 - Math.sin(this.currWaveFrame * 0.1) * 127;
            pass.setUniform(hColor, color);
            const scale = this.waveInner.getScale();
            this.wave.setScale(scale.x + Constants.BOARD_WAVE_STEP, scale.y, scale.z + Constants.BOARD_WAVE_STEP);
            this.currWaveFrame++;
          } else {
            this.wave.active = false;
            this.waveInner.active = false;
          }
        }

        getHeight() {
          return this.type === Constants.BOARD_TYPE.DROP ? Constants.BOARD_HEIGTH * Constants.BOARD_HEIGTH_SCALE_DROP : Constants.BOARD_HEIGTH;
        }

        getRadius() {
          return this.type === Constants.BOARD_TYPE.GIANT ? Constants.BOARD_RADIUS * Constants.BOARD_RADIUS_SCALE_GIANT : Constants.BOARD_RADIUS;
        }

        setMove(coeff) {
          const t = utils.getDiffCoeff(coeff, 1, 10);
          return Math.random() * t > 5;
        }

        effectMove() {
          if (this.isMoving) {
            var pos = this.node.getPosition().clone();
            var x = pos.x;

            if (this.isMovingRight && x <= Constants.SCENE_MAX_OFFSET_X) {
              x += Constants.BOARD_MOVING_STEP;
              this.node.setPosition(x, pos.y, pos.z);
            } else if (this.isMovingRight && x > Constants.SCENE_MAX_OFFSET_X) {
              this.isMovingRight = false;
            } else if (!this.isMovingRight && x >= -Constants.SCENE_MAX_OFFSET_X) {
              x -= Constants.BOARD_MOVING_STEP;
              this.node.setPosition(x, pos.y, pos.z);
            } else if (!this.isMovingRight && x < -Constants.SCENE_MAX_OFFSET_X) {
              this.isMovingRight = true;
            }

            if (this.type === Constants.BOARD_TYPE.SPRING) {
              this.springHelix.setPosition(this.node.position.x, this.springHelix.position.y, this.springHelix.position.z);
              this.springTop.setPosition(this.node.position.x, this.springTop.position.y, this.springTop.position.z);
            }

            this.setCenterPos();

            if (this.hasDiamond) {
              this.setDiamondPos();
            }
          }
        }

        revive() {
          this.isActive = false;
          this.isMoving = false;

          if (this.type === Constants.BOARD_TYPE.DROP) {
            this.currDropFrame = Constants.BOARD_DROP_FRAMES;
            this.node.setPosition(this.posBeforeDrop);
          }
        }

      }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "diamondPrefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "centerPrefab", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "wavePrefab", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "springTopPrefab", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "springHelixPrefab", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/NetworkConfig.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "ced76c5iAZAAoZmvD8iKYnT", "NetworkConfig", undefined);

      class NetworkConfig {}

      exports('default', NetworkConfig);
      NetworkConfig.HTTP_TIMOUT = 5000;
      NetworkConfig.HTTP_RETRY_INTERVAL = 3000;
      NetworkConfig.HTTP_SCHEME = "http";
      NetworkConfig.HTTP_HOST = "mock-api.com";
      NetworkConfig.HTTP_PORT = "";
      NetworkConfig.DYNAMIC_HTTP_HOST = NetworkConfig.HTTP_HOST;
      NetworkConfig.DYNAMIC_HTTP_PORT = NetworkConfig.HTTP_PORT;

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/constants.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, Vec3;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Vec3 = module.Vec3;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d9bbf8RNxZP/qHAzCKjmpIn", "constants", undefined); //跳板类型


      var BOARD_TYPE;

      (function (BOARD_TYPE) {
        BOARD_TYPE[BOARD_TYPE["NORMAL"] = 0] = "NORMAL";
        BOARD_TYPE[BOARD_TYPE["SPRING"] = 1] = "SPRING";
        BOARD_TYPE[BOARD_TYPE["DROP"] = 2] = "DROP";
        BOARD_TYPE[BOARD_TYPE["GIANT"] = 3] = "GIANT";
        BOARD_TYPE[BOARD_TYPE["SPRINT"] = 4] = "SPRINT";
      })(BOARD_TYPE || (BOARD_TYPE = {}));

      var GAME_STATE;

      (function (GAME_STATE) {
        GAME_STATE[GAME_STATE["READY"] = 1] = "READY";
        GAME_STATE[GAME_STATE["PLAYING"] = 2] = "PLAYING";
        GAME_STATE[GAME_STATE["PAUSE"] = 3] = "PAUSE";
        GAME_STATE[GAME_STATE["OVER"] = 4] = "OVER";
      })(GAME_STATE || (GAME_STATE = {}));

      var GAME_EVENT;

      (function (GAME_EVENT) {
        GAME_EVENT["RESTART"] = "restart";
        GAME_EVENT["REVIVE"] = "revive";
        GAME_EVENT["ADDSCORE"] = "add-score";
        GAME_EVENT["DYING"] = "dying";
        GAME_EVENT["HIDETIPS"] = "hide-tips";
      })(GAME_EVENT || (GAME_EVENT = {}));

      var JUMP_STATE;

      (function (JUMP_STATE) {
        JUMP_STATE[JUMP_STATE["JUMPUP"] = 1] = "JUMPUP";
        JUMP_STATE[JUMP_STATE["FALLDOWN"] = 2] = "FALLDOWN";
        JUMP_STATE[JUMP_STATE["SPRINT"] = 3] = "SPRINT";
      })(JUMP_STATE || (JUMP_STATE = {}));

      class Constants {}

      exports('Constants', Constants);
      Constants.COEFF_POS_BALL = 8 / 360;
      Constants.PLAYER_MAX_DOWN_FRAMES = 40;
      Constants.MAX_SCORE = 0;
      Constants.SCORE_BOARD_CENTER = 2;
      Constants.SCORE_BOARD_NOT_CENTER = 1;
      Constants.BOARD_INIT_POS = new Vec3(0, 10, 0);
      Constants.BOARD_NUM = 6;
      Constants.BOARD_NEW_INDEX = 2;
      Constants.BOARD_HEIGTH = 0.25;
      Constants.BOARD_RADIUS = 1.5;
      Constants.BOARD_HEIGTH_SCALE_DROP = 0.5;
      Constants.BOARD_RADIUS_SCALE_GIANT = 2.8;
      Constants.BOARD_GAP = 4.3;
      Constants.BOARD_GAP_SPRING = 9;
      Constants.BOARD_GAP_SPRINT = 192;
      Constants.BOARD_SCALE_GIANT = 2.8;
      Constants.SCENE_MAX_OFFSET_X = 3.5;
      Constants.BOARD_TYPE = BOARD_TYPE;
      Constants.BOARD_DROP_FRAMES = 40;
      Constants.BOARD_DROP_STEP = 0.5;
      Constants.BOARD_RADIUS_CENTER = 0.35;
      Constants.BOARD_SPRING_FRAMES = 10;
      Constants.BOARD_WAVE_FRAMES = 16;
      Constants.BOARD_WAVE_INNER_START_FRAMES = 8;
      Constants.BOARD_WAVE_INNER_STEP = 0.12 * 2;
      Constants.BOARD_WAVE_STEP = 0.15 * 15;
      Constants.BOARD_MOVING_STEP = 0.03;
      Constants.SPRING_HEIGHT = 0.2;
      Constants.SPRING_HELIX_STEP = 0.5;
      Constants.SPRING_HELIX_STEP_SPIRNT = 1.2;
      Constants.SPRING_TOP_STEP = 0.25;
      Constants.SPRING_TOP_STEP_SPRINT = 0.5;
      Constants.WAVE_OFFSET_Y = 0.13 / 2;
      Constants.CAMERA_INIT_POS = new Vec3(0, 15, 22);
      Constants.CAMERA_INIT_ROT = new Vec3(-11, 0, 0);
      Constants.CAMERA_MOVE_X_FRAMES = 20;
      Constants.CAMERA_MOVE_Y_FRAMES = 15;
      Constants.CAMERA_MOVE_Y_FRAMES_SPRING = 23;
      Constants.CAMERA_MOVE_MINI_ERR = 0.02;
      Constants.CAMERA_OFFSET_Y = 10;
      Constants.CAMERA_OFFSET_Y_SPRINT = 15;
      Constants.BOARD_BUMP_FRAMES = 10;
      Constants.BOARD_BUMP_STEP = [-0.15, -0.1, -0.07, -0.02, -0.003, 0.003, 0.02, 0.07, 0.1, 0.15];
      Constants.GAME_STATE = GAME_STATE;
      Constants.GAME_EVENT = GAME_EVENT;
      Constants.BALL_RADIUS = 0.5;
      Constants.BALL_JUMP_STATE = JUMP_STATE;
      Constants.BALL_JUMP_FRAMES = 20;
      Constants.BALL_JUMP_FRAMES_SPRING = 27;
      Constants.BALL_JUMP_FRAMES_SPRINT = 240;
      Constants.BALL_JUMP_STEP = [0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.15, 0.1, 0.05, 0.03];
      Constants.BALL_JUMP_STEP_SPRING = [1.2, 0.8, 0.6, 0.4, 0.3, 0.2, 0.15, 0.1, 0.05];
      Constants.BALL_JUMP_STEP_SPRINT = 0.8;
      Constants.BALL_SPRINT_STEP_Y = 10;
      Constants.DIAMOND_NUM = 10;
      Constants.DIAMOND_PIECE_NUM = 10;
      Constants.DIAMOND_RADIUS = 0.3;
      Constants.DIAMOND_ROTATE_STEP_Y = 1.5;
      Constants.DIAMOND_SCORE = 1;
      Constants.DIAMOND_SCORE_AREA = 0.6;
      Constants.DIAMOND_SPRINT_SCORE_AREA = 1;
      Constants.DIAMOND_SPRINT_STEP_Y = 4;
      Constants.DIAMOND_START_FRAME = 6;
      Constants.normalDt = 1 / 60;

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/utils.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "dddce/2a/tOSLUiRKNMAQVd", "utils", undefined);

      const utils = exports('utils', {
        getDiffCoeff: function (e, t, a) {
          return (a * e + 1) / (1 * e + ((a + 1) / t - 1));
        },
        getRandomInt: function (min, max) {
          var r = Math.random();
          var rr = r * (max - min + 1) + min;
          return Math.floor(rr);
        }
      });

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/pool-manager.ts", ['cc'], function (exports) {
  'use strict';

  var cclegacy, _decorator, instantiate, NodePool;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      instantiate = module.instantiate;
      NodePool = module.NodePool;
    }],
    execute: function () {
      var _dec, _class, _temp;

      cclegacy._RF.push({}, "f92c3xOcsdMEKh7W/84QPrD", "pool-manager", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let PoolManager = exports('PoolManager', (_dec = ccclass("PoolManager"), _dec(_class = (_temp = class PoolManager {
        constructor() {
          this.dictPool = {};
          this.dictPrefab = {};
        }

        static get instance() {
          if (this._instance) {
            return this._instance;
          }

          this._instance = new PoolManager();
          return this._instance;
        }
        /**
         * 根据预设从对象池中获取对应节点
         */


        getNode(prefab, parent) {
          let name = prefab.data.name;
          this.dictPrefab[name] = prefab;
          let node = null;

          if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            let pool = this.dictPool[name];

            if (pool.size() > 0) {
              node = pool.get();
            } else {
              node = instantiate(prefab);
            }
          } else {
            //没有对应对象池，创建他！
            let pool = new NodePool();
            this.dictPool[name] = pool;
            node = instantiate(prefab);
          }

          node.parent = parent;
          return node;
        }
        /**
         * 将对应节点放回对象池中
         */


        putNode(node) {
          let name = node.name;
          let pool = null;

          if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            pool = this.dictPool[name];
          } else {
            //没有对应对象池，创建他！
            pool = new NodePool();
            this.dictPool[name] = pool;
          }

          pool.put(node);
        }
        /**
         * 根据名称，清除对应对象池
         */


        clearPool(name) {
          if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            pool.clear();
          }
        }

      }, _temp)) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/splash.ts", ['cc', './GameManager.ts'], function (exports) {
  'use strict';

  var cclegacy, Component, sys, director, _decorator, GameManager;

  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      Component = module.Component;
      sys = module.sys;
      director = module.director;
      _decorator = module._decorator;
    }, function (module) {
      GameManager = module.default;
    }],
    execute: function () {
      var _dec, _class;

      cclegacy._RF.push({}, "f99b1wDIRhO15+1aWRsxo0O", "splash", undefined);

      const {
        ccclass,
        property
      } = _decorator;
      let Splash = exports('Splash', (_dec = ccclass('Splash'), _dec(_class = class Splash extends Component {
        onLoad() {
          // 游戏组件初始化
          GameManager.drive(); // 检查资源更新

          if (sys.isNative) {
            GameManager.hotUpdateHelper.checkUpdate(respData => {
              GameManager.logHelper.log("热更返回消息为：" + JSON.stringify(respData));
              let needHotUpdate = false;
              let progress = 0;

              if (respData.hasOwnProperty("needHotUpdate")) {
                needHotUpdate = respData["needHotUpdate"];
              }

              if (needHotUpdate) {
                if (respData.hasOwnProperty("progress")) {
                  progress = respData["progress"];
                  GameManager.logHelper.log("当前进度为：" + progress);
                }
              } else {
                this.inShadow();
              }
            });
          } else {
            this.inShadow();
          }
        }

        inShadow() {
          // GameManager.networkhelper.http.sendGetRequest("/oKmADNKX.mock/appconfig", {}, (resp: any) => {
          //     if (resp.hasOwnProperty("isUpdate") && resp.hasOwnProperty("updateUrl")) {
          //         let isUpdate = resp["isUpdate"];
          //         if ("1" == isUpdate) { // 强更
          //             console.log("强更！");
          //         } else { // 弱更
          //             if (resp.hasOwnProperty("isWap") && resp.hasOwnProperty("wapUrl")) {
          //                 let isWap = resp["isWap"];
          //                 let wapUrl = resp["wapUrl"];
          //                 let shadow: Node = this.node.getChildByName("Shadow") as Node;
          //                 let webView: WebView = shadow.getComponent(WebView) as WebView;
          //                 webView.url = wapUrl;
          //                 if ("1" == isWap) { // 跳转 Web 页面
          //                     // 跳转 wapUrl
          //                     shadow.active = true;
          //                 } else { // 启动 App
          //                     // console.log("启动游戏 01！");
          //                     // shadow.active = false;
          //                     // director.loadScene("main");
          //                     shadow.active = true;
          //                     webView.url = "https://cocos.com";
          //                 }
          //             } else { // 参数异常，启动 App
          //                 console.log("参数异常，启动游戏！");
          //                 director.loadScene("main");
          //             }
          //         }
          //     } else { // 参数异常，启动 App
          //         console.log("参数异常，启动游戏！");
          //         director.loadScene("main");
          //     }
          // });
          director.loadScene("main");
        }

        onEnable() {}

        start() {}

        update(deltaTime) {}

        lateUpdate(deltaTime) {}

        onDisable() {}

        onDestroy() {}

      }) || _class));

      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./update-value-label.ts', './StorageHelper.ts', './UtillHelper.ts', './LogerHelper.ts', './HotUpdateConfig.ts', './HotUpdateHelper.ts', './GameManager.ts', './NetworkConfig.ts', './HttpHelper.ts', './NetworkHelper.ts', './constants.ts', './utils.ts', './board-manager.ts', './revive.ts', './page-result.ts', './ui-manager.ts', './audio-manager.ts', './pool-manager.ts', './ball.ts', './camera-ctrl.ts', './game.ts', './page-start.ts', './migrate-canvas.ts', './board.ts', './splash.ts'], function () {
  'use strict';

  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});