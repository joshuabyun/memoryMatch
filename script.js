$(document).ready(function(){
    initInitialPageDom();
});

//------------------things that need some clarification
//need to find a way to change background
function applyBackground(){
    // $('body').css({
    //     "background-image": "url("+ this.initialPageBackground.img +")"
    // }).append(gameOptionPage);
}
//BACKAGROUND IMG - THESE TWO VARS CAN BE COMBINED
var initialPageBackground = {
    img : "../memory_match/images/evangelion-backgrounds-01.jpg"
};
var backgroundPics = {
    player1 : {
        img : '../memory_match/images/evangelion-backgrounds-00.png',
        animationClass :"player1Background"
    },
    // background2 : '../memory_match/images/evangelion-backgrounds-01.jpg',
    // background3 : '../memory_match/images/evangelion-backgrounds-02.jpg',
    player2 : {
        img : '../memory_match/images/evangelion-backgrounds-03.jpg',
        animationClass : "player2Background"
    }
};
//------------------


//NEED TO FIND A WAY TO UTILIZE THE RESET BUTTON
// function applyResetBtn(gameTemplateName,gameTemplateName2){
//     var self = gameTemplateName;
//     var self2 = gameTemplateName2
//     $('#resetBtn').click(
//         function(){
//             self.reset();
//             self2.reset();
//         }
//     )
// }


//------------------------should be the first line-----------------------------
var game1;
var game2;

var cardRuleSet = {
    eva01 : {
        name: 'eva01',
        cardCount: 2,
        image: '../memory_match/images/active_eva00_00.png',
        hideTime: 3000,
        back: '../memory_match/images/nerv.png'
    },
    eva02 : {
        name: 'eva02',
        cardCount: 2,
        image: '../memory_match/images/active_eva00_01.png',
        hideTime: 1000,
        back: '../memory_match/images/nerv.png'
    },
    eva03 : {
        name: 'eva03',
        cardCount: 2,
        image: '../memory_match/images/active_eva01_00.png',
        hideTime: 1000,
        back: '../memory_match/images/nerv.png'
    },
    eva04 : {
        name: 'eva04',
        cardCount: 2,
        image: '../memory_match/images/active_eva01_01.png',
        hideTime: 1000,
        back: '../memory_match/images/nerv.png'
    },
    eva05 : {
        name: 'eva05',
        cardCount: 2,
        image: '../memory_match/images/active_eva02_00.png',
        hideTime: 1000,
        back: '../memory_match/images/nerv.png'
    },
    eva06 : {
        name: 'eva06',
        cardCount: 2,
        image: '../memory_match/images/active_eva02_01.png',
        hideTime: 1000,
        back: '../memory_match/images/nerv.png'
    },
    eva07 : {
        name: 'eva07',
        cardCount: 2,
        image: '../memory_match/images/active_eva02_02.png',
        hideTime: 1000,
        back: '../memory_match/images/nerv.png'
    },
    eva08 : {
        name: 'eva08',
        cardCount: 2,
        image: '../memory_match/images/active_eva06_00.png',
        hideTime: 1000,
        back: '../memory_match/images/nerv.png'
    },
    eva09 : {
        name: 'eva09',
        cardCount: 2,
        image: '../memory_match/images/eva_series_00.png',
        hideTime: 1000,
        back: '../memory_match/images/nerv.png'
    }
};


