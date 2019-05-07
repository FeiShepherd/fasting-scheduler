/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
/* eslint-env browser */
;
let setSample;
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    // Service worker isn't supported
    return;
  }

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

    if (!isLocalhost && window.location.protocol !== 'https:') {
      console.warn('Service worker is supported in this browser but cannot ' +
        'work on a page that isn\'t accessed by HTTPS.');
      return;
    }

    navigator.serviceWorker.register('service-worker.js')
    .catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
}

(function() {
  'use strict';
  const HEAT_PALLETE = [
    '#009966',
    '#029900',
    '#739900',
    '#995c00'
  ]
  registerServiceWorker();
  localStorage.setItem('ate', localStorage.getItem('ate') || '[]')

  function setAte(){
    var currentAtes = getAtes()
    currentAtes.push({
      date: new Date()
    })
    localStorage.setItem('ate', JSON.stringify(currentAtes))
    showAtes()
  }

  function getAtes(){
    return JSON.parse(localStorage.getItem('ate'))
  }

  function showAtes(){
    let boxes = getBoxes()
    for(var i = 0; i < boxes.length; i++){
      var btn = document.createElement("div");
      btn.className = 'heat-box'
      var mycolor
      if(boxes[i]<18){
        mycolor = HEAT_PALLETE[0]
      }else if(boxes[i]< 19){
        mycolor = HEAT_PALLETE[1]
      }else if(boxes[i] < 20){
        mycolor = HEAT_PALLETE[2]
      }else if(boxes[i] < 21){
        mycolor = HEAT_PALLETE[3]
      }else{
        mycolor = HEAT_PALLETE[3]
      }
      console.log(boxes[i])
      btn.style.backgroundColor = mycolor
      document.getElementById("heatmap").appendChild(btn);
    }
  }

  function getBoxes(){
    const boxes = getAtes()
    let fasts = []
    const MIN_HOURS_FAST = 9
    for(var i = 0; i < boxes.length-1; i++){
      var hours = Math.abs(new Date(boxes[i].date) - new Date(boxes[i+1].date)) / 36e5;
      console.log('wtf',hours)
      if(hours > MIN_HOURS_FAST){
        fasts.push(hours)
      }
    }
    console.log(fasts)
    return fasts
  }

  setSample = function(amount) {
    const fasts = [13,14,15,12]
    let randomSample = []
    for(var i = 0; i < amount; i++){
      let newDate = new Date()
      const randomIndex = Math.floor(Math.random()*fasts.length)
      newDate.setDate(newDate.getDate() - i)
      newDate.setHours(fasts[randomIndex])
      randomSample.push({
        date: newDate
      })
      let newDate2 = new Date()
      newDate2.setDate(newDate2.getDate() - i)
      newDate2.setHours(fasts[randomIndex]+6)
      randomSample.push({
        date: newDate2
      })
    }
    localStorage.setItem('ate', JSON.stringify(randomSample))
    showAtes()
  }

  function getLastAteDate(){
    var currentAtes = getAtes()
    if(currentAtes.length)
      return new Date(currentAtes[currentAtes.length-1].date)
    else
      return new Date()
  }

  function setHours(){
    var currentDate = new Date()
    var hours = Math.abs(currentDate - getLastAteDate()) / 36e5;
    if(hours*60 < 1){
      document.getElementById("hours").innerHTML = (Math.floor(hours*60*60)).toString() + ' seconds ago'
    }else if(hours*60 < 60){
      document.getElementById("hours").innerHTML = (Math.floor(hours*60)).toString() + ' mins ago'
    }else{
      document.getElementById("hours").innerHTML = Math.floor(hours).toString() + ' hrs ago'
    }
  }

  function init(){
    showAtes()
    document.getElementById("ateButton").onclick = setAte;
    setInterval(setHours, 1000)
  }

  init()
})();
