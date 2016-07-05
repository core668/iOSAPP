/*
 * 版本：iOS
 * 最后更新日期:2016.6.14
 */
//基础功能
$(function() {
    //专辑页数
    // Ajax事件的完成状态  
    var f = true;
    //加载专辑页数据
    albumsAjax();
    //专辑列表页的位置
    var $new_hot = $('.new_hot');
    //头部
    var $header = $('.header');
    
    //告诉ios关闭页面
    //给头部返回按钮注册back事件
    $('#albums-back').click(function(){
        window.open('?back=1')
    })
    $('#seach_back').click(function(){
        $('.page-active').removeClass('page-active').addClass('page-next page-out');
        $(".page-list").removeClass('page-prev').addClass('page-active page-in');
        // 返回列表页，根据浏览器的历史记录
        window.history.back();
        pageSlideOver();
        closeAudio();
        setTimeout("$('#input-search').html('');$('#search-show').html('');", 350);
        setTimeout("$('.columns-main').html('');$('.content_').html('');",350);
        document.querySelector('#search-form').reset();
    })

    $('#zj_back').click(function(){
        $('.page-active').removeClass('page-active').addClass('page-next page-out');
        $(".page-list").removeClass('page-prev').addClass('page-active page-in');
        // 返回列表页，根据浏览器的历史记录
        window.history.back();
        pageSlideOver();
        setTimeout("$('.columns-main').html('');$('.content_').html('');",350);
        $('._span').html('0');
    })

    $('#xq-back').click(function(){
        if ( $('._span').html()=='0' ) {
            $('.page-active').removeClass('page-active').addClass('page-next page-out');
            $(".page-list").removeClass('page-prev').addClass('page-active page-in');
            // 返回列表页，根据浏览器的历史记录
            window.history.back();
            pageSlideOver();
            closeAudio();
            setTimeout("$('#input-search').html('');$('#search-show').html('');", 350);
            setTimeout("$('.columns-main').html('');$('.content_').html('');",350);
            document.querySelector('#search-form').reset();
        }else{
            $('.page-active').removeClass('page-active').addClass('page-next page-out');
            $("#album").removeClass('page-prev').addClass('page-active page-in');
            window.history.back();
            closeAudio();
            pageSlideOver();
            setTimeout("$('.columns-main').html('');$('.content_').html('');",350);
        }
    })
    //头部返回结束
    // 实例搜索历史对象 story-list-item
    var _StoryList = StoryList();
    //初始化页数
    var pageNumber = 1;
// -----------------事件委托----------------
//--进入专辑页
    $('.fenlei_list').on('click',function(e){
        var tag = $(this).children('p').children('span').html();
        //alert(tag);
        $('#headline').html(tag);
        $('#Section').html('');
        pageNumber = 1;
        ZJfenlei(pageNumber,tag);
        $("#mian").removeClass("page-active").addClass("page-prev page-out");
        $("#album").removeClass("page-next").addClass("page-active page-in");
        window.history.pushState({},"", "?pagestatus=4");
        console.log(window.location.href);
        pageSlideOver();
    })
//--专辑页转入详情页
    $('#Section').on('click','.zhuanji_list',function(e){
       $('._span').html('1');
       console.log($('._span').html());
        var oName = $(this).data('tag');
        //console.log(oName);
        pageNumber = 1;
        $("#album").removeClass("page-active").addClass("page-prev page-out");
        $(".page-detail").removeClass("page-next").addClass("page-active page-in");
        var detailUrl = "http://dev.wawaqinqin.com/api/DisL2.aspx?Id=" + $(this).data("url")+"&pageNumber="+pageNumber+"&total=20";
        console.log(detailUrl);
        detailAjax(detailUrl,oName);
        //加入历史纪录
        window.history.pushState({},"", "?pagestatus=5&url="+ $(this).data("url"));
        console.log(window.location.href);
        pageSlideOver();
    })
//--search页面转场
    $('#albums-haeder').on('click', '#nav-search',
    function() {
        $("#mian").removeClass("page-active").addClass("page-prev page-out");
        $("#search").removeClass("page-next").addClass("page-active page-in");
        //加入历史纪录
        window.history.pushState({},"", "?pagestatus=3");
        console.log(window.location.href);
        pageSlideOver();
        // 插入历史
        var stoArr = _StoryList.getStorageList();
        showStoryList(stoArr);
    });

    //专辑页请求
    function ZJfenlei(pageNumber,tag){
        var zhuanjiUrl = "http://dev.wawaqinqin.com/api/DisL1.aspx?p="+pageNumber+"&tag="+tag+"&total=8";
        $.ajax({
            type: "GET",
            url: zhuanjiUrl,
            dataType: "jsonp",
            success: function(json) {
                var jsonp = eval(json);
                var html="";
                var Item = jsonp.item;
                for(var i = 0 ; i < Item.length;i++){
                    html = '<li class="zhuanji_list" id="zhuanji_list" data-tag=' + Item[i].tag + ' data-url=' + Item[i].url + '>'+'<img src="' + Item[i].img + '" alt="正在加载"/><p>' + Item[i].title + '</p></li>';
                    $('#Section').append(html);                                      
                }
                //专辑间距
                var zj_left=($(window).width()-$('.zhuanji_list').width()*2)/3;
                $('.zhuanji_list').css('marginLeft',zj_left+'px');
                window.onresize = function (){
                    //首页间距
                    var zhuanji_list = $('.zhuanji_list');
                    var zj_left=($(window).width()-zhuanji_list.width()*2)/3;
                    zhuanji_list.css('marginLeft',zj_left+'px');
                }
            },
            error: function(json) {
                alert('失败');
            }
        })
    }
    //专辑页下拉刷新
	    $('#content').scroll(function(){
	    	var Gushi = $('#Section').height();
		    var $distance = $('#content').scrollTop()+$(window).height()-$('.header').height()-1;
		    var tag = $('#album').children('.header').children('#headline').html();
		    //alert(tag);
		    if ($distance>Gushi) {
	        	pageNumber+=1;
			    //console.log("下拉"+pageNumber);
			    var zhuanjiUrl = "http://dev.wawaqinqin.com/api/DisL1.aspx?p="+pageNumber+"&tag="+tag+"&total=8";
			    $.ajax({
			        type: "GET",
			        url: zhuanjiUrl,
			        dataType: "jsonp",
			        success: function(json) {
			            var jsonp = eval(json);
			            var html="";
			            var Item = jsonp.item;
			            for(var i = 0 ; i < Item.length;i++){
			                html = '<li class="zhuanji_list" id="zhuanji_list" data-tag=' + Item[i].tag + ' data-url=' + Item[i].url + '>'+'<img src="' + Item[i].img + '" alt="正在加载"/><p>' + Item[i].title + '</p></li>';
			                $('#Section').append(html);
			            }
			            //专辑间距
			            var zj_left=($(window).width()-$('.zhuanji_list').width()*2)/3;
			            $('.zhuanji_list').css('marginLeft',zj_left+'px');
			            window.onresize = function (){
			                //首页间距
			                var zhuanji_list = $('.zhuanji_list');
			                var zj_left=($(window).width()-zhuanji_list.width()*2)/3;
			                zhuanji_list.css('marginLeft',zj_left+'px');
			            } 
			        },
			        error: function(json) {
			            alert('失败');
			        }
			    })
		    }
	    })
    // --------------event end------------------
    var $WwqqSecondPage = $('#WWQQ-secondPage');
    // 详情页AJAX方法。接受两个个参数，分别是url地址,插入内容的位置
    function detailAjax(detailUrl,oName) {
        $.ajax({
            type: "GET",
            url: detailUrl,
            dataType: "jsonp",
            success: function(json) {
                console.log(json);
                var jsonp = eval(json);
                var html = "";
                var tempName = '';
                tempInfo = jsonp.info;
                tempItems = jsonp.item;
                //console.log(json);
                for(var c = 0 ; c < tempItems.length; c++){
                    //$('.content_').append("<ul><li class='hostry_list'><ul class='hostry_content'><li class='hostry_name'><p class='name_jianju'>" + tempItems[c].name +"</p><p class='data_jianju'>" + tempItems[c].time + "</p></li><li class='hostry_song'><div class='shiting ff'><img src='./images/iconplay.png' data-audio=" + decodeURIComponent(tempItems[c].mp3) + " onclick='PlayOrStop(this)'/><p class='jianju'>试&nbsp;听</p></div><div class='tuisong ff'><a href='?id=" + tempItems[c].id + "&mp3=" + tempItems[c].mp3 + "&name=" + tempItems[c].name + "&pic=" + tempInfo.pic + "'><img src='./images/iconsend.png'><p class='jianju'>点&nbsp;播</p></a></div></li></ul></li></ul>");
                    html = "<ul><li class='hostry_list'><ul class='hostry_content'><li class='hostry_name'><p class='name_jianju'>" + tempItems[c].name +"</p><p class='data_jianju'>" + tempItems[c].time + "</p></li><li class='hostry_song'><div class='shiting ff'><img src='./images/iconplay.png' data-audio=" + decodeURIComponent(tempItems[c].mp3) + " onclick='PlayOrStop(this)'/><p class='jianju'>试听</p></div><div class='tuisong ff'><a ><img src='./images/iconsend.png'/><p class='jianju'>点播</p></a></div></li></ul></li></ul>";                 
                	$('.content_').append(html);
                };
                tempName =  '<div class="columns-img"><img src="'+ tempInfo.pic +'"></div><div class="columns-title"><h1 id="DetailTitle">'+tempInfo.songsname+'</h1><p id="Detailtag">'+tempInfo.lasttime+'</p></div>';
                $('.columns-main').html(tempName);
                $('#Detailtag').html("分类:"+decodeURIComponent(oName));
                $('.hostry_name').on('click',function(){
			        //点击显示于隐藏;
			        if ($(this).next().css('display')=='none' ) {	
			            $(this).parent().parent().parent().parent().children().children().children().children('.hostry_name').css('background','#fff');
			            $(this).parent().children('.hostry_name').css('background','#f9f9f9');
			            $(this).parent().parent().parent().parent().children().children().children().children('.hostry_song').hide();
			            $('.shiting>.jianju').html("试听");
			            $(this).next().show();
			        }else{
			            $(this).next().hide();
			            $(this).css('background','#fff');
			        }
			    })
            },
            error:function(json){
                console.log(json);
            }
        });
        pageNumber+=1;
    } 	
    //详情页下拉刷新
    $('#WWQQ-secondPage').scroll(function(){
        var Hght = $('#WWQQ-secondPage').scrollTop()+$('#WWQQ-secondPage').height();
        //alert($('.columns').height()+$('.content_').height());2160px;
        var Reload = $('.columns').height()+$('.content_').height();
        if ( Hght==Reload ) {
            var ider = window.location.href.split("=")[2];
            var etailUrl = "http://dev.wawaqinqin.com/api/DisL2.aspx?Id=" + ider + "&p="+pageNumber+"&total=20";
            $.ajax({
            type: "GET",
            url: etailUrl,
            dataType: "jsonp",
            success: function(json) {
                var jsonp = eval(json);
                var html = "";
                var tempName = '';
                tempInfo = jsonp.info;
                tempItems = jsonp.item;
                //console.log(json);
                for(var c = 0 ; c < tempItems.length; c++){
                    html = "<ul><li class='hostry_list'><ul class='hostry_content'><li class='hostry_name'><p class='name_jianju'>" + tempItems[c].name +"</p><p class='data_jianju'>" + tempItems[c].time + "</p></li><li class='hostry_song'><div class='shiting ff'><img src='./images/iconplay.png' data-audio=" + decodeURIComponent(tempItems[c].mp3) + " onclick='PlayOrStop(this)'/><p class='jianju'>试听</p></div><div class='tuisong ff'><a href='?id=" + tempItems[c].id + "&mp3=" + tempItems[c].mp3 + "&name=" + tempItems[c].name + "&pic=" + tempInfo.pic +"'><img src='./images/iconsend.png'/><p class='jianju'>点播</p></a></div></li></ul></li></ul>";                    
                    $('.content_').append(html);
                }
                $('.hostry_name').unbind('click').click(function(){
                    if ( $(this).next().css('display')=='none' ) {
                        $(this).parent().parent().parent().parent().children().children().children().children('.hostry_name').css('background','#fff');
                        $(this).parent().children('.hostry_name').css('background','#f9f9f9');
                        $(this).parent().parent().parent().parent().children().children().children().children('.hostry_song').css('display','none');
                        $(this).next().show();
                        $('.shiting>.jianju').html("试听");
                        return false;
                    }else{
                        $(this).next().hide();
                        $(this).css('background','#fff');
                    }
                })
            },
            error:function(json){
                console.log(json);
            }
        });
        pageNumber+=1;
        }
    })

    // 首页。
    function albumsAjax() {
        //改变事件状态
        var f = false;
        var htmlArr = [];
        pageNumber=1;
        var albumsUrl = "http://dev.wawaqinqin.com/api/DisL1.aspx?p=" + pageNumber + "&total=6";//在下面设置scroll的高度设置进行判断如果到底 pageNumber+=1;
        $.ajax({
            type: "GET",
            url: albumsUrl,
            dataType: "jsonp",
            success: function(json) {
                var jsonp = json.item;
                for (var n = 0 ; n < jsonp.length ; n++ ){
                    if (n==0) {$('.data1').html('<img src="' + json.item[n].img + '" alt="正在加载"/><span>' + json.item[n].title + '</span>');$('.data1').attr("data-tag",json.item[n].tag).attr('data-url',json.item[n].url)}
                    if (n==1) {$('.data2').html('<img src="' + json.item[n].img + '" alt="正在加载"/><span>' + json.item[n].title + '</span>');$('.data2').attr("data-tag",json.item[n].tag).attr('data-url',json.item[n].url)}
                    if (n==2) {$('.data3').html('<img src="' + json.item[n].img + '" alt="正在加载"/><span>' + json.item[n].title + '</span>');$('.data3').attr("data-tag",json.item[n].tag).attr('data-url',json.item[n].url)}
                    if (n==3) {$('.data4').html('<img src="' + json.item[n].img + '" alt="正在加载"/><span>' + json.item[n].title + '</span>');$('.data4').attr("data-tag",json.item[n].tag).attr('data-url',json.item[n].url)}
                    if (n==4) {$('.data5').html('<img src="' + json.item[n].img + '" alt="正在加载"/><span>' + json.item[n].title + '</span>');$('.data5').attr("data-tag",json.item[n].tag).attr('data-url',json.item[n].url)}
                    if (n==5) {$('.data6').html('<img src="' + json.item[n].img + '" alt="正在加载"/><span>' + json.item[n].title + '</span>');$('.data6').attr("data-tag",json.item[n].tag).attr('data-url',json.item[n].url)}
                }
                window.history.pushState({},"", "?pagestatus=1");
                //--进入详情页
                $('.new_hot .before_bg,.new_hot1 .before_bg1').click(function(){ 
                   console.log($('._span').html());
                    //获取li的url
                    var detailUrl = "http://dev.wawaqinqin.com/api/DisL2.aspx?Id=" + $(this).data("url")+"&pageNumber="+pageNumber+"&total=20";
                    //通过urlID请求数据，并选择节点
                    var oName = $(this).data("tag");
                    detailAjax(detailUrl,oName);
                    // 移除active，添加过渡动画
                    $("#mian").removeClass("page-active").addClass("page-prev page-out");
                    $(".page-detail").removeClass("page-next").addClass("page-active page-in");
                    // 修改URL，并传参 pushstate 参数state:{可为null},参数title:'兼容性问题一般为null',参数url:'页面地址'
                    window.history.pushState({},"", "?pagestatus=2&url="+ $(this).data("url"));

                });

            },
            complete: function() {
                f = true
            },
            error: function() {
            }
        });
    }
    
/*搜索功能*/
    var _form = document.querySelector('#search-form');
    var $search = $('button#btn-search');
    var $inputVules = $('#input-search');
    var $clear = $('#ico-clear');
    // 搜索按钮
    $search.on('click',
        function() {
            searchMusic($inputVules.val());
            _StoryList.pushToStorage($inputVules.val());
        });
    // 文本变化
    $inputVules.on('change',
        function(e) {
            e.preventDefault();
            $clear.toggle();
            if($inputVules.val().length!=0){
                $clear.show();
            }
        });
    $inputVules.on('focus',
        function(e) {
            $showBox.html('');
            var stoArr = _StoryList.getStorageList();
            showStoryList(stoArr);
            if($inputVules.val().length!=0){
                $clear.show();
            }
        });
    $inputVules.on('blur',
        function(e) {
            if($inputVules.val().length!=0){
                $clear.show();
            }
        });
    //  重置按钮
    $clear.on('click',
    function(e) {
        _form.reset();
        $(this).hide();
    });

    var $showBox = $('#search-show');
    function StoryList() {
        var tempArr;
        if (!localStorage.list) {
            tempArr = [];
        } else {
            tempArr = JSON.parse(localStorage.list)
        }
        return {
            pushToStorage: function(keywork) {
                if (!keywork) {
                    return
                }
                if (tempArr.length >= 3) {
                    tempArr.push(keywork);
                    tempArr.shift();
                } else {
                    tempArr.push(keywork)
                }
                //console.log(tempArr);
                window.localStorage.setItem('list', JSON.stringify(tempArr))
            },
            getStorageList: function() {
                return tempArr
            },
            removeStorageItem: function(index) {
                var _index;
                if (typeof index === 'string') {
                    _index = index + 0;
                } else if (typeof index === 'number') {
                    _index = index
                }
                tempArr.splice(index, 1);
                window.localStorage.setItem('list', JSON.stringify(tempArr));
                return tempArr.length
            }
        }    
    }
    function showStoryList(arr) {
        if (arr instanceof Array && arr.length == 0) {
            return
        }
        var html = '<ul id="story-list"><li class="story-list-tips">搜索历史</li>';
        for (var i = arr.length-1; i >= 0; i--) {
            html += '<li class="story-list-item">' + '<div class="story-list-title">' + arr[i] + '</div>' + '<div class="story-list-remove" data-index=' + i + '></div>'
        }
        html += '</ul>';
        $showBox.append(html);
    }
    // 历史列表事件
    $showBox.on('click', '.story-list-title',
    function() {
        // 点击搜索
        searchMusic($(this).text())
        document.getElementById('input-search').value = $(this).html();
        if($inputVules.val().length!=0){
            $clear.show();
        }
    });
    $showBox.on('click', '.story-list-remove',
    function() {
        // 点击删除
        var len = _StoryList.removeStorageItem($(this).data('index'));
        if(len > 0){
            $(this).parent().remove();
        }else{
            $('#story-list').remove();
        }
    });
    // 搜索请求
    function searchMusic(keyWork) {
        //alert(keyWork);
        if (keyWork === '') {
            return
        }
        var url = 'http://dev.wawaqinqin.com/api/disl2.aspx?Search=' + encodeURI(keyWork);
        var html = '';
        try {
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'jsonp',
                success: function(data) {
                    if (data) {
                        $showBox.html('');
                        var item = data.item;
                        var tempInfo = data.info;
                        var lenght = data.item.length;
                        var tempItems = data.item;
                        if (lenght > 0) {
                            html += '<ul id="secondList" class="list">';
                            for (var i = 0; i < lenght; i++) {
                                html += "<li class='hostry_list'><ul class='hostry_content'><li class='hostry_name'><p class='name_jianju'>" + tempItems[i].name +"</p><p class='data_jianju'>" + tempItems[i].time + "</p></li><li class='hostry_song'><div class='shiting ff'><img src='./images/iconplay.png' data-audio=" + decodeURIComponent(tempItems[i].mp3) + " onclick='PlayOrStop(this)'/><p class='jianju'>试&nbsp;听</p></div><div class='tuisong ff'><a href='?id=" + tempItems[i].id + "&mp3=" + tempItems[i].mp3 + "&name=" + tempItems[i].name + "&pic=" + tempInfo.pic +"'><img src='./images/iconsend.png'/><p class='jianju'>点&nbsp;播</p></a></div></li></ul></li>"
                            }
                            html += '</ul>';
                            $showBox.html(html);
                            $('.hostry_name').on('click',function(){
                                //点击显示于隐藏;
                                if ($(this).next().css('display')=='none' ) {
                                    $(this).parent().parent().parent().parent().children().children().children().children('.hostry_name').css('background','#fff');
                                    $(this).parent().children('.hostry_name').css('background','#f9f9f9');
                                    $(this).parent().parent().parent().children('.hostry_list').children('.hostry_content').children('.hostry_song').css('display','none');
                                    $(this).next().show();
                                    $('.shiting>.jianju').html("试听");
                                }else{
                                    $(this).next().hide();
                                    $(this).css('background','#fff');
                                }
                            })
                        } else {
                            $showBox.html('<div class="text">没有找到相关的结果</div>');
                        }
                    }
                },
                error: function(err) {
                    console.log(err.message)
                }
            })
        } catch(err) {
            console.log(err.maseage + 0);
            $showBox.html('没有搜索结果');
        }
    }
});
// 详情页播放器
var audio, //创建h5的播放器
lastAudioPath = "",
//存储上次播放的音频数据
lastStatus = ""; //存储上次状态图片的位置
audio = document.createElement("audio");
audio.src = "";
// 监听是否播放完成
audio.addEventListener('ended',
function() {
    lastStatus.src = "./images/iconplay.png";
},
false);
// 播放器功能
function PlayOrStop(playitem) {
    // 播放状态图片位置
    var status = playitem;
    var mp3path = "";
    // 判断音频链接是否完整
    if (playitem.getAttribute("data-audio").search(/http/) != -1) {
        //直接使用
        mp3path = playitem.getAttribute("data-audio");
    } else {
        // 获取当如对象的音频链接片段进行拼接，并使用replaceAll的方法解码
        mp3path = "http://mp3.wawaqinqin.com" + (playitem.getAttribute("data-audio").replaceAll("%00", "")).replaceAll("%2f", "/");
    }
    // 判断当前的数据是否一样，否则当初始化处理
    if (mp3path === lastAudioPath) {
        //暂停状态
        if (audio.paused) {
            $('.shiting>.jianju').html("暂停");
            status.src = "./images/icon_stop.png";
            audio.play();
        } else {
            $('.shiting>.jianju').html("试听");
            // 如果当前音频没变化就是暂停播放
            status.src = "./images/iconplay.png";
            audio.pause();
        }
    } else {
        // 首先修改原来位置的图案片
        lastStatus.src = "./images/iconplay.png";
        // 添加路径到播放器中
        audio.src = mp3path;
        audio.play();
        // 修改播放状态的图片
        $('.shiting>.jianju').html("暂停");
        status.src = "./images/icon_stop.png";
        // 把当前的音频数据存在上一次的音频中
        lastAudioPath = mp3path;
        // 把当前的状态图片位置存在上一次的音频位置中
        lastStatus = status;
    }
}
// 返回上一页面时，应关闭播放器
function closeAudio() {
    if (audio.src != "") {
        status.src = "./images/iconplay.png";
        audio.pause();
    }
}
//返回的方法
function goBack() {
    // 获取URL的参数
    var status = getUrlParam("pagestatus");
    if (status == 1) {
            window.open('?back=1');
    }else if (status == 2||status == 3||status == 4) {
            console.log(window.location.href);
            $('.page-active').removeClass('page-active').addClass('page-next page-out');
            $(".page-list").removeClass('page-prev').addClass('page-active page-in');
            // 返回列表页，根据浏览器的历史记录
            window.history.back();
            pageSlideOver();
            closeAudio();
            setTimeout("$('#input-search').html('');$('#search-show').html('');", 350);
            setTimeout("$('.columns-main').html('');$('.content_').html('');",350);
            document.querySelector('#search-form').reset();
    }else if (status == 5) {
            $('.page-active').removeClass('page-active').addClass('page-next page-out');
            $("#album").removeClass('page-prev').addClass('page-active page-in');
            window.history.back();
            closeAudio();
            pageSlideOver();
            setTimeout("$('.columns-main').html('');$('.content_').html('');",350);
    }
}
// 页面滑动完成后的动作
function pageSlideOver() {
    // CSS过渡完成后触发
    $(".page-out").live('transitionend',
    function() {
        $(this).removeClass('page-out');
    });
    $(".page-in").live('transitionend',
    function() {
        $(this).removeClass('page-in');
    });
}