//initial page related
function initInitialPageDom(){
    //Upper Text
    var playerMode = $("<div>").attr({"id" : "optionTitle"}).text("PLAY MODE");
    //Play mode selection
    var player1 = $('<input>').attr({
        "class" : "playSelector",
        "type" : "radio",
        "name" : "playerMode",
        "value" : "1p",
        "checked" : "checked",
        "id" : "1p"
    });
    var player1Label = $("<label>").attr({
        "for" : "1p",
        "class" : "playSelector"
    }).text("1P");
    var player2 = $('<input>').attr({
        "class" : "playSelector",
        "type" : "radio",
        "name" : "playerMode",
        "value" : "2p",
        "id" : "2p"
    });
    var player2Label = $("<label>").attr({
        "for" : "2p",
        "class" : "playSelector"
    }).text("2P");
    var choosePlayers = $('<form>').attr({"id":"player"}).append(player1,player1Label,player2,player2Label);
    //Start Button
    var start = $("<div>").attr({"id" : "start"}).text("START").click(
        function(){
        initGame($("input:radio:checked").val());
    });
    //append and fade in
    var optionContainer = $("<div>").attr({"id" : "optionContainer"}).append(playerMode,choosePlayers,start);
    var gameOptionPage = $('<section>').css({
       "opacity" : 0
    }).attr({'id' : 'gameOption'}).animate({
        opacity : 1
    },1000,"swing").append(optionContainer);
    $('body').append(gameOptionPage);
}
function initGame(playerMode){
    if(playerMode == "2p"){
        $('#gameOption').animate({
            opacity : 0
        },1000,"linear",function(){
            removeGameOptionDom();
            init2pMode(playerMode)
        });
    }else{
        $('#gameOption').animate({
            opacity : 0
        },1000,"linear",function(){
            removeGameOptionDom();
            init1pMode(playerMode);
        });
    }
}
function removeGameOptionDom(){
    $("#gameOption").remove();
}
function init2pMode(playerMode){
    var game1 = new gameTemplate('player1',cardRuleSet,backgroundPics.player1,playerMode);
    var game2 = new gameTemplate('player2',cardRuleSet,backgroundPics.player2,playerMode, game1);
    game1.opponentObj = game2;
    game1.gameTemplateInit();
    game2.gameTemplateInit();
    game1.createCards();
    game2.createCards();
    game1.appendToDom(game1.domElement);
    //applyResetBtn(game1,game2);
}
function init1pMode(playerMode){
    var game1 = new gameTemplate('player1',cardRuleSet,backgroundPics.player1,playerMode);
    game1.gameTemplateInit();
    game1.createCards();
    game1.appendToDom(game1.domElement);
    //applyResetBtn(game1);
}


