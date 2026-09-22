// ---------- setting start ---------------
var _preloadData, _pageData;
var _pagePreloadArray = {
  image: 1,
  audio: -1,
  video: 1,
  data: -1,
}; // item not availble please assign value 1.
var jsonSRC = "pages/module_1/page_0/data/m1_p0_data.json?v=";
_pageAudioSync = true;
_forceNavigation = false;
_audioRequired = true;
_videoRequired = false;
storeCurrentAudioTime = 0;
_popupAudio = false;
_reloadRequired = true;

_checkAudioFlag = false;
_popTweenTimeline = null;
_tweenTimeline = null;
var _audioIndex = 0;
_videoId = null;
_audioId = null;
// ---------- setting end ---------------
var sectionCnt = 0;
var totalSection = 0;
var prevSectionCnt = -1;
var sectionTopPos = [];
var playMainAudio = true;
var totalVisited = 0;
var _currentAudioIndex = 0;
var _visitedArr = [];
// ------------------ common function start ------------------------------------------------------------------------
$(document).ready(function () {
  _preloadData = new PagePreload();
  _preloadData.initObj(_pagePreloadArray, jsonSRC);
  _preloadData.addCustomEvent("ready", _pageLoaded);
});

function _pageLoaded() {
  _pageData = _preloadData.jsonData;

  if (_audioRequired) {
    _audioId = _pageData.mainAudio.audioSRC;
    _audioIndex = _pageData.mainAudio.audioIndex;
  }

  if (_videoRequired) _videoId = "courseVideo";

  if (parent._strictNavigation) {
    // _forceNavigation = true;
  }
  appState.pageCount = _controller.pageCnt - 1;
  console.log(
    "_controller._globalMusicPlaying",
    _controller._globalMusicPlaying,
  );
  if (_controller._globalMusicPlaying) {
    document.getElementById("audio_src").play();
  }
  //   $("#f_header").find(".music, .introInfo, .helpInfo").show();
  //   $("#f_header").find(".helpInfo").show();

  //   $(".helpInfo").css({
  //     backgroundImage: `url(${_pageData.sections[0].helpBtnSrc})`,
  //   });
  //   $(".helpInfo").attr("data-tooltip", "Help");
  //   $(".helpInfo").attr("data-popup", "helpPopup-2");

  //   $(".introInfo").css({
  //     backgroundImage: `url(${_pageData.sections[0].infoBtnSrc})`,
  //   });
  //   $(".introInfo").attr("data-tooltip", "About dynamic maps");
  //   $(".introInfo").attr("data-popup", "introPopup-2");

  //   // $("#f_header, #f_courseTitle").css("background","transparent");
  //   $("#f_courseTitle").css(
  //     "background",
  //     `url(${_pageData.sections[0].headerTitle}) no-repeat center center`,
  //   );

  //   $(".home_btn").css({
  //     backgroundImage: `url(${_pageData.sections[0].homeBtnSrc})`,
  //   });
  addSectionData();
  //assignAudio(_audioId, _audioIndex, _pageAudioSync, _forceNavigation, _videoId, _popupAudio, _reloadRequired);
  pagePreLoad();
  setTimeout(function () {
    initPageAnimations();
    showVisitedModule();
    checkGlobalAudio();
  }, 100);
}

// ------------------ common function end ------------------------------------------------------------------------

