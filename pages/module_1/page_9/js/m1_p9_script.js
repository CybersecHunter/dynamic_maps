// ---------- setting start ---------------
var _preloadData, _pageData;
var _pagePreloadArray = {
  image: 1,
  audio: -1,
  video: 1,
  data: -1,
}; // item not availble please assign value 1.
var jsonSRC = "pages/module_1/page_9/data/m1_p9_data.json?v=";
_pageAudioSync = true;
_forceNavigation = false;
_audioRequired = true;
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
var _isSimulationPaused = false;
var gameStarted = false;

var _audioIndex = 0;
_videoId = null;
_audioId = null;
// ---------- setting end ---------------
var sectionCnt = 0;
var totalSection = 0;
var prevSectionCnt = -1;
var sectionTopPos = [];
var playMainAudio = false;
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
  $(".playPause").show();
  addSectionData();
  appState.pageCount = _controller.pageCnt - 1;
  $('.introInfo').attr('data-popup', 'introPopup-7');
  $("#f_header").css({ backgroundImage: `url(${_pageData.sections[0].headerImg})` });
  $("#f_header").find("#f_courseTitle").css({ backgroundImage: `url(${_pageData.sections[0].headerText})` });
  $(".home_btn").css({ backgroundImage: `url(${_pageData.sections[0].backBtnSrc})` });
  $(".home_btn").attr("data-tooltip", "Back");
  // playBtnSounds(_pageData.sections[sectionCnt - 1].endAudio);
  //   showEndAnimations();
  // checkGlobalAudio();
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

// ------------------ common function end ------------------------------------------------------------------------

// -------- adding slide data ------------
// =============================
// ADD SECTION DATA
// =============================

function addSectionData() {
  totalSection = _pageData.sections.length;
  for (let n = 0; n < _pageData.sections.length; n++) {
    sectionCnt = n + 1;
    if (sectionCnt == 1) {
      const sec = _pageData.sections[sectionCnt - 1];

      let instText = '';

      instText += `
        <button class="wrapTextaudio playing" id="wrapTextaudio_${1}"
        onclick="replayLastAudio(this, '${sec.content.replayAudios[1]}')">
        </button>
        <p tabindex="0" id="inst_1" 
        aria-label="${removeTags(sec.iText[1])}">
        ${sec.iText[1]}</p>`;
      // }

      // ---- Header content ---- (UNCHANGED)
      let headerContent = `<div class="confetti" id="confettiContainer"></div>`;

      /* ================= POPUP ================= */

      let popupDiv = "";

      popupDiv += '<div class="popup"><div class="popup-wrap"><div class="popBtns">';
      popupDiv += '<button id="refresh" data-tooltip="Restart"></button>';
      popupDiv += '<button id="homeBack" data-tooltip="Back"></button>';
      popupDiv += "</div></div></div>";
      popupDiv += '<div class="greetingsPop">';
      popupDiv += '<div class="popup-wrap"></div></div>';
      popupDiv += `<div id="introPopup-7"><div class="popup-content">
      <button class="introPopAudio mute" onclick="togglePopAudio(this, '${_pageData.sections[sectionCnt - 1].infoAudio}')"></button>
      <button class="introPopclose" data-tooltip="Close" onClick="closeIntroPop('introPopup-7')"></button>
      <img src="${_pageData.sections[sectionCnt - 1].infoImg}" alt="">
  </div>
</div>`;

      popupDiv += `<div id="home-popup" class="popup-home" role="dialog" aria-label="Exit confirmation" aria-hidden="false">
    <div class="popup-content modal-box">
      <h2 class="modal-title">Oops!</h2>
      <div class="modal-message">
        <p>If you leave the time simulation then you have to start from beginning.</p>     
        <p class="modal-question">Are you sure you want to leave?</p>   
      </div>      
      <div class="modal-buttons">
        <button id="stay-btn" class="modal-btn" onClick="stayPage()">Stay</button>
        <button id="leave-btn" class="modal-btn" onClick="leavePage()">Leave</button>
      </div>
    </div>
  </div>`;


      /* ================= APPEND STRUCTURE ================= */

      $("#section-" + sectionCnt)
        .find(".content-style")
        .append(
          '<div class="inst">' + instText + '</div>' +
          popupDiv +
          headerContent +
          '<div class="body">' +
          '<div class="animations"></div>' +
          '<div class="animat-container"></div>' +
          '</div>'
        );


      /* ================= AUDIO FLOW ================= */

      playBtnSounds(sec.content.replayAudios[0], function () {
        // Scene 1 → hide text
        $(".inst").hide();
        $(".body").css("display", "flex");

        const mountEl = $("#section-" + sectionCnt)
          .find(".animat-container")[0];

        // ---------- Scene 2 ----------
        initClockScene(mountEl, sec);
        // FIRST LINE AUDIO
        playBtnSounds(sec.content.replayAudios[1], function () {

          // AFTER FIRST AUDIO → CHANGE TEXT
          $("#sceneText").fadeOut(250, function () {

            $(this).html(`<button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button><p>`+ (sec.iText[3] + `</p>` || "")).fadeIn(250);

            // SECOND LINE AUDIO
            playBtnSounds(sec.content.replayAudios[19], function () {

              // NOW GO TO NEXT SCENE
              initClockOverlayScene(mountEl, sec);
              playBtnSounds(sec.content.replayAudios[2], function () {

                // Scene 4
                initClockScene4(mountEl, sec);
                playBtnSounds(sec.content.replayAudios[3], function () {

                  $("#scenetext6").fadeOut(250, function () {
                    // ✅ Scene 5 Numbers
                    initNumberArrangeScene(mountEl, sec);

                  });
                });

              });

            });

          });
        });
      });







      /* ================= BUTTON EVENTS ================= */

      $("#refresh").on("click", function () {

        $(".popup").css({ opacity: "0", visibility: "hidden" });
        jumtoPage(_controller.pageCnt);

      });

      $("#homeBack").on("click", function () {
        $(".playPause").hide();
        jumtoPage(0);

      });

    }
  }
}

// function updateScene2Text(sec) {

//   let html = `
//     <p tabindex="0">${sec.iText[2]}</p>
//     <p tabindex="0">${sec.iText[3]}</p>
//   `;

//   $(".inst").html(html);

// }



window.startClockGame = function () {

  const mountEl = $("#section-" + sectionCnt)
    .find(".animat-container")[0];

  initClockLayout(mountEl);

};

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

function initClockScene(mountEl, sec) {

  const clockImg = sec.endClock || "";

  // BUILD fixed numbers HTML
  // const fixedNums = [3, 6, 9, 12];
  let fixedHTML = '';
  // fixedNums.forEach(n => {
  //   const pos = NUM_POSITIONS[n];
  //   fixedHTML += `
  //   <div class="clock-num-fixed clock-num-preset"
  //        style="left:${pos.left}%;top:${pos.top}%;transform:translate(-50%,-50%);">
  //        ${n}
  //   </div>`;
  // });

  mountEl.innerHTML = `
  
  <div class="clock-layout">

      <div class="clock-left">
          <div class="clock-wrapper">
              <div class="clock-face"
                   style="background-image:url('${clockImg}')">
                   <div class="clock-center"></div>
                    ${fixedHTML}
              </div>
          </div>
      </div>

      <div class="clock-right">
          <div class="clock-title" id="sceneText">
          <button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button>
              <p>${sec.iText[2] || ""}</p>
          </div>

      </div>

  </div>
  `;
}


