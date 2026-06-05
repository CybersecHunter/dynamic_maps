// ---------- setting start ---------------
var _preloadData, _pageData;
var _pagePreloadArray = {
  image: 1,
  audio: 1,
  video: 1,
  data: -1,
}; // item not availble please assign value 1.
var jsonSRC = "pages/module_1/page_8/data/m1_p8_data.json?v=";
_pageAudioSync = true;
_forceNavigation = false;
_audioRequired = false;
_videoRequired = false;
storeCurrentAudioTime = 0;
_popupAudio = false;
_reloadRequired = true;
_globalCicked = 0;
_currentAudio = null;
_isPlayed = false;
_checkAudioFlag = false;
_tweenTimeline = null;
_popTweenTimeline = null;
var lastPatternId = null;

var _audioIndex = 0;
_videoId = null;
_audioId = null;
// ---------- setting end ---------------
var sectionCnt = 0;
var totalSection = 0;
var prevSectionCnt = -1;
var sectionTopPos = [];
var playMainAudio = false;

var dataValue = []; var currentPattern = null; var currentIndex = 0;
var patterns = [];
// ---------- Memory Game State ----------
var memCards = [];
var memFlipped = [];
var memMatched = 0;
var memLock = false;


// ------------------ common function start ------------------------------------------------------------------------
$(document).ready(function () {
  //console.log('Page ready')
  _preloadData = new PagePreload();
  _preloadData.initObj(_pagePreloadArray, jsonSRC);
  _preloadData.addCustomEvent("ready", _pageLoaded);
  //console.log('Page ready 1', _preloadData)
});

function _pageLoaded() {
  //console.log('_pageLoaded')
  _pageData = _preloadData.jsonData;
  if (_audioRequired) {
    _audioId = _pageData.mainAudio.audioSRC;
    _audioIndex = _pageData.mainAudio.audioIndex;
  }

  if (_videoRequired) _videoId = "courseVideo";

  //addSlideData();
  console.log(_pageData.sections, _pageData.sections[0].backBtnSrc, "pageDAtat")
  appState.pageCount = _controller.pageCnt - 1;
  addSectionData();
  $('.introInfo').attr('data-popup', 'introPopup-7');
  $("#f_header").css({ backgroundImage: `url(${_pageData.sections[0].headerImg})` });
  $("#f_header").find("#f_courseTitle").css({ backgroundImage: `url(${_pageData.sections[0].headerText})` });
  $(".home_btn").css({ backgroundImage: `url(${_pageData.sections[0].backBtnSrc})` });
  // playBtnSounds(_pageData.sections[sectionCnt - 1].endAudio);
  //   showEndAnimations();
  //checkGlobalAudio();
  assignAudio(
    _audioId,
    _audioIndex,
    _pageAudioSync,
    _forceNavigation,
    _videoId,
    _popupAudio,
    _reloadRequired
  );
  pagePreLoad();
}


// -------- adding slide data ------------
// ─── Quiz State ───────────────────────────────────────────
var quizCurrentIndex = 0;
var quizAnswered = false;
var quizQuestions = [];

