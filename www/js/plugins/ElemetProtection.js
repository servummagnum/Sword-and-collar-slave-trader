//=============================================================================
// SaveTitleChange.js
//=============================================================================
// バージョン: 1.0.0
// 最終更新日: 2018/10/15
// 作成者：ツノウサギ
// Copyright (c) 2018 Jackalope  http://jackalope111.blog.fc2.com/
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================
/*:
 * @plugindesc 加減算による属性耐性を実装します。
 * 耐性が100を超えた場合、無効化します。
 * @author ツノウサギ
 * 
 * @help
 * ※注意※
 * このプラグインはしぐれん様の「Mano_StateProtection.js」をベースに改変したものになります。
 * 利用規約に関してはこちら（https://github.com/sigureya/）に準拠する形になります。
 * 
 *
 * 属性の有効率の計算に以下の式を適用します。
 * 元々の有効率*(100-ステート防御力)/100
 * この式により、属性防御力が100を超えると、属性の発生を完全に無効化します。
 * 
 * <ElementProtection[2]:50>
 * と書いた場合、属性ID2のステートが発生する確率を半分に抑えます。
 * 
 * <StateProtection[2]:50>と書いてある防具を二つ付けた場合、50+50で100となり完全に無効化します。
 * 
 * 属性に対する防御力はアクター・エネミー・防具などのメモ欄に記述します。
 * 
 * 耐性を貫通させたい場合、耐性を低下させる属性を作成して調整します。
 * 例：火属性防御(100)の相手に火属性貫通(50)を持つキャラで、相手の火属性防御を50扱いで計算したい場合。
 * 火属性のステートIDは2とする。
 * ステート・火属性防御低下を作成し、メモに<ElementProtection[2]:-50>と記述。
 * スキルの効果を以下のようにします。
 * ステートの付加：火属性防御低下
 * ステートの付加：火属性
 * ステートの解除：火属性防御低下
 * 
 * あくまで、スキル単位でしか設定できません。
 * キャラクター自体に適用したい場合、攻撃時属性などをうまく使ってください。
 */
 
 
( function(){
"use strict";

Game_BattlerBase.prototype.elementProtection =function(elementId){
    const key = "ElementProtection["+elementId+"]";
    const list = this.traitObjects();
    let result =0;
    for (const trait of list) {
        const protection =trait.meta[key];//ElementProtection;
        if(protection !==undefined){
            result += Number(protection);
        }
    }
    return result;
};

Game_BattlerBase.prototype.elementProtectionRate =function(elementId){
    const protection = this.elementProtection(elementId);

    if(protection>=100){return 0;}
    if(protection<=0){ return 1;}

    return (100-protection) /100;
};
const Game_BattlerBase_elementRate =Game_BattlerBase.prototype.elementRate;
Game_BattlerBase.prototype.elementRate =function(elementId){
    const protectionRate = this.elementProtectionRate(elementId);
if(protectionRate <=0){ return 0; }
    const baseRate = Game_BattlerBase_elementRate.call(this,elementId);
    return protectionRate * baseRate;
};

})();