function initClockOverlayScene(mountEl, sec) {

  const clockImg = sec.content.clockImg || "";
  const overlay = sec.content.overlay || "";

  const fixedNums = [3, 6, 9, 12];
  let fixedHTML = '';
  fixedNums.forEach(n => {
    const pos = NUM_POSITIONS[n];
    fixedHTML += `
    <div class="clock-num-fixed clock-num-preset"
         style="left:${pos.left}%;top:${pos.top}%;transform:translate(-50%,-50%);">
         ${n}
    </div>`;
  });

  mountEl.innerHTML = `
  
  <div class="clock-layout">

      <div class="clock-left">
          <div class="clock-wrapper">

              <div class="clock-img-wrap">
                  <img class="clock-img-base" src="${clockImg}" alt="clock"/>
                  <img class="clock-img-overlay" src="${overlay}" alt="overlay"/>
                  <!-- fixed numbers go on top of overlay -->
                  <div style="position:absolute;inset:0;">
                      ${fixedHTML}
                  </div>
              </div>

          </div>
      </div>

      <div class="clock-right">

          <div class="clock-title">
              <button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button>
              <p>${sec.iText[5] || ""}</p>
          </div>

          <div class="clock-message">
          
          </div>

      </div>

  </div>
  `;
}

function initClockScene4(mountEl, sec) {

  const clockImg = sec.content.clockImg || "";

  const fixedNums = [3, 6, 9, 12];
  let fixedHTML = '';
  fixedNums.forEach(n => {
    const pos = NUM_POSITIONS[n];
    fixedHTML += `
    <div class="clock-num-fixed clock-num-preset"
         style="left:${pos.left}%;top:${pos.top}%;transform:translate(-50%,-50%);">
         ${n}
    </div>`;
  });

  mountEl.innerHTML = `

  <div class="clock-layout">

      <div class="clock-left">
          <div class="clock-wrapper">
              <div class="clock-face"
                   style="background-image:url('${clockImg}')">
                   <div class="clock-center"></div>
                    ${fixedHTML}
              </div>
          </div>
      </div>

      <div class="clock-right">

          <div class="clock-title" id="scenetext6">
              <button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button><p>${sec.iText[6] || ""}</p>
          </div>

      </div>

  </div>
  `;
}

// ── IDLE AUDIO REPEAT SYSTEM ─────────────────────────────────
var _idleTimer = null;
var _idleAudioSrc = null;
var _idleText = null;       // ✅ text to show on idle
var _idleTextSelector = null; // ✅ which element to update

function startIdleAudioTimer(audioSrc, delay, text, textSelector) {
  _idleAudioSrc = audioSrc;
  _idleText = text || null;
  _idleTextSelector = textSelector || null;
  clearIdleAudioTimer();
  _idleTimer = setTimeout(function () {
    // ✅ update text on screen when idle fires
    if (_idleText && _idleTextSelector) {
      const el = document.querySelector(_idleTextSelector);
      if (el) el.innerHTML = _idleText;
    }
    playBtnSounds(_idleAudioSrc, function () {
      // after replay, start timer again so it keeps repeating if still idle
      startIdleAudioTimer(_idleAudioSrc, delay, _idleText, _idleTextSelector);
    });
  }, delay || 5000);
}

function clearIdleAudioTimer() {
  if (_idleTimer) {
    clearTimeout(_idleTimer);
    _idleTimer = null;
  }
}

function resetIdleAudioTimer(audioSrc, delay, text, textSelector) {
  startIdleAudioTimer(audioSrc, delay || 5000, text, textSelector);
}


var _placedNumbers = {}; // stores { num: true } for each placed number
var _fixedNumbers = [3, 6, 9, 12]; // always shown

var _placedCount = 0;

var NUM_POSITIONS = {
  1: { left: 66, top: 22 },
  2: { left: 78, top: 31 },
  3: { left: 84.5, top: 47.5 },
  4: { left: 78, top: 60 },
  5: { left: 67, top: 71 },
  6: { left: 50, top: 77 },
  7: { left: 32, top: 72 },
  8: { left: 20, top: 62 },
  9: { left: 16, top: 48 },
  10: { left: 22.5, top: 33 },
  11: { left: 35, top: 23 },
  12: { left: 49.5, top: 19 }
};

function initNumberArrangeScene(mountEl, sec) {
  clearIdleAudioTimer();
  setTimeout(function () {
    playBtnSounds(sec.content.replayAudios[22], function () {
      const sec = _pageData.sections[sectionCnt - 1];
      const idleText = `<button class='wrapTextaudio playing' id='wrapTextaudio_1'
      data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
      onClick="replayLastAudio(this)"></button>
      <p>${sec.iText[7]}</p>`; // ✅ number drag instruction text
      startIdleAudioTimer(sec.content.replayAudios[22], 5000, idleText, '.number-drag');
    });
  }, 300);

  _placedNumbers = {};  // ← RESET at start of number scene
  _placedCount = 0;

  const clockImg = sec.content.clockImg || "";
  const handGuideImg = sec.content.handGuideImg || "";

  // Numbers already on clock (fixed)
  const fixedNums = [3, 6, 9, 12];

  // Numbers child must drag
  const draggableNums = [1, 2, 4, 5, 7, 8, 10, 11];

  // Clock-face positions (% from top-left of .clock-face)
  const numPositions = NUM_POSITIONS;

  // Build drop slots on the clock face
  let slotsHTML = '';
  draggableNums.forEach(n => {
    const pos = numPositions[n];
    slotsHTML += `
    <div class="drop-slot" id="slot-${n}" data-num="${n}"
         style="left:${pos.left}%;top:${pos.top}%;transform:translate(-50%,-50%);">
    </div>`;
  });

  // Build fixed numbers on the clock face
  let fixedHTML = '';
  fixedNums.forEach(n => {
    const pos = numPositions[n];
    fixedHTML += `
    <div class="clock-num-fixed"
         style="left:${pos.left}%;top:${pos.top}%;transform:translate(-50%,-50%);">
         ${n}
    </div>`;
  });

  // Build draggable number items in the right panel grid
  let gridHTML = draggableNums.map(n => `
    <div class="num-item">
      <div class="num-circle draggable" id="drag-${n}" data-num="${n}">${n}</div>
    </div>
  `).join('');

  mountEl.innerHTML = `

  <div class="clock-layout">

      <div class="clock-left">
          <div class="clock-wrapper">
              <div class="clock-face" id="clockFaceDrop"
                   style="background-image:url('${clockImg}')">
                   <div class="clock-center"></div>
                   ${fixedHTML}
                   ${slotsHTML}
              </div>
          </div>
      </div>

      <div class="clock-right">
      <div class="number-drag">
      <button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button>
          <p>${sec.iText[7]}</p></div>
          <div class="numbers-panel">
              <div class="numbers-grid" id="numbersGrid">
                  ${gridHTML}
              </div>
          </div>
      </div>

  </div>
  `;

  _placedCount = 0;
  _initNumberDragDrop(sec, draggableNums, numPositions);
}

