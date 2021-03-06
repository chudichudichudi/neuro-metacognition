goog.provide('metacog.BetScene');

goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.fill.LinearGradient');

metacog.BetScene = function(){
};

metacog.BetScene.createScene = function (opt_out_payment) {
	var scene = new lime.Scene();  

  var layer_score = new lime.Layer().setPosition(450,100);
  var score = new lime.Label().setPosition(0,0).setText("¿Apostar?").setFontSize(30).setFontWeight("bold");

  layer_score.appendChild(score,0);

  //Layer score bar
  var layer_score_bar = new lime.Layer().setPosition(896,700);
  var ratio_of_bar = 600 / metacog.experiments.max_score;
  var frame_score_bar = new lime.Sprite().setSize(100,600 + 3).setAnchorPoint(0.5,1).setFill('#9D9D9D');
  layer_score_bar.appendChild(frame_score_bar,1);

  var score_bar = new lime.Sprite().setSize(100,3 + metacog.trials.score * ratio_of_bar)
                      .setAnchorPoint(0.5,1).setFill('#2E8B57');
  
  var label_puntaje = new lime.Label().setPosition(0,-650).setText("Puntaje").setFontSize(30).setFontWeight("bold");
  var label_maximo = new lime.Label().setPosition(-100,-592).setText("Máx.").setFontSize(30).setFontWeight("bold");
  var label_minimo = new lime.Label().setPosition(-100,-12).setText("Mín.").setFontSize(30).setFontWeight("bold");
  layer_score_bar.appendChild(label_maximo);
  layer_score_bar.appendChild(label_minimo);
  layer_score_bar.appendChild(label_puntaje);
  
  layer_score_bar.appendChild(score_bar,2);


  //Layer bet right, bet wrong

  var layer_sure = new lime.Layer().setPosition(200,512);
  var sure_button = new lime.Label().setPosition(0,0).setText("Sí").setFontSize(50).setFontWeight("bold");
  var text_bet_right = (metacog.experiments.current_trial.payment_bet_right >= 0 ? "✓: +" : "✓: ");
  var text_bet_wrong = (metacog.experiments.current_trial.payment_bet_wrong >= 0 ? "✘: +" : "✘: ");
  var sure_label = new lime.Label().setPosition(85,-15).setText(text_bet_right + metacog.experiments.current_trial.payment_bet_right).setFontSize(30);
  var sure_wrong_label = new lime.Label().setPosition(85,20).setText(text_bet_wrong + metacog.experiments.current_trial.payment_bet_wrong).setFontSize(30);
  layer_sure.appendChild(sure_button);
  layer_sure.appendChild(sure_wrong_label);
  layer_sure.appendChild(sure_label);

  var pay_opt_out = metacog.experiments.current_trial.payment_bet_opt_out[Math.floor(Math.random()*metacog.experiments.current_trial.payment_bet_opt_out.length)];

  var layer_not_sure = new lime.Layer().setPosition(650,512);
  var not_sure_button = new lime.Label().setPosition(0,0).setText("No ").setFontSize(50).setFontWeight("bold");
  var not_sure_label = new lime.Label().setPosition(65,0).setText("+" + pay_opt_out).setFontSize(25);
  layer_not_sure.appendChild(not_sure_button);
  layer_not_sure.appendChild(not_sure_label);

  var zoomout_sure = new lime.animation.Spawn(
    new lime.animation.ScaleTo(5).setDuration(0.5),
    new lime.animation.FadeTo(0).setDuration(0.5)
  );

  goog.events.listen(layer_sure,['mousedown','touchstart'],function() {
    metacog.trials.sure_bet();
      layer_score.removeChild(score);
      layer_score.appendChild(new lime.Label().setPosition(0,0)
        .setText( "Score: " + metacog.trials.score ).setFontSize(100).setFontWeight("bold"));
      lime.scheduleManager.callAfter(function () {
        metacog.manage_bet_sure();
      }, false, 0);
  });

  goog.events.listen(layer_not_sure,['mousedown','touchstart'],function() {
        
    metacog.trials.not_sure_bet(pay_opt_out);
    lime.scheduleManager.callAfter(function () {
      metacog.manage_bet_not_sure();
    }, false, 0);

  });

  scene.appendChild(layer_sure);
  scene.appendChild(layer_not_sure);
  scene.appendChild(layer_score);
  scene.appendChild(layer_score_bar); 

  return scene;
};

metacog.BetScene.createScoreBoard = function() {
  var layer_score = new lime.Layer().setPosition(0,0);
  var score_slider = new lime.Sprite().setSize(683 + 5, 100).setStroke(5,'#c00');
  layer_score.appendChild(score_slider);
  return layer_score;
}