// ─── addSectionData — ONLY the inner content block changes ─
function addSectionData() {
  totalSection = _pageData.sections.length;
  for (let n = 0; n < _pageData.sections.length; n++) {
    sectionCnt = n + 1;
    if (sectionCnt == 1) {

      playBtnSounds(_pageData.sections[sectionCnt - 1].replayBtnAudios);
      audioEnd(function () {
        $(".dummy-patch").hide();
        $(".wrapTextaudio").removeClass("playing");
        $(".wrapTextaudio").addClass("paused");
        resetSimulationAudio();
      });

      // ---- Instruction line ---- (UNCHANGED)
      $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-left")
        .find(".content")
        .find(".content-bg")
        .find(".content-style")
        .append(`
          <div class="inst">
            <p tabindex="0" aria-label="${removeTags(_pageData.sections[sectionCnt - 1].iText)}">
              ${_pageData.sections[sectionCnt - 1].iText}
              <button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button>
            </p>
          </div>
        `);

      // ---- Store questions ----
      quizQuestions = _pageData.sections[sectionCnt - 1].content.questions;
      quizCurrentIndex = 0;

      // ---- Header content ---- (UNCHANGED)
      let headerContent = `<div class="confetti" id="confettiContainer"></div>`;

      // ---- Popup HTML ---- (UNCHANGED — identical to original)
      let popupDiv = "";
      popupDiv += `<div class="popup"><div class="popup-wrap"><div class="popBtns">`;
      popupDiv += `<button id="refresh" data-tooltip="Restart"></button>`;
      popupDiv += `<button id="homeBack" data-tooltip="Back"></button>`;
      popupDiv += `</div></div></div>`;
      popupDiv += `<div class="greetingsPop"><div class="popup-wrap"></div></div>`;
      popupDiv += `
        <div id="introPopup-7">
          <div class="popup-content">
            <button class="introPopAudio mute" onclick="togglePopAudio(this, '${_pageData.sections[sectionCnt - 1].infoAudio}')"></button>
            <button class="introPopclose" data-tooltip="Close" onClick="closeIntroPop('introPopup-7')"></button>
            <img src="${_pageData.sections[sectionCnt - 1].infoImg}" alt="">
          </div>
        </div>`;
      popupDiv += `
        <div id="home-popup" class="popup-home" role="dialog" aria-label="Exit confirmation" aria-hidden="false">
          <div class="popup-content modal-box">
            <h2 class="modal-title">Oops!</h2>
            <div class="modal-message">
              <p>If you leave the fun game then you have to start from beginning.</p>
              <p class="modal-question">Are you sure you want to leave?</p>
            </div>
            <div class="modal-buttons">
              <button id="stay-btn" class="modal-btn" onClick="stayPage()">Stay</button>
              <button id="leave-btn" class="modal-btn" onClick="leavePage()">Leave</button>
            </div>
          </div>
        </div>`;

      // ---- Quiz area HTML (REPLACES card grid) ----
      let quizAreaHtml = `
        <div class="quiz-area">
          <div class="clock-panel">
            <img id="clockFace" src="" alt="clock" />
          </div>
          <div class="options-panel" id="optionsPanel"></div>
        </div>`;

      // ---- Append everything ---- (structure UNCHANGED)
      $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-left")
        .find(".content")
        .find(".content-bg")
        .find(".content-style")
        .append(
          popupDiv +
          headerContent +
          `<div class="body">
            <div class="animat-container">
              <div class="dummy-patch"></div>
              ${quizAreaHtml}
            </div>
          </div>`
        );

      // ---- Bind popup buttons ---- (UNCHANGED)
      $(".intro-audio").off("click").on("click", onClickAudioHandler);
      $("#refresh").on("click", function () { playClickThen(); jumtoPage(_controller.pageCnt); });
      $("#homeBack").on("click", function () { playClickThen(); jumtoPage(5); });

      // ---- Load first question ----
      quizLoadQuestion(0);

    } // end sectionCnt == 1
  } // end for
} // end addSectionData


// ============================================================
// QUIZ GAME — FUNCTIONS
// ============================================================

function quizLoadQuestion(index) {
  var q = quizQuestions[index];
  quizAnswered = false;

  // Set clock face image
  $("#clockFace").attr("src", q.watchFaceImage).attr("alt", q.options.find(o => o.id === q.correctOption)?.text || "clock");

  // Render options
  quizRenderOptions(q);
}

function quizRenderOptions(question) {
  var html = "";
  question.options.forEach(function (opt) {
    html += `
      <div class="option-btn" data-id="${opt.id}" tabindex="0" role="button" aria-label="${opt.text}">
        <span>${opt.text}</span>
      </div>`;
  });
  $("#optionsPanel").html(html);

  // Bind click
  $("#optionsPanel").off("click", ".option-btn").on("click", ".option-btn", function () {
    quizOnOptionClick($(this), question);
  });
}
// let isEnd = false;

function playAudiosSequentially(audioArray, callback) {
  let index = 0;
  function playNext() {
    if (index >= audioArray.length) {
      if (callback) callback();
      return;
    }
    playFeedbackAudio(audioArray[index]);
    audioEnd(function () {
      index++;
      playNext();
    });
  }
  playNext();
}