function _buildGuideHandsHTML(sec) {
  const minuteGuide = sec.content.minute_guide || "";
  const secondsGuide = sec.content.seconds_guide || "";

  return `
    <img class="guide-hand-img hour-guide-img"
         src="${secondsGuide}"
         style="pointer-events:none;"
         alt=""/>
    <img class="guide-hand-img minute-guide-img"
         src="${minuteGuide}"
         style=" pointer-events:none;"
         alt=""/>
  `;
}

function _buildGuideHandsHTMLSeconds(sec) {
  const minuteGuide = sec.content.minute_guide || "";
  const secondsGuide = sec.content.seconds_guide || "";

  return `
    <img class="guide-hand-img minute-guide-img"
         src="${minuteGuide}"
         style=" pointer-events:none;"
         alt=""/>
  `;
}


function _initNumberDragDrop(sec, draggableNums, numPositions) {

  // startIdleAudioTimer(sec.content.replayAudios[22], 5000);

  draggableNums.forEach(n => {

    const dragEl = document.getElementById('drag-' + n);
    if (!dragEl) return;

    let ghost = null;
    let offsetX = 0;
    let offsetY = 0;
    let currentScale = 1;
    // ← Use animat-container as the ghost parent — it spans the full body area
    const ghostParent = document.querySelector('.animat-container');

    dragEl.addEventListener('mousedown', onDragStart);
    dragEl.addEventListener('touchstart', onDragStart, { passive: false });

    function onDragStart(e) {
      clearIdleAudioTimer();
      e.preventDefault();

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // Detect scale
      const wrapper = document.getElementById('f_wrapper') || document.body;
      currentScale = wrapper.getBoundingClientRect().width / wrapper.offsetWidth;

      // Offset = where inside the element user clicked, scaled
      const rect = dragEl.getBoundingClientRect();
      offsetX = (clientX - rect.left) / currentScale;
      offsetY = (clientY - rect.top) / currentScale;

      // Hide original
      dragEl.style.color = 'transparent';
      dragEl.style.pointerEvents = 'none';

      // Build ghost
      ghost = document.createElement('div');
      ghost.classList.add('ghost');

      ghost.style.width = dragEl.offsetWidth + 'px';
      ghost.style.height = dragEl.offsetHeight + 'px';
      // ghost.style.cssText = `
      //   position: absolute;
      //   width: ${dragEl.offsetWidth}px;
      //   height: ${dragEl.offsetHeight}px;
      //   z-index: 99999;
      //   pointer-events: none;
      //   border-radius: 50%;
      //   background: transparent;
      //   display: flex;
      //   justify-content: center;
      //   align-items: center;
      //   font-size: 3rem;
      //   font-weight: bold;
      //   color: #000;
      //   font-family: inherit;
      //   margin: 0;
      //   transform: none;
      //   top: 0;
      //   left: 0;
      // `;
      ghost.textContent = n;

      // ← Append to animat-container, not num-item
      ghostParent.appendChild(ghost);

      // Position immediately so there's no 0,0 flash
      moveAt(clientX, clientY);

      document.addEventListener('mousemove', onDragMove);
      document.addEventListener('touchmove', onDragMove, { passive: false });
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('touchend', onDragEnd);
    }

    function moveAt(clientX, clientY) {
      if (!ghost) return;
      // ← parentRect from ghostParent (animat-container), same container ghost lives in
      const parentRect = ghostParent.getBoundingClientRect();
      const posX = (clientX - parentRect.left) / currentScale - offsetX;
      const posY = (clientY - parentRect.top) / currentScale - offsetY;
      ghost.style.left = posX + 'px';
      ghost.style.top = posY + 'px';
    }

    function onDragMove(e) {
      if (!ghost) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      moveAt(clientX, clientY);
    }

    function onDragEnd(e) {
      if (!ghost) return;

      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('touchmove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchend', onDragEnd);

      ghost.parentNode.removeChild(ghost);
      ghost = null;

      const slot = document.getElementById('slot-' + n);
      if (!slot) {
        dragEl.style.opacity = '1';
        dragEl.style.pointerEvents = 'auto';
        return;
      }

      const slotRect = slot.getBoundingClientRect();
      const hit = (
        clientX >= slotRect.left && clientX <= slotRect.right &&
        clientY >= slotRect.top && clientY <= slotRect.bottom
      );

      if (hit) {
        dragEl.style.opacity = '1';
        dragEl.style.pointerEvents = 'auto';
        dragEl.classList.add('placed');

        slot.innerHTML = n;
        slot.style.border = 'none';
        slot.classList.add("slot");
        // slot.style.fontSize = '3rem';
        // slot.style.fontWeight = 'bold';
        slot.style.color = '#000';
        slot.style.display = 'flex';
        slot.style.justifyContent = 'center';
        slot.style.alignItems = 'center';

        _placedNumbers[n] = true;
        _placedCount++;

        // const numItem = dragEl.closest('.num-item');
        // if (numItem) numItem.style.visibility = 'hidden';
        dragEl.style.color = 'transparent';
        dragEl.style.pointerEvents = 'none';
        dragEl.style.cursor = 'default';

        const audios = sec.correctAudio || [];

        let audioToPlay = "";

        if (Array.isArray(audios) && audios.length > 0) {
          audioToPlay = audios[(_placedCount - 1) % audios.length];
        }

        // ✅ Play correct audio
        playBtnSounds(audioToPlay, function () {
          if (_placedCount === draggableNums.length) {
            clearIdleAudioTimer();
            const mountEl = $("#section-" + sectionCnt).find(".animat-container")[0];
            const sec = _pageData.sections[sectionCnt - 1];
            initNumbersFixedScene(mountEl, sec);
          } else {
            const sec = _pageData.sections[sectionCnt - 1];
            const idleText = `<button class='wrapTextaudio playing' id='wrapTextaudio_1'
      data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
      onClick="replayLastAudio(this)"></button>
      <p>${sec.iText[7]}</p>`; // ✅ number drag instruction text
            resetIdleAudioTimer(sec.content.replayAudios[22], 5000, idleText, '.number-drag');
          }
        });

      } else {
        dragEl.style.opacity = '1';
        dragEl.style.pointerEvents = 'auto';
        dragEl.style.color = '#000';
        const sec = _pageData.sections[sectionCnt - 1];
        playBtnSounds(sec.wrongAudio || "");
        const idleText = `<button class='wrapTextaudio playing' id='wrapTextaudio_1'
      data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
      onClick="replayLastAudio(this)"></button><p>${sec.iText[7]}</p>`;
        resetIdleAudioTimer(sec.content.replayAudios[22], 5000, idleText, '.number-drag');
      }
    }

  });
}

function _buildClockNumbersHTML() {

  let html = '';

  // Fixed numbers (always there)
  _fixedNumbers.forEach(n => {
    const pos = NUM_POSITIONS[n];
    html += `
    <div class="clock-num-fixed"
         style="left:${pos.left}%;top:${pos.top}%;transform:translate(-50%,-50%);">
         ${n}
    </div>`;
  });

  // Placed numbers (whatever child has dropped)
  Object.keys(_placedNumbers).forEach(n => {
    const pos = NUM_POSITIONS[n];
    html += `
    <div class="clock-num-fixed"
         style="left:${pos.left}%;top:${pos.top}%;transform:translate(-50%,-50%);">
         ${n}
    </div>`;
  });

  return html;
}

