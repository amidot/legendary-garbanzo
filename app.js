document.addEventListener('DOMContentLoaded',()=>{
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    let doodlerSL = 50;
    let startPoint = 150;
    let doodlerSB = startPoint;
    let isGameOver = false;
    let platFormCount = 5;
    let platForms = [];
    let upTimerid
    let downTimerid
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId 
    let rightTimerId
    let score = 0;

    function createDoodler(){
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodlerSL = platForms[0].left;
        doodler.style.left = doodlerSL + 'px';
        doodler.style.bottom = doodlerSB + 'px';
    }

    class PlatForm {
        constructor(newplatBottom){
            this.bottom = newplatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;

            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    function createPlatform(){
        for(let i=0; i<platFormCount; i++){
            let platFormGap = 600 / platFormCount;
            let newplatBottom = 100 + i * platFormGap;
            let newPlatForm = new PlatForm(newplatBottom);
            platForms.push(newPlatForm);
        }
    }

    function movePlatform(){
        if(doodlerSB > 200){
            platForms.forEach(platform =>{
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if(platform.bottom < 10){
                    let fisrtplatform = platForms[0].visual;
                    fisrtplatform.classList.remove('platform');
                    platForms.shift();
                    score++;
                    let newplatform = new PlatForm(600);
                    platForms.push(newplatform);
                }
            })
        }
    }

    function jump(){
        clearInterval(downTimerid)
        isJumping = true;
        upTimerid = setInterval(function(){
            doodlerSB += 20;
            doodler.style.bottom = doodlerSB + 'px';
            if(doodlerSB > startPoint + 200){
                fall();
            }
        },30)
    }

    function fall(){
        clearInterval(upTimerid);
        isJumping = false;
        downTimerid = setInterval(function(){
            doodlerSB -= 5;
            doodler.style.bottom = doodlerSB + 'px';
            if(doodlerSB <= 0){
                gameOver();
            }
            platForms.forEach(platform =>{
                if((doodlerSB >= platform.bottom) 
                && (doodlerSB <= platform.bottom +15) && 
                ((doodlerSL + 60) >= platform.left) && 
                (doodlerSL <= (platform.left + 85)) && !isJumping ){
                    startPoint = doodlerSB;
                    jump();

                }
            })
        },30)
    }

    function gameOver(){
        isGameOver = true;
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML= score;
        clearInterval(upTimerid);
        clearInterval(downTimerid);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        
    }

    function control(e){
        if(e.key === "ArrowLeft"){
            //move left
            moveLeft();
        }else if(e.key === "ArrowRight"){
            //move right
            moveRight();
        }else if(e.key === "ArrowUp"){
            //move up
            moveStright();
        }
    }

    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId)
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function(){
            if(doodlerSL >= 0){
                doodlerSL -= 5;
                doodler.style.left = doodlerSL + 'px';
            }else moveRight();
            
        }, 30);

    }

    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerId = setInterval(function(){
            if(doodlerSL <= 340){
                doodlerSL += 5;
                doodler.style.left = doodlerSL + 'px';
            }else moveLeft();
        }, 30)
    }

    function moveStright(){
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        

    }

    function start(){
        if(!isGameOver){
            createPlatform();
            createDoodler();
            setInterval(movePlatform, 30);
            jump();
            document.addEventListener('keyup', control)
        }
    }
    start();
})