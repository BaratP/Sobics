$(document).ready(function() {
    //jatekter, magassag, szelesseg
    let game_area=$('#jatekter'), ga_width=parseInt(game_area.css('width')), ga_height=parseInt(game_area.css('height'));
    //jatekteren szélén lévő hely állítása
    let startex=0, startey=0, endex=600,endey=600;
    //oszlopok sorok szinek szama
    let oszlopok_szama=10,sorok_szama=15, szinek_szama=4;
    //x és y irányú lépések
    let offset_x = (endey-startey)/oszlopok_szama,offset_y = (endex-startex)/sorok_szama;
    //player deklaráció
    let player=$('<img src="Media/jatekos.png" id="player" alt="lol">'),player_height=590,player_width=offset_x,move_step=player_width/2 ;
    //player score
    let score=0,korKezdetiScore=0,lvl=1, elteltIdo;
    //tégla
    let tegla,tegla_array=[],kezdo_teglasorok_szama=4;
    //tégla hol léte
    let lenn=false;
    //osszekapcsolodo teglak
    let megtalalt = [];
    //ido uj sor berakasa elott ms
    let ido =10000;
    //audiok
    let end = new Audio('Media/end.mp3');
    let sound = new Audio('Media/hatterZene.mp3'),sound1 = new Audio('Media/puty.mp3'),sound2 = new Audio('Media/puty.mp3'),sound3 = new Audio('Media/score.mp3'),sound4 = new Audio('Media/lvlup.mp3'), soundbool=true;
    sound.loop = true;
    sound.play();
    //player setup
    game_area.append(player);
    player.css({width: player_width});
    player.css({top: ga_height-player_height-1});
    //téglák diveinek hozzáadása a játéktérhez
    timerBar();
    alaphelyzetetGeneral();
    let beszurasKezelo = setInterval(ujSortBeszur, ido);
    let oszlopszam;
    $(this).on('mousemove', function(e){
        let p = game_area.offset();
        let x = e.pageX - p.left;
        if (x<offset_x/2 || x>game_area.width()-offset_x/2) {
            return;
        }
        oszlopszam=Math.round((x - offset_x / 2) / offset_x);
        $('#player').css({
            left: oszlopszam  * offset_x
        });
        //ha lenn van a tégla akkor végig megy a téglák tömbön amik lenn vannak és cipeli magával a játékos
        for (let i=0;i<tegla_array.length;i++) {
            if (lenn) {
                tegla_array[i].css({
                    left: oszlopszam * offset_x
                });
                let str = tegla_array[i].attr('id');
                if (str.length===4)
                    str = str.substring(0, 3) + (oszlopszam);
                else
                    str = str.substring(0, 4) + (oszlopszam);
                tegla_array[i].attr('id',str);
            }
        }

    });
    let jatszhato=true;
    $(this).click(function (e){
        if (jatszhato)
        clickAction(e);
    })
    function osszetartozoTegla(teglaId) {
        if (!megtalalt.includes(teglaId.attr('id')))
        megtalalt.push(teglaId.attr('id'));
        let str
        for (let i=-1;i<=1;i++) {
            for (let j=-1;j<=1;j++) {
                if (!((i===-1 && j===0) || (i===0 && j===-1) || (i===0 && j===1) || (i===1 && j===0)))
                    continue;
                str = teglaId.attr('id');
                if (i + parseInt(str.substring(1, 2))>=sorok_szama || i + parseInt(str.substring(1, 2))<0 || j + parseInt(str.substring(3))<0 || j + parseInt(str.substring(3))>=oszlopok_szama)
                    continue;
                if (str.length === 4) {
                    str = "x" + (i + parseInt(str.substring(1, 2))) + "y" + (j + parseInt(str.substring(3)));
                }
                else{
                    str = "x" + (i+parseInt(str.substring(1, 3))) + "y" + (j+parseInt(str.substring(4)));
                }
                if ($('img[id='+str+']').attr('src')===teglaId.attr('src') && !megtalalt.includes($('img[id='+str+']').attr('id'))) {
                    osszetartozoTegla($('img[id='+str+']'));
                }
            }
        }
    }

    function torles() {
        if (megtalalt.length>3) {
            score+=megtalalt.length*1000;
            $('#score').text(score);
            sound3.play();
            for (let i = 0; i < megtalalt.length; i++) {
                $('img[id='+megtalalt[i]+']').fadeOut(150, function() {
                    $(this).remove();
                });
            }
            if (score>=10000-ido+60000+korKezdetiScore) {
                kovetkezoSzint();
            }
        }
        megtalalt.length=0;
        setTimeout(helyremozgat, 300);
    }
    let ujvizsgalat=[];
    function helyremozgat() {
        ujraKellHívni=false
        for (let i=0;i<sorok_szama;i++) {
            for (let j=0;j<oszlopok_szama;j++) {
                if (i-1>=0 && $('img[id=x'+i+'y'+j+']').attr('src')!==undefined && $('img[id=x'+(i-1)+'y'+j+']').attr('src')===undefined) {
                    $('img[id=x'+i+'y'+j+']').animate({top: ((i-1) * offset_y / 1.5)},100);
                    $('img[id=x'+i+'y'+j+']').attr('id','x'+(i-1)+'y'+j);
                    ujvizsgalat.push($('img[id=x'+(i-1)+'y'+j+']'));
                    helyremozgat();
                }
            }
        }
        for (let i = 0; i < ujvizsgalat.length; i++) {
            osszetartozoTegla(ujvizsgalat[i]);
            torles();
        }
        ujvizsgalat.length=0;
    }
    function ujSortBeszur(){
        for (let i=sorok_szama-1;i>=0;i--) {
            for (let j=oszlopok_szama-1;j>=0;j--) {
                if ($('img[id=x'+i+'y'+j+']').attr('src')!==undefined && i+1<=14) {
                    $('img[id=x'+i+'y'+j+']').animate({top: ((i+1) * offset_y / 1.5)},100);
                    $('img[id=x'+i+'y'+j+']').attr('id','x'+(i+1)+'y'+j);
                }
                else if ($('img[id=x'+i+'y'+j+']').attr('src')!==undefined && i+1>=14){
                    ido=8000;
                    szinek_szama=4;
                    clearInterval(beszurasKezelo);
                    beszurasKezelo= setInterval(ujSortBeszur,ido);
                    elteltIdo=0;
                    score=0;
                    $('#score').text(score);
                    palyatTorol();
                    alaphelyzetetGeneral();
                    sound.pause();
                    end.play();
                    setTimeout(function() {
                        sound.play()
                    },5000);

                }
            }
        }
        for (let j = 0; j < oszlopok_szama; j++ ) {
            kep = '<div><img src="Media/m1.png" id="x0y'+j+'"></div>';
            $(kep).appendTo(game_area);
            $('img[id=x0y'+j+']').css({left: j*offset_x,opacity: 0});
            $('img[id=x0y'+j+']').animate({ opacity: 1 }, 100);
            tegla = "Media/m"+Math.floor(Math.random()*4+1)+".png";
            $('img[id=x0y'+j+']').attr('src',tegla);
        }
    }
    function alaphelyzetetGeneral() {
        for (let i = 0; i < kezdo_teglasorok_szama; i++) {
            for (let j = 0; j < oszlopok_szama; j++ ) {
                kep = '<div><img src="Media/m1.png" id="x'+i+'y'+j+'"></div>';
                $(kep).appendTo(game_area);

            }
        }
        //tégla divek feltöltése képekkel
        for (let i = 0; i < kezdo_teglasorok_szama; i++) {
            for (let j = 0; j < oszlopok_szama; j++ ) {
                if ((i>=0 && i<kezdo_teglasorok_szama)) {
                    tegla = "Media/m"+Math.floor(Math.random()*szinek_szama+1)+".png";
                    $('img[id=x'+i+'y'+j+']').attr('src',tegla);
                }
                else{
                    $('img[id=x'+i+'y'+j+']').attr('src',"");
                }
            }
        }
        //teglak eltolasa a helyukre, alaphelyzet
        for (let i=0;i<sorok_szama;i++) {
            for (let j=0;j<oszlopok_szama;j++) {
                $('img[id=x'+i+'y'+j+']').css({
                    left: j*offset_x,
                    top: i*offset_y/1.5
                })
            }
        }
    }
    function palyatTorol() {
        $('#jatekter > div').remove();
    }
    function timerBar() {
        let maxIdo = (ido/1000);
        elteltIdo = 0;
        let progressBar = $('#ido');
        setInterval(function() {
            maxIdo=(ido/1000);
            elteltIdo++;
            let width = Math.round((elteltIdo / maxIdo) * 600);
            progressBar.width(width + 'px');
            if (elteltIdo >= maxIdo) {
                elteltIdo=0;
            }
        }, 1000);
    }
    let legalsoATablan;
    function kovetkezoSzint() {
        lvl++;
        legalsoATablan=0;
        for (let i = 0; i < sorok_szama; i++) {
            for (let j = 0; j < oszlopok_szama; j++) {
                if($('img[id=x'+i+'y'+j+']').attr('src')!==undefined && i>legalsoATablan) {
                    legalsoATablan=i;
                }
            }
        }
        legalsoSortMegmutat()
        setTimeout(function() {
            jatszhato=true;
            beszurasKezelo = setInterval(ujSortBeszur, ido);
            score += ((14 - legalsoATablan + 1) * 10000);
            korKezdetiScore = score;
            if (ido > 2000) ido -= 1000;
            if (szinek_szama < 6) szinek_szama++;
            clearInterval(beszurasKezelo);
            beszurasKezelo = setInterval(ujSortBeszur, ido);
            elteltIdo = 0;
            sound1.pause();
            sound2.pause();
            sound3.pause();
            sound.pause();
            sound4.play();
            $('#score').text(score);
            $('#pontok p').text("Level " + lvl);
            setTimeout(function () {
                sound.play()
            }, 900);
            palyatTorol();
            alaphelyzetetGeneral();
        },(14-legalsoATablan+1)*100+1000);
    }
    function legalsoSortMegmutat() {
        jatszhato=false;
        for (let i = 0; i < (15-legalsoATablan);i++) {
            for (let j = 0; j < oszlopok_szama; j++) {
                setTimeout(function() {
                    kep = '<div><img src="Media/m0.png" id="xx'+(14-i)+'yy'+j+'"></div>';
                    $(kep).appendTo(game_area);
                    $('img[id=xx'+(14-i)+'yy'+j+']').css({left: j*offset_x,top: (15-i)*offset_y/1.5});
                    elteltIdo=(ido/1000)-1;
                    clearInterval(beszurasKezelo);
                }, i*100);
            }
        }
    }
    function clickAction(e) {
        //néha hibát dob és nem indítja az audiot addig ameddig nem interaktáltunk ezért ez egy alternnatív audio indítási utvonal;
        sound.play();
        if (lenn && soundbool) sound1.play();
        else if (lenn) sound2.play();
        soundbool=!soundbool;
        let legalso,privatei=-1;
        let p = game_area.offset();
        let x = e.pageX - p.left;
        let j = Math.round((x - offset_x / 2) / offset_x);
        //megkeresi a legalsó téglát az oszlopba
        for (let i=0;i<sorok_szama;i++) {
            if ($('img[id=x'+i+'y'+j+']').attr('src')!=="" && $('img[id=x'+i+'y'+j+']').attr('src')!==undefined) {
                legalso='img[id=x'+i+'y'+j+']';
                privatei=i;
            }
            else {
                break;
            }
        }
        if (privatei+tegla_array.length>14 && lenn) return;
        //ha nincs lenn akkor lekéri az egybetartozó téglákat
        if (!lenn) {
            tegla_array.length=0;
            for (let i=sorok_szama-1;i>=0;i--) {
                if ($('img[id=x'+i+'y'+j+']').attr('src')===$(legalso).attr('src')) {
                    tegla_array.push($('img[id=x'+i+'y'+j+']'));
                }
                else if ($('img[id=x'+i+'y'+j+']').attr('src')==="" || $('img[id=x'+i+'y'+j+']').attr('src')===undefined){
                }
                else break
            }
            for (let i = 0; i<tegla_array.length;i++) {
                let str = tegla_array[i].attr('id');
                if (str.length===4)
                    str = str.substring(0, 1) + 16 + str.substring(2);
                else
                    str = str.substring(0, 1) + (16) + str.substring(3);
                tegla_array[i].attr('id',str);
            }
        }
        //téglák mozgatása fel és le
        let onmagahozKepestEltolas=1;
        if (tegla_array[0]===legalso) onmagahozKepestEltolas=tegla_array.length+1;
        for (let i=0;i<tegla_array.length;i++) {
            if (lenn) {
                let str = tegla_array[i].attr('id');
                if (str.length===4)
                    str = str.substring(0, 1) + (privatei+i+1) + str.substring(2);
                else
                    str = str.substring(0, 1) + (privatei+i+1) + str.substring(3);
                tegla_array[i].attr('id',str);
                tegla_array[i].animate({top: ((privatei+i+onmagahozKepestEltolas) * offset_y / 1.5)}, 100);
            } else {
                tegla = $(legalso);
                tegla_array[i].animate({top: 530-i*offset_y/1.5}, 100);
            }
        }
        if (lenn) {
            osszetartozoTegla(tegla_array[0])
            torles();
        }
        lenn=!lenn;
    }
});