// ── SCENE 6: Numbers complete, something still missing ────────
function initNumbersFixedScene(mountEl, sec) {
  clearIdleAudioTimer();

  const clockImg = sec.emptyClock || "";
  const minuteGuide = sec.content.minute_guide || "";
  const secondsGuide = sec.content.seconds_guide || "";

  mountEl.innerHTML = `
  <div class="clock-layout">

      <div class="clock-left">
          <div class="clock-wrapper">
              <div class="clock-face" id="clockFaceDrop"
                   style="background-image:url('${clockImg}')">
                   <div class="clock-center"></div>
                   ${_buildClockNumbersHTML()}
                   ${_buildGuideHandsHTML(sec)}
              </div>
          </div>
      </div>

      <div class="clock-right">
          <div class="clock-title">
          <button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button>    
          <p>${sec.iText[8] || "Yay! The Numbers are fixed"}</p>
          </div>
      </div>

  </div>
  `;

  playBtnSounds(sec.content.replayAudios[5], function () {
    initHandIntroScene(mountEl, sec);
  });
}


// ── SCENE 7: Show both hands on right, intro to dragging ─────
function initHandIntroScene(mountEl, sec) {

  const clockImg = sec.emptyClock || "";
  const hourImg = sec.content.hands.hour || "";
  const minuteImg = sec.content.hands.minute || "";
  const minuteGuide = sec.content.minute_guide || "";
  const secondsGuide = sec.content.seconds_guide || "";

  mountEl.innerHTML = `
  <div class="clock-layout">

      <div class="clock-left">
          <div class="clock-wrapper">
              <div class="clock-face"
                   style="background-image:url('${clockImg}')">
                   <div class="clock-center"></div>
                 ${_buildClockNumbersHTML()}
                  ${_buildGuideHandsHTML(sec)}   <!-- ← ADD -->
              </div>
          </div>
      </div>

      <div class="clock-right">
          <div class="clock-title" id="handIntroText">
<button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button>
              <p>${sec.iText[10] || "Now let's add the clock hands."}</p>
          </div>
          <div class="hands-panel">
              <div class="hand-display">
                  <img class="hand-preview hour-preview" src="${hourImg}" alt="hour hand"/>
              </div>
              <div class="hand-display">
                  <img class="hand-preview minute-preview" src="${minuteImg}" alt="minute hand"/>
              </div>
          </div>
      </div>

  </div>
  `;


  playBtnSounds(sec.content.replayAudios[6], function () {

    $("#handIntroText").fadeOut(250, function () {

      $(this).html(`<button
        class='wrapTextaudio playing'
        id='wrapTextaudio_2'
        data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
        onClick="replayLastAudio(this)">
      </button><p>` + (sec.iText[11] || "Drag them onto the clock!") + `</p>`).fadeIn(250);

      // SECOND TEXT AUDIO
      playBtnSounds(sec.content.replayAudios[23], function () {
        initHourHandDragScene(mountEl, sec);
      });

    });
  });
}


// ── SCENE 8: Drag hour hand onto clock ───────────────────────
function initHourHandDragScene(mountEl, sec) {
  clearIdleAudioTimer();

  const clockImg = sec.emptyClock || "";
  const hourImg = sec.content.hands.hour || "";

  mountEl.innerHTML = `
  <div class="clock-layout">

      <div class="clock-left">
          <div class="clock-wrapper">
              <div class="clock-face" id="clockFaceHour"
                   style="background-image:url('${clockImg}')">
                   <div class="clock-center"></div>
                   ${_buildClockNumbersHTML()}
                   ${_buildGuideHandsHTML(sec)}   <!-- ← ADD -->
                   <!-- Drop zone for hour hand on clock -->
                   <div class="hand-drop-zone" id="hourDropZone"></div>
              </div>
          </div>
      </div>

      <div class="clock-right">
          <div class="clock-title">
          <button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button>
              <p>${sec.iText[12] || "This is the <span class='red'>short hand.</span>"}</p>
          </div>
          <div class="hands-panel">
              <div class="hand-display" id="hourHandContainer">
                  <img class="hand-preview draggable-hand draggable-hand-hour" id="hourHandDrag"
                       src="${hourImg}" alt="hour hand" style="transform:rotate(270deg)"/>
              </div>
          </div>
      </div>

  </div>
  `;

  // ❗ Disable drag initially (optional but recommended)
  let dragEnabled = false;

  // ✅ PLAY FIRST AUDIO WHEN SCENE LOADS
  playBtnSounds(sec.content.replayAudios[7], function () {
    const sec = _pageData.sections[sectionCnt - 1];
    // After first audio finishes → enable drag
    dragEnabled = true;
    const idleText = `<button class='wrapTextaudio playing' id='wrapTextaudio_1'
    data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
    onClick="replayLastAudio(this)"></button>
    <p>${sec.content.shortHandReplayText || ""}</p>`; // ✅ same text as scene shows

    startIdleAudioTimer(sec.content.shortHandReplay, 5000, idleText, '.clock-title'); // ✅ ADD
  });

  _initHandDropDrag('hourHandDrag', 'clockFaceHour', function () {
    $('.hour-guide-img').css("display", "none");
    // Replace title text with second text
    const titleEl = document.querySelector(".clock-title");
    if (titleEl) {
      const text = `<button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button><p>`
      titleEl.innerHTML = text + (sec.iText[13] || "The <span class='red'>short hand</span> shows the hour.") + `</p>`;
    }
    $('.hands-panel').css("display", "none");
    playBtnSounds(sec.content.replayAudios[20], function () {
      initMinuteHandDragScene(mountEl, sec);
    });
  }, 'hour-hand-img', 270);
}


// ── SCENE 9: Drag minute hand onto clock ─────────────────────
function initMinuteHandDragScene(mountEl, sec) {

  const clockImg = sec.emptyClock || "";
  const hourImg = sec.content.hands.hour || "";
  const minuteImg = sec.content.hands.minute || "";

  mountEl.innerHTML = `
  <div class="clock-layout">

      <div class="clock-left">
          <div class="clock-wrapper">
              <div class="clock-face" id="clockFaceMinute"
                   style="background-image:url('${clockImg}')">
                   <div class="clock-center"></div>
                   ${_buildClockNumbersHTML()}   <!-- ← ADD -->
                    ${_buildGuideHandsHTMLSeconds(sec)}   <!-- ← ADD -->
                   <!-- Hour hand already placed (fixed) -->
                   <img class="clock-hand-img hour-hand-img"
                        src="${hourImg}"
                        style="transform:rotate(270deg); pointer-events:none;"
                        alt="hour hand placed"/>
                   <!-- Drop zone for minute hand -->
                   <div class="hand-drop-zone" id="minuteDropZone"></div>
              </div>
          </div>
      </div>

      <div class="clock-right">
          <div class="clock-title">
          <button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button>
              <p>${sec.iText[14] || "The <span class='red'>long hand</span> shows the minutes."}</p>
          </div>
          <div class="hands-panel">
              <div class="hand-display" id="minuteHandContainer">
                  <img class="hand-preview draggable-hand draggable-hand-minute" id="minuteHandDrag"
                       src="${minuteImg}" alt="minute hand"/>
              </div>
          </div>
      </div>

  </div>
  `;

  // ❗ Disable drag initially (optional but recommended)
  let dragEnabled = false;

  // ✅ PLAY FIRST AUDIO WHEN SCENE LOADS
  playBtnSounds(sec.content.replayAudios[8], function () {
    const sec = _pageData.sections[sectionCnt - 1];
    // After first audio finishes → enable drag
    dragEnabled = true;
    const idleText = `<button class='wrapTextaudio playing' id='wrapTextaudio_1'
    data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
    onClick="replayLastAudio(this)"></button>
    <p>${sec.content.longHandReplayText || ""}</p>`; // ✅ same text as scene shows
    startIdleAudioTimer(sec.content.longHandReplay, 5000, idleText, '.clock-title');
  });

  _initHandDropDrag('minuteHandDrag', 'clockFaceMinute', function () {
    $('.minute-guide-img').css("display", "none");
    // Replace title text with second text
    const titleEl = document.querySelector(".clock-title");
    if (titleEl) {
      const text = `<button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button><p>`
      titleEl.innerHTML = text + (sec.iText[15] || "The <span class='red'>long hand</span> shows the minutes.") + `</p>`;
    }
    $('.hands-panel').css("display", "none");
    // Both hands placed → now go to HAND_TASKS (3 o'clock etc.)
    playBtnSounds(sec.content.replayAudios[21], function () {
      initHandScene(mountEl, sec, 0);
    });
  }, 'minute-hand-img', 0);
}