// -------- adding slide data ------------
function addSectionData() {
  totalSection = _pageData.sections.length;
  for (let n = 0; n < _pageData.sections.length; n++) {
    sectionCnt = n + 1;
    let titleText = "",
      insText = "";
    if (sectionCnt == 1) {
      // const instTimer = setTimeout(function () {
      //   playBtnSounds(_pageData.sections[sectionCnt - 1].replayBtnAudios);
      //   // const audio = document.getElementById("simulationAudio");
      //   audioEnd(() => {
      //     console.log("Audio completed instruction");
      //     $(".dummy-patch").hide();
      //     $(".wrapTextaudio").removeClass("playing");
      //     $(".wrapTextaudio").addClass("paused");
      //     resetSimulationAudio();
      //   });
      // }, 2500);

      /*     $("#section-" + sectionCnt).find(".content-holder").find(".col-left").find(".content").find(".content-bg").append('<div class="main-text"><h1 aria-label="' + removeTags(_pageData.sections[sectionCnt - 1].headerTitle) + '" tabindex="0">' + _pageData.sections[sectionCnt - 1].headerTitle + '</h1></div>'); */

      let textObject = "",
        listObject = "";
      // if (_pageData.sections[sectionCnt - 1].insText != "") {
      //   insText +=
      //     '<div class="ins-txt"><p aria-label="' +
      //     removeTags(_pageData.sections[sectionCnt - 1].insText) +
      //     '" tabindex="0">' +
      //     _pageData.sections[sectionCnt - 1].insText +
      //     '<button class="wrapTextaudio playing" id="wrapTextaudio_1" data-src="' +
      //     _pageData.sections[sectionCnt - 1].replayBtnAudios +
      //     '" onClick="replayLastAudio(this)"></button></p></div>';
      // }
      // if (_pageData.sections[sectionCnt - 1].content.text != "") {
      //   for (
      //     let i = 0;
      //     i < _pageData.sections[sectionCnt - 1].content.text.length;
      //     i++
      //   ) {
      //     if (
      //       Array.isArray(_pageData.sections[sectionCnt - 1].content.text[i])
      //     ) {
      //       listObject = "<ul>";
      //       for (
      //         let j = 0;
      //         j < _pageData.sections[sectionCnt - 1].content.text[i].length;
      //         j++
      //       ) {
      //         listObject +=
      //           '<li aria-label="' +
      //           removeTags(
      //             _pageData.sections[sectionCnt - 1].content.text[i][j],
      //           ) +
      //           '" tabindex="0">' +
      //           _pageData.sections[sectionCnt - 1].content.text[i][j] +
      //           "</li>";
      //       }
      //       listObject += "</ul>";
      //       textObject += listObject;
      //       listObject = "";
      //     } else {
      //       textObject +=
      //         '<p aria-label="' +
      //         removeTags(_pageData.sections[sectionCnt - 1].content.text[i]) +
      //         '" tabindex="0">' +
      //         _pageData.sections[sectionCnt - 1].content.text[i] +
      //         "</p>";
      //     }
      //   }
      // }

      let htmlObj =
          "<span class='birds'></span><span class='globe'></span><span class='paper-plane'></span><span class='nav1-head'><span class='nav1'></span></span><span class='nav2-head'><span class='nav2'></span></span><div id='intro-header'><!-- <div class='left-char'></div> --><div class='intro-text-content'><span class='globe-gif'></span><div class='intro-header-container' tabindex='-1' aria-label='Dynamic Maps'><img src='./assets/images/intro_header.png' alt='Dynamic Maps'/></div><!-- <div class='instruction'></div> --><div id='intro-button'><button type='button' id='f_launchBtn' data-tooltip='Play' class='launchInfo' onclick='launchIntroPopup()'></button></div></div></div>",
        imgObj = "";

      htmlObj += textObject + insText;

      // if (_pageData.sections[sectionCnt - 1].content.sectionArray != "") {
      //   for (
      //     let i = 0;
      //     i < _pageData.sections[sectionCnt - 1].content.sectionArray.length;
      //     i++
      //   ) {
      //     imgObj +=
      //       '<div class="btn_holder btn_' +
      //       i +
      //       '"><button class="box" id="box-' +
      //       _pageData.sections[sectionCnt - 1].content.sectionArray[i]
      //         .sectionIndx +
      //       '" disabled="true" style="pointer-events:none; cursor:default;">';

      //     if (
      //       _pageData.sections[sectionCnt - 1].content.sectionArray[i].thumb
      //     ) {
      //       imgObj +=
      //         '<div class="card-thumb" style="background-image:url(\'' +
      //         _pageData.sections[sectionCnt - 1].content.sectionArray[i].thumb +
      //         "');\"></div>";
      //     }
      //     if (
      //       _pageData.sections[sectionCnt - 1].content.sectionArray[i].title
      //     ) {
      //       imgObj +=
      //         '<div class="card-title">' +
      //         _pageData.sections[sectionCnt - 1].content.sectionArray[i].title +
      //         "</div>";
      //     }

      //     // imgObj += '</button><div class="btn_info i-txt-toolTip" id="info-' + (i + 1) + '" data-tooltip="Information"></div></div>'
      //     imgObj += "</button></div>";
      //     $("#section-" + sectionCnt)
      //       .find(".content-holder")
      //       .append(
      //         '<div class="infobtnPopup" id="infobtnPopup-' +
      //           (i + 1) +
      //           '"><div class="popup-content">' +
      //           '<button class="infoPopAudio mute" onclick="togglePopAudio(this, \'' +
      //           _pageData.sections[sectionCnt - 1].content.sectionArray[i]
      //             .infoAudio +
      //           "')\"></button>" +
      //           '<button class="introPopclose" data-tooltip="Close" onClick="closeIntroPop(\'.infobtnPopup\')"></button>' +
      //           '<img src="' +
      //           _pageData.sections[sectionCnt - 1].content.sectionArray[i]
      //             .infoImg +
      //           '" alt="">' +
      //           "</div></div>",
      //       );
      //   }
      // }

      let infoPop = `
            <div id="introPopup-2" class="introPopup">                
                <div class="popup-content">
                    <button class="introPopAudio mute" onclick="togglePopAudio(this, '${_pageData.sections[sectionCnt - 1].infoPopAudio}')"></button>
                    <button class="introPopclose" data-tooltip="Close" onclick="closePopup('introPopup-2')"></button>
                    <img src="assets/images/popup.png" alt="">
                    <div class="popup-info">
            <span class="info"
              ><img src="assets/images/info.png" alt="Information"
            /></span>
            <p>About Dynamic Maps</p>
          </div>
          <div class="popup-text">
            <div class="section" style="font-size: 18px">
              <p>
                Welcome to your DYNAMIC MAPS! Get ready to learn about India in
                a fun and exciting way.
              </p>
              <ul>
                <li>Start by choosing a map type: Physical or Political.</li>
                <li>
                  Then turn on different layers to see them appear on the map.
                </li>
                <li>
                  You can select more than one layer at a time to understand how
                  different features fit together.
                </li>
              </ul>

              <span
                >For example, see how rivers flow through mountains and
                plains!</span
              >
              <ul>
                <li>
                  Click on any feature on the map to learn interesting facts
                  about it.
                </li>
              </ul>
              <i
                >Explore, experiment and enjoy learning geography like never
                before!</i
              >
            </div>
          </div>
                </div>
            </div>
            `;

      $("#section-" + sectionCnt)
        .find(".content-holder")
        .append(infoPop);

      $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-left")
        .find(".content")
        .find(".content-bg")
        .append(
          '<button class="goback-btn"></button><div class="body"><div class="dummypatch"></div>' +
            htmlObj +
            "</div>",
        );

      $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-mid")
        .find(".content")
        .find(".content-bg");
    }
    setCSS(sectionCnt);

    if ($(".nav_btns #full-screen").length === 0) {
      $(".nav_btns").append(
        // '<button data-tooltip="Help" data-popup="helpPopup-2" class="helpInfo"></button>',
        '<button id="full-screen" class="full-screen fScreen fullScreen" onclick="toggleFullscreen(this)" data-tooltip="Fullscreen"></button>',
      );
    }
  }
}

