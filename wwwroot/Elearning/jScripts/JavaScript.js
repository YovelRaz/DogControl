var accessibility = ["false"];
var boldy = ["false"];
var sizy = [0];

$(document).ready(function () {
    var pageName = document.location.href.match(/[^\/]+$/)[0];//בדיקת שם עמוד נוכחי
    var myArray = sessionStorage.getItem('myArray');//בדיקת קונטרסט
    var mySize = sessionStorage.getItem('mySize');//בדיקת גודל
    var myBold = sessionStorage.getItem('myBold');//בדיקת כתב בולט

    var pathname = window.location.pathname;
    var n = pathname.lastIndexOf('/');
    var result = pathname.substring(n + 1);
    if (result == "") {
        console.log("ריק");
    }



    if (pageName == "index.html" || result == "") {//הזזת הלוגו בהתאם לגודל מסך
        var windowHeight = $(document).height();
        var objectHeight = $("#allEnter").height() / windowHeight;
        var topHeight = $("#enterTopMenu").height() / windowHeight;
        var bottomHeight = $("#enterBut").height() / windowHeight;
        var footerHeight = $("#hitFooter").height() / windowHeight;
        var calc = (((1 - (topHeight + bottomHeight + objectHeight + footerHeight)) / 2) + topHeight) * windowHeight;
        $("#allEnter").css("margin-top", calc);
    }

    contrast();
    getSize();
    bold();

    var width = $(window).width();

    if (width < 575) {
        $(".fixP").css("width", width);
        calcContent();
    }
    function calcContent() {
        var windowHeight = $(window).height();
        var conH = windowHeight - 145;
        $('#content').css('height', conH);
    }

    $("#aboutWindow").hide();
    $(".hotspotWin").hide();

    $(".contrastBtn").click(function () {//קליק על כפתור קונטרסט
        if (accessibility[0] == "false") {//לקונטרסט גבוה
            highContrast();
            accessibility[0] = "true";
            sessionStorage.setItem('myArray', accessibility[0]);
            if (boldy[0] == "false") {
                var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                $('.boldTextBtn').css('backgroundPosition', '-213px ' + boldTextBtn);//קונטרסט גבוה רגיל
            }

            else {
                var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                $('.boldTextBtn').css('backgroundPosition', '-555px ' + boldTextBtn);//קונטרסט גבוה בולט
            }
        }

        else {//לקונטרסט רגיל
            lowContrast();
            accessibility[0] = "false";
            sessionStorage.setItem('myArray', accessibility[0]);
            if (boldy[0] == "false") {
                var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                $('.boldTextBtn').css('backgroundPosition', '-42px ' + boldTextBtn);//קונטרסט נמוך רגיל
            }

            else {
                var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                $('.boldTextBtn').css('backgroundPosition', '-384px ' + boldTextBtn);//קונטרסט נמוך בולט
            }
        }
    });

    function contrast() {//בדיקת קונטרסט
        if (myArray != null) {//אם הכפתור נלחץ בעבר
            if (myArray == "false") {//אם הקונטרסט רגיל
                lowContrast();
                accessibility[0] = "false";
                sessionStorage.setItem('myArray', accessibility[0]);
            }

            else {//אם הקונטרסט גבוה
                highContrast();
                accessibility[0] = "true";
                sessionStorage.setItem('myArray', accessibility[0]);
            }
        }

    }
    $(".boldTextBtn").click(function () {//קליק על כפתור בולד
        if (boldy[0] == "false") {//לכתב בולט
            yesBold();
            boldy[0] = "true";
            sessionStorage.setItem('myBold', boldy[0]);
        }

        else {//לכתב רגיל
            noBold();
            boldy[0] = "false";
            sessionStorage.setItem('myBold', boldy[0]);
        }
        boldyHover();
    });

    function bold() {//בדיקת טקסט בולט
        if (myBold != null) {//אם הכפתור נלחץ בעבר
            if (myBold == "false") {//אם הטקסט רגיל
                noBold();
                boldy[0] = "false";
                sessionStorage.setItem('myBold', boldy[0]);
            }

            else {//אם הטקסט בולט
                yesBold();
                boldy[0] = "true";
                sessionStorage.setItem('myBold', boldy[0]);
            }
        }
        boldyHover();
    }

    function yesBold() {//פונקצית כתב בולט
        $("#content, #accessibilityDiv, #logoName, #accWindow, #arrows, #aboutWin, .breadcrumbs, .breadcrumbs a, .modal-body p").css("font-weight", "bold");
        $(".toDo, .myBold, h1, h2, h3, h4, h5, h6").css("-webkit-text-stroke", "0.5px");

        if (accessibility[0] == "false") {
            var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
            $('.boldTextBtn').css('backgroundPosition', '-384px ' + boldTextBtn);//קונטרסט נמוך בולט
        }

        else {
            var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
            $('.boldTextBtn').css('backgroundPosition', '-555px ' + boldTextBtn);//קונטרסט גבוה בולט
        }
    }

    function noBold() {//פונקצית כתב רגיל
        $("#content, #accessibilityDiv, #logoName, #accWindow, #arrows, #aboutWin, .breadcrumbs, .breadcrumbs a, .modal-body p").css("font-weight", "normal");
        $(".toDo, .myBold, h1, h2, h3, h4, h5, h6").css("font-weight", "bold");
        $(".toDo, .myBold, h1, h2, h3, h4, h5, h6").css("-webkit-text-stroke", "0px");

        if (accessibility[0] == "false") {
            var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
            $('.boldTextBtn').css('backgroundPosition', '-42px ' + boldTextBtn);//קונטרסט נמוך רגיל
        }

        else {
            var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
            $('.boldTextBtn').css('backgroundPosition', '-213px ' + boldTextBtn);//קונטרסט גבוה רגיל
        }
    }


    function lowContrast() {//פונקצית קונטרסט נמוך
        $("#container, .accorbody").css("background-color", "white");
        $(".modal-content").css("border", "2px solid #1D3666");
        $(".hotspotWin, .modal-content, .card, #hitFooter").css("background-color", "#eae9e7");
        $("#content, .size, .contrast, #popupH2, #forwardText, #backText, .accorBtns, .mb-0, #copy, #aboutH2, .aboutP, #hitFooterP, #logoName, .boldText, .modal-title, .modal-body p").css("color", "#1d3666");
        $("audio").css("filter", "sepia(26%) saturate(70%) grayscale(1) contrast(99%) invert(100%)");
        $(".breadcrumbs a, #mailLink, .myLinks, #popupLink , #aboutBtn").css("color", "#b23326");
        $(".breadcrumbs").css("color", "#1d3666");
        $("#logoPic, #logoEnter").attr('src', "images/logo1.png");

        if (pageName != "index.html") {
            var closeBut = $('.closeBut').css('backgroundPosition').split(' ')[1];
            $('.closeBut').css('backgroundPosition', '0px ' + closeBut);//קונטרסט נמוך

            var contrastBtn = $('.contrastBtn').css('backgroundPosition').split(' ')[1];
            $('.contrastBtn').css('backgroundPosition', '-41px ' + contrastBtn);

            var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
            $('.boldTextBtn').css('backgroundPosition', '-42px ' + boldTextBtn);

            var plus = $('.plus').css('backgroundPosition').split(' ')[1];
            $('.plus').css('backgroundPosition', '-40px ' + plus);//קונטרסט נמוך

            var minus = $('.minus').css('backgroundPosition').split(' ')[1];
            $('.minus').css('backgroundPosition', '-40px ' + minus);//קונטרסט נמוך

            var forwardBtn = $('#forwardBtn').css('backgroundPosition').split(' ')[1];
            $('#forwardBtn').css('backgroundPosition', '0px ' + forwardBtn);//קונטרסט נמוך

            var backBtn = $('#backBtn').css('backgroundPosition').split(' ')[1];
            $('#backBtn').css('backgroundPosition', '-0.5px ' + backBtn);//קונטרסט נמוך

            var accBut = $('#accBut').css('backgroundPosition').split(' ')[1];
            $('#accBut').css('backgroundPosition', '10px ' + accBut);//קונטרסט נמוך

            if (boldy[0] == "false") {
                var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                $('.boldTextBtn').css('backgroundPosition', '-42px ' + boldTextBtn);//קונטרסט נמוך רגיל
            }

            else {
                var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                $('.boldTextBtn').css('backgroundPosition', '-384px ' + boldTextBtn);//קונטרסט נמוך בולט
            }

        }

        else {
            var closeBut = $('.closeBut').css('backgroundPosition').split(' ')[1];
            $('.closeBut').css('backgroundPosition', '0px ' + closeBut);//קונטרסט נמוך
            $("#enterDiv").css("color", "#1d3666");
        }
    }

    function highContrast() {//פונקצית קונטרסט גבוה
        $("#container,.accorbody, #hitFooter").css("background-color", "black");
        $(".modal-content").css("border", "2px solid white");
        $(".hotspotWin, .modal-content, .card, #hitFooter").css("background-color", "#787373");
        $("#content, .accorBtns, .mb-0, #copy, #aboutH2, .aboutP, #hitFooterP, .modal-title, .modal-body p").css("color", "white");
        $(".size, .contrast, #popupH2, #forwardText, #backText, .boldText").css("color", "black");
        $("audio").css("filter", "sepia(26%) saturate(70%) grayscale(1) contrast(99%) invert(0%)");
        $(".breadcrumbs").css("color", "white");
        $(".breadcrumbs a, #mailLink").css("color", "#f6ba20");
        $("#popupLink,.myLinks, #aboutBtn, #logoName").css("color", "black");
        $("#logoPic, #logoEnter").attr('src', "images/logoContrast.png");

        if (pageName != "index.html") {
            var contrastBtn = $('.contrastBtn').css('backgroundPosition').split(' ')[1];
            $('.contrastBtn').css('backgroundPosition', '-209px ' + contrastBtn);

            var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
            $('.boldTextBtn').css('backgroundPosition', '-213px ' + boldTextBtn);

            var plus = $('.plus').css('backgroundPosition').split(' ')[1];
            $('.plus').css('backgroundPosition', '-207px ' + plus);//קונטרסט גבוה

            var minus = $('.minus').css('backgroundPosition').split(' ')[1];
            $('.minus').css('backgroundPosition', '-207px ' + minus);//קונטרסט גבוה

            var forwardBtn = $('#forwardBtn').css('backgroundPosition').split(' ')[1];
            $('#forwardBtn').css('backgroundPosition', '-104.5px ' + forwardBtn);//קונטרסט גבוה

            var backBtn = $('#backBtn').css('backgroundPosition').split(' ')[1];
            $('#backBtn').css('backgroundPosition', '-104px ' + backBtn);//קונטרסט גבוה

            var closeBut = $('.closeBut').css('backgroundPosition').split(' ')[1];
            $('.closeBut').css('backgroundPosition', '-112px ' + closeBut);//קונטרסט גבוה

            var accBut = $('#accBut').css('backgroundPosition').split(' ')[1];
            $('#accBut').css('backgroundPosition', '-312px ' + accBut);//קונטרסט גבוה

            if (boldy[0] == "false") {
                var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                $('.boldTextBtn').css('backgroundPosition', '-213px ' + boldTextBtn);//קונטרסט גבוה רגיל
            }

            else {
                var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                $('.boldTextBtn').css('backgroundPosition', '-555px ' + boldTextBtn);//קונטרסט גבוה בולט
            }
        }

        else {
            var closeBut = $('.closeBut').css('backgroundPosition').split(' ')[1];
            $('.closeBut').css('backgroundPosition', '-112px ' + closeBut);//קונטרסט גבוה
            $("#enterDiv").css("color", "black");

        }
    }

    function boldyHover() {//פונקצית הובר לכפתור כתב בולד
        if (boldy[0] == "false") {//כתב רגיל
            $(".boldTextBtn").hover(function () {
                if (accessibility[0] == "false") {
                    var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                    $('.boldTextBtn').css('backgroundPosition', '-127.5px ' + boldTextBtn);//קונטרסט נמוך הובר
                }

                else {
                    var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                    $('.boldTextBtn').css('backgroundPosition', '-298.5px ' + boldTextBtn);//קונטרסט גבוה הובר
                }
            }, function () {
                if (accessibility[0] == "false") {
                    var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                    $('.boldTextBtn').css('backgroundPosition', '-42px ' + boldTextBtn);//קונטרסט נמוך
                }

                else {
                    var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                    $('.boldTextBtn').css('backgroundPosition', '-213px ' + boldTextBtn);//קונטרסט גבוה
                }
            });
        }

        else {
            $(".boldTextBtn").hover(function () {//הובר כפתורים בקונטרסט
                if (accessibility[0] == "false") {//כתב בולט
                    var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                    $('.boldTextBtn').css('backgroundPosition', '-469.5px ' + boldTextBtn);//קונטרסט נמוך הובר
                }
                else {
                    var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                    $('.boldTextBtn').css('backgroundPosition', '-640.5px ' + boldTextBtn);//קונטרסט גבוה הובר
                }
            }, function () {
                if (accessibility[0] == "false") {
                    var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                    $('.boldTextBtn').css('backgroundPosition', '-384px ' + boldTextBtn);//קונטרסט נמוך
                }

                else {
                    var boldTextBtn = $('.boldTextBtn').css('backgroundPosition').split(' ')[1];
                    $('.boldTextBtn').css('backgroundPosition', '-555px ' + boldTextBtn);//קונטרסט גבוה
                }
            });
        }
    }

    $(".contrastBtn").hover(function () {//הובר כפתורים בקונטרסט
        if (accessibility[0] == "false") {
            var contrastBtn = $('.contrastBtn').css('backgroundPosition').split(' ')[1];
            $('.contrastBtn').css('backgroundPosition', '-125px ' + contrastBtn);//קונטרסט נמוך הובר
        }
        else {
            var contrastBtn = $('.contrastBtn').css('backgroundPosition').split(' ')[1];
            $('.contrastBtn').css('backgroundPosition', '-293px ' + contrastBtn);//קונטרסט גבוה הובר
        }
    }, function () {
        if (accessibility[0] == "false") {
            var contrastBtn = $('.contrastBtn').css('backgroundPosition').split(' ')[1];
            $('.contrastBtn').css('backgroundPosition', '-41px ' + contrastBtn);//קונטרסט נמוך
        }

        else {
            var contrastBtn = $('.contrastBtn').css('backgroundPosition').split(' ')[1];
            $('.contrastBtn').css('backgroundPosition', '-209px ' + contrastBtn);//קונטרסט גבוה
        }
    });



    $(".plus").hover(function () {//הובר כפתורים בקונטרסט
        if (accessibility[0] == "false") {
            var plus = $('.plus').css('backgroundPosition').split(' ')[1];
            $('.plus').css('backgroundPosition', '-124px ' + plus);//קונטרסט נמוך הובר
        }

        else {
            var plus = $('.plus').css('backgroundPosition').split(' ')[1];
            $('.plus').css('backgroundPosition', '-291px ' + plus);//קונטרסט גבוה הובר
        }
    }, function () {
        if (accessibility[0] == "false") {
            var plus = $('.plus').css('backgroundPosition').split(' ')[1];
            $('.plus').css('backgroundPosition', '-40px ' + plus);//קונטרסט נמוך
        }

        else {
            var plus = $('.plus').css('backgroundPosition').split(' ')[1];
            $('.plus').css('backgroundPosition', '-207px ' + plus);//קונטרסט גבוה
        }
    });

    $(".minus").hover(function () {//הובר כפתורים בקונטרסט
        if (accessibility[0] == "false") {
            var minus = $('.minus').css('backgroundPosition').split(' ')[1];
            $('.minus').css('backgroundPosition', '-124px ' + minus);//קונטרסט נמוך הובר
        }

        else {
            var minus = $('.minus').css('backgroundPosition').split(' ')[1];
            $('.minus').css('backgroundPosition', '-291px ' + minus);//קונטרסט גבוה הובר
        }
    }, function () {
        if (accessibility[0] == "false") {
            var minus = $('.minus').css('backgroundPosition').split(' ')[1];
            $('.minus').css('backgroundPosition', '-40px ' + minus);//קונטרסט נמוך
        }

        else {
            var minus = $('.minus').css('backgroundPosition').split(' ')[1];
            $('.minus').css('backgroundPosition', '-207px ' + minus);//קונטרסט גבוה
        }
    });

    $("#forwardBtn").hover(function () {//הובר כפתורים בקונטרסט
        if (accessibility[0] == "false") {
            var forwardBtn = $('#forwardBtn').css('backgroundPosition').split(' ')[1];
            $('#forwardBtn').css('backgroundPosition', '-52px ' + forwardBtn);//קונטרסט נמוך הובר
        }

        else {
            var forwardBtn = $('#forwardBtn').css('backgroundPosition').split(' ')[1];
            $('#forwardBtn').css('backgroundPosition', '-156px ' + forwardBtn);//קונטרסט גבוה הובר
        }
    }, function () {
        if (accessibility[0] == "false") {
            var forwardBtn = $('#forwardBtn').css('backgroundPosition').split(' ')[1];
            $('#forwardBtn').css('backgroundPosition', '-0.5px ' + forwardBtn);//קונטרסט נמוך
        }

        else {
            var forwardBtn = $('#forwardBtn').css('backgroundPosition').split(' ')[1];
            $('#forwardBtn').css('backgroundPosition', '-104.5px ' + forwardBtn);//קונטרסט גבוה
        }
    });

    $("#backBtn").hover(function () {//הובר כפתורים בקונטרסט
        if (accessibility[0] == "false") {
            var backBtn = $('#backBtn').css('backgroundPosition').split(' ')[1];
            $('#backBtn').css('backgroundPosition', '-52px ' + backBtn);//קונטרסט נמוך הובר
        }

        else {
            var backBtn = $('#backBtn').css('backgroundPosition').split(' ')[1];
            $('#backBtn').css('backgroundPosition', '-155.5px ' + backBtn);//קונטרסט גבוה הובר
        }
    }, function () {
        if (accessibility[0] == "false") {
            var backBtn = $('#backBtn').css('backgroundPosition').split(' ')[1];
            $('#backBtn').css('backgroundPosition', '-0.5px ' + backBtn);//קונטרסט נמוך
        }

        else {
            var backBtn = $('#backBtn').css('backgroundPosition').split(' ')[1];
            $('#backBtn').css('backgroundPosition', '-104px ' + backBtn);//קונטרסט גבוה
        }
    });

    $(".closeBut").hover(function () {//הובר כפתורים בקונטרסט
        if (accessibility[0] == "false") {
            var closeBut = $('.closeBut').css('backgroundPosition').split(' ')[1];
            $('.closeBut').css('backgroundPosition', '-56px ' + closeBut);//קונטרסט נמוך הובר
        }

        else {
            var closeBut = $('.closeBut').css('backgroundPosition').split(' ')[1];
            $('.closeBut').css('backgroundPosition', '-168px ' + closeBut);//קונטרסט גבוה הובר
        }
    }, function () {
        if (accessibility[0] == "false") {
            var closeBut = $('.closeBut').css('backgroundPosition').split(' ')[1];
            $('.closeBut').css('backgroundPosition', '0px ' + closeBut);//קונטרסט נמוך
        }

        else {
            var closeBut = $('.closeBut').css('backgroundPosition').split(' ')[1];
            $('.closeBut').css('backgroundPosition', '-112px ' + closeBut);//קונטרסט גבוה
        }
    });

    $("#accBut").hover(function () {//הובר כפתורים בקונטרסט
        if (accessibility[0] == "false") {
            var accBut = $('#accBut').css('backgroundPosition').split(' ')[1];
            $('#accBut').css('backgroundPosition', '-151px ' + accBut);//קונטרסט נמוך הובר
        }

        else {
            var accBut = $('#accBut').css('backgroundPosition').split(' ')[1];
            $('#accBut').css('backgroundPosition', '-473px ' + accBut);//קונטרסט גבוה הובר
        }
    }, function () {
        if (accessibility[0] == "false") {
            var accBut = $('#accBut').css('backgroundPosition').split(' ')[1];
            $('#accBut').css('backgroundPosition', '10px ' + accBut);//קונטרסט נמוך
        }

        else {
            var accBut = $('#accBut').css('backgroundPosition').split(' ')[1];
            $('#accBut').css('backgroundPosition', '-312px ' + accBut);//קונטרסט גבוה
        }
    });

    $(".plus").click(function () {//הגדלת טקסט
        var mySize = sessionStorage.getItem('mySize');//בדיקת גודל

        if (mySize != null) {//אם יש ערך תכניס למשתנה חישובי
            sizy = parseInt(mySize);
        }

        if (sizy >= -2 && sizy < 3) {
            sizy = parseInt(sizy + 1);
        }
        sessionStorage.setItem('mySize', sizy);
        getSize();
    });


    $(".minus").click(function () {//הקטנת טקסט
        var mySize = parseInt(sessionStorage.getItem('mySize'));//בדיקת גודל

        if (mySize != null) {//אם יש ערך תכניס למשתנה חישובי
            sizy = parseInt(mySize);
        }

        if (sizy > -2 && sizy <= 3) {
            sizy -= 1;
        }
        sessionStorage.setItem('mySize', sizy);
        getSize();
    });

    function getSize() {//פונקצית עיצוב לפי גודל
        var width = $(window).width();

        var mySize = sessionStorage.getItem('mySize');//בדיקת גודל

        if (mySize == -2) {
            $('#content, .modal-body p').css('font-size', '7px');
            $('.myAcor, h3, h2, h4').css('font-size', '7px');
            $('.mb-0, #aboutH2').css('font-size', '9px');
            $('#backText, #forwardText, .contrast, .size, .boldText, .aboutP').css('font-size', '6px');
            $('#textGuideDog').css('padding-top', '0px');
            $('#forwardText, #backText').css('margin-top', '30px');
            $('.contrast').css('width', '34px');
            $('.size').css('width', '25px');
            $('.boldText').css('width', '32px');
            $('#accessibilityDiv').css('width', '380px');
            $('#SkipH1').css('font-size', '10px');
            $('.modal-title').css('font-size', '9px');
            $('#aboutName').css('font-size', '8px');
            $('#popupH2, #copy').css('font-size', '5px');
            $('.breadcrumbs li').css('font-size', '5px');
        }

        if (mySize == -1) {
            $('#content, .modal-body p').css('font-size', '12px');
            $('.myAcor, h3, h2, h4').css('font-size', '12px');
            $('.mb-0, #aboutH2').css('font-size', '15px');
            $('#backText, #forwardText, .contrast, .size, .boldText, .aboutP').css('font-size', '11px');
            $('#textGuideDog').css('padding-top', '0px');
            $('#forwardText, #backText').css('margin-top', '30px');
            $('.contrast, .boldText').css('width', '34px');
            $('.size').css('width', '25px');
            $('#accessibilityDiv').css('width', '380px');
            $('#SkipH1').css('font-size', '21px');
            $('.modal-title').css('font-size', '17px');
            $('#aboutName').css('font-size', '17px');
            $('#popupH2, #copy').css('font-size', '9px');
            $('.breadcrumbs li').css('font-size', '10px');
        }

        if (mySize == 0 || mySize == null) {
            $('#content, .modal-body p').css('font-size', '18px');
            $('.myAcor, h3, h2, h4').css('font-size', '19px');
            $('.mb-0, #aboutH2').css('font-size', '20px');
            $('#backText, #forwardText, .contrast, .size, .boldText, .aboutP').css('font-size', '16px');
            $('#textGuideDog').css('padding-top', '33px');
            $('#forwardText, #backText').css('margin-top', '30px');
            $('.contrast').css('width', '57px');
            $('.size').css('width', '42px');
            $('.boldText').css('width', '53px');
            $('#SkipH1').css('font-size', '32px');
            $('#accessibilityDiv').css('width', '435px');
            $('.modal-title').css('font-size', '28px');
            $('#aboutName').css('font-size', '26px');
            $('#popupH2, #copy').css('font-size', '13px');
            $('.breadcrumbs li').css('font-size', '15px');

            if (width < 575) {
                $('#textGuideDog').css('padding-top', '0px');
            }
            else {
                $('#textGuideDog').css('padding-top', '33px');
            }
        }

        if (mySize == 1) {
            $('#content, .modal-body p').css('font-size', '24px');
            $('.myAcor, h3, h2, h4').css('font-size', '24px');
            $('.mb-0, #aboutH2').css('font-size', '27px');
            $('#backText, #forwardText, .contrast, .size, .boldText, .aboutP').css('font-size', '21px');
            $('#textGuideDog').css('padding-top', '0px');
            $('#forwardText, #backText').css('margin-top', '27px');
            $('.contrast').css('width', '84px');
            $('.size, .boldText').css('width', '75px');
            $('#accessibilityDiv').css('width', '520px');
            $('#SkipH1').css('font-size', '43px');
            $('.modal-title, #aboutName').css('font-size', '35px');
            $('#popupH2, #copy').css('font-size', '17px');
            $('.breadcrumbs li').css('font-size', '20px');
        }

        if (mySize == 2) {
            $('#content, .modal-body p').css('font-size', '30px');
            $('.myAcor, h3, h2, h4').css('font-size', '30px');
            $('.mb-0, #aboutH2').css('font-size', '34px');
            $('#backText, #forwardText, .contrast, .size, .boldText, .aboutP').css('font-size', '26px');
            $('#textGuideDog').css('padding-top', '0px');
            $('#forwardText, #backText').css('margin-top', '21px');
            $('.contrast').css('width', '103px');
            $('.boldText').css('width', '90px');
            $('.size').css('width', '75px');
            $('#accessibilityDiv').css('width', '556px');
            $('#SkipH1').css('font-size', '54px');
            $('.modal-title').css('font-size', '42px');
            $('#aboutName').css('font-size', '44px');
            $('#popupH2, #copy').css('font-size', '21px');
            $('.breadcrumbs li').css('font-size', '25px');
        }

        if (mySize == 3) {
            $('#content, .modal-body p').css('font-size', '36px');
            $('.myAcor, h3, h2, h4').css('font-size', '36px');
            $('.mb-0, #aboutH2').css('font-size', '41px');
            $('#backText, #forwardText, .contrast, .size, .boldText, .aboutP').css('font-size', '31px');
            $('#textGuideDog').css('padding-top', '0px');
            $('#forwardText, #backText').css('margin-top', '18px');
            $('.contrast').css('width', '111px');
            $('.size').css('width', '75px');
            $('.boldText').css('width', '103px');
            $('#accessibilityDiv').css('width', '575px');
            $('#SkipH1').css('font-size', '65px');
            $('.modal-title').css('font-size', '49px');
            $('#aboutName').css('font-size', '52px');
            $('#popupH2, #copy').css('font-size', '25px');
            $('.breadcrumbs li').css('font-size', '30px');
        }
    }

    //////////////עמוד טיפים///////////////////
    $(".myTabs").hide();
    $(".myTabsBtn").click(function () {//פונקצית רקעי כפתורים 
        var changeBg = $(".myTabsBtn").css('backgroundPosition').split(' ')[1];//איפוס רקעי כפתורים
        $(".myTabsBtn").css('backgroundPosition', '5px ' + changeBg);
        var changeCurrent = $(this).css('backgroundPosition').split(' ')[1];//הבלטת כפתור פעיל
        $(this).css('backgroundPosition', '-91px ' + changeCurrent);
    });

    $("#prepareMantallyBtn").click(function () {
        var width = $(window).width();
        $(".myTabs").hide();
        $(".myTabsBtn").attr('aria-expanded', false);
        $("#prepareMantallyBtn").attr('aria-expanded', true);
        if (width > 575) {
            $("#prepareMantallyDiv").fadeIn();
        }

        else {
            $("#prepareMantallyDivPhone").fadeIn();
        }
        $('#prepareMantallyTxt').css('text-decoration', 'underline solid');
        $('#prepareOrientationTxt').css('text-decoration', 'none');
    });

    $("#prepareOrientationBtn").click(function () {
        var width = $(window).width();
        $(".myTabs").hide();
        $(".myTabsBtn").attr('aria-expanded', false);
        $("#prepareOrientationBtn").attr('aria-expanded', true);
        if (width > 575) {
            $("#prepareOrientationDiv").fadeIn();
        }

        else {
            $("#prepareOrientationDivPhone").fadeIn();
        }
        $('#prepareOrientationTxt').css('text-decoration', 'underline solid');
        $('#prepareMantallyTxt').css('text-decoration', 'none');
    });

    //////////////אקורדיון///////////////////
    $('.collapse').on('shown.bs.collapse', function (e) {
        var scrollOffset = $('#content').scrollTop() + $(this).offset().top;
        $('#content').animate({ scrollTop: scrollOffset - 150 }, 500);
    });

    var width = $(window).width();
    if (width < 575) {
        $(".myTabsBtn").click(function (e) {
            var $card = $(this).closest('.myTabsBtn');
            $('html,body').animate({
                scrollTop: $card.offset().top - 80
            }, 500);

        });

    }

    $(".accorBtns").click(function () {
        $('audio').each(function () {
            this.pause(); // Stop playing
            this.currentTime = 0; // Reset time
        });
    });

    // Every time a modal is shown, if it has an autofocus element, focus on it.
    $('.modal').on('shown.bs.modal', function () {
        console.log("פוקוס");
        $(this).find('[autofocus]').focus();
    });
});