function quizOnOptionClick($btn, question) {
  if (quizAnswered) return;
  quizAnswered = true;

  var selected = $btn.data("id");
  var isCorrect = (selected === question.correctOption);


  if (isCorrect) {
    $btn.addClass("correct");

    const starImg = `
    <img src="${_pageData.sections[sectionCnt - 1].star}" class="option-star">`;
    $btn.append(starImg);
    $(".option-btn").css({ "cursor": "auto", "pointer-events": "none" })

    const correctAudios = _pageData.sections[sectionCnt - 1].correctAudio;

    // ✅ Play ONLY one audio based on question index
    playFeedbackAudio(_pageData.sections[sectionCnt - 1].correctTune);
    audioEnd(function () {
      playFeedbackAudio(correctAudios[quizCurrentIndex]);

      audioEnd(function () {
        // Remove star after audio
        setTimeout(function () {
          $btn.find(".option-star").remove();
          quizCurrentIndex++;
          if (quizCurrentIndex >= quizQuestions.length) {
            // isEnd = true;
            setTimeout(function () {

              // 🎉 SHOW CONFETTI + GREAT JOB IMMEDIATELY
              pageVisited();
              $(".greetingsPop").css({ visibility: "visible", opacity: "1" });
              $(".confetti").addClass("show");

              // 🔊 PLAY FINAL AUDIO
              playBtnSounds(_pageData.sections[sectionCnt - 1].finalAudio);

              // 🎯 WHEN AUDIO ENDS → SHOW COMPLETION POPUP
              audioEnd(function () {

                const audio = document.getElementById("simulationAudio");
                audio.onended = null; // 🚫 prevent repeat

                setTimeout(function () {
                  $(".greetingsPop").css({ visibility: "hidden", opacity: "0" });
                  $(".popup").css({ visibility: "visible", opacity: "1" });
                }, 500);

                setTimeout(function () {
                  $(".confetti").removeClass("show");
                }, 800);

              });

            }, 400);

          } else {
            setTimeout(function () {
              $(".option-btn").css({ "cursor": "pointer", "pointer-events": "auto" })
              quizLoadQuestion(quizCurrentIndex);
            }, 800);
          }
        }, 2000)
      });
    });

  } else {
    $btn.addClass("wrong");
    playFeedbackAudio(_pageData.sections[sectionCnt - 1].incorrectTune);
    audioEnd(function () {
      playFeedbackAudio(_pageData.sections[sectionCnt - 1].wrongAudio);
      audioEnd(function () {
        setTimeout(function () {
          $btn.removeClass("wrong");
          quizAnswered = false;
        }, 600);
      });
    });
  }
}

function quizRestart() {
  quizCurrentIndex = 0;
  quizAnswered = false;
  quizLoadQuestion(0);
}

// Override restartActivity to use quiz restart
function restartActivity() {
  $(".popup").css({ opacity: "0" });
  setTimeout(function () {
    $(".popup").css({ visibility: "hidden", opacity: "0" });
  }, 500);
  _globalCicked = 0;
  quizRestart();
}


/* ---------- showEndAnimations — overrides shared version ---------- */
// function showEndAnimations() {
//   var $audio = $("#simulationAudio");
//   // closePopup("introPopup-7");
//   pageVisited();

//   $audio.on("timeupdate", function () {
//     var currentTime = this.currentTime;
//     $(".greetingsPop").css({ visibility: "visible", opacity: "1" });

//     if (currentTime >= 1) {
//       $(".confetti").addClass("show");

//       setTimeout(function () {
//         $(".greetingsPop").css({ visibility: "hidden", opacity: "0" });
//         $(".popup").css({ visibility: "visible", opacity: "1" });
//       }, 1500);

//       setTimeout(function () {
//         $(".confetti").removeClass("show");
//       }, 2000);

//       $audio.off("timeupdate");
//     }
//   });
// }


/* ---------- restartActivity — overrides shared version ---------- */
// function restartActivity() {
//   $(".popup").css("opacity", "0");
//   setTimeout(function () {
//     $(".popup").css({ visibility: "hidden", opacity: "0" });
//   }, 500);

//   _globalCicked = 0;
//   memRerenderGrid();
// }

function playFeedbackAudio(_audio) {
  $(".dummy-patch").show();
  playBtnSounds(_audio)
  audioEnd(function () {
    $(".dummy-patch").hide();
  })
}


function onClickAudioHandler(e) {

  $("#simulationAudio")[0].pause();
  playClickThen();
  $('.dummy-box').show();
  e.stopPropagation();
  const audioSrc = $(this).data('audio');
  if (!audioSrc) {
    console.log('No audio src found');
    return;
  }

  const audio = document.getElementById('simulationAudio');
  if (!audio) {
    console.log('Audio element not found');
    return;
  }

  audio.src = audioSrc;
  audio.currentTime = 0;

  audio.play().catch(err => {
    console.error('Audio play failed:', err);
  });

  audio.addEventListener('ended', function () {
    console.log('Audio finished playing');
    $("dummy-patch").hide();
    resetSimulationAudio();

    $('.dummy-box').hide();

  });
}


function stayPage() {
  playClickThen();
  // AudioController.play();

  // Resume simulation audio if it was playing before popup
  if (typeof resumeSimulationAudio === 'function') {
    resumeSimulationAudio();
  }

  $("#home-popup").hide();
}

