//=============================================================================
// SaveTitleChange.js
//=============================================================================
// バージョン: 1.0.0
// 最終更新日: 2018/02/19
// 作成者：ツノウサギ
// Copyright (c) 2018 Jackalope  http://jackalope111.blog.fc2.com/
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc セーブファイルに表示されるゲームタイトル部分を特定の変数に変更する。
 *
 * @author ツノウサギ
 *
 * @param ExchageForVariableNum
 * @desc タイトルと入れ替えるゲーム変数の番号（デフォルトで1）
 * @default 1
 *
 * @help
 * 
 *セーブファイルウィンドウでゲームのタイトルが表示されるところを、
 *特定の変数に変えます。
 *   
 *もし変数番号10に数値や文字列などを入れていて、それをゲームタイトル
 *の代わりに表示させたいという場合は、パラメータを“10”に変更すれば
 *ＯＫ。
 *
 *【注意】
 *tomoaky様のプラグイン『TMSaveDataLabel.js』でセーブファイルに追加
 *の変数を表示させている場合、『TMSaveDataLabel.js』より上の位置に
 *当プラグインを配置しないと競合します。
 *
 *
 */
//=============================================================================
// タイトル表示部分の書き換え
//=============================================================================
//
(function() {
  //-----------------------------------------------------------------------------
  // パラメータの取得
  //-----------------------------------------------------------------------------
var PluginN = 'SaveTitleChange';
  	var param = PluginManager.parameters(PluginN);
  	var ExchageForVariableNum = Number(param['ExchageForVariableNum'])||1;

  //-----------------------------------------------------------------------------
  // DataManager
  //-----------------------------------------------------------------------------
  
    DataManager.makeSavefileInfo = function() {
    var info = {};
    info.globalId   = this._globalId;
    info.title      = $dataSystem.gameTitle;
    info.characters = $gameParty.charactersForSavefile();
    info.faces      = $gameParty.facesForSavefile();
    info.playtime   = $gameSystem.playtimeText();
    info.timestamp  = Date.now();
    info.saveString = $gameVariables.value(ExchageForVariableNum);
    return info;
    };

  //-----------------------------------------------------------------------------
  // Window_SavefileList
  //-----------------------------------------------------------------------------

  Window_SavefileList.prototype.drawGameTitle = function(info, x, y, width) {
    if (info.title) {
        this.drawText(info.saveString, x, y, width);
    }
  };
})();
