let playerCar; 
//= {
//     brand: 'lamborghini',
//     model: 'aventador',
//     carClass: '',
//     year: 2020,
//     rotation: 90,
//     image: null,
//     x: 3500,
//     y: 1450,
//     xv: 0,
//     yv: 0,
//     speed: 1,
//     carHeight: 50,
//     carWidth: 50,
// };
let lambo;
let ferrari;
let truck;
let van;
let car1;
let car2;
let car3;
let stationWagon;
let atv;
let twoSeater1;
let twoSeater2;
let twoSeater3;
let playing;
let playerCarSpeedVariable = 0.75;
let spriteSheet;
let running = false;
let go = false;
let countdownTime = 3;
let countdown = false;
let score = 0;
let finalBeep = false;
let secondsRacing = 0;
let initialSecs = 0;
let finalSecs = 0;
let grassPTS = 1;
let roadPTS = 1;
let circuit = {
    x: 0, 
    y: 0, 
}

class Car {
    constructor(carClass, cylinders, year, brand, model, drive, carHeight = 50, carWidth = 50, image = null){
        this.carClass = carClass;
        this.cylinders = cylinders;
        this.year = year;
        this.brand = brand;
        this.model = model;
        this.drive = drive;
        this.speed = calculateSpeed(this.carClass, this.cylinders)/100;
        this.rotation = 90;
        this.x = 3500;
        this.y = 1450;
        this.xv = 0;
        this.yv = 0;
        this.carHeight = carHeight;
        this.carWidth = carWidth;
        this.image = image;
    }

};

function preload() {
    bgImage = loadImage('./images/circuit.png');
    spriteSheet = loadImage('./images/cars.png');
    pixelFont = loadFont('./fonts/RacingSansOne-Regular.ttf');
    driveSound = document.getElementById('driving');
    gravelSound = document.getElementById('gravel');
    beepSound = document.getElementById('beeps');
    tireSound = document.getElementById('tires');
    crashSound = document.getElementById('crash');
}

function calculateSpeed(carClass, cylinders){
    let speed = 50;
    if(carClass.includes('compact') || carClass.includes('minicompact') || carClass.includes('subcompact')){
        speed += 7;
    } else if(carClass.includes('large')){
        speed -= 10;
    }else if(carClass.includes('midsize') || carClass.includes('standard')){
        speed += 5;
    };
    
    if(carClass.includes('station wagon') || carClass.includes('truck')){
        speed -= 10;
    } else if(carClass.includes('van') || carClass.includes('special purpose')){
        speed -=5;
    } else if(carClass.includes('two seater')){
        speed += 5;
    };
    
    speed += cylinders * 5;
    
    return speed;
};

function setup(){
    //angleMode(DEGREES);
    lambo = spriteSheet.get(257, 57, 282-257, 99-57);
    ferrari = spriteSheet.get(233, 100, 261-233, 147-100);
    truck = spriteSheet.get(289, 198, 318-289, 254-198);
    van = spriteSheet.get(202, 148, 230-202, 196-148);
    car1 = spriteSheet.get(400, 110, 425-400, 155-110);
    car2 = spriteSheet.get(452, 109, 477-452, 154-109);
    car3 = spriteSheet.get(65, 78, 92-65, 129-78);
    stationWagon = spriteSheet.get(195, 197, 226-195, 254-197);
    atv = spriteSheet.get(373, 154, 398-373, 201-154);
    twoSeater1 = spriteSheet.get(93, 83, 120-93, 132-83);
    twoSeater2 = spriteSheet.get(86, 133, 113-86, 182-133);
    twoSeater3 = spriteSheet.get(114, 135, 143-114, 183-135);
    imageMode(CENTER);
    back();
    
    let chooseButton = document.getElementById('chooseCar');
    chooseButton.addEventListener('click', chooseCar);

    let backButton = document.getElementById('back');
    backButton.addEventListener('click', back);

    let playButton = document.getElementById('play');
    playButton.addEventListener('click', () => {
        if(playerCar){
            play();
        } else {
            alert('You Must Select a Car Before Playing');
        }
        
    });

    let searchBar = document.getElementById('carSearchForm');
    searchBar.addEventListener('submit', (event) => {
        event.preventDefault()
        let search = document.getElementById('searchBar').value

        if(document.getElementById('make').checked){
            getAPI(search, 'make')
        } else if(document.getElementById('year').checked){
            getAPI(search, 'year')
        } else if (document.getElementById('model').checked){
            getAPI(search, 'model')
        } else {
            getAPI(search.split(' ')[0], 'make', search.split(' ')[1], 'model')
            console.log(search.split())
        }
    });

};