// ── DRAG HAND ONTO CLOCK (drop anywhere on clock face) ───────



function _initHandDropDrag(handId, faceId, onSuccess, handClass, defaultAngle) {

  const hand = document.getElementById(handId);
  const face = document.getElementById(faceId);
  if (!hand || !face) return;

  let ghost = null;
  let offsetX = 0;
  let offsetY = 0;
  let currentScale = 1;
  const ghostParent = document.querySelector('.animat-container');

  function onStart(e) {
    clearIdleAudioTimer();
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Detect scale
    const wrapper = document.getElementById('f_wrapper') || document.body;
    currentScale = wrapper.getBoundingClientRect().width / wrapper.offsetWidth;

    // Capture click offset within the hand image
    const rect = hand.getBoundingClientRect();
    offsetX = (clientX - rect.left) / currentScale;
    offsetY = (clientY - rect.top) / currentScale;

    // Hide original
    hand.style.opacity = '0';
    hand.style.pointerEvents = 'none';

    // Build ghost matching hand image exactly
    ghost = document.createElement('img');
    ghost.src = hand.src;
    ghost.style.cssText = `
      position: absolute;
      width: ${hand.offsetWidth}px;
      height: ${hand.offsetHeight}px;
      z-index: 99999;
      pointer-events: none;
      margin: 0;
      transform: ${hand.style.transform || 'none'};
      object-fit: contain;
      top: 0;
      left: 0;
    `;
    ghostParent.appendChild(ghost);

    // Position immediately — no 0,0 flash
    moveAt(clientX, clientY);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
  }

  function moveAt(clientX, clientY) {
    if (!ghost) return;
    const parentRect = ghostParent.getBoundingClientRect();

    const isRotated = (hand.style.transform || '').includes('270') || (hand.style.transform || '').includes('90');
    const nudgeX = isRotated ? 25 : 0;  // +5px right for hour hand
    const nudgeY = isRotated ? -25 : 0; // -5px top for hour hand (negative = up)

    const posX = (clientX - parentRect.left) / currentScale - offsetX + nudgeX;
    const posY = (clientY - parentRect.top) / currentScale - offsetY + nudgeY;
    ghost.style.left = posX + 'px';
    ghost.style.top = posY + 'px';
  }

  function onMove(e) {
    if (!ghost) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    moveAt(clientX, clientY);
  }

  function onEnd(e) {
    if (!ghost) return;

    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchend', onEnd);

    ghost.parentNode.removeChild(ghost);
    ghost = null;

    // Restore hand visibility
    hand.style.opacity = '1';
    hand.style.pointerEvents = 'auto';

    const faceRect = face.getBoundingClientRect();
    const hit = (
      clientX >= faceRect.left && clientX <= faceRect.right &&
      clientY >= faceRect.top && clientY <= faceRect.bottom
    );

    if (hit) {
      clearIdleAudioTimer();
      // ✅ Dropped on clock — move hand into face
      hand.style.opacity = '';
      hand.style.pointerEvents = 'none';
      hand.style.cursor = 'default';

      face.appendChild(hand);
      hand.className = 'clock-hand-img ' + (handClass || 'hour-hand-img');
      hand.style.transform = 'rotate(' + (defaultAngle || 0) + 'deg)';

      // Hide the container on right
      const container = hand.closest('.hand-display') || document.getElementById(handId.replace('Drag', 'Container'));
      if (container) container.style.visibility = 'hidden';

      playBtnSounds('', function () { });
      setTimeout(onSuccess, 500);

    } else {
      resetIdleAudioTimer(_idleAudioSrc, 5000,_idleText, _idleTextSelector);
      // ❌ Snap back — already restored above
      hand.style.cursor = 'grab';
    }
  }

  hand.style.cursor = 'grab';
  hand.addEventListener('mousedown', onStart);
  hand.addEventListener('touchstart', onStart, { passive: false });
}

// ─── HAND DRAG SCENES (6, 7, 8, 9) ───────────────────────────

var HAND_TASKS = [
  { targetHour: 3, minuteAngle: 0, startAngle: 270, instructionIdx: 16, successIdx: 17, confettiIdx: 9, instructAudio: 9, completeAudio: 10, idleAudio: 'replay3', idleTextIdx: 'replay3Text' },
  { targetHour: 6, minuteAngle: 0, startAngle: 90, instructionIdx: 18, successIdx: 19, confettiIdx: 10, instructAudio: 11, completeAudio: 12, idleAudio: 'replay6', idleTextIdx: 'replay6Text' },
  { targetHour: 9, minuteAngle: 0, startAngle: 180, instructionIdx: 20, successIdx: 21, confettiIdx: 11, instructAudio: 13, completeAudio: 14, idleAudio: 'replay9', idleTextIdx: 'replay9Text' },
  { targetHour: 12, minuteAngle: 0, startAngle: 270, instructionIdx: 22, successIdx: 23, confettiIdx: 12, instructAudio: 15, completeAudio: 16, idleAudio: 'replay12', idleTextIdx: 'replay12Text' }
];