function launchIntroPopup() {
  console.log("🔥 LAUNCH INTRO POPUP CLICKED");

  var popup = document.getElementById("launchIntroPopup");

  console.log("launchIntroPopup element:", popup);

  if (!popup) {
    console.error("❌ launchIntroPopup was not found in the HTML");
    return;
  }

  // Pause simulation audio if available
  if (typeof pauseSimulationAudio === "function") {
    pauseSimulationAudio();
  }

  // Hide all intro popups
  document.querySelectorAll(".introPopup").forEach(function (p) {
    p.style.display = "none";
    p.style.opacity = "0";
    p.style.visibility = "hidden";
    p.style.pointerEvents = "none";
  });

  // Show launch popup
  popup.style.display = "flex";
  popup.style.opacity = "1";
  popup.style.visibility = "visible";
  popup.style.pointerEvents = "auto";

  // Reset popup audio buttons
  $(".introPopAudio").removeClass("playing").addClass("mute");

  // Play launch popup audio if the function exists
  if (typeof playIntroPopupAudio === "function") {
    playIntroPopupAudio("launchIntroPopup", "assets/audios/intro_pop_audio.mp3");
  }

  // Normal click sound
  if (typeof playClickThen === "function") {
    playClickThen();
  }

  console.log("✅ launchIntroPopup opened");
}