function getAPI(search, type, search2 = null, type2 = null) {
    $.ajax({
        method: 'GET',
        url: `https://api.api-ninjas.com/v1/cars?limit=50&${type}=${search}&${type2}=${search2}`,
        headers: { 'X-Api-Key': 'gqrGVQU4KRarareJSVg7ig==0kjoQ7T0O4vKBeuz'},
        contentType: 'application/json',
        success: function(result) {
            showCars(result);
            console.log(result);
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
    });
};

function back(){
    playing = false;
    document.getElementById('titleScreen').style.display = 'block';
    document.getElementById('choosingScreen').style.display = 'none';
    running = false;
    go = false;
    countdownTime = 3;
    countdown = false;
    score = 0;
    grassPTS = 1;
    roadPTS = 1;
    if(playerCar){
        playerCar.x = 3500;
        playerCar.y = 1450;
        playerCar.rotation = 90;
    }
    finalBeep = false;
    clear();
};

function chooseCar(){
    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('choosingScreen').style.display = 'block';
};

function showCars(carArr){
    let table = document.getElementById('carsTable');
    table.innerHTML = null;
    for(let i = 0; i < carArr.length; i++){
        let car = carArr[i];
        let div = document.createElement('div');
        div.setAttribute('class', 'car');
        let pic = document.createElement('img');
        let brand = document.createElement('h3');
        brand.innerHTML = 'Brand: ' + car.make;
        div.appendChild(brand);
        let model = document.createElement('h3');
        model.innerHTML = 'Model: ' + car.model;
        div.appendChild(model);
        let year = document.createElement('h3');
        year.innerHTML = 'Year: ' + car.year;
        div.appendChild(year);
        let cylinders = document.createElement('h3');
        cylinders.innerHTML = 'Cylinders: ' + car.cylinders;
        div.appendChild(cylinders);
        let carClass = document.createElement('h3');
        carClass.innerHTML = 'Class: ' + car.class;
        div.appendChild(carClass);
        let drive = document.createElement('h3');
        drive.innerHTML = 'Drive: ' + car.drive;
        div.appendChild(drive);
        let mpg = document.createElement('h3');
        mpg.innerHTML = 'MPG: ' + car.city_mpg;
        div.appendChild(mpg);
        div.addEventListener('click', () => {
            playerCar = new Car(car.class, car.cylinders, car.year, car.make, car.model, car.drive);
            let carElement = document.createElement('div');
            carElement.setAttribute('class', 'car');
            let title = document.createElement('h3');
            title.innerHTML = "Chosen Car: ";
            let chosenBrand = document.createElement('h3');
            let chosenModel = document.createElement('h3');
            let chosenYear = document.createElement('h3');
            chosenBrand.innerHTML = brand.innerHTML;
            chosenModel.innerHTML = model.innerHTML;
            chosenYear.innerHTML = year.innerHTML;
            carElement.appendChild(title);
            carElement.appendChild(chosenBrand);
            carElement.appendChild(chosenModel);
            carElement.appendChild(chosenYear);
            document.getElementById('car').innerHTML = null;
            document.getElementById('car').appendChild(carElement);
            console.log(document.getElementById('car'));
            back();
        });
        table.appendChild(div);
    }
};

function play(){
    getCarImage();
    document.getElementById('choosingScreen').style.display = 'none';
    document.getElementById('titleScreen').style.display = 'none';
    document.body.style.backgroundImage = 'none';
    playing = true;
    bgImage.loadPixels();
    tireSound.currentTime = 1;
    driveSound.currentTime = 2;
    driveSound.volume = 0.6
}
    
    function draw(){
        if(playing){
        let degree = playerCar.rotation * (Math.PI / 180)
        createCanvas(windowWidth-30, windowHeight-30);
        background('#006400');
        updateBG();
        if(go){
            findPlayer(degree);
            finalSecs = millis();
            secondsRacing = finalSecs - initialSecs;
            secondsRacing = Math.round(secondsRacing/10) / 100;
            textSize(32);
            textAlign(LEFT, TOP);
            text('Timer: ' + secondsRacing, 10, 10);
            textAlign(CENTER, CENTER)
            findMovement(degree);
        }
        movePlayer(degree);
        updatePlayer(degree);
        
        if(!running){
            textFont(pixelFont);
            textSize(50);
            textAlign(CENTER, CENTER)
            fill('grey');
            rect(width/2 - 675, height* 4/5 - 60, 1350, 170);
            fill('white');
            rect(width/2 - 665, height* 4/5 - 50, 1330, 150);
            fill('black');
            text('Press Any Button To Start', width/2, height* 4/5);
            text('Use W,A,S,D or Up, Down, Left, Right or Space bar to move', width/2, height* 4/5 + 50);
            if(keyIsPressed && !keyIsDown(27)){
                countdown = true;
                startCountdown();        
                beepSound.currentTime = 0;
                beepSound.play();
                running = true;
            }
        }
        if(countdown){
            textSize(100);
            text(countdownTime, width/2, height/2 - 300);
        }
        if(playerCar.x > 2307 && playerCar.x < 2488 && playerCar.y > 1195 && playerCar.y < 1598){
            if(!finalBeep){
                beepSound.currentTime = 3.5;
                beepSound.play();
                finalBeep = true;
            }
            
            go = false;
            textSize(70);
            fill('grey');
            rect(width/2 - 310, height*1/6 - 60, 620, 250);
            fill('white');
            rect(width/2 - 300, height*1/6 - 50, 600, 230);
            fill('black');
            text('FINISH!!!', width/2, height*1/6);
            textSize(50);
            score = Math.round(((roadPTS/grassPTS)/secondsRacing) * 10000);
            text(`Your score is ` + score, width/2, height*1/6 + 60);
            text(`With a time of ` + Math.round(secondsRacing) + ' seconds', width/2, height*1/6 + 120);
            fill('grey');
            rect(width/2 - 675, height* 4/5 - 60, 1350, 120);
            fill('white');
            rect(width/2 - 665, height* 4/5 - 50, 1330, 100);
            fill('black');
            text('Press ESC to return to menu', width/2, height* 4/5);

        }
        }
        if(keyIsDown(27)){
            document.body.style.backgroundImage = 'url("/images/39dd6c97e9eb7c2217f4dface2f9390e.jpg")';
            back();
        }        
};

function startCountdown(){
    setTimeout(() => {
        countdownTime = 2;

    }, 1000);
    setTimeout(() => {
        countdownTime = 1;
    }, 2000);
    setTimeout(() => {
        countdownTime = 'GO!!';
        go = true;
        initialSecs = millis();
        beepSound.currentTime = 3.5;
        beepSound.play();
    }, 3000);
    setTimeout(() => {
        countdown = false;
        
    }, 4000);

}

function findMovement(degree) {
    //PLAYER MOVEMENT
    //W
    if((keyIsDown(87) || keyIsDown(38) || keyIsDown(32))){
        driveSound.play()
        if(playerCar.rotation < 90 || playerCar.rotation > 270){
            if(playerCar.yv > playerCarSpeedVariable*-10){
                playerCar.yv -= playerCarSpeedVariable * (Math.cos(degree));
            } else {
                playerCar.yv = playerCarSpeedVariable * -10;
            }
        } else {
            if(playerCar.yv < playerCarSpeedVariable*10){
                playerCar.yv += playerCarSpeedVariable * -(Math.cos(degree));
            } else {
                playerCar.yv = playerCarSpeedVariable * 10;
            }
        };
        if(playerCar.rotation > 360 || playerCar.rotation < 180) {
            if(playerCar.xv < playerCarSpeedVariable*10){
                playerCar.xv += playerCarSpeedVariable * (Math.sin(degree));
            } else {
                playerCar.xv = playerCarSpeedVariable * 10;
            }
        } else {
            if(playerCar.xv > playerCarSpeedVariable*-10){
                playerCar.xv -= playerCarSpeedVariable * -(Math.sin(degree));
            } else {
                playerCar.xv = playerCarSpeedVariable * -10;
            }
        };
    };
    //S
    if((keyIsDown(83) || keyIsDown(40))){
        driveSound.play()
        if(playerCar.rotation < 90 || playerCar.rotation > 270){
            if(playerCar.yv < playerCarSpeedVariable*10){
                playerCar.yv += playerCarSpeedVariable * (Math.cos(degree));
            }
        } else {
            if(playerCar.yv > playerCarSpeedVariable*-10){
                playerCar.yv -= playerCarSpeedVariable * -(Math.cos(degree));
            }
        };
        if(playerCar.rotation > 360 || playerCar.rotation < 180) {
            if(playerCar.xv > playerCarSpeedVariable*-10){
                playerCar.xv -= playerCarSpeedVariable * (Math.sin(degree));
            }
        } else {
            if(playerCar.xv < playerCarSpeedVariable*10){
                playerCar.xv += playerCarSpeedVariable * -(Math.sin(degree));
            }
        };
    };

    if(driveSound.currentTime > 5){
        driveSound.currentTime = 2;
    }
    //A
    if(keyIsDown(65) || keyIsDown(37)){
        tireSound.play()
        if(playerCar.rotation < 0){
            playerCar.rotation += 360;
        };
        playerCar.rotation -= 5;
    };
    //D
    if(keyIsDown(68) || keyIsDown(39)){
        tireSound.play()
        if(playerCar.rotation > 360){
            playerCar.rotation -= 360;
        };
        playerCar.rotation += 5;
    };
    if(tireSound.currentTime > 1.5){
        tireSound.currentTime = 1;
    }
    if(!(keyIsDown(68) || keyIsDown(39) || keyIsDown(65) || keyIsDown(37))){
        tireSound.pause()
    }
}
function movePlayer(degree){
    playerCar.x += playerCar.xv;
    playerCar.y += playerCar.yv;

    //BOUNCE
    if((!(keyIsDown(87) || keyIsDown(38) || keyIsDown(32) || keyIsDown(83) || keyIsDown(40)) || !go) && (playerCar.yv != 0 || playerCar.xv != 0)){
        driveSound.pause();
        if(playerCar.yv > 0){
            playerCar.yv -= 0.75;
        } else if(playerCar.yv < 0){
            playerCar.yv += 0.75;
        };
        if(playerCar.xv > 0){
            playerCar.xv -= 0.75;
        } else if(playerCar.xv < 0){
            playerCar.xv += 0.75;
        };
    };
    if((!(keyIsDown(87) || keyIsDown(38) || keyIsDown(32) || keyIsDown(83) || keyIsDown(40)) || !go) && (0.5 > playerCar.xv && playerCar.xv > -0.5)){
        playerCar.xv = 0;
    }
    
    if((!(keyIsDown(87) || keyIsDown(38) || keyIsDown(32) || keyIsDown(83) || keyIsDown(40)) || !go) && (0.5 > playerCar.yv && playerCar.yv > -0.5)){
        playerCar.yv = 0;
    }

    // if(playerCar.y > playerCarSpeedVariable * 10){
        // playerCar.y = playerCarSpeedVariable * 10;
    // } else if(playerCar.y < playerCarSpeedVariable * -10){
        // playerCar.y = playerCarSpeedVariable * -10;
    // }
    // if(playerCar.x > playerCarSpeedVariable * 10){
        // playerCar.x = playerCarSpeedVariable * 10;
    // } else if(playerCar.x < playerCarSpeedVariable * -10){
        // playerCar.x = playerCarSpeedVariable * -10;
    // }

}
function updateBG(){
    image(bgImage, -playerCar.x + width/2, -playerCar.y + height/2, 2560*4, 957*4);
}

function updatePlayer(degree) { 
    
    strokeWeight(0);
    fill('white');
    push();
    translate(width/2, height/2);
    rotate(degree);
    image(playerCar.image, 0, playerCar.carHeight * 0.75, playerCar.carHeight*2, playerCar.carWidth*2);
    fill('white');
    pop();
    
}

function findPlayer(){
    let x = Number(Math.floor(playerCar.x/4) + (2560))
    let y = Number(Math.floor(playerCar.y/4) + (957/2))
    let position = Math.floor(y * (2560) + x)*4;
    console.log( x - 2560/2 + ', ' + y);
    // console.log( x + ', ' + y);
    // console.log(position);

    let red = bgImage.pixels[position];
    let green = bgImage.pixels[position + 1];
    let blue = bgImage.pixels[position + 2];
    let alpha = bgImage.pixels[position + 3];

    // bgImage.pixels[position] = 0;
    // bgImage.pixels[position + 1] = 0;
    // bgImage.pixels[position + 2] = 0;
    // bgImage.pixels[position + 3] = 255;

    // bgImage.updatePixels();
    //console.log({
    //   red, green, blue, alpha
    //});
    if(((red == 0 && green == 100 && blue == 0) || red == null || alpha == 0) && !(playerCar.carClass.includes('truck') || playerCar.carClass.includes('special purpose'))){
        gravelSound.play();
        if(gravelSound.currentTime == 6){
            gravelSound.currentTime = 0;
        }
        grassPTS += 0.001;
        playerCarSpeedVariable = playerCar.speed -0.4;
    } else {
        gravelSound.pause();
        roadPTS += 0.001;
        playerCarSpeedVariable = playerCar.speed;
    }

    if(x-2560/2 > 1980 && x-2560/2 < 2000 && y > 767){
        if(playerCar.xv > 0){
            playerCar.xv += 1;
        } else {
            playerCar.xv -= 1;
        }
        playerCar.xv *= -1;
    }

    if((red == 255 && green == 128 && blue == 34) || (red == 255 && green == 154 && blue == 69) || (red == 186 && green == 123 && blue == 86) || (red == 3 && green == 1 && blue == 88)){
        let xpos = x - 2560/2;
        let ypos = y;
        console.log('bound')
        if((xpos > 338 && xpos < 815 && ypos > 206 && ypos < 237) || (xpos > 225 && xpos < 817 && ypos > 257 && ypos < 331) || (xpos > 2037 && xpos < 2127 && ypos > 252 && ypos < 273) || (xpos > 2042 && xpos < 2135 && ypos > 307 && ypos < 325) || (xpos > 2222 && xpos < 2259 && ypos > 297 && ypos < 314) || (xpos > 612 && xpos < 2260 && ypos > 741 && ypos < 770) || (xpos > 231 && xpos < 357 && ypos > 440 && ypos < 489) || (xpos > 607 && xpos < 952 && ypos > 454 && ypos < 490) || (xpos > 606 && xpos < 947 && ypos > 517 && ypos < 549)){
            if(playerCar.yv > 0){
                playerCar.yv += 1;
            } else {
                playerCar.yv -= 1;
            }
            playerCar.yv *= -1;
            console.log('hit')
        }
        if((xpos > 326 && xpos < 356 && ypos > 206 && ypos < 491) || (xpos > 784 && xpos < 819 && ypos > 205 && ypos < 311) || (xpos > 231 && xpos < 260 && ypos > 271 && ypos < 494) || (xpos > 601 && xpos < 625 && ypos > 452 && ypos < 556) || (xpos > 924 && xpos < 952 && ypos > 454 && ypos < 550) || (xpos > 607 && xpos < 627 && ypos > 737 && ypos < 774) || (xpos > 2217 && xpos < 2261 && ypos > 295 && ypos < 779) || (xpos > 2039 && xpos < 2064 && ypos > 250 && ypos < 330) || (xpos > 2102 && xpos < 2128 && ypos > 247 && ypos < 328)){
            if(playerCar.xv > 0){
                playerCar.xv += 1;
            } else {
                playerCar.xv -= 1;
            }
            playerCar.xv *= -1;
            console.log('hit')
        }
        if((xpos > 931 && xpos < 1200 && ypos > 90 && ypos < 472) || (xpos > 323 && xpos < 620 && ypos > 481 && ypos < 753)){

            if(playerCar.yv > 0){
                playerCar.yv += 5;
            } else {
                playerCar.yv -= 5;
            }
            playerCar.yv *= -1;

            if(playerCar.xv > 0){
                playerCar.xv += 5;
            } else {
                playerCar.xv -= 5;
            }
            playerCar.xv *= -1;        
        }
        crashSound.currentTime = 0;
        crashSound.play();
    }
}

function getCarImage() {
    if(playerCar.brand.includes('lambo')){
        playerCar.carHeight = 282-257;
        playerCar.carWidth = 99-57;
        playerCar.image = lambo;
    } else if(playerCar.brand.includes('ferrari')){
        playerCar.carHeight = 261-233;
        playerCar.carWidth = 147-100;
        playerCar.image = ferrari;
    } else if(playerCar.carClass.includes('truck')){
        playerCar.carHeight = 318-289;
        playerCar.carWidth = 254-198;
        playerCar.image = truck;
    } else if(playerCar.carClass.includes('van')){
        playerCar.carHeight = 230-202;
        playerCar.carWidth = 196-148;
        playerCar.image = van;
    } else if(playerCar.carClass.includes('station wagon')){
        playerCar.carHeight = 226-195;
        playerCar.carWidth = 254-197;
        playerCar.image = stationWagon;
    } else if(playerCar.carClass.includes('special purpose')){
        playerCar.carHeight = 398-373;
        playerCar.carWidth = 201-154;
        playerCar.image = atv;
    } else if(playerCar.carClass.includes('seater')){
        let rand = Math.floor(Math.random() * 3) + 1;
        if(rand == 1){
            playerCar.carHeight = 120-93;
            playerCar.carWidth = 132-83;
            playerCar.image = twoSeater1;
        } else if(rand == 2) {
            playerCar.carHeight = 113-86;
            playerCar.carWidth = 182-133;
            playerCar.image = twoSeater2;
        } else if(rand == 3) {
            playerCar.carHeight = 143-113;
            playerCar.carWidth = 183-135;
            playerCar.image = twoSeater3;
        }
    } else {
        let rand = Math.floor(Math.random() * 3) + 1;
        if(rand == 1){
            playerCar.carHeight = 425-400;
            playerCar.carWidth = 155-110;
            playerCar.image = car1;
        } else if(rand == 2) {
            playerCar.carHeight = 477-452;
            playerCar.carWidth = 154-109;
            playerCar.image = car2;
        } else if(rand == 3) {
            playerCar.carHeight = 92-65;
            playerCar.carWidth = 129-78;
            playerCar.image = car3;
        }
    }
    
}