var _currentTaskIdx = 0;
function initHandScene(mountEl, sec, taskIdx) {
  clearIdleAudioTimer();

  _currentTaskIdx = taskIdx;
  const task = HAND_TASKS[taskIdx];
  const clockImg = sec.content.clockCompleteImg || "";
  const hourHandImg = sec.content.hands.hour || "";
  const minuteHandImg = sec.content.hands.minute || "";

  const targetAngle = task.targetHour === 12 ? 0 : task.targetHour * 30;
  const startAngle = task.startAngle || 270;

  mountEl.innerHTML = `

  <div class="clock-layout">

      <div class="clock-left">
          <div class="clock-wrapper">
              <div class="clock-face clock-face--complete" id="clockFaceHands"
                   style="background-image:url('${clockImg}')">

                   <div class="clock-center"></div>
                   ${_buildClockNumbersHTML()}   <!-- ← ADD -->

                   <!-- Minute hand image (fixed first, draggable after hour placed) -->
                   <img class="clock-hand-img minute-hand-img" id="minuteHandImg"
                        src="${minuteHandImg}"
                        style="transform:rotate(${task.minuteAngle}deg); pointer-events:none;"
                        alt="minute hand"/>

                   <!-- Hour hand image (draggable first) -->
                   <img class="clock-hand-img hour-hand-img" id="hourHandImg"
                        src="${hourHandImg}"
                        style="transform:rotate(${startAngle}deg);"
                        alt="hour hand"/>

                   <!-- Target ring -->
                   <div class="target-ring" id="targetRing"
                        style="left:${_getNumPos(task.targetHour).left}%;
                               top:${_getNumPos(task.targetHour).top}%;">
                   </div>

              </div>
          </div>
      </div>

      <div class="clock-right">
          <div class="clock-title" id="handInstruction">
          <button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button>
              <p>${sec.iText[task.instructionIdx] || ""}</p>
          </div>
      </div>

  </div>
  `;

  // Step 1: drag hour hand first
  // ✅ Play instruction audio first, then enable dragging
  playBtnSounds(sec.content.replayAudios[task.instructAudio], function () {
    const idleAudioSrc = sec.content[task.idleAudio];
    const idleText = `<button class='wrapTextaudio playing' id='wrapTextaudio_1'
    data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
    onClick="replayLastAudio(this)"></button>
    <p>${sec.content[task.idleTextIdx] || ""}</p>`; // ✅ same as instruction text
    console.log(sec.content[task.idleTextIdx], "checking what cominggg")
    startIdleAudioTimer(idleAudioSrc, 5000, idleText, '#handInstruction');
    _initImgHandDrag(
      'hourHandImg',
      targetAngle,
      startAngle,
      20,
      function onHourSuccess() {
        clearIdleAudioTimer();
        _onHandSuccess(mountEl, sec, task);
      },
      false,  // ← isMinute = false for hour hand
      sec
    );
  });
}


// ✅ CORRECT
function _getNumPos(num) {
  return NUM_POSITIONS[num] || { left: 50, top: 50 };
}

function _initImgHandDrag(handId, targetAngle, startAngle, tolerance, onSuccess, isMinute, sec) {

  const face = document.getElementById('clockFaceHands');
  const hand = document.getElementById(handId);
  if (!face || !hand) return;

  let isDragging = false;
  let currentAngle = startAngle;
  let lastAngle = 0;
  let angleBeforeDrag = startAngle;  // ← ADD THIS

  function getAngle(clientX, clientY) {
    const rect = face.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI + 90;
  }

  function onStart(e) {
    clearIdleAudioTimer();
    e.preventDefault();
    isDragging = true;
    hand.style.cursor = 'grabbing';
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    lastAngle = getAngle(clientX, clientY);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
  }

  function onMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const angle = getAngle(clientX, clientY);
    let delta = angle - lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    currentAngle += delta;
    lastAngle = angle;
    hand.style.transform = `rotate(${currentAngle}deg)`;
  }

  function onEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    hand.style.cursor = 'grab';

    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchend', onEnd);

    // Normalize to 0-360
    let normalized = ((currentAngle % 360) + 360) % 360;
    let diff = Math.abs(normalized - targetAngle);
    if (diff > 180) diff = 360 - diff;

    if (diff <= tolerance) {
      clearIdleAudioTimer();

      // Calculate full 360 based on current direction
      let finalAngle = targetAngle;

      // Keep rotation direction same (no reverse snap)
      let base = Math.floor(currentAngle / 360) * 360;
      finalAngle = base + targetAngle;

      if (targetAngle === 0) {
        // Pick the multiple of 360 closest to currentAngle
        let candidate1 = base + 0;
        let candidate2 = base + 360;
        let candidate3 = base - 360;
        let distances = [candidate1, candidate2, candidate3].map(c => ({ c, d: Math.abs(c - currentAngle) }));
        distances.sort((a, b) => a.d - b.d);
        finalAngle = distances[0].c;
      }

      hand.style.transition = 'transform 0.3s ease';
      hand.style.transform = `rotate(${finalAngle}deg)`;
      currentAngle = finalAngle;

      setTimeout(() => { hand.style.transition = ''; }, 350);

      // Lock it — no more dragging
      hand.style.cursor = 'default';
      hand.style.pointerEvents = 'none';

      // Remove target ring if hour hand placed
      if (!isMinute) {
        const ring = document.getElementById('targetRing');
        if (ring) ring.classList.add('target-ring--done');
      }

      // Play correct sound then callback
      // playBtnSounds(sec.content.correctAudio || "", function () {
      //   if (typeof onSuccess === 'function') onSuccess();
      // });
      // Directly call success — no correct audio
      setTimeout(() => {
        if (typeof onSuccess === 'function') onSuccess();
      }, 350);

    } else {

      // ❌ Snap back to where drag started, shake in-place without CSS class
      const snapBack = angleBeforeDrag;
      currentAngle = snapBack;

      hand.style.transition = 'transform 0.15s ease';
      hand.style.transform = `rotate(${snapBack + 8}deg)`;

      setTimeout(() => {
        hand.style.transform = `rotate(${snapBack - 8}deg)`;
        setTimeout(() => {
          hand.style.transform = `rotate(${snapBack + 5}deg)`;
          setTimeout(() => {
            hand.style.transform = `rotate(${snapBack}deg)`;
            setTimeout(() => { hand.style.transition = ''; }, 150);
          }, 100);
        }, 100);
      }, 100);

      // Play wrong sound
      resetIdleAudioTimer(_idleAudioSrc, 5000, _idleText, _idleTextSelector);
      playBtnSounds(sec.content.wrongAudio || "");
    }
  }

  hand.addEventListener('mousedown', onStart);
  hand.addEventListener('touchstart', onStart, { passive: false });
}


function _initHandRotateDrag(mountEl, sec, task, targetAngle, startAngle) {

  const face = document.getElementById('clockFaceHands');
  const hand = document.getElementById('hourHand');
  if (!face || !hand) return;

  let isDragging = false;
  let currentAngle = startAngle;
  let lastMouseAngle = 0;
  const SNAP_TOLERANCE = 20;

  function _getAngleFromCenter(clientX, clientY) {
    const rect = face.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI + 90;
  }

  function onStart(e) {
    e.preventDefault();
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    lastMouseAngle = _getAngleFromCenter(clientX, clientY);
  }

  function onMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const mouseAngle = _getAngleFromCenter(clientX, clientY);
    let delta = mouseAngle - lastMouseAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    currentAngle += delta;
    lastMouseAngle = mouseAngle;
    hand.style.transform = `rotate(${currentAngle}deg)`;
  }

  function onEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    let normalized = ((currentAngle % 360) + 360) % 360;
    let diff = Math.abs(normalized - targetAngle);
    if (diff > 180) diff = 360 - diff;

    if (diff <= SNAP_TOLERANCE) {
      // ✅ Correct — snap
      hand.style.transition = 'transform 0.3s ease';
      hand.style.transform = `rotate(${targetAngle}deg)`;
      setTimeout(() => { hand.style.transition = ''; }, 350);

      _onHandSuccess(mountEl, sec, task);

    } else {
      // ❌ Wrong — shake hand
      hand.classList.add('hand-shake');
      setTimeout(() => hand.classList.remove('hand-shake'), 500);
    }

    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchend', onEnd);
  }

  hand.addEventListener('mousedown', onStart);
  hand.addEventListener('touchstart', onStart, { passive: false });

  function attachMove() {
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchend', onEnd);
  }

  hand.addEventListener('mousedown', attachMove);
  hand.addEventListener('touchstart', attachMove, { passive: false });
}