function gameTemplate(name,cardRuleSet,backgroundImg,totalPlayers,opponentObj){
    this.name = name;
    this.domElement;
    this.firstCard ;
    this.secondCard;
    this.firstFlipedEventTimeStamp;
    this.secondFlipedEventTimeStamp;
    this.totalPlayerMode = totalPlayers; // 1p for single player 2p for 2player mode
    this.ruleset = cardRuleSet;
    this.children = [];//
    this.childrenDomElementList =[];//would like to consolidate with this.children
    this.gamesPlayed = 0;
    this.matchedCardCount = 0;
    this.attempts = 0;
    this.accurarcy;
    this.opponentObj = opponentObj;
    this.backgroundImgObj = backgroundImg;//contains background image and its animation class POSSIBLY REMOVE
    this.gameTemplateInit = function(){
        this.createDomElement();
    };
    this.createDomElement = function(){
        var gameBoard = $('<section>').attr({'id' : 'game-area','name': this.name});
        this.domElement = gameBoard;
    };
    this.appendToDom = function(domElement){
        // this.applyBodyBackgroundAnimation();
        // this.applyBodyBackground();
        var self = this;
        console.log(domElement);
        $('body').append(domElement);
        $(domElement).css({
            "opacity":0
        }).animate({
              opacity:1
              },2000,"linear",function(){
              self.applyClickToCardTemplates();
        });
    };
    this.removeDom = function(){
        this.domElement.remove(); //in case of using two boards
    };
    this.clearBoard = function(){
        for(var index in this.children){
            this.children[index].removeCardDom();
        }
    };
    // this.applyBodyBackground = function(){   //change background image in the gameboard template
    //   $('body').css({
    //       "background-image": "url("+ this.backgroundImgObj.img +")"
    //   });
    // };
    // this.applyBodyBackgroundAnimation = function(){ //background change animation in the gameboard template
    //     $('body').css({
    //         "animation-name" : this.backgroundImgObj.animationClass
    //     })
    // };
    this.callOpponentObj = function(){
        this.opponentObj.appendToDom(this.opponentObj.domElement);
    };
    this.applyClickToCardTemplates = function(){
        for(var eachCardTemplate in this.children){
            this.children[eachCardTemplate].addClickHandler();
        }
    };
    this.createCards = function(){
        for(var item in this.ruleset){
            for(var i = 0; i < this.ruleset[item].cardCount; i++){
                //console.log('cardTemplate',cardTemplate);
                var card = new cardTemplate(this);
                var domElement = card.cardTemplateInit(this.ruleset[item]);
                this.children.push(card);
                this.childrenDomElementList.push(domElement);
            }
        }
        this.randomizeCardOrder(this.childrenDomElementList);
    };
    this.randomizeCardOrder = function(childrenDomElementList){
        var cardDom =  childrenDomElementList; //this.domElement.find('.card');//array of card dom elements in order based on dom
        var randomizedList = [];
        while(cardDom.length > 0){
            var randomNum = Math.floor(Math.random()*cardDom.length);
            var splicedDom = cardDom.splice(randomNum,1);
            randomizedList.push(splicedDom[0]);
        }
        this.domElement.html('');
        this.domElement.append(randomizedList);
        this.childrenDomElementList = randomizedList;
    };
    this.handleClick = function(clickedCard){
        if(clickedCard.clicked){
            console.log('cannot click what\'s been clicked already');
        }
        if(clickedCard.matched){
            console.log('cannot select what\'s already matched');
            return;
        }
        if(this.firstCard == undefined){
            this.firstCard = clickedCard;
            this.firstCard.clicked = true;
            console.log("first card",this.firstCard);
            this.firstCard.handleFirstCard();
        }
        else if(this.secondCard == undefined){
            if(clickedCard != this.firstCard){
                this.secondCard = clickedCard;
                this.secondCard.clicked = true;
                console.log('second card',this.secondCard);
                this.secondCard.handleSecondCard();
                this.checkCardsMatched();
            }
            else{
                console.log('cannot choose the same card as the first one');
            }
        }
        else{
            console.log('cannot accept more cards');
        }
    };
    this.checkCardsMatched = function(){
        this.attempts++;
        if(this.firstCard.getCard() == this.secondCard.getCard()){
            console.log('cards matched');
            this.firstCard.handleMatchedCondition(this.secondCard);
            this.secondCard.handleMatchedCondition(this.firstCard);
            this.matchedCardCount+=2;
            if(this.matchedCardCount == this.children.length){
                this.calculateStats();
                this.displayStats();
                console.log('you won');
                this.gameWinHandler();
                return;
            }
            this.calculateStats();
            this.displayStats();
            this.firstCard = null;
            this.secondCard = null;
        }else{
            this.calculateStats();
            this.displayStats();
            var self = this;
            console.log('card not matched');
            setTimeout(function(){
                self.firstCard.handleMismatchCondition(self.secondCard);
                self.secondCard.handleMismatchCondition(self.firstCard);
                },1000)
        }
    };
    this.waitForFlipEvent = function(timeStamp){
        if(this.firstFlipedEventTimeStamp == undefined){
            this.firstFlipedEventTimeStamp = timeStamp;
            console.log('first flip ends at ',this.firstFlipedEventTimeStamp);
        }else if(this.secondFlipedEventTimeStamp == undefined){
            this.secondFlipedEventTimeStamp = timeStamp;
            console.log('second flip ends at ',this.secondFlipedEventTimeStamp);
            if(this.totalPlayerMode == "2p"){
                this.removeDom();
                this.callOpponentObj();
            }
            this.firstCard.clicked = null;
            this.secondCard.clicked = null;
            this.firstCard = null;
            this.secondCard = null;
            this.firstFlipedEventTimeStamp = null;
            this.secondFlipedEventTimeStamp = null;
        }
    };
    this.gameWinHandler = function(){
        this.reset();
        if(this.totalPlayerMode == "2p"){
            this.opponentObj.reset();
        }
        console.log('you won');
    };
    this.reset = function(){
        this.gamesPlayed +=1;
        this.clearBoard();
        this.children = [];
        this.childrenDomElementList =[];
        this.firstCard = null;
        this.secondCard = null;
        this.attempts = 0;
        this.matchedCardCount = 0;
        this.createCards();
        this.applyClickToCardTemplates();///////////////////////////////////////////////click handler
        console.log('gamesPlayed : ',this.gamesPlayed );
    };
    this.calculateStats = function(){
        console.log('calculation running');
        var matches = this.matchedCardCount/2;
        var attempts = this.attempts;
        var decimal_accuracy = matches/attempts*100;
        this.accurarcy = decimal_accuracy.toFixed(2) + "%";
    };
    this.displayStats = function(){
        console.log('stats display running');
        var statsDomId = this.name+"Stat";
        $("#"+statsDomId+" > .gamesPlayed .value").text(this.gamesPlayed);
        $("#"+statsDomId+" > .attempts .value").text(this.attempts);
        $("#"+statsDomId+" > .accuracy .value").text(this.accurarcy);
    };
}