function setCSS($sectionCnt) {
  _wrapperWidth = $("#f_wrapper").outerWidth();
  _wrapperHeight = $("#f_wrapper").outerHeight();
  // ---- checking device width and height ----
  if (_wrapperWidth > 768) {
    for (var i = 0; i < _pageData.imgCollage.desktop.length; i++) {
      $("#section-" + $sectionCnt)
        .find(".bg-img")
        .eq(i)
        .css({
          "background-image":
            "url(" +
            _pageData.imgCollage.desktop[$sectionCnt - 1].imageSRC +
            ")",
          "background-size": "cover",
        });
    }
  } else {
    for (var j = 0; j < _pageData.imgCollage.portrait.length; j++) {
      $("#section-" + $sectionCnt)
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

function audioEnd(callback) {
  const audio = document.getElementById("simulationAudio");
  audio.onended = null;
  audio.onended = () => {
    if (typeof callback === "function") callback();
  };
}

function showVisitedModule() {
  getModuleLevelpageVisited();
  console.log("Raj-------------", getModuleLevelPageCount);

  var pageCnter = 0;
  var sectionArray = _pageData.sections[sectionCnt - 1].content.sectionArray;
  //$('#box-'+ ( _controller.pageCnt + 1)).addClass('active');

  $(".image-container").find(".box").removeClass("active");

  setTimeout(function () {
    pageVisited();
    for (let i = 0; i < sectionArray.length; i++) {
      console.log(
        _controller.pageCnt + 1,
        sectionArray[i].sectionID,
        "Controoler",
      );
      if (_controller.pageCnt + 1 == sectionArray[i].sectionID) {
        console.log(
          sectionArray[i].sectionIndx,
          sectionArray[i].sectionID,
          "Controoler",
          i,
        );
        $("#box-" + sectionArray[i].sectionIndx).addClass("active");
        $("#box-" + sectionArray[i].sectionIndx)
          .find("img")
          .attr("src", sectionArray[i].imgActive);
        $("#box-" + sectionArray[i].sectionIndx).attr("disabled", false);
        $("#box-" + sectionArray[i].sectionIndx).css({
          pointerEvents: "auto",
          cursor: "pointer",
        });

        let currentDiv = "#box-" + sectionArray[i].sectionIndx;
        // console.log('#box-' + sectionArray[i].sectionIndx, currentDiv, "visited", ('#arrow-' + (sectionArray[i].sectionIndx)))

        if ($(currentDiv).hasClass("visited")) {
          console.log(sectionArray[i].sectionIndx + 1, "Visited");
          $("#box-" + (sectionArray[i].sectionIndx + 1)).attr(
            "disabled",
            false,
          );
          $("#box-" + (sectionArray[i].sectionIndx + 1)).css({
            pointerEvents: "auto",
            cursor: "pointer",
          });
        }
        loadAudio(sectionArray[i]);
        // console.log("Audio Count", audioCount);
        // console.log(_pageData.mainAudio+' '+audioCount);
      }

      for (let j = 0; j < getModuleLevelPageCount.length; j++) {
        let count = 0;
        if (Array.isArray(getModuleLevelPageCount[j])) {
          for (let k = 0; k < getModuleLevelPageCount[j].length; k++) {
            if (getModuleLevelPageCount[j][k] == 1) {
              count++;
            }
          }

          console.log(
            "count ",
            count,
            getModuleLevelPageCount[j].length,
            getModuleLevelPageCount[j],
          );
          if (count == getModuleLevelPageCount[j].length) {
            console.log(
              getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]),
              "Values",
            );
            $(
              "#box-" +
                (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]) -
                  1),
            )
              .find(".moduleVisited")
              .show();
            $(
              "#box-" +
                (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]) -
                  1),
            ).addClass("visited");

            $(
              "#box-" +
                (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]) -
                  1),
            ).css({
              pointerEvents: "auto",
              cursor: "pointer",
            });

            $(
              "#box-" +
                getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]),
            ).css({
              pointerEvents: "auto",
              cursor: "pointer",
            });
            $(
              "#box-" +
                getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]),
            ).attr("disabled", false);

            let boxElement = $(
              "#box-" +
                getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]),
            ).find(".moduleVisited");
            var id = $(boxElement).attr("id");
            var arr = id.split("-");
            var num1 = Number(arr[arr.length - 1]) - 1;
            $(
              "#box-" +
                getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]),
            )
              .find("img")
              .attr("src", sectionArray[num1].imgVisisted);

            //$("#box-" + (getModuleLevelPageCount.indexOf(getModuleLevelPageCount[j]))).addClass('active');
          }
        }
      }
    }
  }, 200);
}