function leavePage() {
  playClickThen();


  var audio = document.getElementById("simulationAudio");
  if (audio) {
    // Stop audio whether it's playing or paused
    audio.pause();
    audio.currentTime = 0;
  }

  // Clear the manual pause flag since we're leaving
  if (typeof isManuallyPaused !== 'undefined') {
    isManuallyPaused = false;
  }
  if (typeof simulationWasPlaying !== 'undefined') {
    simulationWasPlaying = false;
  }

  jumtoPage(5);
}

function jumtoPage(pageNo) {
  playClickThen();

  _controller.pageCnt = pageNo;

  _controller.updateViewNow();
}


var activeAudio = null;

function playBtnSounds(soundFile) {
  if (!soundFile) {
    console.warn("Audio source missing!");
    return;
  }

  console.log("calling audios");

  const audio = document.getElementById("simulationAudio");

  // Stop previous audio if it exists
  if (activeAudio && !activeAudio.paused) {
    activeAudio.pause();
    // Do NOT reset src yet, let it finish
  }

  audio.loop = false;
  audio.src = soundFile;
  audio.load();

  activeAudio = audio;

  audio.play().catch((err) => {
    console.warn("Audio play error:", err);
  });

}



function resetSimulationAudio() {

  $("dummy-patch").hide();

  const audioElement = document.getElementById("simulationAudio");
  if (!audioElement) return;

  audioElement.pause();

  audioElement.src = "";
  audioElement.removeAttribute("src");

  const source = audioElement.querySelector("source");
  if (source) source.src = "";

  audioElement.load();
  audioElement.onended = null;
  // ✅ ensure button enabled

}


function audioEnd(callback) {
  const audio = document.getElementById("simulationAudio");
  audio.onended = null;
  audio.onended = () => {
    if (typeof callback === "function") callback();
  };
}


function toggleAudio(el) {
  playClickThen();
  // console.log(event, "current e")
  // const el = event.currentTarget; 
  const audio = document.getElementById("audio_src");

  // console.log(el, "Target class");

  if (audio.paused) {
    audio.muted = false;
    audio.play();
    el.classList.remove("mute");
    el.classList.add("playing");
    _controller._globalMusicPlaying = true;
  } else {
    audio.pause();
    el.classList.remove("playing");
    el.classList.add("mute");
    _controller._globalMusicPlaying = false;
  }
}

var AudioController = (() => {
  const audio = document.getElementById("simulationAudio");

  const hasAudio = () => audio && audio.src;

  return {
    play() {
      if (hasAudio()) audio.play();
    },
    pause() {
      if (hasAudio()) audio.pause();
    }
  };
})();






function restartActivity() {
  $(".popup").css("opacity", "0");
  setTimeout(function () {
    $(".popup").css("display", "none");
  }, 500);
  _globalCicked = 0;
  restartPage();
}

function showEndAnimations() {
  pageVisited();

  $(".greetingsPop").css({ visibility: "visible", opacity: "1" });
  $(".confetti").addClass("show");

  setTimeout(function () {
    $(".greetingsPop").css({ visibility: "hidden", opacity: "0" });
    $(".popup").css({ visibility: "visible", opacity: "1" });
  }, 1500);

  setTimeout(function () {
    $(".confetti").removeClass("show");
  }, 2000);
}

// function closeIntroPop(ldx) {
//   playClickThen();
//   // AudioController.play();
//   document.getElementById(ldx).style.display = 'none';
//   let audio = document.getElementById("popupAudio");
//   if (audio.src) {
//     audio.pause();
//     audio.currentTime = 0;
//   }
// }


// --- UPDATED REPLAY FUNCTION ---

function replayLastAudio(btn) {
  const audio = document.getElementById("simulationAudio");
  const audioSource = btn.getAttribute('data-src') || window.replayBtnAudio;

  console.log("Replay/Toggle triggered");

  // 1. RESTART: If audio has finished or isn't loaded
  if (audio.ended || !audio.src || audio.src === "") {
    console.log("Starting Audio Fresh");

    // Reset Mute to False (Play with sound)
    audio.muted = false;

    // SHOW patch on start
    $(".dummy-patch").show();

    playBtnSounds(audioSource);
    setButtonState(btn, "playing");

    // Attach completion listener
    audioEnd(() => {
      setButtonState(btn, "paused");
      $(".dummy-patch").hide(); // Always hide when done
      console.log("Audio completed");
    });
    return;
  }

  // 2. TOGGLE Logic (While Playing)
  if (audio.muted) {
    // --- RESUME (UNMUTE) ---
    console.log("Resuming Sound");
    audio.muted = false;
    setButtonState(btn, "playing");

    // SHOW patch because audio is audible now
    $(".dummy-patch").show();
  } else {
    // --- MUTE (SILENT PLAY) ---
    console.log("Muting Sound");
    audio.muted = true;
    setButtonState(btn, "paused");

    // HIDE patch because audio is silent (user wants to interact)
    $(".dummy-patch").hide();
  }
}