function cardTemplate(parent){
    this.parent = parent;
    this.domElement;
    this.ruleset;
    this.matched;
    this.clicked;
    this.cardTemplateInit = function(ruleset){
        this.ruleset =ruleset;
        var cardDomElement  = this.createDomElement(this.ruleset);
        return cardDomElement;
    };
    this.createDomElement = function(ruleset){
        var back =$('<div>').addClass('back').append($('<img>').attr({'src' : ruleset.back}));
        var front = $('<div>').addClass('front').append($('<img>').attr({'src' : ruleset.image}));
        var card = $('<div>').addClass('card').attr({'name' : this.ruleset.name});
        this.domElement = card.append(front,back);
        return this.domElement;
    };
    this.removeCardDom = function(){
      this.domElement.remove();
    };
    this.addClickHandler = function(){
        this.domElement.click(this.handleClick.bind(this));//before bind(), this refers to the dom element
    };
    this.handleClick = function(){
        this.parent.handleClick(this);
    };
    this.handleFirstCard = function(){
        this.showCard();
    };
    this.handleSecondCard = function(){
        this.showCard();
    };
    this.showCard = function(){
        this.domElement.find('.back').removeClass('flipBack2');
        this.domElement.find('.front').removeClass('flipFront2');
        this.domElement.find('.back').addClass('flipBack');
        this.domElement.find('.front').addClass('flipFront');
    };
    function whichTransitionEvent(){    //not my code : listens for the event
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };
        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }
    this.listenEvent = function(){
        var self = this;
        var transitionEvent = whichTransitionEvent();
        transitionEvent && this.domElement.one(transitionEvent, function(e) {
            self.parent.waitForFlipEvent(e.timeStamp);
        });
    };
    this.hideCard = function(){
        this.domElement.find('.back').removeClass('flipBack');
        this.domElement.find('.front').removeClass('flipFront');
        this.domElement.find('.back').addClass('flipBack2');
        this.domElement.find('.front').addClass('flipFront2');
    };
    this.handleMatchedCondition = function(matchedPair){
        this.matched = true;
        console.log('i ',this.domElement, 'am matched with ', matchedPair.domElement);
    };
    this.handleMismatchCondition = function(){
        this.listenEvent();
        this.hideCard();
    };
    this.getCard = function(){
        return this.ruleset.name;
    };
}
