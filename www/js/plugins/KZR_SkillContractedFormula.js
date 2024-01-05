//=============================================================================
// KZR_SkillContractedFormula.js
// Version : 1.00
// -----------------------------------------------------------------------------
// [Homepage]: かざり - ホームページ名なんて飾りです。偉い人にはそれがわからんのですよ。 -
//             http://nyannyannyan.bake-neko.net/
// -----------------------------------------------------------------------------
// [Version]
// 1.00 2017/01/26 公開
//=============================================================================

/*:
 * @plugindesc ダメージ計算式を短縮します。
 * 式は10まで設定できます。足りない場合は追加プラグインで。
 * @author ぶちょー
 *
 * @param Form1
 * @desc 短縮式, 置換文
 * @default :attack, (a.atk * 4 - b.def * 2)
 *
 * @param Form2
 * @desc 短縮式, 置換文
 * @default :magic, (a.mat * 4 - b.mdf * 2)
 *
 * @param Form3
 * @desc 短縮式, 置換文
 * @default :noGuard, (a.atk * 4)
 *
 * @param Form4
 * @desc 短縮式, 置換文
 * @default
 *
 * @param Form5
 * @desc 短縮式, 置換文
 * @default
 *
 * @param Form6
 * @desc 短縮式, 置換文
 * @default
 *
 * @param Form7
 * @desc 短縮式, 置換文
 * @default
 *
 * @param Form8
 * @desc 短縮式, 置換文
 * @default
 *
 * @param Form9
 * @desc 短縮式, 置換文
 * @default
 *
 * @param Form10
 * @desc 短縮式, 置換文
 * @default
 *
 * @help
 *
 *　★注意！！★（使用者追記）
 *　　短縮式の名前は半角7文字以内に収めないと「0」扱いになってしまう模様。
 *
 * 【設定方法】
 * 　スキル/アイテムの計算式に設定した短縮式を記述してください。
 * （例）:attack
 *
 * 　短縮式に記述を加えることもできます。
 * （例）:attack * 2
 *
 *  ※ 短縮式を a.atk * 4 - b.def * 2 として、
 *     :attack * 2 と記述すると、
 * 　　a.atk * 4 - b.def * 2 * 2 となってしまいます。
 * 　　(a.atk * 4 - b.def * 2) とすることで、
 * 　　(a.atk * 4 - b.def * 2) * 2 となり、2倍の計算になります。
 */

var SCF_Form = {};
(function() {
    var parameters = PluginManager.parameters('KZR_SkillContractedFormula');
    for (var i = 1; i <= 10; i++) {
        var param = (parameters['Form' + i]);
        if (param.match(/(\S+),(.*)/g)) {
            var cont = RegExp.$1;
            var form = RegExp.$2;
            if (cont !== '' && form !== '') SCF_Form[cont] = form;
        }
    }

//-----------------------------------------------------------------------------
// Scene_Boot
//

var _kzr_SCF_Scene_Boot_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    _kzr_SCF_Scene_Boot_start.call(this);
    for (var i = 1; i < $dataSkills.length; i++) {
        var skill = $dataSkills[i];
        this.convertDamageFormula(skill);
    }
};

Scene_Boot.prototype.convertDamageFormula = function(skill) {
    var formula = skill.damage.formula;
    for (key in SCF_Form) formula = formula.replace(key, SCF_Form[key]);
    skill.damage.formula = formula;
};

})();