function _onHandSuccess(mountEl, sec, task) {

  // Update text
  const instrEl = document.getElementById('handInstruction');
  if (instrEl) {
    const text = `<button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button><p>`
    instrEl.innerHTML = text + (sec.iText[task.successIdx] || "") + `</p>`;
  }

  // Remove target ring pulse
  const ring = document.getElementById('targetRing');
  if (ring) ring.classList.add('target-ring--done');

  // Show confetti
  $(".animations").addClass("show");

  playBtnSounds(sec.content.replayAudios[task.completeAudio], function () {

    $(".animations").removeClass("show");

    _currentTaskIdx++;

    if (_currentTaskIdx < HAND_TASKS.length) {
      // Next hand task
      initHandScene(mountEl, sec, _currentTaskIdx);
    } else {
      // All done → Scene 10
      initCelebrationScene(mountEl, sec);
    }

  });
}


// ─── SCENE 10: Celebration ────────────────────────────────────

function initCelebrationScene(mountEl, sec) {
  clearIdleAudioTimer();

  // const endClockImg = sec.content.endClock || "";
  // const hourImg = sec.content.hands.hour || "";
  // const minuteHandImg = sec.content.hands.minute || "";

  mountEl.innerHTML = `

  <div class="clock-layout clock-layout--celebration">

      <div class="clock-left clock-left--wide">
          <div class="clock-title celebration-title">
              ${sec.iText[24] || ""}<button
                class='wrapTextaudio playing'
                id='wrapTextaudio_1'
                data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}"
                onClick="replayLastAudio(this)">
              </button>
          </div>
          <div class="clock-wrapper clock-wrapper--large">
              <img class="end-clock-img" src="${_pageData.sections[sectionCnt - 1].endClock}" alt="completed clock"/>
              <div class="sparkle-wrap">
                  <span class="sparkle-star">✦</span>
                  <span class="sparkle-star">✦</span>
                  <span class="sparkle-star">✦</span>
              </div>
          </div>
      </div>

  </div>
  `;

  $(".animations").addClass("show");

  playBtnSounds(sec.content.replayAudios[17], function () {
    $(".animations").removeClass("show");
    _showCompletedPopup();
  });
}


// ─── SCENE 11: Simulation Completed Popup ────────────────────

function _showCompletedPopup() {

  pageVisited();

  $(".greetingsPop").css({ visibility: "visible", opacity: "1" });
  $(".confetti").addClass("show");
  playBtnSounds(_pageData.sections[sectionCnt - 1].finalAudio);
  audioEnd(function () {
    setTimeout(function () {
      $(".greetingsPop").css({ visibility: "hidden", opacity: "0" });
      $(".popup").css({ visibility: "visible", opacity: "1" });
    }, 1500);
    setTimeout(function () {
      $(".confetti").removeClass("show");
      // $(".confetti").hide();                
    }, 2000);
  })

  // Re-bind buttons since innerHTML was replaced
  $("#refresh").on("click", function () {
    $(".popup").css({ opacity: "0", visibility: "hidden" });
    jumtoPage(_controller.pageCnt);
  });

  $("#homeBack").on("click", function () {
    $(".playPause").hide();
    jumtoPage(0);
  });
}





function playPauseSimulation(btn) {
  playClickThen();
  var audio = document.getElementById("simulationAudio");
  var hasAudio = !!audio.getAttribute("src");

  _isSimulationPaused = !_isSimulationPaused;

  if (_isSimulationPaused) {
    // Pause state
    // ✅ Only pause if audio is actually playing right now
    if (hasAudio && !audio.paused && !audio.ended) {
      audio.pause();
    }
    disableAll();
    btn.classList.remove("play");
    btn.classList.add("pause");
    btn.dataset.tooltip = "Play";
  } else {
    // Play state
    // ✅ Only resume if audio is paused mid-way — not if it already ended
    if (hasAudio && audio.paused && !audio.ended && audio.currentTime > 0) {
      audio.play().catch(() => { });
    }
    enableAll();
    btn.classList.remove("pause");
    btn.classList.add("play");
    btn.dataset.tooltip = "Pause";
  }
}


function enableAll() {
  playClickThen();
  window.enableClockControls();
  // window.enableIdleStart();
  $(".home_btn, .music,.introInfo,#full-screen, .wrapTextaudio").prop("disabled", false);
  const audio = document.getElementById("audio_src");
  if (_controller._globalMusicPlaying) {
    audio.muted = false;
    audio.play();
  }

}



function disableAll() {
  playClickThen();
  window.disableClockControls();
  // window.disableIdleStart();
  $(".home_btn, .music,.introInfo,#full-screen,.wrapTextaudio").prop("disabled", true);
  const audio = document.getElementById("audio_src");
  if (_controller._globalMusicPlaying) {
    audio.pause();
  }
}

window.enableClockControls = function () {
  $(".draggable").prop("disabled", false);
  $(".draggable").css({ "pointerEvents": "auto" });

  $(".draggable-hand").prop("disabled", false);
  $(".draggable-hand").css({ "pointerEvents": "auto" });

  $(".hour-hand-img").prop("disabled", false);
  $(".hour-hand-img").css({ "pointerEvents": "auto" });

  $(".minute-hand-img").prop("disabled", false);
  $(".minute-hand-img").css({ "pointerEvents": "auto" });

  $(".target-ring").css("display", "block");
  console.log("Clock controls enabled");
};

// DISABLE movement + controls
window.disableClockControls = function () {
  $(".draggable").prop("disabled", true);
  $(".draggable").css({ "pointerEvents": "none" });

  $(".draggable-hand").prop("disabled", true);
  $(".draggable-hand").css({ "pointerEvents": "none" });

  $(".hour-hand-img").prop("disabled", true);
  $(".hour-hand-img").css({ "pointerEvents": "none" });

  $(".minute-hand-img").prop("disabled", true);
  $(".minute-hand-img").css({ "pointerEvents": "none" });

  $(".target-ring").css("display", "none");
  console.log("Clock controls disabled");
};

// ENABLE idle system
// window.enableIdleStart = function () {
//   if (isGameActive) {
//     resetIdleTimer();
//   }
//   console.log("Idle enabled");
// };

// // DISABLE idle system
// window.disableIdleStart = function () {
//   stopIdleTimer();
//   console.log("Idle disabled");
// };


function updateText(txt, audio) {


  $("#simulationAudio").on("ended", function () {
    $(".wrapTextaudio")
      .removeClass("playing")
      .addClass("paused");
    // console.log("audio ended");
  });



  let text = `
    <p tabindex="0" aria-label="${removeTags(txt)}">
      ${txt}
      <button 
        class="wrapTextaudio paused"
        onclick="replayLastAudio(this, '${audio}')">
      </button>
    </p>
  `;


  $(".inst").html(text);
  $(".wrapTextaudio")
    .removeClass("paused")
    .addClass("playing");
}

