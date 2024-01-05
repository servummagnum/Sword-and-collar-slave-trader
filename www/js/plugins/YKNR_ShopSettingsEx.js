// ===========================================================================
// YKNR_ShopSettingsEx.js - ver.1.0.0
// ---------------------------------------------------------------------------
// Copyright (c) 2016 Yakinori
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//============================================================================
/*:
 * ===========================================================================
 * @plugindesc ショップの設定を拡張します。装備コマンドの追加や
 * 価格レートの設定、売却専用ショップなどが設定できます。
 * @author 焼きノリ
 * ===========================================================================
 * @param 直接商品リストを開く
 * @desc "購入のみ or 売却のみ" のときに直接リストを表示するか。
 * 直接表示した場合は、装備や最適化は無視されます。(ON/OFF)
 * @default OFF

 * @param 装備コマンド常に表示
 * @desc 装備 コマンドの追加表示を常に有効にするか。
 * プラグインコマンドからでも個別に設定可能。(ON/OFF)
 * @default ON

 * @param コマンドを常に最適化
 * @desc 無効になった 購入/売却 コマンドは常に非表示にするか。
 * プラグインコマンドからでも個別に設定可能。(ON/OFF)
 * @default OFF

 * @param 購入価格レート基本値
 * @desc 購入時の価格に対し、乗算するレートのデフォルト値。
 * #0001 で変数1の値を購入価格レートとして扱う。(n%/#n)
 * @default 100%

 * @param 売却価格レート基本値
 * @desc 売却時の価格に対し、乗算するレートのデフォルト値。
 * #0002 で変数2の値を売却価格レートとして扱う。(n%/#n)
 * @default 50%

 * @help
 * ===========================================================================
 * 装備コマンドの追加や
 * 価格レートの設定、売却専用ショップなどが設定できます。
 * ===========================================================================
 *【機能紹介】
 * ・売却専用ショップが設定できるようになる
 * ・"購入のみ or 売却のみ" の場合、直接商品リストを表示させる
 * ・"購入のみ or 売却のみ" なら、無効になったコマンドを非表示にする
 *   (直接商品リストを表示させる機能がOFFの場合にのみ設定有効)
 * ・ショップ画面の "購入する/売却する/やめる" のコマンドに "装備" を表示
 *   (直接商品リストを表示させる機能がOFFの場合にのみ設定有効)
 * ・"購入/売却" 時の価格に対し、それぞれレートをかけることができる
 *   (小数点以下は切り捨て)

 * ---------------------------------------------------------------------------
 *【プラグインコマンド】
 * イベントコマンドの「ショップの処理」の実行前に
 * 「プラグインコマンド」から以下のコマンドを呼び出して設定します。
 * また、設定した内容はショップ画面から戻ったタイミングでリセットされます。

 * --------------------------------------
 * ショップ拡張設定 売却のみ
 * --------------------------------------
 * 購入不可の売却のみのショップにすることができます。
 * その際、購入のみのチェックは外さないと、購入のみが優先されるので注意。
 * 商品を設定していると、その商品だけを売ることができる店になります。
 * 商品が何も設定されていなければ、通常の売却処理が実行されます。

 * --------------------------------------
 * ショップ拡張設定 購入/売却コマンド表示最適化
 * --------------------------------------
 * ショップが "購入のみ or 売却のみ" に設定されているとき、
 * もう片方の無効なコマンドを消すことができます。
 * パラメータの "コマンドを常に最適化" の設定より優先されます。
 * コマンドごと消すことで、より "購入/売却" 専門の店という印象が出るかも。

 * --------------------------------------
 * ショップ拡張設定 装備コマンド表示
 * ショップ拡張設定 装備コマンド非表示
 * --------------------------------------
 * 装備コマンドの表示設定をショップ個別に行えます。
 * パラメータの "装備コマンド常に表示" の設定より優先されます。
 * 武器屋のみ店での装備変更が可能、といった表現をしたいときに。

 * --------------------------------------
 * ショップ拡張設定 購入価格レート 指定 n%
 * ショップ拡張設定 購入価格レート 変数 #0001
 * --------------------------------------
 * 購入時の価格のレートを変更できます。
 * 指定の場合、'n' には任意の整数を入れてください。基本値は 100 です。
 * 変数の場合、例のように0埋めする必要はないです。#1 でも有効です。

 * --------------------------------------
 * ショップ拡張設定 売却価格レート 指定 n%
 * ショップ拡張設定 売却価格レート 変数 #0001
 * --------------------------------------
 * 売却時の価格のレートを変更できます。
 * 指定の場合、'n' には任意の整数を入れてください。基本値は 50 です。
 * 変数の場合、例のように0埋めする必要はないです。#1 でも有効です。

 * ---------------------------------------------------------------------------
 *【その他】
 * <!> Scene_Shop.prototype.sellingPrice を再定義しています。
 *
 * ---------------------------------------------------------------------------
 *【更新履歴】
 * [2016/12/25] [1.0.0] 公開
 *
 * ===========================================================================
 * [Blog]   : http://mata-tuku.ldblog.jp/
 * [Twitter]: https://twitter.com/Noritake0424
 * ---------------------------------------------------------------------------
 * 本プラグインは MITライセンス のもとで配布されています。
 * 利用はどうぞご自由に。
 * http://opensource.org/licenses/mit-license.php
*/
(function () {
    'use strict';

    //------------------------------------------------------------------------
    // パラメータを受け取る.
    var parameters = PluginManager.parameters('YKNR_ShopSettingsEx');
    var defaultShowEquipCommand = parameters['装備コマンド常に表示'].toUpperCase() === 'ON';
    var defaultAutoHideCommand = parameters['コマンドを常に最適化'].toUpperCase() === 'ON';
    var directList = parameters['直接商品リストを開く'].toUpperCase() === 'ON';
    var defaultBuyRate = parameters['購入価格レート基本値'];
    var defaultSeelRate = parameters['売却価格レート基本値'];

    //------------------------------------------------------------------------
    var _isShowEquipCommand = false;
    var _isAutoHideCommand = false;
    var _vendOnly = false;
    var _buyRate = 0;
    var _sellRate = 0;

    var _goods = null;
    var _purchaseOnly = false;

    //------------------------------------------------------------------------
    /**
     * ショップ拡張用の変数の初期化処理.
     * @method InitializeExShopParams
     */
    var InitializeExShopParams = function () {
        _isShowEquipCommand = defaultShowEquipCommand;
        _isAutoHideCommand = defaultAutoHideCommand;
        _vendOnly = false;
        _buyRate = defaultBuyRate;
        _sellRate = defaultSeelRate;

        _goods = null;
        _purchaseOnly = false;
    };

    /**
     * 文字列パラメータからレートの値を取得.
     * @method parseShopPriceRate
     * @param {String} formatType : 指定 か 変数
     * @param {String} rateValueFormat : レートのパラメータ文字列
     * @return {Number} : レート
     */
    var parseShopPriceRate = function (formatType, rateValueFormat) {
        if (formatType === '変数') {
            return parseInt(rateValueFormat.replace(/#(\d+)/, function () {
                return $gameVariables.value(parseInt(arguments[1]));
            }.bind(this)));
        } else if (formatType === '指定') {
            return parseInt(rateValueFormat.replace('%', ''));
        }
        return 0;
    };

    //------------------------------------------------------------------------
    defaultBuyRate = parseShopPriceRate(defaultBuyRate.contains('#') ? '変数' : '指定', defaultBuyRate);
    defaultSeelRate = parseShopPriceRate(defaultSeelRate.contains('#') ? '変数' : '指定', defaultSeelRate);
    InitializeExShopParams();

    //------------------------------------------------------------------------
    var _Game_Interpreter_prototype_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        if (command === 'ショップ拡張設定') {
            switch (args[0]) {
                case '売却のみ':
                    _vendOnly = true;
                    break;
                case '装備コマンド表示':
                    _isShowEquipCommand = true;
                    break;
                case '装備コマンド非表示':
                    _isShowEquipCommand = false;
                    break;
                case '購入/売却コマンド表示最適化':
                    _isAutoHideCommand = true;
                    break;
                case '購入価格レート':
                    _buyRate = parseShopPriceRate(args[1], args[2]);
                    break;
                case '売却価格レート':
                    _sellRate = parseShopPriceRate(args[1], args[2]);
                    break;
            }
        } else {
            _Game_Interpreter_prototype_pluginCommand.call(this, command, args);
        }
    };

    //------------------------------------------------------------------------
    /**
     * ショップのコマンドがデフォルト状態か判定.
     * @method Window_ShopCommand.prototype.isDefaultCommand
     * @return {Boolean} : コマンドに関する設定拡張が何もなければ true.
     */
    Window_ShopCommand.prototype.isDefaultCommand = function () {
        return (!_vendOnly && !_isAutoHideCommand && !_isShowEquipCommand && !directList);
    };

    var _Window_ShopCommand_prototype_maxCols = Window_ShopBuy.prototype.maxCols;
    Window_ShopCommand.prototype.maxCols = function () {
        if (this.isDefaultCommand()) {
            return _Window_ShopCommand_prototype_maxCols.call(this);
        }
        return this._list.length;
    };

    var _Window_ShopCommand_prototype_makeCommandList = Window_ShopBuy.prototype.makeCommandList;
    Window_ShopCommand.prototype.makeCommandList = function () {
        if (this.isDefaultCommand()) {
            _Window_ShopCommand_prototype_makeCommandList.call(this);
            return;
        }

        if (directList && (this._purchaseOnly || _vendOnly)) {
            if (this._purchaseOnly) {
                this.addCommand(TextManager.buy, 'buy');
            } else if (_vendOnly) {
                this.addCommand(TextManager.sell, 'sell');
            }
        } else {
            if (_isAutoHideCommand && (this._purchaseOnly || _vendOnly)) {
                if (this._purchaseOnly) {
                    this.addCommand(TextManager.buy, 'buy');
                } else if (_vendOnly) {
                    this.addCommand(TextManager.sell, 'sell');
                }
            } else {
                this.addCommand(TextManager.buy, 'buy', !_vendOnly);
                this.addCommand(TextManager.sell, 'sell', !this._purchaseOnly);
            }
            if (_isShowEquipCommand) {
                this.addCommand(TextManager.equip, 'equip', $gameParty.exists());
            }
            this.addCommand(TextManager.cancel, 'cancel');
        }
    };


    //------------------------------------------------------------------------
    var _Window_ShopBuy_prototype_price = Window_ShopBuy.prototype.price;
    Window_ShopBuy.prototype.price = function (item) {
        var priceBase = _Window_ShopBuy_prototype_price.call(this, item);
        return Math.floor(priceBase * (_buyRate / 100.0));
    };

    //------------------------------------------------------------------------
    /**
     * 売却価格を返す.
     * @method Window_ShopSell.prototype.price
     * @param {Any} item : アイテム, 武器, 防具
     * @return {Number} レート補正後の売却価格.
     */
    Window_ShopSell.prototype.price = function (item) {
        var priceBase = item.price;
        return Math.floor(priceBase * (_sellRate / 100.0));
    };

    var _Window_ShopSell_prototype_isEnabled = Window_ShopSell.prototype.isEnabled;
    Window_ShopSell.prototype.isEnabled = function (item) {
        var result = _Window_ShopSell_prototype_isEnabled.call(this, item);
        if (result && _vendOnly && this._itemFilterList) {
            return this._itemFilterList.contains(item);
        }
        return result;
    };

    /**
     * アイテムのフィルタリングの設定.
     * @method Window_ShopSell.prototype.setSellableFilter
     * @param {Object} shopGoods : ショップの商品リスト
     */
    Window_ShopSell.prototype.setFilter = function (shopGoods) {
        this._itemFilterList = null;

        // ひとつでも設定されているのであれば, フィルタリング有効化.
        if (_vendOnly && shopGoods && shopGoods.length > 0) {
            shopGoods.forEach(function (goods) {
                var item = null;
                switch (goods[0]) {
                    case 0:
                        item = $dataItems[goods[1]];
                        break;
                    case 1:
                        item = $dataWeapons[goods[1]];
                        break;
                    case 2:
                        item = $dataArmors[goods[1]];
                        break;
                }
                if (item && (!this._itemFilterList || !this._itemFilterList.contains(item))) {
                    this._itemFilterList = this._itemFilterList || [];
                    this._itemFilterList.push(item);
                }
            }, this);
        }
        //this.refresh();
    };

    //------------------------------------------------------------------------
    var _Scene_Shop_prototype_initialize = Scene_Shop.prototype.initialize;
    Scene_Shop.prototype.initialize = function () {
        // 保持してある商品リストがあれば再設定する.
        if (_goods !== null) {
            this.prepare(_goods, _purchaseOnly);
            _goods = null;
            this.fromEquipeScene = true;
        }

        _Scene_Shop_prototype_initialize.call(this);
    };

    var _Scene_Shop_prototype_popScene = Scene_Shop.prototype.popScene;
    Scene_Shop.prototype.popScene = function () {
        InitializeExShopParams();
        _Scene_Shop_prototype_popScene.call(this);
    };
    var _Scene_Shop_prototype_create = Scene_Shop.prototype.create;
    Scene_Shop.prototype.create = function () {
        _Scene_Shop_prototype_create.call(this);

        if (directList && (this._purchaseOnly || _vendOnly)) {
            if (this._purchaseOnly) {
                this._commandWindow.selectSymbol('buy');
                this._commandWindow.deactivate();
                this.commandBuy();
            } else if (_vendOnly) {
                this._commandWindow.selectSymbol('sell');
                this._commandWindow.deactivate();
                this.commandSell();
            }
        } else if (this.fromEquipeScene) {
            this._commandWindow.selectSymbol('equip');
        }
    }

    var _Scene_Shop_prototype_createCommandWindow = Scene_Shop.prototype.createCommandWindow;
    Scene_Shop.prototype.createCommandWindow = function () {
        _Scene_Shop_prototype_createCommandWindow.call(this);
        this._commandWindow.setHandler('equip', this.commandEquip.bind(this));
    };

    var _Scene_Shop_prototype_createSellWindow = Scene_Shop.prototype.createSellWindow;
    Scene_Shop.prototype.createSellWindow = function () {
        _Scene_Shop_prototype_createSellWindow.call(this);
        this._sellWindow.setFilter(this._goods);
    };

    /**
     * コマンド[装備] の処理.
     * @method Scene_Shop.prototype.commandEquip
     */
    Scene_Shop.prototype.commandEquip = function () {
        // 戻ってきたときに再設定するため保持しておく.
        _goods = this._goods;
        _purchaseOnly = this._purchaseOnly;

        SceneManager.push(Scene_Equip);
    };

    var _Scene_Shop_prototype_onBuyCancel = Scene_Shop.prototype.onBuyCancel;
    Scene_Shop.prototype.onBuyCancel = function () {
        if (directList && this._purchaseOnly) {
            this.popScene();
        } else {
            _Scene_Shop_prototype_onBuyCancel.call(this);
        }
    };

    var _Scene_Shop_prototype_onCategoryCancel = Scene_Shop.prototype.onCategoryCancel;
    Scene_Shop.prototype.onCategoryCancel = function () {
        if (directList && _vendOnly) {
            this.popScene();
        } else {
            _Scene_Shop_prototype_onCategoryCancel.call(this);
        }
    };
    Scene_Shop.prototype.sellingPrice = function () {
        return this._sellWindow.price(this._item);
    };
})();