function getModuleLevelpageVisited() {
  console.log(getModuleLevelPageCount, "Module Level count start");

  var sectionArray = _pageData.sections[sectionCnt - 1].content.sectionArray;

  for (let i = 0; i < sectionArray.length; i++) {
    if (Array.isArray(getModuleLevelPageCount[sectionArray[i].sectionIndx])) {
      let count = sectionArray[i].sectionID;
      for (
        let j = 0;
        j < getModuleLevelPageCount[sectionArray[i].sectionIndx].length;
        j++
      ) {
        if (_visitedArr[count] == "1" || _visitedArr[count] == 1) {
          getModuleLevelPageCount[sectionArray[i].sectionIndx][j] = 1;
        }
        count++;
      }
    }
  }
  console.log(getModuleLevelPageCount, "Module Level count end");
}

function onClickinfoHandler(evt) {
  var eventType = evt.type;
  var targetButton = $(this);
  var count = 0;
  var id = $(this).attr("id");
  var arr = id.split("-");
  var num = Number(arr[arr.length - 1]);
  console.log("helo", num);
  var body = $("#section-" + sectionCnt).find(".content-holder");
  switch (eventType) {
    case "click":
      playClickThen();
      ///AudioController.pause();
      // console.log("its wokring")
      $(`#infobtnPopup-${num}`).css("display", "flex");
      $(`#infobtnPopup-${num}`).css("opacity", "1");
      $(".infoPopAudio").removeClass("playing");
      $(".infoPopAudio").addClass("mute");
      break;
    case "mouseenter":
      break;
    case "mouseleave":
      break;
  }
}

function onClickHandler(evt) {
  var eventType = evt.type;
  var targetButton = $(this);
  var count = 0;
  var id = $(this).attr("id");
  var arr = id.split("-");
  var num = Number(arr[arr.length - 1]) - 1;
  console.log("its clicked", _controller.pageCnt, num);
  // exit();

  var body = $("#section-" + sectionCnt)
    .find(".content-holder")
    .find(".col-mid")
    .find(".content")
    .find(".content-bg")
    .find(".body");
  //var sectionArray = _pageData.sections[sectionCnt - 1].content.sectionArray;
  var jumpToPage = [1, 2]; // [Physical Map (page 10), Political Map (page 2)]
  console.log("Jump to page", jumpToPage[num]);
  //var jumpToPage = sectionArray.sectionID
  //console.log(' == num ', num, sectionCnt,  _pageData.sections[sectionCnt-1].content[num].terms.iconHoverImage)
  switch (eventType) {
    case "click":
      playClickThen();
      //pageVisited();
      _controller.pageCnt = jumpToPage[num];
      $(".dummy-patch").hide();
      $(".wrapTextaudio").removeClass("playing");
      $(".wrapTextaudio").addClass("paused");
      resetSimulationAudio();

      // $("#f_preventor").show();
      _controller.updateViewNow();
      break;
    case "mouseenter":
      break;
    case "mouseleave":
      break;
  }
}