function playFeedbackAudio(_audio) {
  $(".dummy-patch").show();
  playBtnSounds(_audio)
  audioEnd(function () {
    $(".dummy-patch").hide();
  })
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
  $(".playPause").hide();
  jumtoPage(0);
}

function jumtoPage(pageNo) {
  playClickThen();

  _controller.pageCnt = pageNo;
  console.log(pageNo, "pageNumber");

  _controller.updateViewNow();
}


var activeAudio = null;


function playBtnSounds(soundFile, callback) {
  const audio = document.getElementById("simulationAudio");

  audio.muted = false;

  if (!soundFile) {
    console.warn("Audio source missing!");
    // If audio is missing but a callback exists, we should probably run it 
    // so the flow doesn't hang, or just return.
    if (callback) callback();
    return;
  }

  // 1. CRITICAL: Clear any existing onended triggers from previous plays
  audio.onended = null;

  // Stop previous audio if it exists
  if (activeAudio && !activeAudio.paused) {
    activeAudio.pause();
  }

  audio.loop = false;
  audio.src = soundFile;
  audio.load();

  activeAudio = audio;

  // 2. If a callback is provided, attach it
  if (typeof callback === "function") {
    audio.onended = () => {
      // Remove self to prevent future loops
      audio.onended = null;
      callback();
    };
  }

  console.log("Playing:", soundFile);
  audio.play().catch((err) => {
    console.warn("Audio play error:", err);
    // Optional: If play fails, should we trigger callback?
    // if (callback) callback(); 
  });
}



function resetSimulationAudio() {
  console.log("Balajia");

  const audioElement = document.getElementById("simulationAudio");
  if (!audioElement) return;

  audioElement.pause();

  audioElement.src = "";
  audioElement.removeAttribute("src");

  const source = audioElement.querySelector("source");
  if (source) source.src = "";

  audioElement.load();
  audioElement.onended = null;
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

// var isEndAnimationTriggered = false;

// function showEndAnimations() {
//   if (isEndAnimationTriggered) return;
//   isEndAnimationTriggered = true;

//   console.log("showEndAnimations initiated");

//   // Cleanup previous states
//   closePopup('introPopup-1');
//   pageVisited();

//   const $audio = $("#simulationAudio");

//   // Remove previous timeupdate listeners to prevent stacking
//   $audio.on("timeupdate", function () {
//     // var currentTime = this.currentTime;
//     setTimeout(function () {
//       $(".greetingsPop").css({ visibility: "visible", opacity: "1" });
//       $(".confetti").addClass("show");

//       // 🔊 PLAY FINAL AUDIO
//       playBtnSounds(_pageData.sections[sectionCnt - 1].finalAudio);
//       audioEnd(function () {
//         const audio = document.getElementById("simulationAudio");
//         audio.onended = null; // 🚫 prevent repeat

//         setTimeout(function () {
//           $(".greetingsPop").css({ visibility: "hidden", opacity: "0" });
//           $(".popup").css({ visibility: "visible", opacity: "1" });
//         }, 500);

//         setTimeout(function () {
//           $(".confetti").removeClass("show");
//         }, 800);

//       })
//       $audio.off("timeupdate");
//     }, 400)
//   })
//   //  else {
//   //     // Fallback if no audio exists
//   //     $(".popup").css({ visibility: "visible", opacity: "1", display: "flex" });
//   //   }
// }

// function showEndAnimations() {
//   var $audio = $("#simulationAudio");
//   closePopup('introPopup-1');
//   console.log("Audio ending");
//   pageVisited();

//   $audio.on("timeupdate", function () {
//     var currentTime = this.currentTime;
//     $(".greetingsPop").css("visibility", "visible");
//     $(".greetingsPop").css("opacity", "1");

//     if (currentTime >= 1) {
//       $(".confetti").addClass("show");
//       // $(".confetti").show();
//       setTimeout(function () {
//         $(".greetingsPop").css("visibility", "hidden");
//         $(".greetingsPop").css("opacity", "0");
//         $(".popup").css("visibility", "visible");
//         $(".popup").css("opacity", "1");
//       }, 1500)
//       setTimeout(function () {
//         $(".confetti").removeClass("show");
//         // $(".confetti").hide();                
//       }, 2000);

//       $audio.off("timeupdate");
//     }

//   });
// }

function replayLastAudio(btnElement, audioSrc) {
  playClickThen();

  const courseAudio = document.getElementById("courseAudio");
  const simulationAudio = document.getElementById("simulationAudio");

  let activeAudio = null;

  if (courseAudio && !courseAudio.paused && !courseAudio.ended) {
    activeAudio = courseAudio;
  } else if (simulationAudio && !simulationAudio.paused && !simulationAudio.ended) {
    activeAudio = simulationAudio;
  }

  // If something playing → toggle mute
  if (activeAudio) {
    activeAudio.muted = !activeAudio.muted;
    updateButtonUI(btnElement, !activeAudio.muted);
    return;
  }

  // Nothing playing → play passed audio
  if (audioSrc) {
    playBtnSounds(audioSrc);
    resetAllButtons();
    updateButtonUI(btnElement, true);

    if (simulationAudio) {
      simulationAudio.onended = function () {
        updateButtonUI(btnElement, false);
      };
    }
  }
}

function stopAllAudios() {
  const courseAudio = document.getElementById("courseAudio");
  const simulationAudio = document.getElementById("simulationAudio");

  [courseAudio, simulationAudio].forEach(audio => {
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false; // unmute when new audio plays
    }
  });

  // Reset wrapText button UI
  resetAllButtons();
}

function updateButtonUI(btn, isPlaying) {
  if (isPlaying) {
    btn.classList.remove("paused");
    btn.classList.add("playing");
  } else {
    btn.classList.remove("playing");
    btn.classList.add("paused");
  }
}

function resetAllButtons() {
  document.querySelectorAll(".wrapTextaudio").forEach(btn => {
    btn.classList.remove("playing");
    btn.classList.add("paused");
  });
}

function enableButtons() {
  $(".flip-card").prop("disabled", false);
  $(".flipTextAudio").prop("disabled", false);
}

function disableButtons() {
  $(".flip-card").prop("disabled", true);
  $(".flipTextAudio").prop("disabled", true);
}

function resetToggle() {
  $(".flip-card").removeClass('flipped');
}

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

  _tweenTimeline.add(animateFadeIn($(".inst").find("#inst_1"), 0.5).play(), 0.5);
  // _tweenTimeline.add(animateFadeOut($(".inst").find("#inst_1"), 0.5).play(), 4);
  // _tweenTimeline.add(animateFadeIn($(".inst").find("#inst_2"), 0.5).play(), 4.2);
  _tweenTimeline.add(animateFadeOut($(".ost"), 0.5).play(), 4.5);
  _tweenTimeline.add(animateFadeOut($(".dummy-patch"), 0.5).play(), 7);
  // _tweenTimeline.add(animateFadeIn($(".inst"), 0.5).play(), 5);

  _tweenTimeline.add(
    animateFadeIn($(".animat-container"), 0.5, 0).play(),
    0.3
  );

  var rightListTiming = [0.3];
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
