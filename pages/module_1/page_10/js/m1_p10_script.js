// ---------- setting start ---------------
var _preloadData, _pageData;
var _pagePreloadArray = {
  image: 1,
  audio: 1,
  video: 1,
  data: -1,
}; // item not availble please assign value 1.
var jsonSRC = "pages/module_1/page_10/data/m1_p10_data.json?v=";
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
var layerOrder = [];
var activeLayerOrder = [];
var activeLayerKey = null;
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

  $(".introInfo").css({ backgroundImage: `url(${_pageData.sections[0].homeBtnSrc})` });
  $(".introInfo").attr("data-tooltip", "Home");
  $('.introInfo').on("click", function () {
    // window.location.reload();
    goToMainScreen();
  });
  // $('.introInfo').attr('data-popup', 'introPopup-7');
  $("#f_header").css({ background: `#f4ede4` });
  $("#f_header").find("#f_courseTitle").css({ content: `Dynamic Maps` });
  $(".home_btn").css({ backgroundImage: `url(${_pageData.sections[0].backBtnSrc})` });
  $(".home_btn").attr("data-tooltip", "Back");
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

// ------------------ common function end ------------------------------------------------------------------------

// -------- adding slide data ------------


// -------- adding slide data ------------
function addSectionData() {
  totalSection = _pageData.sections.length;
  for (let n = 0; n < _pageData.sections.length; n++) {
    sectionCnt = n + 1;
    if (sectionCnt == 1) {

      // playBtnSounds(_pageData.sections[sectionCnt - 1].replayBtnAudios);
      // audioEnd(function () {
      //   $(".dummy-patch").hide();
      //   $(".wrapTextaudio").removeClass("playing");
      //   $(".wrapTextaudio").addClass("paused");
      //   resetSimulationAudio();
      // });

      // ---- Instruction line ----
      const layerIcons = {
        physical: `<img src="${_pageData.sections[sectionCnt - 1].content.layerIcons.physical}" alt="Icon">`,
        rivers: `<img src="${_pageData.sections[sectionCnt - 1].content.layerIcons.rivers}" alt="Icon">`,
        vegetation: `<img src="${_pageData.sections[sectionCnt - 1].content.layerIcons.vegetation}" alt="Icon">`,
        population: `<img src="${_pageData.sections[sectionCnt - 1].content.layerIcons.population}" alt="Icon">`,
        parks: `<img src="${_pageData.sections[sectionCnt - 1].content.layerIcons.parks}" alt="Icon">`,
        wildlife: `<img src="${_pageData.sections[sectionCnt - 1].content.layerIcons.wildlife}" alt="Icon">`
      };
      let mapHtml = `
  <div class="dynamic-map-container">
    <button type="button" id="layersToggleBtn" class="layers-vertical-btn">
        <span>L</span>
  <span>A</span>
  <span>Y</span>
  <span>E</span>
  <span>R</span>
  <span>S</span>
    </button>
    <div class="layers-sidebar" id="layersSidebar" style="display:none;">
      <div class="layers-header">
        <span>LAYERS</span>
        <span class="layer-info-icon" id="layerInfoIcon">
          <span class="layers-info-tooltip">Select layer(s) to add to your map.</span>
        </span>
        <button class="introPopclose" data-tooltip="Close" onClick="closeLayerBtnInfoPopup()"></button>
      </div>

      <div class="layers-tab-panel active" id="layersTabPanel">
        <div class="layers-list" id="layersList">`;

      for (let i = 0; i < _pageData.sections[0].content.mapLayers.length; i++) {
        let layer = _pageData.sections[0].content.mapLayers[i];
        let icon = layerIcons[layer.value] || layerIcons.physical;
        mapHtml += `
  <label class="layer-option" data-layer="${layer.value}">
    <input type="checkbox" name="map_layer" value="${layer.value}">
    <span class="layer-icon-wrap">${icon}</span>
    <span class="layer-label-text">${layer.label}</span>
    <button type="button" class="layer-info-icon layerPopupIcon" data-layer="${layer.value}" data-tooltip="Info"></button>
    <button type="button"
            class="layer-active-toggle"
            data-layer="${layer.value}"
            aria-pressed="false"
            aria-label="Activate ${layer.label} layer"
            style="width:34px;height:18px;border:1px solid #7c8794;border-radius:999px;background:#d7dce2;position:relative;cursor:pointer;flex:0 0 auto;padding:0;">
      <span class="layer-active-toggle-knob"
            style="position:absolute;width:14px;height:14px;border-radius:50%;background:#fff;left:1px;top:1px;transition:transform 0.15s ease;"></span>
    </button>
  </label>`;
      }

      mapHtml += `
        </div>
      </div>

      <!-- Layer Position Tab Panel -->
      <div class="layers-tab-panel" id="positionTabPanel">
        <div id="layerPositionList"></div>
      </div>
    </div>
    <!-- end .layers-sidebar -->
`;


      mapHtml += `<!-- Map Area -->
          <div class="map-view-area">
              <div class="zoom-controls">
                  <div class="zoomButtons">
                    <button class="zoom-btn" id="mapZoomIn" title="Zoom In"></button>
                    <button class="zoom-btn" id="mapZoomOut" title="Zoom Out"></button>
                  </div>
                  <button class="reset-view-btn" title="Reset" data-tooltip="Reset" id="mapReset" style="display:none;"></button>
              </div>
              
              <div class="map-wrapper" id="mapWrapper">
               <div class="map-img-layer" id="mapImgLayer">
                  <img src="`+ _pageData.sections[0].content.mapImage.src + `" 
                    alt="` + _pageData.sections[0].content.mapImage.alt + `" 
                    id="baseMapImg" 
                    onerror="this.src='` + _pageData.sections[0].content.mapImage.fallback + `'" 
                    style="width:100%; height:auto;" />
                    <div id="layerContainer"
     style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:5;">
</div>
                </div>
                  <svg class="map-svg-overlay" id="physicalLayerSVG" 
                    viewBox="0 0 382 444" preserveAspectRatio="xMidYMid meet" 
                    style="display:none; position:absolute; top:0; left:0; width:100%; height:100%;">
                    <defs>
                      <clipPath id="regionClip">
                        <path id="activeRegionPath" d="" />
                      </clipPath>
                    </defs>
                    <image id="svgTopImg" href="`+ _pageData.sections[0].content.mapImage.src + `" 
                           width="382" height="444" 
                           preserveAspectRatio="xMidYMid meet" 
                           clip-path="url(#regionClip)" style="display:none;" />
                    <g id="regionPathsGroup"></g>
                  </svg>
                  <div class="map-region-tooltip" id="mapTooltip" style="display:none;"></div>
              </div>
          </div>
          
          <!-- Information Panel -->
          <div class="div-info-panel" id="divInfoPanel" style="display:none;">
              <div class="info-content">
                  <button class="wrapTextaudio playing" id="wrapTextaudio_1" title="audio" data-tooltip="audio" data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}" onClick="replayLastAudio(this)"></button>
                  <button class="region-info-close" id="regionInfoClose" type="button" data-tooltip="close" aria-label="Close region information" title="Close"></button>
                  <h2 id="infoTitle">Division Name</h2>
                  <p id="infoDesc">Description of the physical division goes here.</p>
                  <h4>`+ _pageData.sections[0].content.uiText.infoPanelKeyFeaturesLabel + `</h4>
                  <ul id="infoFeatures"></ul>
              </div>
          </div>
      </div>
      `;

      let popupDiv = "";

      popupDiv += `<div class="popup">`;
      popupDiv += `<div class="popup-wrap">`;
      popupDiv += `<div class="popBtns">`;
      popupDiv += `<button id="refresh" data-tooltip="Restart"></button>`;
      popupDiv += `<button id="homeBack" data-tooltip="Back"></button>`;
      popupDiv += `</div>`;
      popupDiv += `</div>`;
      popupDiv += `</div>`;

      popupDiv += `<div class="greetingsPop">`;
      popupDiv += `<div class="popup-wrap"></div>`;
      popupDiv += `</div>`;

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
              <p>If you leave the dyanamic maps then you have to start from beginning.</p>
              <p class="modal-question">Are you sure you want to leave?</p>
            </div>
            <div class="modal-buttons">
              <button id="stay-btn"  class="modal-btn" onClick="stayPage()">Stay</button>
              <button id="leave-btn" class="modal-btn" onClick="leavePage()">Leave</button>
            </div>
          </div>
        </div>`;
      popupDiv += `
  <div id="layerInfoPopup" class="layer-info-popup">
    <div class="popup-content">
      <button class="introPopclose" data-tooltip="Close" onClick="closeLayerInfoPopup()"></button>
      <button class="wrapTextaudio playing" id="wrapTextaudio_1" title="audio" data-tooltip="audio" data-src="${_pageData.sections[sectionCnt - 1].replayBtnAudios}" onClick="replayLastAudio(this)"></button>
      <div class="layer-popup-text">
        <h2 id="layerPopupTitle"></h2>
        <p id="layerPopupDesc"></p>
      </div>
    </div>
  </div>`;

      $("#section-" + sectionCnt)
        .find(".content-holder")
        .find(".col-left")
        .find(".content")
        .find(".content-bg")
        .find(".content-style")
        .append(popupDiv + mapHtml); // Replace everything with mapHTML

      initMapInteractions();

      // $('.nav_btns').append('<button id="full-screen" class="full-screen fScreen fullScreen" onclick="toggleFullscreen(this)" data-tooltip="Fullscreen"></button>')


      /* ================= BUTTON EVENTS ================= */

      // ---- Bind popup buttons ----
      $("#refresh").on("click", function () {
        playClickThen();
        jumtoPage(_controller.pageCnt);
      });




      // $("#homeBack").on("click", function () {
      //   jumtoPage(1); 
      // });

    } // end sectionCnt == 1
  } // end for
} // end addSectionData

window.appState = { pageCount: 0 };
// ============================================================
// MAP INTERACTIONS — FUNCTIONS
// ============================================================

if (typeof currentZoomScale === 'undefined') {
  var currentZoomScale = 1;
  var mapTranslateX = 0;
  var mapTranslateY = 0;

  var isDraggingMap = false;
  var dragStartX = 0;
  var dragStartY = 0;
}

function initMapInteractions() {
  $("input[name='map_layer']").on("change", function () {
    renderActiveLayers();
    currentZoomScale = 1;
  });

  initLayerActiveToggle();

  // Tab switching
  $(".layers-tab-btn").off("click").on("click", function () {
    let tab = $(this).data("tab");
    $(".layers-tab-btn").removeClass("active");
    $(".layers-tab-panel").removeClass("active");
    $(this).addClass("active");
    if (tab === "layers") {
      $("#layersTabPanel").addClass("active");
    } else {
      $("#positionTabPanel").addClass("active");
      updateLayerPositionUI();
    }
  });

  $("#mapReset").on("click", function () {
    currentZoomScale = 1;
    mapTranslateX = 0;
    mapTranslateY = 0;
    updateMapTransform();
    // TweenMax.to("#baseMapImg", 0.5, { filter: "blur(0px)" });
    // $("#svgTopImg").hide();

    // $(".phy-region").removeClass("active");
    // TweenMax.to(".phy-region", 0.3, { fillOpacity: 0.3, strokeWidth: 0.1 });
    // $("#divInfoPanel").fadeOut();
    // $("input[name='map_layer']").prop("checked", false);
    // activeLayerOrder = [];
    // layerOrder = _pageData.sections[0].content.mapLayers.map(l => l.value);
    // $("#layerPositionList").empty();
    // updateLayerOrderUI();

    // $("#layerContainer").empty();
    // $("#regionPathsGroup").empty();
    // $("#physicalLayerSVG").hide();

    $(this).fadeOut();
  });

  $("#mapZoomIn").on("click", function () {
    currentZoomScale += _pageData.sections[0].content.zoomSettings.step;
    if (currentZoomScale > _pageData.sections[0].content.zoomSettings.max)
      currentZoomScale = _pageData.sections[0].content.zoomSettings.max;
    // TweenMax.to("#mapWrapper", 0.5, { scale: currentZoomScale, ease: Power2.easeOut });
    updateMapTransform();
    $("#mapReset").fadeIn();
  });

  $("#mapZoomOut").on("click", function () {
    currentZoomScale -= _pageData.sections[0].content.zoomSettings.step;
    if (currentZoomScale < _pageData.sections[0].content.zoomSettings.min)
      currentZoomScale = _pageData.sections[0].content.zoomSettings.min;
    // TweenMax.to("#mapWrapper", 0.5, { scale: currentZoomScale, ease: Power2.easeOut });
    updateMapTransform();
    if (currentZoomScale === _pageData.sections[0].content.zoomSettings.defaultScale)
      $("#mapReset").fadeOut();
  });

  $("#regionInfoClose").off("click").on("click", closeRegionInfoPanel);

  // $("#layersToggleBtn").on("click", function () {
  //   let $list = $("#layersList");
  //   if ($list.is(":visible")) {
  //     $(".layer-position-tab").hide();
  //     $(".layer-info-icon").hide();
  //     $("#layersInfoPill").hide();
  //     $list.slideUp(200);
  //     $(this).closest(".layers-sidebar").removeClass("layers-open");
  //   } else {
  //     $(".layer-position-tab").show();
  //     $(".layer-info-icon").show();
  //     $("#layersInfoPill").show();
  //     $list.slideDown(200);
  //     $(this).closest(".layers-sidebar").addClass("layers-open");
  //   }
  // });
  // $("#layerInfoIcon").on("click", function (e) {
  //   e.stopPropagation();
  //   $("#layersInfoPill").stop(true, true).fadeToggle(150);
  // });
  // if ($list.is(":visible")) {
  //   $("#layersInfoPill").hide();
  // }

  $("#layerPositionToggleBtn").on("click", function () {
    let $panel = $("#layerPositionPanel");
    if ($panel.is(":visible")) {
      $panel.slideUp(200);
      $(this).closest(".layers-sidebar").removeClass("position-open");
    } else {
      $panel.slideDown(200);
      $(this).closest(".layers-sidebar").addClass("position-open");
    }
  });

  const mapWrapper = document.getElementById("mapWrapper");

  $(mapWrapper).on("mousedown touchstart", function (e) {
    if (currentZoomScale <= 1) return;
    isDraggingMap = true;

    const point = e.type === "touchstart"
      ? e.originalEvent.touches[0]
      : e;

    dragStartX = point.pageX - mapTranslateX;
    dragStartY = point.pageY - mapTranslateY;

    $(this).css("cursor", "grabbing");
  });

  $(document).on("mousemove touchmove", function (e) {

    if (!isDraggingMap) return;

    const point = e.type === "touchmove"
      ? e.originalEvent.touches[0]
      : e;

    mapTranslateX = point.pageX - dragStartX;
    mapTranslateY = point.pageY - dragStartY;

    updateMapTransform();
  });

  $(document).on("mouseup touchend touchcancel", function () {

    isDraggingMap = false;

    $("#mapWrapper").css(
      "cursor",
      currentZoomScale > 1 ? "grab" : "default"
    );
  });

  layerOrder = _pageData.sections[0].content.mapLayers.map(l => l.value);

  updateLayerOrderUI();

  $("#layersToggleBtn").off("click").on("click", function () {
    playClickThen();

    const $sidebar = $("#layersSidebar");
    const isOpen = $sidebar.is(":visible");

    if (isOpen) {
      $sidebar.hide();
      $(this).removeClass("active").attr("aria-expanded", "false");
    } else {
      $sidebar.show();
      $(this).addClass("active").attr("aria-expanded", "true");
    }
  });

  $(".layerPopupIcon").off("click").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (typeof playClickThen === "function") {
      playClickThen();
    }

    const layerKey = $(this).data("layer");
    const layerData = _pageData.sections[0].content.mapLayers.find(function (layer) {
      return layer.value === layerKey;
    });

    if (!layerData) return;

    $("#layerPopupTitle").text(layerData.label);
    $("#layerPopupDesc").text(layerData.desc);

    $("#layerInfoPopup").css({
      display: "flex",
      visibility: "visible",
      opacity: "1"
    });

    if (layerData.audio) { // replace 'audio' with your actual property name if different
      const audio = $("#simulationAudio")[0];
      audio.pause();
      audio.currentTime = 0;
      audio.src = layerData.audio;
      audio.load();
      audio.play();
      const audioElement = document.querySelector("#wrapTextaudio_1");
      audioElement.classList.add("playing");
    }
  });
}
function closeLayerInfoPopup() {
  playClickThen();

  $("#layerInfoPopup").css({
    display: "none",
    opacity: "0"
  });
  let audio = document.getElementById("simulationAudio");
  if (audio.src) {
    audio.pause();
    audio.currentTime = 0;
  }
}
function closeLayerBtnInfoPopup() {
  playClickThen();
  $("#layersSidebar").css({
    display: "none"
  });
}

function clampMapTranslate() {
  const wrapper = document.getElementById("mapWrapper");
  if (!wrapper || currentZoomScale <= 1) {
    mapTranslateX = 0;
    mapTranslateY = 0;
    return;
  }

  const maxTranslateX = wrapper.offsetWidth * (currentZoomScale - 1) / 2;
  const maxTranslateY = wrapper.offsetHeight * (currentZoomScale - 1) / 2;

  mapTranslateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, mapTranslateX));
  mapTranslateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, mapTranslateY));
}

function updateMapTransform() {
  clampMapTranslate();

  TweenMax.set("#mapWrapper", {
    scale: currentZoomScale,
    x: mapTranslateX,
    y: mapTranslateY,
    transformOrigin: "center center"
  });
}

function focusMapOnRegion(regionPath, clickEvent) {
  const wrapper = document.getElementById("mapWrapper");
  const svg = document.getElementById("physicalLayerSVG");
  if (!wrapper || !svg) return;

  const wrapperWidth = wrapper.offsetWidth;
  const wrapperHeight = wrapper.offsetHeight;
  const viewBox = svg.viewBox.baseVal;
  let targetX = wrapperWidth / 2;
  let targetY = wrapperHeight / 2;

  try {
    const bbox = regionPath.getBBox();
    targetX = ((bbox.x + bbox.width / 2) - viewBox.x) / viewBox.width * wrapperWidth;
    targetY = ((bbox.y + bbox.height / 2) - viewBox.y) / viewBox.height * wrapperHeight;
  } catch (err) {
    if (clickEvent) {
      const offset = $("#mapWrapper").offset();
      targetX = clickEvent.pageX - offset.left;
      targetY = clickEvent.pageY - offset.top;
    }
  }

  mapTranslateX = -((targetX - wrapperWidth / 2) * currentZoomScale);
  mapTranslateY = -((targetY - wrapperHeight / 2) * currentZoomScale);
}

function updateLayerOrderUI() {
  let html = "";
  layerOrder.forEach((key, index) => {
    let layer = _pageData.sections[0].content.mapLayers.find(
      l => l.value === key
    );
    html += `
        <li class="layer-order-item"
            draggable="true"
            data-layer="${key}">
            <span>${index + 1}</span>
            ${layer.label}
        </li>`;
  });
  $("#layerOrderList").html(html);
  initLayerDrag();
}

function initLayerDrag() {

  let dragged = null;

  $(".layer-order-item").on("dragstart", function () {
    dragged = this;
  });

  $(".layer-order-item").on("dragover", function (e) {
    e.preventDefault();
  });

  $(".layer-order-item").on("drop", function (e) {

    e.preventDefault();

    if (dragged === this) return;

    let from = layerOrder.indexOf($(dragged).data("layer"));
    let to = layerOrder.indexOf($(this).data("layer"));

    let moved = layerOrder.splice(from, 1)[0];
    layerOrder.splice(to, 0, moved);

    updateLayerOrderUI();
    renderActiveLayers();
  });
}

// ── Renders image + SVG regions for the selected layer ──
// function renderActiveLayers() {
//   // Collect all checked layer keys
//   let activeKeys = [];
//   $("input[name='map_layer']:checked").each(function () {
//     activeKeys.push($(this).val());
//   });
//   // Nothing checked — clear the SVG overlay and info panel
//   if (activeKeys.length === 0) {
//     $("#regionPathsGroup").empty();
//     $("#physicalLayerSVG").fadeOut();
//     $("#divInfoPanel").hide();
//     return;
//   }
//   // Merge all active layers' regions into one SVG group
//   let svgHtml = "";
//   let allRegions = [];
//   activeKeys.forEach(function (key) {
//     let layerData = _pageData.sections[0].content.layerData[key];
//     if (!layerData) return;
//     layerData.regions.forEach(function (r) {
//       svgHtml += `<path class="phy-region"
//         data-id="${r.id}"
//         d="${r.d}"
//         fill="${r.fill}"
//         stroke="#fff"
//         stroke-width="0.1"/>`;
//       allRegions.push(r);
//     });
//   });
//   $("#regionPathsGroup").html(svgHtml);
//   $("#physicalLayerSVG").fadeIn();
//   $("#divInfoPanel").hide();
//   bindRegionEvents(allRegions);
// }
function renderActiveLayers() {
  $("input[name='map_layer']:checked").each(function () {
    let key = $(this).val();

    if (!activeLayerOrder.includes(key)) {
      activeLayerOrder.push(key);
    }
  });

  activeLayerOrder = activeLayerOrder.filter(key =>
    $(`input[value="${key}"]`).prop("checked")
  );

  if (!activeLayerOrder.includes(activeLayerKey)) {
    activeLayerKey = activeLayerOrder[0] || null;
  }

  moveActiveLayerToTop();

  $("#layerContainer").empty();

  activeLayerOrder.slice().reverse().forEach(function (key) {
    let layer = _pageData.sections[0].content.mapLayers.find(
      x => x.value === key
    );

    if (layer && layer.image) {
      $("#layerContainer").append(`
        <img
          src="${layer.image}"
          class="map-layer-img"
          data-layer="${key}"
          style="
            position:absolute;
            left:0;
            top:0;
            width:100%;
            height:100%;
          ">
      `);
    }
  });

  updateLayerActiveToggleUI();

  if (activeLayerOrder.length === 0) {
    $("#regionPathsGroup").empty();
    $("#physicalLayerSVG").hide();
    $("#divInfoPanel").hide();
    return;
  }

  renderSVGForLayer(activeLayerKey);
}

function updateLayerPositionUI() {
  let html = "";
  activeLayerOrder.forEach((key, index) => {
    let layer = _pageData.sections[0].content.mapLayers.find(
      x => x.value === key
    );
    html += `
        <div class="layer-position-item"
             draggable="true"
             data-layer="${key}">
            <span class="layer-no">${index + 1}</span>
            <span class="layer-name">${layer.label}</span>
        </div>`;
  });
  $("#layerPositionList").html(html);
  initLayerSorting();
}

function updateLayerActiveToggleUI() {
  $(".layer-active-toggle").each(function () {
    let key = $(this).data("layer");
    let isActive =
      key === activeLayerKey &&
      $(`input[name="map_layer"][value="${key}"]`).prop("checked");

    $(this)
      .toggleClass("active", isActive)
      .attr("aria-pressed", isActive)
      .css({
        background: isActive ? "#2e7d32" : "#d7dce2",
        borderColor: isActive ? "#2e7d32" : "#7c8794"
      })
      .find(".layer-active-toggle-knob")
      .css("transform", isActive ? "translateX(16px)" : "translateX(0)");
  });
}

function moveActiveLayerToTop() {
  if (!activeLayerKey) return;

  activeLayerOrder = activeLayerOrder.filter(key => key !== activeLayerKey);
  activeLayerOrder.unshift(activeLayerKey);
}

function setActiveLayer(key) {
  let $checkbox = $(`input[name="map_layer"][value="${key}"]`);
  if (!$checkbox.length) return;

  if (!$checkbox.prop("checked")) {
    $checkbox.prop("checked", true);
  }

  if (!activeLayerOrder.includes(key)) {
    activeLayerOrder.push(key);
  }

  activeLayerKey = key;
  moveActiveLayerToTop();
  renderActiveLayers();
}

function initLayerActiveToggle() {
  $(".layer-active-toggle").off("click").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    setActiveLayer($(this).data("layer"));
  });
}

function initLayerSorting() {

  let dragged = null;

  $(".layer-position-item").off();

  $(".layer-position-item").on("dragstart", function () {
    dragged = this;
  });

  $(".layer-position-item").on("dragover", function (e) {
    e.preventDefault();
  });

  $(".layer-position-item").on("drop", function (e) {

    e.preventDefault();

    let fromLayer = $(dragged).data("layer");
    let toLayer = $(this).data("layer");

    let fromIndex = activeLayerOrder.indexOf(fromLayer);
    let toIndex = activeLayerOrder.indexOf(toLayer);

    let moved = activeLayerOrder.splice(fromIndex, 1)[0];
    activeLayerOrder.splice(toIndex, 0, moved);

    renderActiveLayers();
  });
}

function renderSVGForLayer(layerKey) {

  $("#regionPathsGroup").empty();

  if (!layerKey) {
    $("#physicalLayerSVG").hide();
    return;
  }

  let layerData = _pageData.sections[0].content.layerData[layerKey];
  $("#svgTopImg")
    .attr("href", layerData.mapImage.src)
    .hide();

  if (!layerData || !layerData.regions) {
    $("#physicalLayerSVG").hide();
    return;
  }

  let svgHtml = "";

  layerData.regions.forEach(region => {

    svgHtml += `
            <path
                class="phy-region"
                data-id="${region.id}"
                d="${region.d}"
                fill="transparent"
                stroke="#fff"
                stroke-width="0"
                fill-opacity="0">
            </path>`;
  });

  $("#regionPathsGroup").html(svgHtml);
  $("#physicalLayerSVG").show();

  bindRegionEvents(layerData.regions);
}


function closeRegionInfoPanel() {
  $("#divInfoPanel").fadeOut(150);
  console.log("popup closed");
  const audio = document.getElementById('simulationAudio');
  audio.pause();
  audio.currentTime = 0;
  $("#svgTopImg").hide();
  $(".phy-region").removeClass("active");
  TweenMax.to(".phy-region", 0.3, { fillOpacity: 0, strokeWidth: 0 });
}
function bindRegionEvents(regions) {
  let regionMap = {};
  regions.forEach(r => regionMap[r.id] = r);

  $(document).off("mouseenter mouseleave click", ".phy-region");

  $(".phy-region").on("mouseenter", function () {
    let bbox = this.getBBox();

    let centerX = bbox.x + bbox.width / 2;
    let centerY = bbox.y + bbox.height / 2;
    if (!$(this).hasClass("active")) {
      TweenMax.to(this, 0.3, { fillOpacity: 0, strokeWidth: 0 });
      $(this).css("cursor", "pointer");
      let regionId = $(this).data("id");
      let d = regionMap[regionId];
      if (d) {
        $("#mapTooltip").text(d.name).fadeIn(150);
      }
    }
  }).on("mousemove", function (e) {
    // ✅ Follow cursor
    let offset = $("#mapWrapper").offset();
    let x = e.pageX - offset.left + 12;
    let y = e.pageY - offset.top + 12;
    $("#mapTooltip").css({ left: x + "px", top: y + "px" });
  }).on("mouseleave", function () {
    if (!$(this).hasClass("active")) {
      TweenMax.to(this, 0.1, { fillOpacity: 0, strokeWidth: 0 });
    }
    $("#mapTooltip").fadeOut(100);
  }).on("click", function (e) {
    let regionId = $(this).data("id");
    let d = regionMap[regionId];
    if (!d) return;

    TweenMax.to("#baseMapImg", 0.1, { filter: "blur(0px)" });
    // $("#activeRegionPath").attr("d", d.d);
    $("#svgTopImg").hide();

    $(".phy-region").removeClass("active");
    TweenMax.to(".phy-region", 0.3, { fillOpacity: 0, strokeWidth: 0 });

    $(this).addClass("active");
    TweenMax.to(this, 0.3, { fillOpacity: 0, strokeWidth: 0 });

    currentZoomScale = d.scale || _pageData.sections[0].content.zoomSettings.defaultScale;
    focusMapOnRegion(this, e);

    updateMapTransform();

    $("#infoTitle").text(d.name);

    $("#infoDesc").text(d.desc);
    let fHtml = "";
    d.features.forEach(f => fHtml += "<li>" + f + "</li>");
    $("#infoFeatures").html(fHtml);
    $("#divInfoPanel").fadeIn();
    const audio = $("#simulationAudio")[0];
    audio.src = d.audio;
    audio.load();
    audio.play();
    $("#mapReset").fadeIn();
  });
}
/* ---------- showEndAnimations — overrides shared version ---------- */
function showEndAnimations() {
  var $audio = $("#simulationAudio");
  closePopup("introPopup-7");
  pageVisited();

  $audio.on("timeupdate", function () {
    var currentTime = this.currentTime;
    $(".greetingsPop").css({ visibility: "visible", opacity: "1" });

    if (currentTime >= 1) {
      $(".confetti").addClass("show");

      setTimeout(function () {
        $(".greetingsPop").css({ visibility: "hidden", opacity: "0" });
        $(".popup").css({ visibility: "visible", opacity: "1" });
      }, 1500);

      setTimeout(function () {
        $(".confetti").removeClass("show");
      }, 2000);

      $audio.off("timeupdate");
    }
  });
}


/* ---------- restartActivity — overrides shared version ---------- */
function restartActivity() {
  $(".popup").css("opacity", "0");
  setTimeout(function () {
    $(".popup").css({ visibility: "hidden", opacity: "0" });
  }, 500);

  _globalCicked = 0;
  memRerenderGrid();
}

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

/* ---------------- Interaction ---------------- */
$(document).on("pointerdown", ".cup", function (e) {
  e.preventDefault();

  if (!currentPattern) return;

  const selectedValue = $(this).data("value");
  const correctValue = currentPattern.correctNextValue;

  if (selectedValue !== correctValue) {
    wrongFeedback(this);
    return;
  }

  correctFeedback(this);
  fillNextSlot(selectedValue);
});

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

  jumtoPage(0);
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
  var $audio = $("#simulationAudio");
  closePopup('introPopup-1');
  console.log("Audio ending");
  pageVisited();

  $audio.on("timeupdate", function () {
    var currentTime = this.currentTime;
    $(".greetingsPop").css("visibility", "visible");
    $(".greetingsPop").css("opacity", "1");

    if (currentTime >= 1) {
      $(".confetti").addClass("show");
      // $(".confetti").show();
      setTimeout(function () {
        $(".greetingsPop").css("visibility", "hidden");
        $(".greetingsPop").css("opacity", "0");
        $(".popup").css("visibility", "visible");
        $(".popup").css("opacity", "1");
      }, 1500)
      setTimeout(function () {
        $(".confetti").removeClass("show");
        // $(".confetti").hide();                
      }, 2000);

      $audio.off("timeupdate");
    }

  });
}

function goToMainScreen() {
  const simulationAudio = document.getElementById("simulationAudio");
  if (simulationAudio) {
    simulationAudio.pause();
    simulationAudio.currentTime = 0;
  }

  const bgAudio = document.getElementById("audio_src");
  if (bgAudio) {
    bgAudio.pause();
    bgAudio.currentTime = 0;
  }

  window.location.href = window.location.pathname;
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
function audioEnd(callback) {
  const audio = document.getElementById("simulationAudio");
  audio.onended = null;
  audio.onended = () => {
    if (typeof callback === "function") callback();
  };
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