function loadAudio(aud) {
  _audioId = aud.audioSRC;
  _audioIndex = aud.audioIndex;
  console.log(_audioIndex);
  _currentAudioIndex = _audioIndex;

  assignAudio(
    _audioId,
    _audioIndex,
    _pageAudioSync,
    _forceNavigation,
    _videoId,
    _popupAudio,
    _reloadRequired,
  );
}

function resetSimulationAudio() {
  $(".dummy-patch").hide();

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

// document.addEventListener("DOMContentLoaded", function () {
//   $(".helpInfo").attr("data-popup", "helpPopup-2");
//   $(".introInfo").attr("data-popup", "introPopup-1");

//   document.querySelectorAll(".introInfo").forEach((btn) => {
//     btn.addEventListener("click", function (event) {
//       const el = event.currentTarget;
//       console.log(el, "working fine");
//       //-------global info audio mute--------

//       pauseSimulationAudio();

//       //--------------------------
//       // Get popup ID from button
//       const popupId = el.getAttribute("data-popup");
//       console.log(popupId, "dis;");

//       // Hide all other popups
//       document.querySelectorAll(".introPopup").forEach((p) => {
//         p.style.display = "none";
//         p.style.opacity = "0";
//       });

//       // Show the popup
//       const popupEl = document.getElementById(popupId);
//       if (popupEl) {
//         popupEl.style.display = "flex";
//         popupEl.style.opacity = "1";
//       }

//       // Reset audio buttons
//       $(".introPopAudio").removeClass("playing").addClass("mute");

//       if (popupId === "introPopup-1") {
//         playIntroPopupAudio("introPopup-1");
//       }

//       // Optional click sound
//       if (typeof playClickThen === "function") playClickThen();
//     });
//   });

//   document.querySelectorAll(".helpInfo").forEach((btn) => {
//     btn.addEventListener("click", function (event) {
//       const el = event.currentTarget;
//       console.log(el, "working fine");
//       //-------global info audio mute--------

//       pauseSimulationAudio();

//       //--------------------------
//       // Get popup ID from button
//       const popupId = el.getAttribute("data-popup");
//       console.log(popupId, "dis;");

//       // Hide all other popups
//       document.querySelectorAll(".introPopup").forEach((p) => {
//         p.style.display = "none";
//         p.style.opacity = "0";
//       });

//       // Show the popup
//       const popupEl = document.getElementById(popupId);
//       if (popupEl) {
//         popupEl.style.display = "flex";
//         popupEl.style.opacity = "1";
//       }

//       // Reset audio buttons
//       $(".introPopAudio").removeClass("playing").addClass("mute");

//       if (popupId === "helpPopup-2") {
//         playHelpPopupAudio();
//       }

//       // Optional click sound
//       if (typeof playClickThen === "function") playClickThen();
//     });
//   });

// });

// function playIntroPopupAudio(popupId) {
//   const popup = document.getElementById(popupId);
//   const audioBtn = popup?.querySelector(".introPopAudio");
//   const audio = document.getElementById("popupAudio");

//   if (!audioBtn || !audio) return;

//   audio.pause();
//   audio.currentTime = 0;
//   audio.onended = null;
//   audio.src = "assets/audios/intro_pop_audio.mp3";
//   audio.load();
//   audio.muted = false;
//   audio.play();

//   $(".introPopAudio").removeClass("playing").addClass("mute");
//   audioBtn.classList.remove("mute");
//   audioBtn.classList.add("playing");

//   audio.onended = () => {
//     audioBtn.classList.remove("playing");
//     audioBtn.classList.add("mute");
//   };
// }

// function playHelpPopupAudio(popupId) {
//   const popup = document.getElementById(popupId);
//   const audioBtn = popup?.querySelector(".introPopAudio");
//   const audio = document.getElementById("popupAudio");

//   if (!audioBtn || !audio) return;

//   audio.pause();
//   audio.currentTime = 0;
//   audio.onended = null;
//   audio.src = "assets/audios/help_popup.mp3";
//   audio.load();
//   audio.muted = false;
//   audio.play();

//   $(".introPopAudio").removeClass("playing").addClass("mute");
//   audioBtn.classList.remove("mute");
//   audioBtn.classList.add("playing");

//   audio.onended = () => {
//     audioBtn.classList.remove("playing");
//     audioBtn.classList.add("mute");
//   };
// }

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

function replayLastAudio(btn) {
  const audio = document.getElementById("simulationAudio");
  const audioSource = btn.getAttribute("data-src") || window.replayBtnAudio;

  console.log("Replay/Toggle triggered");

  // 1. RESTART: If audio has finished or isn't loaded
  if (audio.ended || !audio.src || audio.src === "") {
    console.log("Starting Audio Fresh");
    $(".wrapTextaudio").removeClass("paused");
    $(".wrapTextaudio").addClass("playing");

    // Reset Mute to False (Play with sound)
    audio.muted = false;

    // SHOW patch on start
    $(".dummy-patch").show();

    playBtnSounds(audioSource);
    // setButtonState(btn, "playing");

    // Attach completion listener
    audioEnd(() => {
      $(".wrapTextaudio").removeClass("playing");
      $(".wrapTextaudio").addClass("paused");
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
    $(".wrapTextaudio").removeClass("paused");
    $(".wrapTextaudio").addClass("playing");
    // setButtonState(btn, "playing");

    // SHOW patch because audio is audible now
    $(".dummy-patch").show();
  } else {
    // --- MUTE (SILENT PLAY) ---
    console.log("Muting Sound");
    audio.muted = true;
    $(".wrapTextaudio").removeClass("playing");
    $(".wrapTextaudio").addClass("paused");
    // setButtonState(btn, "paused");

    // HIDE patch because audio is silent (user wants to interact)
    $(".dummy-patch").hide();
  }
}

function removeTags(str) {
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
    300,
  );
}

// function withAudioSync() {
//   _tweenTimeline.play();
//   console.log("With Audio", _currentAudioIndex);
//   _tweenTimeline.add(animateFadeIn($(".col-left"), 0.5).play(), 0.5);
//   var body = $("#section-" + sectionCnt)
//     .find(".content-holder")
//     .find(".col-left")
//     .find(".content")
//     .find(".content-bg")
//     .find(".body");
//   _tweenTimeline.add(animateFadeIn($("h1"), 0.5).play(), 2);
//   _tweenTimeline.add(animateFadeIn(body.find("#intro-header"), 0.5).play(), 2);
//   _tweenTimeline.add(
//     animateFadeIn(body.find(".intro-header-container"), 0.5).play(),
//     2.5,
//   );
//   _tweenTimeline.add(animateFadeIn(body.find("#intro-button"), 0.5).play(), 3);
//   _tweenTimeline.add(animateFromLeft($(".btn_0"), 0.5, 0).play(), 1.5);
//   _tweenTimeline.add(animateFromRight($(".btn_1"), 0.5, 0).play(), 2);
//   // var iconTimings = [3];
//   // var textTimings = [3,5,7];
//   // for (var k = 0; k < iconTimings.length; k++) {
//   //    _tweenTimeline.add(animateFadeIn(body.find('.text-container').find('p').eq(k), 0.5, 0).play(), iconTimings[k])
//   // }
//   var rightListTiming = [1, 2];
//   for (var k = 0; k < rightListTiming.length; k++) {
//     _tweenTimeline.add(
//       animateFadeIn(
//         body.find(".text-container").find("li").eq(k),
//         0.5,
//         0,
//       ).play(),
//       rightListTiming[k],
//     );
//   }

//   var boxTiming1 = [0.1, 0.5, 0.8];
//   _tweenTimeline.add(
//     animateFadeIn(body.find(".text-container").find(".ins-txt "), 0.5).play(),
//     1,
//   );
//   _tweenTimeline.add(animateFadeOut(body.find(".dummypatch "), 0.5).play(), 1);
//   for (var k = 0; k < boxTiming1.length; k++) {
//     _tweenTimeline.add(
//       animateFadeIn(body.find(".box").eq(k), 0.5, 0).play(),
//       boxTiming1[k],
//     );
//   }
// }

function withAudioSync() {
  _tweenTimeline.play();
  console.log("With Audio", _currentAudioIndex);
  var body = $("#section-" + sectionCnt)
    .find(".content-holder")
    .find(".col-left")
    .find(".content")
    .find(".content-bg")
    .find(".body");
  // -------------------------------------------------- // INTRO INITIAL STATE // --------------------------------------------------
  TweenMax.set(body.find(".intro-header-container"), { opacity: 0 });
  TweenMax.set(body.find("#intro-button"), { opacity: 0 });
  TweenMax.set(body.find("#intro-header"), {
    opacity: 1,
    clipPath: "inset(0 100% 0 0)",
  });
  TweenMax.set(body.find("#intro-btns"), { opacity: 0, scale: 0.8 });
  // -------------------------------------------------- // LEFT CONTENT // --------------------------------------------------
  _tweenTimeline.add(animateFadeIn($(".col-left"), 0.5).play(), 0.5);
  // -------------------------------------------------- // PAGE TITLE // --------------------------------------------------
  _tweenTimeline.add(animateFadeIn($("h1"), 0.5).play(), 2);
  // -------------------------------------------------- // INTRO HEADER - CLIP PATH REVEAL // --------------------------------------------------
  _tweenTimeline.to(
    body.find("#intro-header"),
    1,
    { clipPath: "inset(0 0% 0 0)", ease: Power2.easeOut },
    2,
  );
  // -------------------------------------------------- // INTRO HEADER CONTAINER // --------------------------------------------------
  _tweenTimeline.fromTo(
    body.find(".intro-header-container"),
    1,
    { opacity: 0, y: 60 },
    { opacity: 1, y: 0, ease: Power2.easeOut },
    3,
  );
  // -------------------------------------------------- // LAUNCH BUTTON // --------------------------------------------------
  _tweenTimeline.fromTo(
    body.find("#intro-button"),
    1,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, ease: Back.easeOut },
    4,
  );
  _tweenTimeline.fromTo(
    body.find("#intro-btns"),
    0.1,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1 },
    5,
  );
  _tweenTimeline.add(animateFromLeft($(".btn_0"), 0.5, 0).play(), 1.5);
  _tweenTimeline.add(animateFromRight($(".btn_1"), 0.5, 0).play(), 2);
  var rightListTiming = [1, 2];
  for (var k = 0; k < rightListTiming.length; k++) {
    _tweenTimeline.add(
      animateFadeIn(
        body.find(".text-container").find("li").eq(k),
        0.5,
        0,
      ).play(),
      rightListTiming[k],
    );
  }
  _tweenTimeline.add(
    animateFadeIn(body.find(".text-container").find(".ins-txt"), 0.5).play(),
    1,
  );
  _tweenTimeline.add(animateFadeOut(body.find(".dummypatch"), 0.5).play(), 1);
  var boxTiming1 = [0.1, 0.5, 0.8];
  for (var k = 0; k < boxTiming1.length; k++) {
    _tweenTimeline.add(
      animateFadeIn(body.find(".box").eq(k), 0.5, 0).play(),
      boxTiming1[k],
    );
  }
}
function withoutAudioSync() {
  _tweenTimeline.play();
  console.log("Out Audio");
  _tweenTimeline.add(animateFadeIn($("h1"), 0.5).play(), 0.5);
  _tweenTimeline.add(
    animateFromMarginLeft($(".animat-container"), 0.5, 0).play(),
    1,
  );
  let time = 1,
    t = 0,
    pTag = 0,
    listTag = 0,
    divTag = 0;
  for (let i = 0; i < _pageData.sections[0].content.text.length; i++) {
    t = time + i * 0.5;
    if (Array.isArray(_pageData.sections[0].content.text[i])) {
      let time1 = t + 0.5;
      for (let j = 0; j < _pageData.sections[0].content.text[i].length; j++) {
        t = time1 + j * 0.5;
        _tweenTimeline.add(
          animateFadeIn(
            $(courseIdNameRef + "")
              .find("ul li")
              .eq(listTag),
            0.5,
            0,
          ).play(),
          t,
        );
        listTag++;
      }
      time = time1;
    } else {
      _tweenTimeline.add(
        animateFadeIn(
          $(courseIdNameRef + "")
            .find("p")
            .eq(pTag),
          0.5,
          0,
        ).play(),
        t,
      );
      pTag++;
    }
  }
}
