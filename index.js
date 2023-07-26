document.addEventListener("DOMContentLoaded", function(_e) {
    window.onload = function(){
        slideOne();
        slideTwo();
    }
    let sliderOne = document.getElementById("slider-1");
    let sliderTwo = document.getElementById("slider-2");
    let displayValOne = document.getElementById("range1");
    let displayValTwo = document.getElementById("range2");
    let minGap = 0;
    let sliderTrack = document.querySelector(".slider-track");
    let sliderMaxValue = document.getElementById("slider-1").max;
    function slideOne(){
        if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
            sliderOne.value = parseInt(sliderTwo.value) - minGap;
        }
        displayValOne.textContent = sliderOne.value;
        fillColor();
    }
    function slideTwo(){
        if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
            sliderTwo.value = parseInt(sliderOne.value) + minGap;
        }
        displayValTwo.textContent = sliderTwo.value;
        fillColor();
    }
    function fillColor(){
        percent1 = (sliderOne.value / sliderMaxValue) * 100;
        percent2 = (sliderTwo.value / sliderMaxValue) * 100;
        sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
    }

    sliderOne.addEventListener("input", slideOne);
    sliderTwo.addEventListener("input", slideTwo);


    document.getElementById("number").addEventListener("click", function(){
        document.getElementById("wheel").classList.remove("visuallyhidden")
        document.getElementsByClassName("selectNumber")[0].classList.remove("visuallyhidden")
        document.getElementById("welcome").classList.add("visuallyhidden")
        }
    );
    document.getElementById("word").addEventListener("click", function(){
        document.getElementById("wheel").classList.remove("visuallyhidden")
        document.getElementsByClassName("selectWord")[0].classList.remove("visuallyhidden")
        document.getElementById("welcome").classList.add("visuallyhidden")
        }
    );
    document.getElementById("submitNumber").addEventListener("click", function(){
        document.getElementsByClassName("selectNumber")[0].classList.add("visuallyhidden")
        document.getElementsByClassName("selectWord")[0].classList.add("visuallyhidden")
        createNumberWheel();
        document.getElementById("myWheel").classList.remove("visuallyhidden")
        }
    );
    //check if the user has entered a word
    // if there is no word, do nothing, if there is a word, add it to the list of words and clear the input
    let wordList = [];
    document.getElementById("wordButton").addEventListener("click", function(){
        let word = document.getElementById("wordInput").value;
        if(word != "" && word != " " && wordList.indexOf(word) == -1 && word.length > 0){
            let list = document.getElementById("wordList");
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(word));
            list.appendChild(li);
            wordList.push(word);
            document.getElementById("wordInput").value = "";
        }
    });



    document.getElementById("submitWord").addEventListener("click", function(){
        if(wordList.length < 2 ){
            alert("Please enter at least two word");
        }
        else{
          document.getElementsByClassName("selectNumber")[0].classList.add("visuallyhidden")
          document.getElementsByClassName("selectWord")[0].classList.add("visuallyhidden")
          createWordWheel();
          document.getElementById("myWheel").classList.remove("visuallyhidden")
          }
        }
    );
    function hslToHex(h, s, l) {
      h /= 360;
      s /= 100;
      l /= 100;
      let r, g, b;
      if (s === 0) {
        r = g = b = l; // achromatic
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function getColor(){ 
      return hslToHex(360 * Math.random(), 25 + 70 * Math.random(), 65 + 10 * Math.random());
    }
    let sectors = [];
    function createNumberWheel(){
      let inferiorBorn = sliderOne.value;
      let superiorBorn = sliderTwo.value;
      let size = superiorBorn - inferiorBorn;
      //fill the array "sectors" with the numbers and a random color
      for(let i = 0; i < size+1; i++){
          sectors.push({color: getColor(),label: inferiorBorn.toString()});
          inferiorBorn++;
      }
      //randomize the place of the numbers in the array
      sectors.sort(() => Math.random() - 0.5);
      // Generate random float in range min-max:
      const rand = (m, M) => Math.random() * (M - m) + m;
      
      const tot = sectors.length;
      const elSpin = document.querySelector("#spin");
      const ctx = document.querySelector("#wheelTest").getContext`2d`;
      const dia = ctx.canvas.width;
      const rad = dia / 2;
      const PI = Math.PI;
      const TAU = 2 * PI;
      const arc = TAU / tot;
      const friction = 0.991;  // 0.995=soft, 0.99=mid, 0.98=hard
      const angVelMin = 0.002; // Below that number will be treated as a stop
      let angVelMax = 0; // Random ang.vel. to accelerate to 
      let angVel = 0;    // Current angular velocity
      let ang = 0;       // Angle rotation in radians
      let isSpinning = false;
      let isAccelerating = false;
      let animFrame = null; // Engine's requestAnimationFrame
      
      //* Get index of current sector */
      const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;
      
      //* Draw sectors and prizes texts to canvas */
      const drawSector = (sector, i) => {
        const ang = arc * i;
        ctx.save();
        // COLOR
        ctx.beginPath();
        ctx.fillStyle = sector.color;
        ctx.moveTo(rad, rad);
        ctx.arc(rad, rad, rad, ang, ang + arc);
        ctx.lineTo(rad, rad);
        ctx.fill();
        // TEXT
        ctx.translate(rad, rad);
        ctx.rotate(ang + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(sector.label, rad - 10, 10);
        //
        ctx.restore();
      };
      
      //* CSS rotate CANVAS Element */
      const rotate = () => {
        const sector = sectors[getIndex()];
        ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
        elSpin.textContent = !angVel ? "SPIN" : sector.label;
        elSpin.style.background = sector.color;
      };
      
      const frame = () => {
      
        if (!isSpinning) return;
      
        if (angVel >= angVelMax) isAccelerating = false;
      
        // Accelerate
        if (isAccelerating) {
          angVel ||= angVelMin; // Initial velocity kick
          angVel *= 1.06; // Accelerate
        }
        
        // Decelerate
        else {
          isAccelerating = false;
          angVel *= friction; // Decelerate by friction  
      
          // SPIN END:
          if (angVel < angVelMin) {
            isSpinning = false;
            angVel = 0;
            cancelAnimationFrame(animFrame);
          }
        }
      
        ang += angVel; // Update angle
        ang %= TAU;    // Normalize angle
        rotate();      // CSS rotate!
      };
      
      const engine = () => {
        frame();
        animFrame = requestAnimationFrame(engine)
      };
      
      elSpin.addEventListener("click", () => {
        if (isSpinning) return;
        isSpinning = true;
        isAccelerating = true;
        angVelMax = rand(0.25, 0.40);
        engine(); // Start engine!
      });
      
      // INIT!
      sectors.forEach(drawSector);
      rotate(); // Initial rotation   
    }

    function createWordWheel(){
      
      //fill the array "sectors" with a word of the list and a random color
      wordList.forEach(element => {
        sectors.push({color: getColor(),label: element});
      });
      //randomize the place of the numbers in the array
      sectors.sort(() => Math.random() - 0.5);
      // Generate random float in range min-max:
      const rand = (m, M) => Math.random() * (M - m) + m;
      
      const tot = sectors.length;
      const elSpin = document.querySelector("#spin");
      const ctx = document.querySelector("#wheelTest").getContext`2d`;
      const dia = ctx.canvas.width;
      const rad = dia / 2;
      const PI = Math.PI;
      const TAU = 2 * PI;
      const arc = TAU / tot;
      const friction = 0.991;  // 0.995=soft, 0.99=mid, 0.98=hard
      const angVelMin = 0.002; // Below that number will be treated as a stop
      let angVelMax = 0; // Random ang.vel. to accelerate to 
      let angVel = 0;    // Current angular velocity
      let ang = 0;       // Angle rotation in radians
      let isSpinning = false;
      let isAccelerating = false;
      let animFrame = null; // Engine's requestAnimationFrame
      
      //* Get index of current sector */
      const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;
      
      //* Draw sectors and prizes texts to canvas */
      const drawSector = (sector, i) => {
        const ang = arc * i;
        ctx.save();
        // COLOR
        ctx.beginPath();
        ctx.fillStyle = sector.color;
        ctx.moveTo(rad, rad);
        ctx.arc(rad, rad, rad, ang, ang + arc);
        ctx.lineTo(rad, rad);
        ctx.fill();
        // TEXT
        ctx.translate(rad, rad);
        ctx.rotate(ang + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(sector.label, rad - 10, 10);
        //
        ctx.restore();
      };
      
      //* CSS rotate CANVAS Element */
      const rotate = () => {
        const sector = sectors[getIndex()];
        ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
        elSpin.textContent = !angVel ? "SPIN" : sector.label;
        elSpin.style.background = sector.color;
      };
      
      const frame = () => {
      
        if (!isSpinning) return;
      
        if (angVel >= angVelMax) isAccelerating = false;
      
        // Accelerate
        if (isAccelerating) {
          angVel ||= angVelMin; // Initial velocity kick
          angVel *= 1.06; // Accelerate
        }
        
        // Decelerate
        else {
          isAccelerating = false;
          angVel *= friction; // Decelerate by friction  
      
          // SPIN END:
          if (angVel < angVelMin) {
            isSpinning = false;
            angVel = 0;
            cancelAnimationFrame(animFrame);
          }
        }
      
        ang += angVel; // Update angle
        ang %= TAU;    // Normalize angle
        rotate();      // CSS rotate!
      };
      
      const engine = () => {
        frame();
        animFrame = requestAnimationFrame(engine)
      };
      
      elSpin.addEventListener("click", () => {
        if (isSpinning) return;
        isSpinning = true;
        isAccelerating = true;
        angVelMax = rand(0.25, 0.40);
        engine(); // Start engine!
      });
      
      // INIT!
      sectors.forEach(drawSector);
      rotate(); // Initial rotation   
    }
});