// Helper to toggle classes
function setButtonState(btn, state) {
  if (state === "playing") {
    btn.classList.remove("paused");
    btn.classList.add("playing");
  } else if (state === "paused") {
    btn.classList.remove("playing");
    btn.classList.add("paused");
  }
}

// Handle the end event
// function audioEnd(callback) {
//   const audio = document.getElementById("simulationAudio");
//   audio.onended = null;
//   audio.onended = () => {
//     if (typeof callback === "function") callback();
//   };
// }


// function enableButtons() {
//   $(".flip-card").prop("disabled", false);
//   $(".flipTextAudio").prop("disabled", false);
// }

// function disableButtons() {
//   $(".flip-card").prop("disabled", true);
//   $(".flipTextAudio").prop("disabled", true);
// }

// function resetToggle() {
//   $(".flip-card").removeClass('flipped');
// }

// -------- update CSS ------------
function setCSS(sectionCnt) {
  _wrapperWidth = $("#f_wrapper").outerWidth();
  _wrapperHeight = $("#f_wrapper").outerHeight();
  // ---- checking device width and height ----
  if (_wrapperWidth > 768) {
    for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
      $("#section-1")
        .find(".bg-img")
        .eq(i)
        .css({
          "background-image":
            "url(" + _pageData.imgCollage.desktop[i].imageSRC + ")",
          "background-size": "cover",
        });
    }
  } else {
    for (var j = 0; j < _pageData.imgCollage.portrait.length; j++) {
      $("#section-1")
        .find(".bg-img")
        .eq(j)
        .css({
          "background-image":
            "url(" + _pageData.imgCollage.portrait[j].imageSRC + ")",
          "background-size": "cover",
        });
    }
  }
}

// -------- animations ------------
//function updateCurrentTime(_currTime) {
//    _tweenTimeline.seek(_currTime)
//}

/*
function removeTags(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig, '');
}*/
function removeTags(str) {
  //console.log('removeTags 0', str)
  if (str === null || str === "") {
    return false;
  } else {
    str = _controller.removeTags(str);
    return str;
  }
}
function initPageAnimations() {
  if (_tweenTimeline) {
    _tweenTimeline.kill();
  }
  _tweenTimeline = new TimelineLite();

  mainAnimation();
  if (_pageAudioSync && !_pageData.mainAudio.isEmptyAudio) {
    withAudioSync();
  } else {
    withoutAudioSync();
  }
}

function mainAnimation() {
  $(".f_page_content").animate(
    {
      opacity: 1,
    },
    300
  );
}

function withAudioSync() {
  _tweenTimeline.play();

  _tweenTimeline.add(animateFadeIn($("h1"), 0.5).play(), 0.5);

  _tweenTimeline.add(animateFadeIn($(".ost"), 0.5).play(), 0.1);
  _tweenTimeline.add(animateFadeOut($(".ost"), 0.5).play(), 4.5);
  _tweenTimeline.add(animateFadeOut($(".dummy-patch"), 0.5).play(), 3);
  // _tweenTimeline.add(animateFadeIn($(".inst"), 0.5).play(), 5);

  _tweenTimeline.add(
    animateFadeIn($(".animat-container"), 0.5, 0).play(),
    0.3
  );

  var rightListTiming = [0.3];
  // for (var k = 0; k < rightListTiming.length; k++) {
  //   _tweenTimeline.add(
  //     animateFadeIn(
  //       $(".animat-container").find(".flip-container").eq(k),
  //       0.5,
  //       0
  //     ).play(),
  //     rightListTiming[k]
  //   );
  // }
}

// function withoutAudioSync() {
//   _tweenTimeline.play();
//   _tweenTimeline.add(animateFadeIn($("h1"), 0.5).play(), 0.5);
//   _tweenTimeline.add(animateFadeIn($(".animat-container"), 0.5, 0).play(), 0.1);
//   let time = 1,
//     t = 0,
//     pTag = 0,
//     listTag = 0,
//     divTag = 0;
//   let time1 = time;
//   for (let j = 0; j < _pageData.sections[0].content.listText.length; j++) {
//     t = time1 + j * 0.5;
//     _tweenTimeline.add(
//       animateFromRight(
//         $(".animat-container").find(".list li").eq(listTag),
//         0.5,
//         0
//       ).play(),
//       t
//     );
//     listTag++;
//   }
// }
// -------- resize page details ------------
/*window.onresize = function() {
    //setCSS()
}*/
